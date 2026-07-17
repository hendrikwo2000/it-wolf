/*
  Netz (Beta) - animiertes Partikel-Netz als Seitenhintergrund.

  Wird ueber index.js dynamisch ein- und ausgehaengt (includeScript/removeScript)
  und laeuft auf allen Seiten mit <canvas id="backgroundCanvas">.

  Wichtig: Das Script startet SOFORT beim Ausfuehren (in einer IIFE), nicht erst
  bei window.load. Denn wenn man das Netz per Schalter im Impressum aktiviert, wird
  die Datei erst nach dem load-Event nachgeladen - ein load-Listener wuerde dann nie
  mehr feuern. Das Canvas steht ohnehin schon fest im HTML.
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
    const MAX_KREISE    = 80;
    const KREIS_RADIUS  = 2.2;   // Punktgroesse
    const TEMPO         = 0.28;  // Driftgeschwindigkeit
    const LINK_DISTANZ  = 150;   // ab hier verbinden sich zwei Kreise
    const MAUS_DISTANZ  = 190;   // Reichweite der Maus
    const LINIE_ALPHA   = 0.55;  // max. Deckkraft der Linien zwischen Kreisen
    const MAUS_ALPHA    = 0.9;   // max. Deckkraft der Maus-Linien
    const LINIE_BREITE  = 1;     // Strichstaerke in CSS-Pixeln

    // "Weniger Bewegung": Punkte driften dann nicht, reagieren aber weiter auf die Maus.
    const wenigerBewegung = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = 1;
    let breite = 0, hoehe = 0;      // Zeichenflaeche in CSS-Pixeln
    let kreise = [];
    let mausX = 0, mausY = 0, mausAktiv = false;
    let laeuft = false, frame = 0, resizeTimer = 0;

    // Farbe pro Frame aus der CSS-Variable lesen, damit ein Wechsel des Farbschemas
    // (Darkmode / eigenes Schema) sofort durchschlaegt.
    function farbe(name, fallback) {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return v || fallback;
    }

    function Kreis() {
        this.x = Math.random() * breite;
        this.y = Math.random() * hoehe;
        const winkel = Math.random() * Math.PI * 2;
        this.vx = Math.cos(winkel) * TEMPO;
        this.vy = Math.sin(winkel) * TEMPO;
    }

    function kreiseErzeugen() {
        const anzahl = Math.max(MIN_KREISE,
            Math.min(MAX_KREISE, Math.round((breite * hoehe) / DICHTE)));
        kreise = [];
        for (let i = 0; i < anzahl; i++) kreise.push(new Kreis());
    }

    // Canvas an Viewport UND Pixeldichte anpassen -> scharf auch auf HiDPI-Displays.
    // clientWidth/Height schliessen die Scrollbar aus, deshalb entsteht kein Overflow.
    function flaecheAnpassen() {
        dpr = window.devicePixelRatio || 1;
        breite = document.documentElement.clientWidth;
        hoehe = document.documentElement.clientHeight;
        canvas.width = Math.round(breite * dpr);
        canvas.height = Math.round(hoehe * dpr);
        // Ab hier wieder in CSS-Pixeln zeichnen; der Backing-Store ist dpr-fach groesser.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function bewegen(k) {
        if (wenigerBewegung) return;
        k.x += k.vx;
        k.y += k.vy;
        if (k.x < 0)      { k.x = 0;      k.vx = -k.vx; }
        if (k.x > breite) { k.x = breite; k.vx = -k.vx; }
        if (k.y < 0)      { k.y = 0;      k.vy = -k.vy; }
        if (k.y > hoehe)  { k.y = hoehe;  k.vy = -k.vy; }
    }

    function zeichnen() {
        const linienFarbe = farbe('--line-color', '#0693e3');
        const kreisFarbe = farbe('--circle-color', '#0693e3');

        ctx.clearRect(0, 0, breite, hoehe);
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

        // Verbindungen zur Maus, etwas kraeftiger.
        if (mausAktiv) {
            for (let i = 0; i < kreise.length; i++) {
                const a = kreise[i];
                const dx = a.x - mausX, dy = a.y - mausY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAUS_DISTANZ) {
                    ctx.globalAlpha = (1 - dist / MAUS_DISTANZ) * MAUS_ALPHA;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(mausX, mausY);
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
        for (let i = 0; i < kreise.length; i++) bewegen(kreise[i]);
        zeichnen();
        frame = requestAnimationFrame(schleife);
    }

    function starten() {
        if (laeuft) return;
        laeuft = true;
        frame = requestAnimationFrame(schleife);
    }

    function stoppen() {
        laeuft = false;
        cancelAnimationFrame(frame);
    }

    // Unter der mobilen Grenze bleibt das Netz aus. Die .hidden-Klasse blendet das
    // Canvas per CSS aus, hier stoppt zusaetzlich die Rechenschleife und - beim
    // Wechsel zurueck auf Desktop - baut sie die Flaeche neu auf.
    function groesseAendern() {
        const mobil = window.innerWidth <= MOBILE_BREITE;
        canvas.classList.toggle('hidden', mobil);
        if (mobil) { stoppen(); return; }
        flaecheAnpassen();
        kreiseErzeugen();
        if (!document.hidden) starten();
    }

    // --- Events --------------------------------------------------------------
    window.addEventListener('mousemove', (e) => {
        // Fixes Canvas -> Viewport-Koordinaten (clientX/Y) passen direkt, ohne Scroll-Offset.
        mausX = e.clientX;
        mausY = e.clientY;
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
        else if (window.innerWidth > MOBILE_BREITE) starten();
    });

    // --- Start ---------------------------------------------------------------
    groesseAendern();
})();
