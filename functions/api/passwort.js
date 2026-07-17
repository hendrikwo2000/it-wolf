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
// Kurzzeitig lag die Anfrage hier zusaetzlich in KV, als Netz fuer den Fall,
// dass ein Adblocker die Mail verschluckt. Wieder ausgebaut: die Liste hat
// nie jemand angesehen, und fremde Namen und Adressen zu speichern, die man
// nicht braucht, ist keine Vorsorge - das ist nur Datenhalde. Wer per Adblocker
// unbemerkt laedt, bleibt damit unbemerkt; das ist der bewusste Preis.
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
    let turnstile = "";
    try {
        const typ = request.headers.get("content-type") || "";
        if (typ.includes("application/json")) {
            const b = await request.json();
            name = String(b.name || "").trim();
            email = String(b.email || "").trim();
            turnstile = String(b.turnstile || "");
        } else {
            const f = await request.formData();
            name = String(f.get("name") || "").trim();
            email = String(f.get("email") || "").trim();
            turnstile = String(f.get("cf-turnstile-response") || "");
        }
    } catch {
        return json({ fehler: "Anfrage konnte nicht gelesen werden." }, 400);
    }

    // Vor allem anderen: erst gar keine Arbeit fuer ein Skript machen.
    if (!(await turnstileOk(request, env, turnstile))) {
        return json({ fehler: "Bitte bestätige noch, dass du kein Bot bist." }, 403);
    }

    if (!name || name.length > 100) {
        return json({ fehler: "Bitte gib einen Namen ein." }, 400);
    }
    // Bewusst grob: strenge E-Mail-Regex lehnt mehr gueltige Adressen ab als sie
    // ungueltige faengt. Ein Tippfehler faellt hier ohnehin nicht auf.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
        return json({ fehler: "Bitte gib eine gültige E-Mail-Adresse ein." }, 400);
    }

    // name und email werden hier nur geprueft, nicht gespeichert und nicht
    // verschickt - das macht der Browser. Sie stehen trotzdem in der Signatur,
    // weil eine Anfrage ohne plausible Angaben gar nicht erst ein Passwort
    // bekommen soll.
    return json({ passwort: env.EBOOK_PASSWORT });
}

// Turnstile ist Cloudflares Captcha: der Browser loest im Hintergrund eine
// Aufgabe und legt ein Token ins Formular, das hier gegengeprueft wird.
//
// Warum ueberhaupt: Seit die Anfragen in KV landen, kostet jeder Aufruf einen
// Schreibvorgang - im kostenlosen Tarif sind das 1.000 pro Tag fuers ganze
// Konto. Ein Skript in einer Schleife koennte das Kontingent leerraeumen, und
// danach liessen sich nicht einmal mehr Rezensionen speichern.
//
// Zwei bewusste Entscheidungen, beide zugunsten des Besuchers:
//
// Ohne gesetztes Secret wird nicht geprueft. Sonst haette der Deploy dieser
// Datei das Formular so lange totgelegt, bis das Secret im Dashboard steht. Der
// Preis: solange TURNSTILE_SECRET fehlt, schuetzt hier nichts - und man sieht es
// nur im Log.
//
// Ist Cloudflare selbst nicht erreichbar, wird ebenfalls durchgelassen. Ein
// Ausfall dort soll nicht das E-Book sperren; das Passwort ist ohnehin keine
// echte Zugangskontrolle, sondern eine Huerde gegen Massenabruf.
async function turnstileOk(request, env, token) {
    if (!env.TURNSTILE_SECRET) {
        console.log("TURNSTILE_SECRET fehlt - Anfrage wird ungeprueft durchgelassen.");
        return true;
    }
    if (!token) return false;

    try {
        const antwort = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secret: env.TURNSTILE_SECRET,
                response: token,
                remoteip: request.headers.get("CF-Connecting-IP") || undefined,
            }),
        });
        const ergebnis = await antwort.json().catch(() => ({}));
        if (ergebnis.success !== true) {
            console.log("Turnstile abgelehnt:", (ergebnis["error-codes"] || []).join(", "));
            return false;
        }
        return true;
    } catch (e) {
        console.log("Turnstile nicht erreichbar - Anfrage durchgelassen:", e.message);
        return true;
    }
}

// Ein GET soll nicht einfach das Passwort ausspucken - genau das war der alte Fehler.
export async function onRequest(context) {
    if (context.request.method === "POST") return onRequestPost(context);
    return json({ fehler: "Nur POST." }, 405);
}
