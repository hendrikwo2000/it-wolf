// Serverloser Endpoint fuer das E-Book-Passwort (Cloudflare Pages Function).
//
// Warum es das gibt: Vorher stand das Passwort im Klartext auf EdankeE.html,
// einer ganz normalen oeffentlichen Datei. Das Formular war kein Schloss, sondern
// ein Wegweiser - wer die URL kannte, kam ohne Formular ans Passwort.
//
// Hier liegt das Passwort im verschluesselten Secret EBOOK_PASSWORT und wird nur
// auf ein POST mit plausibler E-Mail hin herausgegeben. Der Lead geht dabei
// serverseitig an formsubmit, wodurch die formsubmit-Adresse nicht mehr im
// oeffentlichen HTML steht.
//
// Ehrliche Grenze: Auch das ist keine echte Zugangskontrolle. Wer die Anfrage
// nachbaut, bekommt das Passwort - die E-Mail wird nicht verifiziert. Es hebt die
// Huerde von "URL aufrufen" auf "POST nachbauen" und haelt das Passwort aus dem
// Quelltext, dem Repo und dem Suchindex heraus. Wasserdicht waere nur Versand
// per E-Mail an die angegebene Adresse.

const FORMSUBMIT = "https://formsubmit.co/ajax/fe15abf088e090210d1d03807c630d3b";

// formsubmit lehnt Anfragen ohne Referer ab ("FormSubmit will not work in pages
// browsed as HTML files") und schickt dann keine Mail. Aus dem Browser kam der
// Header automatisch mit, ein Worker muss ihn selbst setzen - das war der Grund,
// warum die Passwort-Anfrage funktionierte, aber nie eine Mail ankam.
const HERKUNFT = "https://it-wolf.org/ebook";

const json = (daten, status = 200) =>
    new Response(JSON.stringify(daten), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // Antwort enthaelt das Passwort - niemals zwischenspeichern.
            "Cache-Control": "no-store",
        },
    });

export async function onRequestPost(context) {
    const { request, env } = context;

    if (!env.EBOOK_PASSWORT) {
        // Lieber ein klarer Fehler als ein stiller Fehlschlag.
        return json({ fehler: "Serverkonfiguration unvollständig." }, 503);
    }

    let name = "";
    let email = "";
    try {
        const typ = request.headers.get("content-type") || "";
        if (typ.includes("application/json")) {
            const b = await request.json();
            name = String(b.name || "").trim();
            email = String(b.email || "").trim();
        } else {
            const f = await request.formData();
            name = String(f.get("name") || "").trim();
            email = String(f.get("email") || "").trim();
        }
    } catch {
        return json({ fehler: "Anfrage konnte nicht gelesen werden." }, 400);
    }

    if (!name || name.length > 100) {
        return json({ fehler: "Bitte gib einen Namen ein." }, 400);
    }
    // Bewusst grob: strenge E-Mail-Regex lehnt mehr gueltige Adressen ab als sie
    // ungueltige faengt. Ein Tippfehler faellt hier ohnehin nicht auf.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
        return json({ fehler: "Bitte gib eine gültige E-Mail-Adresse ein." }, 400);
    }

    // Lead an formsubmit weiterreichen. Schlaegt das fehl, bekommt der Nutzer
    // trotzdem sein Passwort - sein Download soll nicht an meinem Postfach haengen.
    try {
        const antwort = await fetch(FORMSUBMIT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Referer: HERKUNFT,
            },
            body: JSON.stringify({
                name,
                email,
                _subject: "E-Book Passwort angefordert",
                _template: "table",
            }),
        });
        // Achtung: formsubmit antwortet auch bei Ablehnung mit HTTP 200. Ein
        // Check auf antwort.ok wuerde den Fehler durchwinken - die Wahrheit
        // steht im Feld success.
        const ergebnis = await antwort.json().catch(() => ({}));
        if (ergebnis.success !== "true") {
            console.log("formsubmit hat den Lead abgelehnt:", ergebnis.message);
        }
    } catch (e) {
        console.log("formsubmit nicht erreichbar:", e.message);
    }

    return json({ passwort: env.EBOOK_PASSWORT });
}

// Ein GET soll nicht einfach das Passwort ausspucken - genau das war der alte Fehler.
export async function onRequest(context) {
    if (context.request.method === "POST") return onRequestPost(context);
    return json({ fehler: "Nur POST." }, 405);
}
