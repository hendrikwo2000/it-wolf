// Serverloser Endpoint fuer das E-Book-Passwort (Cloudflare Pages Function).
//
// Warum es das gibt: Vorher stand das Passwort im Klartext auf EdankeE.html,
// einer ganz normalen oeffentlichen Datei. Das Formular war kein Schloss, sondern
// ein Wegweiser - wer die URL kannte, kam ohne Formular ans Passwort.
//
// Hier liegt das Passwort im verschluesselten Secret EBOOK_PASSWORT und wird nur
// auf ein POST mit plausibler E-Mail hin herausgegeben.
//
// Die Mail mit Name und Adresse verschickt der Browser (index.js), nicht diese
// Function. Der Versuch, den Lead von hier aus an formsubmit zu geben, ist
// gescheitert: formsubmit verlangt einen Referer, und den darf ein Worker in
// Produktion nicht setzen - die Function stirbt daran mit einem blanken 502.
// Lange fiel es nicht auf, weil der alte Code das Ergebnis von fetch nie
// angesehen hat: das Passwort kam, die Mail verschwand still.
//
// Ehrliche Grenze: Das ist keine echte Zugangskontrolle. Wer die Anfrage
// nachbaut, bekommt das Passwort - die E-Mail wird nicht verifiziert. Es hebt die
// Huerde von "URL aufrufen" auf "POST nachbauen" und haelt das Passwort aus dem
// Quelltext, dem Repo und dem Suchindex heraus. Wasserdicht waere nur Versand
// per E-Mail an die angegebene Adresse.

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

    // name und email werden hier nur geprueft, nicht verschickt - das macht der
    // Browser. Sie stehen trotzdem in der Signatur, weil eine Anfrage ohne
    // plausible Angaben gar nicht erst ein Passwort bekommen soll.
    return json({ passwort: env.EBOOK_PASSWORT });
}

// Ein GET soll nicht einfach das Passwort ausspucken - genau das war der alte Fehler.
export async function onRequest(context) {
    if (context.request.method === "POST") return onRequestPost(context);
    return json({ fehler: "Nur POST." }, 405);
}
