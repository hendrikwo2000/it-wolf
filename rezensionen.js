/* ====================================================================
   Rezensionen - laeuft nur auf ebook.html
   ====================================================================
   Vorher standen hier neun erfundene Rezensionen fest im HTML, jede mit
   fuenf ausgeschriebenen Stern-SVGs. Jetzt kommen sie von /api/rezensionen
   und werden hier gezeichnet.

   Schreiben geht nur mit dem Admin-Passwort, das die Function prueft. Das
   Passwort liegt im sessionStorage: einmal pro Tab eingeben, beim Schliessen
   ist es weg. Der adminmode aus index.js (Name = "Admin") blendet nur das
   Login-Feld ein - er entscheidet nichts, das kann er auch gar nicht.
   ==================================================================== */

const REZ_API = "/api/rezensionen";
// REZ_PASSWORT_KEY kommt aus index.js - der Login sitzt auch im Impressum, wo
// diese Datei nicht geladen wird. Hier nochmal deklarieren wäre ein SyntaxError.

// So viele Karten sind sofort sichtbar, der Rest haengt an "mehr anzeigen".
const REZ_SICHTBAR = 6;

const STERN_VOLL =
    "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z";
const STERN_HALB =
    "M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z";

let rezensionen = [];
let alleSichtbar = false;

// ---------- Passwort (nur fuer diesen Tab) ----------

const passwortHolen = () => sessionStorage.getItem(REZ_PASSWORT_KEY) || "";
const istAngemeldet = () => passwortHolen() !== "";

// ---------- Sterne ----------

// Ein Stern als SVG. Hier fliesst nichts vom Nutzer ein, deshalb ist der
// String-Bau unbedenklich.
function sternSvg(pfad, groesse, aktiv) {
    const farbe = aktiv ? "var(--stern-color)" : "var(--hovg)";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${groesse}" height="${groesse}"
        fill="currentColor" viewBox="0 0 16 16" style="color: ${farbe}"><path d="${pfad}" /></svg>`;
}

// Fuenf Sterne, gefuellt bis "wert". Halbe Sterne nur fuer den Schnitt -
// eine einzelne Rezension hat immer ganze.
function sterneHtml(wert, groesse = 16) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        const rest = wert - i + 1;
        if (rest >= 0.75) html += sternSvg(STERN_VOLL, groesse, true);
        else if (rest >= 0.25) html += sternSvg(STERN_HALB, groesse, true);
        else html += sternSvg(STERN_VOLL, groesse, false);
    }
    return html;
}

const datumDeutsch = (iso) => {
    const [j, m, t] = String(iso || "").split("-");
    return j && m && t ? `${t}.${m}.${j}` : "";
};

// ---------- Zeichnen ----------

// Eine Karte. Name, Titel und Text kommen per textContent ins DOM und nicht per
// innerHTML: sonst koennte ein <script> im Rezensionstext ausgefuehrt werden.
function karteBauen(r, versteckt) {
    const col = document.createElement("div");
    col.className = versteckt ? "col toggleRezensionen" : "col";
    if (versteckt) col.style.display = "none";

    const huelle = document.createElement("a");
    huelle.className = "clink";

    const karte = document.createElement("div");
    karte.id = "hovr";
    karte.className = "card h-100";

    const koerper = document.createElement("div");
    koerper.className = "card-body";

    const titel = document.createElement("h5");
    titel.className = "card-title";
    titel.textContent = r.name;

    const text = document.createElement("p");
    text.className = "card-text";

    const sterne = document.createElement("a");
    sterne.className = "stern";
    sterne.innerHTML = sterneHtml(r.sterne);

    const datum = document.createElement("small");
    datum.className = "clink";
    datum.style.opacity = "0.7";
    datum.textContent = " " + datumDeutsch(r.datum);

    const inhalt = document.createElement("a");
    inhalt.className = "clink";
    const fett = document.createElement("b");
    fett.textContent = r.titel;
    inhalt.appendChild(fett);
    inhalt.appendChild(document.createElement("br"));
    inhalt.appendChild(document.createTextNode(r.text));

    text.appendChild(sterne);
    text.appendChild(datum);
    text.appendChild(document.createElement("br"));
    text.appendChild(inhalt);

    koerper.appendChild(titel);
    koerper.appendChild(text);

    if (istAngemeldet()) {
        koerper.appendChild(adminKnoepfe(r));
    }

    karte.appendChild(koerper);
    huelle.appendChild(karte);
    col.appendChild(huelle);
    return col;
}

function adminKnoepfe(r) {
    const leiste = document.createElement("div");
    leiste.style.marginTop = "15px";

    const bearbeiten = document.createElement("button");
    bearbeiten.type = "button";
    bearbeiten.className = "btn btn-sm";
    bearbeiten.style.cssText = "border-color: var(--popupborder); color: var(--linkc)";
    bearbeiten.textContent = "Bearbeiten";
    bearbeiten.onclick = () => formularFuellen(r);

    const loeschen = document.createElement("button");
    loeschen.type = "button";
    loeschen.className = "btn btn-sm text-bg-danger";
    loeschen.style.marginLeft = "10px";
    loeschen.textContent = "Löschen";
    loeschen.onclick = () => rezensionLoeschen(r);

    leiste.appendChild(bearbeiten);
    leiste.appendChild(loeschen);
    return leiste;
}

function zeichneListe() {
    const liste = document.getElementById("rezensionen-liste");
    const leer = document.getElementById("rezensionen-leer");
    const knopf = document.getElementById("anzeigen");
    if (!liste) return;

    liste.replaceChildren();
    rezensionen.forEach((r, i) => {
        const versteckt = !alleSichtbar && i >= REZ_SICHTBAR;
        liste.appendChild(karteBauen(r, versteckt));
    });

    if (leer) leer.style.display = rezensionen.length ? "none" : "block";
    if (knopf) {
        // Der Knopf hat nur einen Sinn, wenn es ueberhaupt etwas zu verstecken gibt.
        knopf.parentElement.style.display = rezensionen.length > REZ_SICHTBAR ? "flex" : "none";
        knopf.textContent = alleSichtbar ? "weniger anzeigen" : "mehr anzeigen";
    }
}

// Schnitt und Anzahl neben dem Download-Knopf. Beides stand frueher fest im
// HTML ("67 Rezensionen", 4,5 Sterne) und hatte mit den Karten darunter nichts
// zu tun.
function zeichneSchnitt() {
    const block = document.getElementById("rezensionen-schnitt");
    const sterne = document.getElementById("rezensionen-sterne");
    const anzahl = document.getElementById("rezensionen-anzahl");
    if (!block) return;

    if (!rezensionen.length) {
        // Keine Rezensionen: lieber gar keine Wertung zeigen als 0,0 Sterne
        // neben das E-Book zu schreiben.
        block.style.display = "none";
        return;
    }

    const schnitt = rezensionen.reduce((s, r) => s + r.sterne, 0) / rezensionen.length;
    block.style.display = "block";
    if (sterne) sterne.innerHTML = sterneHtml(schnitt);
    if (anzahl) {
        anzahl.textContent =
            rezensionen.length === 1 ? "1 Rezension" : rezensionen.length + " Rezensionen";
    }
}

// Wird von ebook.html per onclick aufgerufen.
function toggleRezensionen() {
    alleSichtbar = !alleSichtbar;
    zeichneListe();
}

// ---------- Laden ----------

async function ladeRezensionen() {
    try {
        const antwort = await fetch(REZ_API, { cache: "no-store" });
        const ergebnis = await antwort.json().catch(() => ({}));
        if (!antwort.ok) throw new Error(ergebnis.fehler || "HTTP " + antwort.status);
        rezensionen = ergebnis.rezensionen || [];
    } catch (e) {
        // Kein Grund, die Seite kaputt aussehen zu lassen: ohne Daten sieht der
        // Bereich aus wie ohne Rezensionen.
        console.error("Rezensionen konnten nicht geladen werden:", e);
        rezensionen = [];
    }
    zeichneListe();
    zeichneSchnitt();
}

// ---------- Admin ----------

function adminMeldung(text, fehler = true) {
    const feld = document.getElementById("admin-meldung");
    if (!feld) return;
    feld.textContent = text;
    feld.className = fehler ? "alert text-bg-danger" : "alert text-bg-success";
    feld.style.display = text ? "block" : "none";
}

// Zeigt Login oder Editor, je nachdem ob ein Passwort im Tab liegt.
function adminUiZeichnen() {
    const bereich = document.getElementById("rezensionen-admin");
    const login = document.getElementById("admin-login");
    const editor = document.getElementById("admin-editor");
    if (!bereich) return;

    // adminmode kommt aus index.js. Das ist reine Bequemlichkeit - wer das Feld
    // auf anderem Weg oeffnet, scheitert trotzdem am Passwort in der Function.
    const zeigen = typeof adminmode !== "undefined" && adminmode;
    bereich.style.display = zeigen ? "block" : "none";
    if (!zeigen) return;

    if (login) login.style.display = istAngemeldet() ? "none" : "block";
    if (editor) editor.style.display = istAngemeldet() ? "block" : "none";
}

async function adminAnmelden(event) {
    event.preventDefault();
    const feld = document.getElementById("admin-passwort");
    const passwort = feld ? feld.value : "";
    if (!passwort) return;

    // Passwort-Probe gegen die Function. Ein GET wuerde nichts beweisen, das
    // darf jeder. pruefeRezensionsPasswort kommt aus index.js.
    if (!(await pruefeRezensionsPasswort(passwort))) {
        adminMeldung("Passwort falsch.");
        return;
    }
    sessionStorage.setItem(REZ_PASSWORT_KEY, passwort);

    if (feld) feld.value = "";
    adminMeldung("Angemeldet. Das Passwort gilt, bis du den Tab schließt.", false);
    formularLeeren();
    adminUiZeichnen();
    zeichneListe();
}

function adminAbmelden() {
    sessionStorage.removeItem(REZ_PASSWORT_KEY);
    adminMeldung("");
    adminUiZeichnen();
    zeichneListe();
}

function formularFuellen(r) {
    document.getElementById("rez-id").value = r.id;
    document.getElementById("rez-name").value = r.name;
    document.getElementById("rez-titel").value = r.titel;
    document.getElementById("rez-text").value = r.text;
    document.getElementById("rez-sterne").value = r.sterne;
    document.getElementById("rez-datum").value = r.datum;
    document.getElementById("admin-speichern").textContent = "Änderung speichern";
    adminMeldung("");
    document.getElementById("rezensionen-admin").scrollIntoView({ behavior: "smooth", block: "center" });
}

function formularLeeren() {
    const formular = document.getElementById("admin-formular");
    if (!formular) return;
    formular.reset();
    document.getElementById("rez-id").value = "";
    // Neue Rezension: heute vorbelegen, das ist fast immer das richtige Datum.
    document.getElementById("rez-datum").value = new Date().toISOString().slice(0, 10);
    document.getElementById("admin-speichern").textContent = "Rezension anlegen";
}

async function adminSpeichern(event) {
    event.preventDefault();
    const id = document.getElementById("rez-id").value;
    const daten = {
        id: id || undefined,
        name: document.getElementById("rez-name").value,
        titel: document.getElementById("rez-titel").value,
        text: document.getElementById("rez-text").value,
        sterne: Number(document.getElementById("rez-sterne").value),
        datum: document.getElementById("rez-datum").value,
    };

    const ergebnis = await schreibe(id ? "PUT" : "POST", daten);
    if (!ergebnis) return;

    rezensionen = ergebnis.rezensionen || [];
    adminMeldung(id ? "Änderung gespeichert." : "Rezension angelegt.", false);
    formularLeeren();
    zeichneListe();
    zeichneSchnitt();
}

async function rezensionLoeschen(r) {
    if (!confirm(`Rezension von ${r.name} wirklich löschen?`)) return;

    const ergebnis = await schreibe("DELETE", { id: r.id });
    if (!ergebnis) return;

    rezensionen = ergebnis.rezensionen || [];
    adminMeldung("Rezension gelöscht.", false);
    zeichneListe();
    zeichneSchnitt();
}

// Gemeinsamer Weg fuer POST, PUT und DELETE. Gibt bei Erfolg die Antwort
// zurueck, sonst null - die Meldung steht dann schon im Kasten.
async function schreibe(methode, daten) {
    try {
        const antwort = await fetch(REZ_API, {
            method: methode,
            headers: { "Content-Type": "application/json", "X-Admin-Passwort": passwortHolen() },
            body: JSON.stringify(daten),
        });
        const ergebnis = await antwort.json().catch(() => ({}));

        if (antwort.status === 401) {
            // Passwort abgelaufen oder falsch: zurueck zum Login, sonst klickt
            // man weiter gegen eine Wand.
            sessionStorage.removeItem(REZ_PASSWORT_KEY);
            adminUiZeichnen();
            adminMeldung("Passwort falsch. Bitte neu anmelden.");
            return null;
        }
        if (!antwort.ok) {
            adminMeldung(ergebnis.fehler || "Das hat nicht geklappt.");
            return null;
        }
        return ergebnis;
    } catch (e) {
        console.error("Netzwerkfehler:", e);
        adminMeldung("Keine Verbindung zum Server. Bist du online?");
        return null;
    }
}

// ---------- Start ----------

// index.js setzt adminmode beim Laden, beide Skripte haengen an defer und
// laufen in Reihenfolge - adminmode steht hier also schon fest.
if (document.getElementById("rezensionen-liste")) {
    adminUiZeichnen();
    formularLeeren();
    ladeRezensionen();

    const login = document.getElementById("admin-login-formular");
    if (login) login.addEventListener("submit", adminAnmelden);

    const formular = document.getElementById("admin-formular");
    if (formular) formular.addEventListener("submit", adminSpeichern);

    const abmelden = document.getElementById("admin-abmelden");
    if (abmelden) abmelden.addEventListener("click", adminAbmelden);

    const abbrechen = document.getElementById("admin-abbrechen");
    if (abbrechen) abbrechen.addEventListener("click", formularLeeren);
}
