// Serverloser Endpoint fuer das E-Book-Passwort (Cloudflare Pages Function).
//
// Warum es das gibt: Vorher stand das Passwort im Klartext auf EdankeE.html,
// einer ganz normalen oeffentlichen Datei. Das Formular war kein Schloss, sondern
// ein Wegweiser - wer die URL kannte, kam ohne Formular ans Passwort.
//
// Hier liegt das Passwort im verschluesselten Secret EBOOK_PASSWORT und wird nur
// auf ein POST mit plausibler E-Mail hin herausgegeben.
//
// Die Mail mit Name und Adresse verschickt bis auf Weiteres der Browser
// (index.js), nicht diese Function. Der Versuch, den Lead von hier aus an
// formsubmit zu geben, ist gescheitert: formsubmit verlangt einen Referer, und
// den darf ein Worker in Produktion nicht setzen - die Function stirbt daran mit
// einem blanken 502. Lange fiel es nicht auf, weil der alte Code das Ergebnis
// von fetch nie angesehen hat: das Passwort kam, die Mail verschwand still.
//
// Genau deshalb steht der Lead seit Neuestem hier in KV, bevor das Passwort
// rausgeht. Der Browser-Weg ist naemlich blockierbar: jeder Adblocker, der
// formsubmit.co kennt, verschluckt die Mail - der Besucher bekommt sein E-Book
// und ich erfahre nie davon. Was hier gespeichert ist, kann kein Adblocker und
// kein fremdes Postfach mehr verlieren. Die Mail ist dann nur noch
// Benachrichtigung, nicht mehr die einzige Spur.
//
// Ehrliche Grenze: Das ist keine echte Zugangskontrolle. Wer die Anfrage
// nachbaut, bekommt das Passwort - die E-Mail wird nicht verifiziert. Es hebt die
// Huerde von "URL aufrufen" auf "POST nachbauen" und haelt das Passwort aus dem
// Quelltext, dem Repo und dem Suchindex heraus. Wasserdicht waere nur Versand
// per E-Mail an die angegebene Adresse.

// Anfragen liegen im selben KV-Bin wie die Rezensionen, nur unter eigenem
// Praefix. Ein zweites Bin waere sauberer getrennt, kostet aber eine weitere
// Bindung im Dashboard - fuer zwei Datenarten auf einer kleinen Seite ist das
// den Aufwand nicht wert. leads.js liest sie unter demselben Praefix wieder aus.
const LEAD_PREFIX = "lead:";

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

    await merkeLead(env, name, email);

    return json({ passwort: env.EBOOK_PASSWORT });
}

// Ein Schluessel pro Anfrage statt einer Liste unter einem Schluessel: zwei
// Besucher, die im selben Moment anfragen, wuerden sich bei Lesen-Aendern-
// Schreiben gegenseitig ueberschreiben. Hier kann das nicht passieren.
//
// Die Daten stehen in den Metadaten statt im Wert, weil ein einziges list()
// dann schon alles liefert, was die Uebersicht braucht - sonst waere pro
// Anfrage ein eigener Abruf noetig. Der Zeitstempel steht vorn im Schluessel,
// damit KV sie von allein chronologisch sortiert zurueckgibt.
async function merkeLead(env, name, email) {
    // Ohne Bin kein Speicher - dann bleibt es beim Browser-Weg. Kein Grund,
    // deshalb das Passwort zu verweigern.
    if (!env.REZENSIONEN) {
        console.log("Kein KV-Bin gebunden - Anfrage nicht gespeichert.");
        return;
    }
    const jetzt = new Date().toISOString();
    try {
        await env.REZENSIONEN.put(`${LEAD_PREFIX}${jetzt}:${crypto.randomUUID()}`, "", {
            metadata: { name, email, datum: jetzt },
        });
    } catch (e) {
        // Der Download des Besuchers haengt nicht an meiner Buchhaltung.
        console.log("Anfrage nicht gespeichert:", e.message);
    }
}

// Ein GET soll nicht einfach das Passwort ausspucken - genau das war der alte Fehler.
export async function onRequest(context) {
    if (context.request.method === "POST") return onRequestPost(context);
    return json({ fehler: "Nur POST." }, 405);
}
