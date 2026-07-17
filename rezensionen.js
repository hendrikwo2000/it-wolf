/* ====================================================================
   Rezensionen - laeuft nur auf ebook.html
   ====================================================================
   Vorher standen hier neun erfundene Rezensionen fest im HTML, jede mit
   fuenf ausgeschriebenen Stern-SVGs. Jetzt kommen sie von /api/rezensionen
   und werden hier gezeichnet.

   Schreiben geht nur mit dem Admin-Passwort, das die Function prueft. Es liegt
   im localStorage und bleibt, bis man sich abmeldet - sonst fragte der
   Rezensions-Link aus der E-Mail jedes Mal neu, weil er einen neuen Tab
   oeffnet. Der adminmode aus index.js (Name = "Admin") blendet nur das
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

// Daten aus einem Rezensions-Link (#rezension=...), noch nicht übernommen.
let ausLink = null;
// Über so einen Link gekommen? Dann den Admin-Bereich zeigen, auch wenn der
// adminmode aus index.js nicht an ist - sonst führt der Knopf aus der E-Mail
// auf einem anderen Gerät ins Leere.
let linkModus = false;

// ---------- Passwort (nur fuer diesen Tab) ----------

// rezPasswortSpeicher und REZ_PASSWORT_KEY kommen aus index.js.
const passwortHolen = () => rezPasswortSpeicher.getItem(REZ_PASSWORT_KEY) || "";
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

// Die Sterne im Admin-Formular sind dieselben anklickbaren Radio-Sterne wie beim
// Feedback, vorher war es ein <select>. Deshalb hat das Feld keinen einzelnen
// Wert mehr, den man lesen oder setzen koennte - das erledigen diese beiden.
function sterneLesen() {
    const gewaehlt = document.querySelector('#admin-formular input[name="rez-sterne"]:checked');
    return gewaehlt ? Number(gewaehlt.value) : 0;
}

// Faellt still auf den vorigen Stand zurueck, wenn der Wert nichts taugt: die
// Zahl aus einem Rezensions-Link ist fremd, und ein leerer Kasten waere hier
// schlimmer als die 5 aus formularLeeren().
function sterneSetzen(wert) {
    const feld = document.getElementById("rez-stern" + Math.round(Number(wert)));
    if (feld) feld.checked = true;
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
    // hovr ist eine Klasse, kein id: mehrere Karten teilen sich den Hover-Stil,
    // und eine id waere hier doppelt vergeben.
    karte.className = "card h-100 hovr";

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
    // Ein Rezensions-Link zaehlt genauso: wer ihn hat, will offensichtlich hier
    // arbeiten, und ein sichtbares Passwortfeld verraet nichts.
    const zeigen = (typeof adminmode !== "undefined" && adminmode) || linkModus;
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
    rezPasswortSpeicher.setItem(REZ_PASSWORT_KEY, passwort);

    if (feld) feld.value = "";
    adminMeldung("Angemeldet. Dieser Browser merkt sich das, bis du dich über das Schloss abmeldest.", false);
    formularLeeren();
    // Überschrift ("Admin!") und Schloss oben rechts hängen an genau diesem
    // Passwort. adminAnzeigeAktualisieren kommt aus index.js.
    adminAnzeigeAktualisieren();
    adminUiZeichnen();
    zeichneListe();
    // Die Passwort-Anfragen haengen an derselben Anmeldung (anfragen.js).
    anfragenLaden();
    // Kam der Aufruf aus einer E-Mail, wartet die Rezension schon.
    uebernehmeAusLink();
}

function adminAbmelden() {
    rezPasswortSpeicher.removeItem(REZ_PASSWORT_KEY);
    adminMeldung("");
    adminAnzeigeAktualisieren();
    adminUiZeichnen();
    zeichneListe();
    // Fremde Namen und Adressen gehoeren nach dem Abmelden nicht mehr auf den
    // Schirm - anfragenLaden() leert die Liste, wenn kein Passwort mehr da ist.
    anfragenLaden();
}

function formularFuellen(r) {
    document.getElementById("rez-id").value = r.id;
    document.getElementById("rez-name").value = r.name;
    document.getElementById("rez-titel").value = r.titel;
    document.getElementById("rez-text").value = r.text;
    sterneSetzen(r.sterne);
    document.getElementById("rez-datum").value = r.datum;
    document.getElementById("admin-speichern").textContent = "Änderung speichern";
    adminMeldung("");
    document.getElementById("rezensionen-admin").scrollIntoView({ behavior: "smooth", block: "center" });
}

// Liest die Daten aus dem Fragment eines Rezensions-Links.
//
// Achtung bei der Bewertung dessen, was hier rauskommt: der Link wurde im
// Browser des Kunden gebaut, der Inhalt ist also fremd. Er landet ausschließlich
// als .value in Formularfeldern - nie als Markup - und wird erst gespeichert,
// wenn im Formular auf "anlegen" geklickt wird. Was in der Mail steht, muss
// nicht dasselbe sein wie im Link: entscheidend ist, was im Formular steht.
function rezensionAusLink() {
    const treffer = location.hash.match(/rezension=([^&]+)/);
    if (!treffer) return null;
    try {
        const b64 = treffer[1].replace(/-/g, "+").replace(/_/g, "/");
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        const daten = JSON.parse(new TextDecoder().decode(bytes));
        return daten && typeof daten === "object" ? daten : null;
    } catch (e) {
        console.error("Rezensions-Link nicht lesbar:", e);
        return null;
    }
}

// Nimmt einen gelesenen Link entgegen. Gemeinsamer Weg für beide Fälle: frisch
// aufgerufene Seite und Fragmentwechsel in einem schon offenen Tab.
function verarbeiteLink(daten) {
    if (!daten) return;
    ausLink = daten;
    linkModus = true;

    // Fragment sofort aus der Adresszeile nehmen: sonst füllt ein Neuladen alles
    // wieder vor - auch nach dem Anlegen - und der Rezensionstext bliebe in der
    // URL und im Verlauf stehen.
    history.replaceState(null, "", location.pathname + location.search);

    adminUiZeichnen();
    if (istAngemeldet()) {
        uebernehmeAusLink();
        return;
    }
    adminMeldung("Eine Rezension aus der E-Mail wartet – bitte zuerst anmelden.", false);
    document.getElementById("rezensionen-admin").scrollIntoView({ behavior: "smooth", block: "center" });
}

// Füllt das Formular aus fremden Rohdaten. Zwei Wege enden hier: der Link aus
// der E-Mail und der Übernehmen-Knopf an einer Anfrage (anfragen.js).
//
// Egal woher: der Inhalt ist von Fremden geschrieben. Er landet ausschließlich
// als .value in Formularfeldern - nie als Markup - und ist damit noch lange
// nicht veröffentlicht. Das passiert erst beim Klick auf "Rezension anlegen".
function formularAusRohdaten(daten) {
    const feld = (id, wert) => (document.getElementById(id).value = wert);

    feld("rez-id", ""); // leer = neue Rezension, kein Ändern
    feld("rez-name", daten.name || "");
    feld("rez-titel", daten.titel || "");
    feld("rez-text", daten.text || "");
    sterneSetzen(daten.sterne || 5);
    feld("rez-datum", daten.datum || new Date().toISOString().slice(0, 10));
    document.getElementById("admin-speichern").textContent = "Rezension anlegen";
    document.getElementById("rezensionen-admin").scrollIntoView({ behavior: "smooth", block: "center" });
}

// Trägt die Daten aus dem Link ins Formular ein.
function uebernehmeAusLink() {
    if (!ausLink) return;
    formularAusRohdaten(ausLink);
    adminMeldung("Aus der E-Mail übernommen. Bitte prüfen, ggf. korrigieren – veröffentlicht wird erst mit „Rezension anlegen“.", false);
    ausLink = null; // nur einmal übernehmen
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
        sterne: sterneLesen(),
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
            // Passwort passt nicht mehr (z.B. Secret geaendert): zurueck zum
            // Login, sonst klickt man weiter gegen eine Wand.
            rezPasswortSpeicher.removeItem(REZ_PASSWORT_KEY);
            adminAnzeigeAktualisieren();
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

    // Klickt man den Link aus der E-Mail, während schon ein Tab auf /ebook
    // offen ist, lädt der Browser die Seite nicht neu - er ändert nur das
    // Fragment. Ohne diesen Listener passierte dann schlicht gar nichts.
    window.addEventListener("hashchange", () => verarbeiteLink(rezensionAusLink()));
    // Nach formularLeeren(), sonst räumt das den gerade gefüllten Editor wieder ab.
    verarbeiteLink(rezensionAusLink());

    const login = document.getElementById("admin-login-formular");
    if (login) login.addEventListener("submit", adminAnmelden);

    const formular = document.getElementById("admin-formular");
    if (formular) formular.addEventListener("submit", adminSpeichern);

    const abmelden = document.getElementById("admin-abmelden");
    if (abmelden) abmelden.addEventListener("click", adminAbmelden);

    const abbrechen = document.getElementById("admin-abbrechen");
    if (abbrechen) abbrechen.addEventListener("click", formularLeeren);
}
