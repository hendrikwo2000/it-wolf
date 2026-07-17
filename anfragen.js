/* ====================================================================
   Rezensions-Anfragen - laeuft nur auf ebook.html
   ====================================================================
   Zeigt, was ueber das Feedback-Formular hereingekommen ist, und schiebt es auf
   Knopfdruck ins Formular "Rezensionen verwalten". Die Anfragen kommen aus
   /api/feedback, geschrieben werden sie dort beim Absenden des Formulars.

   Vorher fuehrte der Weg ueber die formsubmit-Mail: Mail suchen, Link klicken,
   neuer Tab, Formular vorausgefuellt. Die Mail gibt es weiter, aber man braucht
   sie nicht mehr.

   passwortHolen(), istAngemeldet(), sterneHtml() und formularAusRohdaten()
   kommen aus rezensionen.js - dieselbe Anmeldung, dieselbe Darstellung. Diese
   Datei haengt in ebook.html hinter rezensionen.js, damit das beim Laden steht.
   ==================================================================== */

const ANFRAGEN_API = "/api/feedback";

let anfragen = [];

function anfragenMeldung(text, fehler = true) {
    const feld = document.getElementById("anfragen-meldung");
    if (!feld) return;
    feld.textContent = text;
    feld.className = fehler ? "alert text-bg-danger" : "alert text-bg-success";
    feld.style.display = text ? "block" : "none";
}

// Name, Titel und Text kommen von Fremden und gehen per textContent ins DOM,
// nie per innerHTML - sonst stuende ein <script> aus dem Formular gleich hier
// im Admin-Bereich. Nur die Sterne sind selbst gebautes Markup.
function anfrageKarte(a) {
    const kasten = document.createElement("div");
    kasten.style.cssText = "padding: 12px 0; border-bottom: 1px solid var(--popupborder);";

    const kopf = document.createElement("div");
    const name = document.createElement("b");
    name.textContent = a.name || "(ohne Namen)";
    kopf.appendChild(name);

    if (a.sterne) {
        const sterne = document.createElement("a");
        sterne.className = "stern";
        sterne.style.marginLeft = "10px";
        sterne.innerHTML = sterneHtml(a.sterne);
        kopf.appendChild(sterne);
    }

    const wann = document.createElement("small");
    wann.className = "clink";
    wann.style.opacity = "0.7";
    wann.style.marginLeft = "10px";
    wann.textContent = datumDeutsch(a.datum);
    kopf.appendChild(wann);

    const inhalt = document.createElement("p");
    inhalt.className = "clink";
    inhalt.style.margin = "6px 0";
    if (a.titel) {
        const fett = document.createElement("b");
        fett.textContent = a.titel;
        inhalt.appendChild(fett);
        inhalt.appendChild(document.createElement("br"));
    }
    inhalt.appendChild(document.createTextNode(a.text || ""));

    const leiste = document.createElement("div");

    const uebernehmen = document.createElement("button");
    uebernehmen.type = "button";
    uebernehmen.className = "btn btn-sm";
    uebernehmen.style.cssText = "border-color: var(--popupborder); color: var(--linkc)";
    uebernehmen.textContent = "Ins Formular übernehmen";
    uebernehmen.onclick = () => anfrageUebernehmen(a);

    const weg = document.createElement("button");
    weg.type = "button";
    weg.className = "btn btn-sm text-bg-danger";
    weg.style.marginLeft = "10px";
    weg.textContent = "Löschen";
    weg.onclick = () => anfrageLoeschen(a);

    leiste.appendChild(uebernehmen);
    leiste.appendChild(weg);

    kasten.appendChild(kopf);
    kasten.appendChild(inhalt);
    if (a.email) {
        const mail = document.createElement("a");
        mail.className = "link";
        mail.href = "mailto:" + a.email;
        mail.style.cssText = "font-size: 0.85em; opacity: 0.7;";
        mail.textContent = a.email;
        kasten.appendChild(mail);
        kasten.appendChild(document.createElement("br"));
        kasten.appendChild(document.createElement("br"));
    }
    kasten.appendChild(leiste);
    return kasten;
}

function anfragenZeichnen() {
    const liste = document.getElementById("anfragen-liste");
    const leer = document.getElementById("anfragen-leer");
    const zahl = document.getElementById("anfragen-anzahl");
    if (!liste) return;

    liste.replaceChildren();
    anfragen.forEach((a) => liste.appendChild(anfrageKarte(a)));

    if (leer) leer.style.display = anfragen.length ? "none" : "block";
    if (zahl) zahl.textContent = anfragen.length ? "(" + anfragen.length + ")" : "";
}

// Schiebt die Anfrage ins Rezensionsformular. Bewusst ohne Loeschen: erst
// pruefen und anlegen, dann von Hand wegraeumen - sonst waere die Anfrage weg,
// wenn beim Anlegen etwas schiefgeht.
function anfrageUebernehmen(a) {
    formularAusRohdaten(a);
    adminMeldung("Aus der Anfrage übernommen. Bitte prüfen, ggf. korrigieren – veröffentlicht wird erst mit „Rezension anlegen“.", false);
}

// Ohne Anmeldung gar nicht erst fragen: die Function antwortet mit 401, und eine
// rote Fehlermeldung im leeren Admin-Bereich waere nur verwirrend.
async function anfragenLaden() {
    if (typeof istAngemeldet !== "function" || !istAngemeldet()) {
        anfragen = [];
        anfragenZeichnen();
        return;
    }
    try {
        const antwort = await fetch(ANFRAGEN_API, {
            cache: "no-store",
            headers: { "X-Admin-Passwort": passwortHolen() },
        });
        const ergebnis = await antwort.json().catch(() => ({}));
        if (!antwort.ok) {
            anfragenMeldung(ergebnis.fehler || "Anfragen konnten nicht geladen werden.");
            return;
        }
        anfragen = ergebnis.anfragen || [];
        anfragenMeldung("");
        anfragenZeichnen();
    } catch (e) {
        console.error("Anfragen konnten nicht geladen werden:", e);
        anfragenMeldung("Keine Verbindung zum Server. Bist du online?");
    }
}

async function anfrageLoeschen(a) {
    if (!confirm(`Anfrage von ${a.name} wirklich löschen?`)) return;
    try {
        const antwort = await fetch(ANFRAGEN_API, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "X-Admin-Passwort": passwortHolen() },
            body: JSON.stringify({ id: a.id }),
        });
        const ergebnis = await antwort.json().catch(() => ({}));
        if (!antwort.ok) {
            anfragenMeldung(ergebnis.fehler || "Das hat nicht geklappt.");
            return;
        }
        anfragen = ergebnis.anfragen || [];
        anfragenMeldung("Anfrage gelöscht.", false);
        anfragenZeichnen();
    } catch (e) {
        console.error("Netzwerkfehler:", e);
        anfragenMeldung("Keine Verbindung zum Server. Bist du online?");
    }
}

// rezensionen.js ruft anfragenLaden() beim An- und Abmelden auf. Beim Laden der
// Seite muss es hier selbst passieren - wer schon angemeldet ist, soll die
// Liste sofort sehen.
if (document.getElementById("anfragen-liste")) {
    anfragenLaden();
}
