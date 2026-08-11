/*
  Scroll-Animation fuer portfolio.html.

  Aufgabe: jedem Abschnitt die Klasse .sichtbar anhaengen, sobald er in den
  Blick kommt. Alles Sichtbare macht portfolio.css - hier steht nur, WANN
  umgeschaltet wird.

  Warum IntersectionObserver und nicht das scroll-Ereignis wie in index.js:
  der Browser meldet von sich aus, wenn ein Element den Rand kreuzt, statt
  bei jedem Scroll-Pixel fuer jedes Element die Geometrie neu auszurechnen.
  Auf einer Seite mit fuenf grossen Bloecken ist das spuerbar ruhiger.

  Diese Datei laeuft ohne defer als erstes Skript im <head>, damit .js-an
  gesetzt ist, BEVOR der Browser den Body malt. Sonst blitzt der fertige
  Inhalt einen Moment auf, bevor er auf unsichtbar springt.
*/

(function () {
    'use strict';

    // Startzustand "unsichtbar" haengt in portfolio.css komplett an .js-an.
    // Ohne JavaScript (oder wenn diese Datei nicht laedt) bleibt die Klasse
    // aus und die Seite ist einfach sofort vollstaendig lesbar - besser als
    // eine Seite, die dauerhaft leer bleibt.
    document.documentElement.classList.add('js-an');

    var wenigerBewegung = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function allesZeigen() {
        document.querySelectorAll('.enthuellen').forEach(function (el) {
            el.classList.add('sichtbar');
        });
    }

    function beobachterStarten() {
        var abschnitte = document.querySelectorAll('.enthuellen');

        // Weniger Bewegung gewuenscht, oder ein Browser ohne
        // IntersectionObserver: dann sofort alles zeigen.
        if (wenigerBewegung || !('IntersectionObserver' in window)) {
            allesZeigen();
            return;
        }

        var beobachter = new IntersectionObserver(function (eintraege) {
            eintraege.forEach(function (eintrag) {
                if (!eintrag.isIntersecting) return;
                eintrag.target.classList.add('sichtbar');
                // Einmalig: ein Block, der einmal da war, soll beim
                // Zurueckscrollen nicht wieder verschwinden.
                beobachter.unobserve(eintrag.target);
            });
        }, {
            // Erst ausloesen, wenn der Block ein Stueck weit drin ist -
            // sonst ist die Animation schon durch, bevor man ihn sieht.
            rootMargin: '0px 0px -12% 0px',
            threshold: 0.15
        });

        abschnitte.forEach(function (el) {
            beobachter.observe(el);
        });
    }

    /*
      Zweiter Teil: alles, was sich WAEHREND des Scrollens veraendert.
      Der Beobachter oben schaltet nur einmal um; hier laufen Werte
      fortlaufend mit.

        --fortschritt  Balken am oberen Rand (0 bis 1)
        --weg          Kopfbereich blendet aus (0 bis 1)
        --p            je Block: +1 noch unten, 0 mittig, -1 schon oben
                       -> Ziffer und Symbol wandern gegenlaeufig mit

      Gerechnet wird nur einmal pro Bild (requestAnimationFrame). Ein
      Scroll-Ereignis feuert deutlich oefter als der Bildschirm neu zeichnet;
      ohne die Bremse wuerde dieselbe Rechnung mehrfach pro Bild laufen.
    */
    function scrollWirkungBinden() {
        var bloecke = Array.prototype.slice.call(document.querySelectorAll('.projektblock'));
        var pillen = Array.prototype.slice.call(document.querySelectorAll('.projektpille'));
        var kopf = document.querySelector('.kopfbereich');
        var balken = document.querySelector('.fortschritt');

        var wartet = false;
        var letzteAktive;

        function rechnen() {
            wartet = false;
            var hoehe = window.innerHeight;
            var mitte = hoehe / 2;

            if (balken) {
                var scrollbar = document.documentElement.scrollHeight - hoehe;
                var anteil = scrollbar > 0 ? window.scrollY / scrollbar : 0;
                balken.style.setProperty('--fortschritt',
                    Math.max(0, Math.min(1, anteil)).toFixed(4));
            }

            // Der Kopfbereich ist nach drei Vierteln einer Bildschirmhoehe weg.
            if (kopf && !wenigerBewegung) {
                kopf.style.setProperty('--weg',
                    Math.min(1, window.scrollY / (hoehe * 0.75)).toFixed(4));
            }

            var naechster;
            var kuerzesterAbstand = Infinity;

            bloecke.forEach(function (block, i) {
                var r = block.getBoundingClientRect();
                var blockMitte = r.top + r.height / 2;

                // Welcher Block liegt der Bildschirmmitte am naechsten?
                if (r.bottom > 0 && r.top < hoehe) {
                    var abstand = Math.abs(blockMitte - mitte);
                    if (abstand < kuerzesterAbstand) {
                        kuerzesterAbstand = abstand;
                        naechster = i;
                    }
                }

                // Bewusst ohne "nur wenn sichtbar"-Abkuerzung: die wuerde nur
                // einen Setter sparen, dafuer bliebe --p bei weggescrolltem
                // Block auf einem Zwischenwert stehen und spraenge beim
                // Zurueckscrollen. Das Rechteck liegt oben ohnehin schon vor.
                if (!wenigerBewegung) {
                    var p = (blockMitte - mitte) / (mitte + r.height / 2);
                    block.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(4));
                }
            });

            // Klassen nur anfassen, wenn sich wirklich etwas geaendert hat.
            if (naechster !== letzteAktive) {
                pillen.forEach(function (pille, i) {
                    pille.classList.toggle('aktiv', i === naechster);
                });
                letzteAktive = naechster;
            }
        }

        function anstossen() {
            if (wartet) return;
            wartet = true;
            window.requestAnimationFrame(rechnen);
        }

        // addEventListener, nicht window.onscroll: index.js belegt die
        // onscroll-Eigenschaft bereits fuer den Go-to-Top-Knopf.
        window.addEventListener('scroll', anstossen, { passive: true });
        window.addEventListener('resize', anstossen);
        rechnen();
    }

    function alleStarten() {
        beobachterStarten();
        scrollWirkungBinden();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', alleStarten);
    } else {
        alleStarten();
    }

    // Notnagel: falls der Beobachter aus irgendeinem Grund nicht greift,
    // ist die Seite spaetestens zwei Sekunden nach dem Laden trotzdem
    // vollstaendig da. Unsichtbarer Inhalt ist der einzige Fehler, den
    // diese Datei nicht machen darf.
    window.addEventListener('load', function () {
        setTimeout(function () {
            var offen = document.querySelector('.enthuellen:not(.sichtbar)');
            if (!offen) return;
            if (offen.getBoundingClientRect().top < window.innerHeight) {
                allesZeigen();
            }
        }, 2000);
    });
})();
