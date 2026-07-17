// Serverloser Endpoint, der nur ein Turnstile-Token prueft (Cloudflare Pages
// Function). Kein Speichern, kein Mailen - er sagt bloss ja oder nein.
//
// Warum getrennt: Das Kontaktformular im Impressum schickt seine Mail direkt aus
// dem Browser an formsubmit. Der Umweg ueber eine eigene Function scheitert
// daran, dass formsubmit einen Referer verlangt, den ein Worker nicht setzen
// darf. Also bleibt der Mailweg im Browser - und der Spamschutz haengt hier
// davor: index.js fragt erst diesen Endpoint, und nur bei "ok" geht die Mail
// raus. So ist auch das letzte Formular gegen Skripte geschuetzt, ohne dass
// etwas am Mailversand kaputtgeht.

const json = (daten, status = 200) =>
    new Response(JSON.stringify(daten), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });

export async function onRequestPost({ request, env }) {
    // Ohne Secret keine Pruefung moeglich - dann bewusst ok, sonst legt der
    // Deploy dieser Datei das Kontaktformular lahm, bis das Secret im Dashboard
    // steht. Dieselbe Entscheidung wie in passwort.js und feedback.js.
    if (!env.TURNSTILE_SECRET) {
        console.log("TURNSTILE_SECRET fehlt - Kontakt wird ungeprueft durchgelassen.");
        return json({ ok: true });
    }

    const body = await request.json().catch(() => ({}));
    const token = String(body.turnstile || "");
    if (!token) return json({ ok: false }, 403);

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
        return ergebnis.success === true ? json({ ok: true }) : json({ ok: false }, 403);
    } catch (e) {
        // Ist Cloudflare selbst nicht erreichbar, soll das Kontaktformular nicht
        // sterben - ein Ausfall dort darf niemanden aussperren.
        console.log("Turnstile nicht erreichbar - Kontakt durchgelassen:", e.message);
        return json({ ok: true });
    }
}
