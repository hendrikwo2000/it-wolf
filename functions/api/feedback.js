// Serverloser Endpoint fuer die beiden Kontaktformulare (Cloudflare Pages Function).
//
// Warum es das gibt: passwort.js hatte die formsubmit-Adresse bewusst
// serverseitig versteckt - sie stand danach aber weiter im Klartext in
// ebook.html und impressum.html. Solange sie dort zu lesen war, war durch das
// Verstecken nichts gewonnen. Beide Formulare posten jetzt hierher.
//
// Der Betreff kommt aus der festen Liste unten und nicht aus dem Formular:
// sonst koennte sich jeder mit einem nachgebauten POST einen beliebigen Betreff
// in mein Postfach schreiben.
//
// Ehrliche Grenze: Das ist kein Spam-Schutz. Wer die Anfrage nachbaut, kann
// weiter Nachrichten schicken - so wie vorher direkt an formsubmit. Es haelt
// nur die Adresse aus dem oeffentlichen Quelltext heraus.

const FORMSUBMIT = "https://formsubmit.co/ajax/fe15abf088e090210d1d03807c630d3b";

// Erlaubte Formulare, ihr Betreff und die Seite, von der sie kommen.
// Alles andere wird abgelehnt.
const FORMULARE = {
    ebook: { betreff: "E-Book Feedback!", herkunft: "https://it-wolf.org/ebook" },
    kontakt: { betreff: "Impressum Kontakt!", herkunft: "https://it-wolf.org/impressum" },
};

const json = (daten, status = 200) =>
    new Response(JSON.stringify(daten), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });

export async function onRequestPost({ request }) {
    let body;
    try {
        const typ = request.headers.get("content-type") || "";
        if (typ.includes("application/json")) {
            body = await request.json();
        } else {
            body = Object.fromEntries(await request.formData());
        }
    } catch {
        return json({ fehler: "Anfrage konnte nicht gelesen werden." }, 400);
    }

    const formular = String(body.formular || "").trim();
    if (!FORMULARE[formular]) {
        return json({ fehler: "Unbekanntes Formular." }, 400);
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const nachricht = String(body.message || "").trim();
    // Sterne gibt es nur beim E-Book-Feedback und auch dort nur freiwillig.
    const sterne = Number(body.rating);

    if (!name || name.length > 100) {
        return json({ fehler: "Bitte gib einen Namen ein." }, 400);
    }
    // Bewusst grob - dieselbe Regex wie in passwort.js: eine strenge E-Mail-Regex
    // lehnt mehr gueltige Adressen ab als sie ungueltige faengt.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
        return json({ fehler: "Bitte gib eine gültige E-Mail-Adresse ein." }, 400);
    }
    if (!nachricht || nachricht.length > 5000) {
        return json({ fehler: "Bitte schreib eine Nachricht (max. 5000 Zeichen)." }, 400);
    }

    const inhalt = {
        name,
        email,
        message: nachricht,
        _subject: FORMULARE[formular].betreff,
        _template: "table",
        _captcha: "false",
    };
    if (Number.isInteger(sterne) && sterne >= 1 && sterne <= 5) {
        inhalt.rating = sterne;
    }

    // Anders als in passwort.js ist der Versand hier der ganze Zweck: klappt er
    // nicht, muss der Nutzer das erfahren, sonst haelt er seine Nachricht fuer
    // zugestellt.
    try {
        const antwort = await fetch(FORMSUBMIT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Ohne Referer haelt formsubmit den Request fuer eine lokale
                // HTML-Datei und verwirft ihn. Aus dem Browser kam der Header
                // automatisch, der Worker muss ihn selbst setzen.
                Referer: FORMULARE[formular].herkunft,
            },
            body: JSON.stringify(inhalt),
        });
        // formsubmit antwortet auch bei Ablehnung mit HTTP 200 - auf antwort.ok
        // darf man sich hier nicht verlassen, entscheidend ist das Feld success.
        const ergebnis = await antwort.json().catch(() => ({}));
        if (ergebnis.success !== "true") {
            console.log("formsubmit hat abgelehnt:", ergebnis.message || "HTTP " + antwort.status);
            return json({ fehler: "Die Nachricht konnte nicht zugestellt werden." }, 502);
        }
    } catch (e) {
        console.log("formsubmit nicht erreichbar:", e.message);
        return json({ fehler: "Die Nachricht konnte nicht zugestellt werden." }, 502);
    }

    return json({ ok: true });
}

// Ein GET soll die formsubmit-Adresse nicht durch einen Fehler verraten.
export async function onRequest(context) {
    if (context.request.method === "POST") return onRequestPost(context);
    return json({ fehler: "Nur POST." }, 405);
}
