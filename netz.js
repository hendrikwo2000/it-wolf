/*
  Netz - animiertes Partikel-Netz als Seitenhintergrund.

  Wird ueber index.js dynamisch ein- und ausgehaengt (includeScript/removeScript)
  und laeuft auf allen Seiten mit <canvas id="backgroundCanvas">.

  Das Netz spannt sich ueber die GESAMTE Seitenhoehe (nicht nur den Bildschirm) und
  scrollt mit dem Inhalt mit. Umgesetzt ist das effizient: das Canvas bleibt fix und
  viewport-gross (kleiner Zeichenpuffer), und die Zeichnung wird pro Frame um die
  Scroll-Position versetzt. So sind die Punkte an feste Stellen der Seite gekoppelt,
  ohne ein riesiges Canvas ueber die komplette Laenge legen zu muessen.

  Wichtig: Das Script startet SOFORT beim Ausfuehren (in einer IIFE), nicht erst bei
  window.load. Denn wenn man das Netz per Schalter im Impressum aktiviert, wird die
  Datei erst nach dem load-Event nachgeladen - ein load-Listener wuerde dann nie mehr
  feuern. Das Canvas steht ohnehin schon fest im HTML.

  Fensteruebergreifend ("Split Screen"): Liegen zwei IT-Wolf-Fenster nebeneinander,
  reicht das Netz ueber die Luecke hinweg von einem ins andere - als waere es ein
  durchgehendes Netz ueber beide Bildschirme. Umsetzung:
    - Jedes Fenster kennt seine Lage auf dem Bildschirm (window.screenX/screenY) und
      teilt seine sichtbaren Punkte (und die Maus) in BILDSCHIRM-Koordinaten ueber
      einen BroadcastChannel mit allen anderen Fenstern derselben Seite.
    - Ein empfangendes Fenster rechnet diese Bildschirm-Koordinaten in seine EIGENE
      Sicht zurueck (minus eigenes screenX/screenY). Der Chrome-Versatz (Adressleiste
      usw.) ist bei gleichem Browser in beiden Fenstern gleich gross und kuerzt sich
      dabei heraus - die Linien treffen sich an der Kante passgenau.
    - Alles laeuft in CSS-Pixeln; screenX/screenY, innerWidth und die Punktkoordinaten
      teilen dieselbe Einheit, deshalb ist keine DPR-Umrechnung noetig.
  Das Ganze ist automatisch: bei nur einem Fenster passiert nichts (kein Nachbar da),
  es entstehen keine spuerbaren Kosten. Funktioniert nur zwischen Fenstern DERSELBEN
  Seite (gleiche Origin) und ab Desktop-Breite (darunter ist das Netz ohnehin aus).
*/
(function () {
    'use strict';

    const canvas = document.getElementById('backgroundCanvas');
    if (!canvas) return;

    // Doppelstart abfangen: index.js koennte das Script theoretisch mehrfach anhaengen.
    if (window.__netzLaeuft) return;
    window.__netzLaeuft = true;

    const ctx = canvas.getContext('2d');

    // --- Einstellungen (alles in CSS-Pixeln gedacht) -------------------------
    const MOBILE_BREITE = 768;   // darunter bleibt das Netz aus (Akku/Platz)
    const DICHTE        = 26000; // ein Kreis je so vielen Pixeln Flaeche
    const MIN_KREISE    = 24;
    const MAX_KREISE    = 140;   // Deckel, damit sehr lange Seiten nicht ausufern
    const KREIS_RADIUS  = 2.2;   // Punktgroesse
    const TEMPO         = 0.28;  // Driftgeschwindigkeit
    const LINK_DISTANZ  = 150;   // ab hier verbinden sich zwei Kreise
    const MAUS_DISTANZ  = 190;   // Reichweite der Maus
    const LINIE_ALPHA   = 0.55;  // max. Deckkraft der Linien zwischen Kreisen
    const MAUS_ALPHA    = 0.9;   // max. Deckkraft der Maus-Linien
    const LINIE_BREITE  = 1;     // Strichstaerke in CSS-Pixeln

    // Fensteruebergreifend --------------------------------------------------
    const KANAL_NAME    = 'itwolf-netz';  // BroadcastChannel-Name (pro Origin eindeutig)
    const FREMD_TIMEOUT = 1200;  // ms ohne Lebenszeichen -> Nachbarfenster gilt als weg
    const SENDE_TAKT    = 2;     // nur jeden n-ten Frame senden -> ~30/s statt 60/s
    const DRIFT_DISTANZ = 240;   // ab hier zieht ein Nachbarpunkt einen Punkt leicht an
    const DRIFT_KRAFT   = 0.0035;// Staerke der Anziehung Richtung Nachbarfenster
    const MAX_TEMPO     = TEMPO * 2.2; // Deckel fuer die Driftgeschwindigkeit

    // "Weniger Bewegung": Punkte driften dann nicht, reagieren aber weiter auf die Maus.
    const wenigerBewegung = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = 1;
    let breite = 0, hoehe = 0;   // Viewport in CSS-Pixeln (Groesse des Canvas-Puffers)
    let weltHoehe = 0;           // volle Seitenhoehe - so lang ist das Netz
    let kreise = [];
    let mausClientX = 0, mausClientY = 0, mausAktiv = false;
    let laeuft = false, frame = 0, resizeTimer = 0;

    // Zustand der Nachbarfenster.
    const meineId = 'w' + Math.random().toString(36).slice(2);
    let kanal = null;
    const fremde = new Map();    // id -> { punkte:[x,y,...], maus:[x,y]|null, stand }
    let fremdWelt = [];          // Nachbarpunkte in MEINEN Weltkoordinaten (pro Frame neu)
    let fremdMaus = [];          // Nachbar-Maeuse in MEINEN Weltkoordinaten (pro Frame neu)
    let tick = 0, jetzt = 0;

    // Farbe pro Frame aus der CSS-Variable lesen, damit ein Wechsel des Farbschemas
    // (Darkmode / eigenes Schema) sofort durchschlaegt.
    function farbe(name, fallback) {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return v || fallback;
    }

    function Kreis() {
        this.x = Math.random() * breite;
        this.y = Math.random() * weltHoehe;   // ueber die ganze Seitenhoehe verteilt
        const winkel = Math.random() * Math.PI * 2;
        this.vx = Math.cos(winkel) * TEMPO;
        this.vy = Math.sin(winkel) * TEMPO;
    }

    function zielAnzahl() {
        return Math.max(MIN_KREISE,
            Math.min(MAX_KREISE, Math.round((breite * weltHoehe) / DICHTE)));
    }

    // Kompletter Neuwurf - bei Init und echtem Resize.
    function kreiseErzeugen() {
        kreise = [];
        const ziel = zielAnzahl();
        for (let i = 0; i < ziel; i++) kreise.push(new Kreis());
    }

    // Sanftes Angleichen (nur auffuellen/kuerzen), wenn allein die Seitenhoehe wandert -
    // sonst wuerde jeder aufklappende Inhalt alle Punkte zuruecksetzen und es flackert.
    function kreiseAngleichen() {
        const ziel = zielAnzahl();
        while (kreise.length < ziel) kreise.push(new Kreis());
        if (kreise.length > ziel) kreise.length = ziel;
    }

    // Viewport-Puffer dpr-skaliert (scharf auf HiDPI), plus volle Seitenhoehe messen.
    function messen() {
        dpr = window.devicePixelRatio || 1;
        breite = document.documentElement.clientWidth;   // ohne Scrollbar -> kein Overflow
        hoehe = document.documentElement.clientHeight;
        // scrollHeight = gesamte Dokumenthoehe. Das fixe, viewport-grosse Canvas
        // zaehlt dabei nicht mit, der Wert ist also die reine Inhaltshoehe.
        weltHoehe = Math.max(document.documentElement.scrollHeight, hoehe);
        canvas.width = Math.round(breite * dpr);
        canvas.height = Math.round(hoehe * dpr);
    }

    function bewegen(k) {
        if (wenigerBewegung) return;
        k.x += k.vx;
        k.y += k.vy;
        if (k.x < 0)         { k.x = 0;         k.vx = -k.vx; }
        if (k.x > breite)    { k.x = breite;    k.vx = -k.vx; }
        if (k.y < 0)         { k.y = 0;         k.vy = -k.vy; }
        if (k.y > weltHoehe) { k.y = weltHoehe; k.vy = -k.vy; }
    }

    // Leichte Anziehung Richtung naechstgelegenem Nachbarpunkt: das Netz "greift"
    // sichtbar zum Nebenfenster hinueber. Bewusst schwach + Tempo gedeckelt, damit
    // es lebendig bleibt und die Punkte nicht an der Kante verklumpen.
    function anziehen(k) {
        if (wenigerBewegung || fremdWelt.length === 0) return;
        let bx = 0, by = 0, bestD = DRIFT_DISTANZ;
        for (let i = 0; i < fremdWelt.length; i += 2) {
            const dx = fremdWelt[i] - k.x, dy = fremdWelt[i + 1] - k.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < bestD && d > 0.001) { bestD = d; bx = dx / d; by = dy / d; }
        }
        if (bx === 0 && by === 0) return;
        const kraft = DRIFT_KRAFT * (1 - bestD / DRIFT_DISTANZ);
        k.vx += bx * kraft;
        k.vy += by * kraft;
        const v = Math.sqrt(k.vx * k.vx + k.vy * k.vy);
        if (v > MAX_TEMPO) { k.vx = k.vx / v * MAX_TEMPO; k.vy = k.vy / v * MAX_TEMPO; }
    }

    function zeichnen(sx, sy) {
        const linienFarbe = farbe('--line-color', '#0693e3');
        const kreisFarbe = farbe('--circle-color', '#0693e3');

        // Transform: dpr-Skalierung + Scroll-Versatz. Gezeichnet wird in
        // Welt-Koordinaten (volle Seite); sichtbar ist nur das viewport-grosse
        // Fenster, der Rest wird vom kleinen Puffer abgeschnitten.
        ctx.setTransform(dpr, 0, 0, dpr, -sx * dpr, -sy * dpr);
        ctx.clearRect(sx, sy, breite, hoehe);

        ctx.lineWidth = LINIE_BREITE;
        ctx.lineCap = 'round';
        ctx.strokeStyle = linienFarbe;

        // Verbindungen zwischen den Kreisen; Deckkraft faellt mit der Distanz.
        for (let i = 0; i < kreise.length; i++) {
            const a = kreise[i];
            for (let j = i + 1; j < kreise.length; j++) {
                const b = kreise[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DISTANZ) {
                    ctx.globalAlpha = (1 - dist / LINK_DISTANZ) * LINIE_ALPHA;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Fensteruebergreifend: Verbindungen zu den Punkten der Nachbarfenster.
        // fremdWelt liegt bereits in meinen Weltkoordinaten; Punkte jenseits meiner
        // Kante werden von der Canvas-Grenze sauber abgeschnitten -> die Linie reicht
        // genau bis zum Fensterrand und trifft drueben auf ihr Gegenstueck.
        for (let i = 0; i < kreise.length; i++) {
            const a = kreise[i];
            for (let j = 0; j < fremdWelt.length; j += 2) {
                const dx = a.x - fremdWelt[j], dy = a.y - fremdWelt[j + 1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DISTANZ) {
                    ctx.globalAlpha = (1 - dist / LINK_DISTANZ) * LINIE_ALPHA;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(fremdWelt[j], fremdWelt[j + 1]);
                    ctx.stroke();
                }
            }
        }

        // Verbindungen zur Maus, etwas kraeftiger. clientX/Y + Scroll = Welt-Position.
        if (mausAktiv) {
            const mx = mausClientX + sx, my = mausClientY + sy;
            for (let i = 0; i < kreise.length; i++) {
                const a = kreise[i];
                const dx = a.x - mx, dy = a.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAUS_DISTANZ) {
                    ctx.globalAlpha = (1 - dist / MAUS_DISTANZ) * MAUS_ALPHA;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(mx, my);
                    ctx.stroke();
                }
            }
        }

        // Fensteruebergreifende Maus: auch der Zeiger im Nachbarfenster zieht Linien.
        for (let j = 0; j < fremdMaus.length; j += 2) {
            const mx = fremdMaus[j], my = fremdMaus[j + 1];
            for (let i = 0; i < kreise.length; i++) {
                const a = kreise[i];
                const dx = a.x - mx, dy = a.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAUS_DISTANZ) {
                    ctx.globalAlpha = (1 - dist / MAUS_DISTANZ) * MAUS_ALPHA;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(mx, my);
                    ctx.stroke();
                }
            }
        }

        // Kreise zuletzt, damit sie ueber den Linien liegen.
        ctx.globalAlpha = 1;
        ctx.fillStyle = kreisFarbe;
        for (let i = 0; i < kreise.length; i++) {
            const k = kreise[i];
            ctx.beginPath();
            ctx.arc(k.x, k.y, KREIS_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function schleife() {
        if (!laeuft) return;
        tick++;
        jetzt = (window.performance && performance.now) ? performance.now() : Date.now();
        const sx = window.pageXOffset || 0;
        const sy = window.pageYOffset || 0;

        fremdeEinlesen(sx, sy);
        for (let i = 0; i < kreise.length; i++) { bewegen(kreise[i]); anziehen(kreise[i]); }
        zeichnen(sx, sy);
        if (kanal && tick % SENDE_TAKT === 0) fremdenSenden(sx, sy);

        frame = requestAnimationFrame(schleife);
    }

    function starten() {
        if (laeuft) return;
        laeuft = true;
        kanalStarten();
        frame = requestAnimationFrame(schleife);
    }

    function stoppen() {
        laeuft = false;
        cancelAnimationFrame(frame);
    }

    // --- Fensteruebergreifende Kommunikation ---------------------------------
    function kanalStarten() {
        if (kanal || typeof BroadcastChannel === 'undefined') return;
        kanal = new BroadcastChannel(KANAL_NAME);
        kanal.onmessage = (e) => {
            const m = e.data;
            if (!m || m.id === meineId) return;
            if (m.t === 'weg') { fremde.delete(m.id); return; }
            if (m.t === 'stand') {
                fremde.set(m.id, { punkte: m.pts || [], maus: m.maus || null, stand: jetzt });
            }
        };
    }

    // Meine sichtbaren Punkte (und die Maus) in BILDSCHIRM-Koordinaten teilen. Weit
    // ausserhalb des Viewports liegende Punkte koennen ohnehin keinen Nachbarn
    // beruehren - die spart man sich, das haelt die Nachricht klein.
    function fremdenSenden(sx, sy) {
        const zx = window.screenX || window.screenLeft || 0;
        const zy = window.screenY || window.screenTop || 0;
        const pts = [];
        for (let i = 0; i < kreise.length; i++) {
            const k = kreise[i];
            const vx = k.x - sx, vy = k.y - sy;   // Position im Viewport
            if (vx < -LINK_DISTANZ || vx > breite + LINK_DISTANZ) continue;
            if (vy < -LINK_DISTANZ || vy > hoehe + LINK_DISTANZ) continue;
            pts.push(zx + vx, zy + vy);           // -> Bildschirm-Koordinaten
        }
        const maus = mausAktiv ? [zx + mausClientX, zy + mausClientY] : null;
        try { kanal.postMessage({ t: 'stand', id: meineId, pts: pts, maus: maus }); }
        catch (e) { /* Kanal evtl. geschlossen - ignorieren */ }
    }

    // Bildschirm-Koordinaten der Nachbarn in MEINE Weltkoordinaten umrechnen:
    // Bildschirm -> mein Viewport (minus eigenes screenX/screenY) -> Welt (plus Scroll).
    function fremdeEinlesen(sx, sy) {
        fremdWelt.length = 0;
        fremdMaus.length = 0;
        if (fremde.size === 0) return;
        const zx = window.screenX || window.screenLeft || 0;
        const zy = window.screenY || window.screenTop || 0;
        fremde.forEach((f, id) => {
            if (jetzt - f.stand > FREMD_TIMEOUT) { fremde.delete(id); return; }
            const p = f.punkte;
            for (let i = 0; i < p.length; i += 2) {
                fremdWelt.push(p[i] - zx + sx, p[i + 1] - zy + sy);
            }
            if (f.maus) fremdMaus.push(f.maus[0] - zx + sx, f.maus[1] - zy + sy);
        });
    }

    // Unter der mobilen Grenze bleibt das Netz aus. Die .hidden-Klasse blendet das
    // Canvas per CSS aus, hier stoppt zusaetzlich die Rechenschleife und - beim
    // Wechsel zurueck auf Desktop - misst/wirft sie neu.
    function groesseAendern() {
        const mobil = window.innerWidth <= MOBILE_BREITE;
        canvas.classList.toggle('hidden', mobil);
        if (mobil) { stoppen(); return; }
        messen();
        kreiseErzeugen();
        if (!document.hidden) starten();
    }

    // Die Seitenhoehe kann sich ohne Resize aendern (Bilder laden, Admin-Bereiche,
    // aufklappende Inhalte). Dann nur nachmessen und Punkte sanft angleichen.
    function hoeheAktualisieren() {
        if (window.innerWidth <= MOBILE_BREITE) return;
        const neu = Math.max(document.documentElement.scrollHeight, hoehe);
        if (Math.abs(neu - weltHoehe) < 4) return;
        weltHoehe = neu;
        kreiseAngleichen();
    }

    // --- Events --------------------------------------------------------------
    window.addEventListener('mousemove', (e) => {
        mausClientX = e.clientX;
        mausClientY = e.clientY;
        mausAktiv = true;
    });

    // Verlaesst der Zeiger das Fenster, keine Maus-Linien mehr.
    document.addEventListener('mouseleave', () => { mausAktiv = false; });

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(groesseAendern, 150);
    });

    // Im Hintergrund-Tab pausieren (spart CPU/Akku), beim Zurueckkehren weiterlaufen.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stoppen();
        else if (window.innerWidth > MOBILE_BREITE) { hoeheAktualisieren(); starten(); }
    });

    // Inhaltshoehe beobachten (falls verfuegbar), gedrosselt.
    if (typeof ResizeObserver !== 'undefined') {
        let beobTimer = 0;
        const ro = new ResizeObserver(() => {
            clearTimeout(beobTimer);
            beobTimer = setTimeout(hoeheAktualisieren, 200);
        });
        ro.observe(document.body);
    }
    // Nachladende Bilder aendern die Seitenhoehe oft erst nach dem Start.
    window.addEventListener('load', hoeheAktualisieren);

    // Schliesst das Fenster/navigiert weg: Nachbarn sofort Bescheid geben, statt sie
    // auf den Timeout warten zu lassen.
    window.addEventListener('pagehide', () => {
        if (!kanal) return;
        try { kanal.postMessage({ t: 'weg', id: meineId }); } catch (e) { /* egal */ }
        kanal.close();
        kanal = null;
    });

    // --- Start ---------------------------------------------------------------
    groesseAendern();
})();
