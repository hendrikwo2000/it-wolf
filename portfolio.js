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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', beobachterStarten);
    } else {
        beobachterStarten();
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
