/*
  Mini-Build fuer die statische Seite: haelt die geteilten Bloecke (Navbar +
  Footer) ueber alle Seiten synchron, ohne sie in jeder HTML-Datei doppelt zu
  pflegen. Kein Framework, keine Abhaengigkeiten - nur Node.

  Workflow:
    1. Gemeinsame Teile in partials/ bearbeiten (nav.html, footer.html,
       nav-right-*.html).
    2. `node build.js` ausfuehren - schreibt die Bloecke in die Seiten.
    3. Wie gewohnt committen und pushen. Cloudflare Pages liefert die erzeugten
       Dateien direkt aus (kein Deploy-Schritt aendert sich).

  Die Navbar hat rechts einen seitenabhaengigen Teil (Admin-/Rezensions-Schloss);
  dafuer steht {{RIGHT}} im nav-Partial, ersetzt je Seite durch eine der
  nav-right-*.html-Varianten.

  404.html ist bewusst NICHT dabei: die Seite wird unter beliebigen URLs
  ausgeliefert und braucht deshalb absolute Pfade. Sie wird von Hand gepflegt -
  wer Navbar/Footer strukturell aendert, muss 404.html separat nachziehen.
*/
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const partial = (f) => fs.readFileSync(path.join(ROOT, 'partials', f), 'utf8').replace(/\s+$/, '');

const nav = partial('nav.html');
const footer = partial('footer.html');
const rights = {
    base: partial('nav-right-base.html'),
    seiten: partial('nav-right-seiten.html'),
    ebook: partial('nav-right-ebook.html'),
};

// Seite -> Variante des rechten Navbar-Teils.
const pages = {
    'index.html': 'base',
    'tools.html': 'base',
    'impressum.html': 'base',
    'seiten.html': 'seiten',
    'ebook.html': 'ebook',
};

let fehler = 0;
for (const [file, variant] of Object.entries(pages)) {
    const p = path.join(ROOT, file);
    let html = fs.readFileSync(p, 'utf8');
    const navHtml = nav.replace('{{RIGHT}}', () => rights[variant]);

    const vorher = html;
    // Funktion als Ersatz -> Inhalt wird woertlich eingesetzt (kein $-Sonderzeichen-Problem).
    html = html.replace(/<nav\b[^>]*id="nav"[\s\S]*?<\/nav>/, () => navHtml);
    html = html.replace(/<footer\b[\s\S]*?<\/footer>/, () => footer);

    if (!/id="nav"/.test(html) || !/<footer/.test(html)) {
        console.error('FEHLER: nav/footer in ' + file + ' nicht gefunden - Datei unveraendert gelassen.');
        fs.writeFileSync(p, vorher);
        fehler++;
        continue;
    }
    fs.writeFileSync(p, html);
    console.log((html === vorher ? 'unveraendert:' : 'gebaut:      ') + ' ' + file + '  (' + variant + ')');
}

console.log('\n' + Object.keys(pages).length + ' Seiten verarbeitet' + (fehler ? ', ' + fehler + ' FEHLER' : ', keine Fehler') + '.');
process.exit(fehler ? 1 : 0);
