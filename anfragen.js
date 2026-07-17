/* ====================================================================
   Passwort-Anfragen - laeuft nur auf ebook.html
   ====================================================================
   Zeigt, wer das E-Book-Passwort angefordert hat. Die Anfragen kommen aus
   /api/leads und werden von passwort.js in KV geschrieben - unabhaengig davon,
   ob die Benachrichtigungs-Mail durchkommt. Genau das ist der Sinn: der Browser
   des Besuchers schickt die Mail, und jeder Adblocker kann sie verschlucken.
   Was hier steht, ist die verlaessliche Spur.

   passwortHolen() und rezPasswortSpeicher kommen aus rezensionen.js bzw.
   index.js - dieselbe Anmeldung, dasselbe Passwort. Diese Datei haengt in
   ebook.html hinter beiden, damit sie beim Laden schon da sind.
   ==================================================================== */

const ANFRAGEN_API = "/api/leads";

let anfragen = [];

// Der Kasten sitzt im Admin-Bereich und wird von rezensionen.js mit ein- und
// ausgeblendet. Hier geht es nur um den Inhalt.
function anfragenMeldung(text, fehler = true) {
    const feld = document.getElementById("anfragen-meldung");
    if (!feld) return;
    feld.textContent = text;
    feld.className = fehler ? "alert text-bg-danger" : "alert text-bg-success";
    feld.style.display = text ? "block" : "none";
}

const anfrageDatum = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
};

// Name und E-Mail kommen von Fremden und gehen per textContent ins DOM, nie per
// innerHTML - sonst stuende ein <script> im Namen hier gleich im Admin-Bereich.
function anfrageZeile(a) {
    const zeile = document.createElement("div");
    zeile.style.cssText = "display: flex; align-items: baseline; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--popupborder);";

    const text = document.createElement("div");
    text.style.flex = "1";

    const name = document.createElement("b");
    name.textContent = a.name || "(ohne Namen)";

    const mail = document.createElement("a");
    mail.className = "link";
    mail.href = "mailto:" + (a.email || "");
    mail.textContent = a.email || "";

    const wann = document.createElement("small");
    wann.className = "clink";
    wann.style.opacity = "0.7";
    wann.textContent = anfrageDatum(a.datum);

    text.appendChild(name);
    text.appendChild(document.createElement("br"));
    text.appendChild(mail);
    text.appendChild(document.createTextNode(" – "));
    text.appendChild(wann);

    const weg = document.createElement("button");
    weg.type = "button";
    weg.className = "btn btn-sm text-bg-danger";
    weg.textContent = "Löschen";
    weg.onclick = () => anfrageLoeschen(a);

    zeile.appendChild(text);
    zeile.appendChild(weg);
    return zeile;
}

function anfragenZeichnen() {
    const liste = document.getElementById("anfragen-liste");
    const leer = document.getElementById("anfragen-leer");
    const zahl = document.getElementById("anfragen-anzahl");
    if (!liste) return;

    liste.replaceChildren();
    anfragen.forEach((a) => liste.appendChild(anfrageZeile(a)));

    if (leer) leer.style.display = anfragen.length ? "none" : "block";
    if (zahl) {
        zahl.textContent = anfragen.length === 1 ? "1 Anfrage" : anfragen.length + " Anfragen";
    }
}

// Ohne Anmeldung gar nicht erst fragen: die Function antwortet dann mit 401,
// und eine rote Fehlermeldung im leeren Admin-Bereich waere nur verwirrend.
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
    if (!confirm(`Anfrage von ${a.name || a.email} wirklich löschen?`)) return;
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
