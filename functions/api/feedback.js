// Serverloser Endpoint fuer die Rezensions-Anfragen (Cloudflare Pages Function).
//
// Warum es das gibt: Wer das Feedback-Formular ausfuellt, schickt damit fast
// immer eine Rezension in spe. Bisher kam sie nur als formsubmit-Mail an, mit
// einem Link, der das Admin-Formular vorausfuellt - also: Mail suchen, Link
// klicken, neuer Tab. Jetzt liegt die Anfrage hier und steht direkt im
// Admin-Bereich, einen Klick vom fertigen Formular entfernt.
//
// Die Mail bleibt trotzdem: sie ist die Benachrichtigung. Der Browser schickt
// sie weiter selbst an formsubmit (siehe FORMSUBMIT in index.js).
//
// Schreiben darf jeder - das ist ein oeffentliches Formular. Davor haengt
// Turnstile, denn jeder Aufruf kostet einen KV-Schreibvorgang, und im
// kostenlosen Tarif sind das 1.000 pro Tag fuers ganze Konto.
//
// Lesen und Loeschen nur mit dem Rezensions-Passwort (REZENSION_ADMIN) - dasselbe
// wie bei den Rezensionen, es haengt ohnehin an derselben Person.
//
// Ehrliche Grenze: Was hier steht, ist ungeprueft. Niemand bestaetigt Name oder
// Adresse. Veroeffentlicht wird nichts von allein - erst wenn im Admin-Formular
// auf "Rezension anlegen" geklickt wird.

const ANFRAGE_PREFIX = "feedback:";

const json = (daten, status = 200) =>
    new Response(JSON.stringify(daten), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // Enthaelt fremde Namen und Texte - niemals zwischenspeichern.
            "Cache-Control": "no-store",
        },
    });

function istAdmin(request, env) {
    const gesendet = request.headers.get("X-Admin-Passwort") || "";
    return Boolean(env.REZENSION_ADMIN) && gesendet === env.REZENSION_ADMIN;
}

// Gleiche Pruefung wie in passwort.js. Bewusst kopiert statt geteilt: Pages
// bundelt jede Function einzeln, und ein gemeinsames Modul waere hier mehr
// Bauwerk als Nutzen. Ohne Secret wird durchgelassen, sonst legt der Deploy das
// Formular lahm, bis das Secret im Dashboard steht.
async function turnstileOk(request, env, token) {
    if (!env.TURNSTILE_SECRET) {
        console.log("TURNSTILE_SECRET fehlt - Feedback wird ungeprueft angenommen.");
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
        console.log("Turnstile nicht erreichbar - Feedback angenommen:", e.message);
        return true;
    }
}

// Grosszuegiger als bei den Rezensionen: das hier ist ein Vorschlag, kein
// Veroeffentlichtes. Zu lange Texte werden gekuerzt statt abgelehnt - sonst
// verliert der Besucher seinen Text an einer Fehlermeldung, die er nicht
// versteht. Zurechtgerueckt wird spaeter im Admin-Formular.
function pruefeFelder(body) {
    const kurz = (wert, max) => String(wert || "").trim().slice(0, max);

    const name = kurz(body.name, 60);
    if (!name) return { fehler: "Name fehlt." };

    const sterne = Number(body.sterne);
    return {
        wert: {
            name,
            email: kurz(body.email, 200),
            titel: kurz(body.titel, 120),
            text: kurz(body.text, 2000),
            sterne: Number.isInteger(sterne) && sterne >= 1 && sterne <= 5 ? sterne : null,
            datum: new Date().toISOString().slice(0, 10),
        },
    };
}

// Ein Schluessel pro Anfrage statt einer Liste unter einem Schluessel: zwei
// Besucher, die im selben Moment abschicken, wuerden sich bei Lesen-Aendern-
// Schreiben sonst gegenseitig ueberschreiben.
//
// Der Zeitstempel steht vorn im Schluessel, damit KV von allein chronologisch
// sortiert. Der Inhalt liegt im Wert und nicht in den Metadaten: die sind auf
// 1.024 Byte begrenzt, ein Rezensionstext darf 2.000 Zeichen haben.
export async function onRequestPost({ request, env }) {
    if (!env.REZENSIONEN) return json({ fehler: "Serverkonfiguration unvollständig." }, 503);

    const body = await request.json().catch(() => null);
    if (!body) return json({ fehler: "Anfrage konnte nicht gelesen werden." }, 400);

    if (!(await turnstileOk(request, env, String(body.turnstile || "")))) {
        return json({ fehler: "Bitte bestätige noch, dass du kein Bot bist." }, 403);
    }

    const geprueft = pruefeFelder(body);
    if (geprueft.fehler) return json({ fehler: geprueft.fehler }, 400);

    const jetzt = new Date().toISOString();
    await env.REZENSIONEN.put(
        `${ANFRAGE_PREFIX}${jetzt}:${crypto.randomUUID()}`,
        JSON.stringify(geprueft.wert)
    );

    return json({ ok: true }, 201);
}

// Neueste zuerst - KV liefert aufsteigend, vorn steht der Zeitstempel.
async function leseAnfragen(env) {
    const treffer = await env.REZENSIONEN.list({ prefix: ANFRAGE_PREFIX });
    const anfragen = await Promise.all(
        treffer.keys.map(async (k) => {
            const wert = await env.REZENSIONEN.get(k.name, "json");
            return wert ? { id: k.name, ...wert } : null;
        })
    );
    return anfragen.filter(Boolean).reverse();
}

export async function onRequestGet({ request, env }) {
    if (!env.REZENSIONEN) return json({ fehler: "Serverkonfiguration unvollständig." }, 503);
    if (!istAdmin(request, env)) return json({ fehler: "Passwort falsch." }, 401);

    return json({ anfragen: await leseAnfragen(env) });
}

export async function onRequestDelete({ request, env }) {
    if (!env.REZENSIONEN) return json({ fehler: "Serverkonfiguration unvollständig." }, 503);
    if (!istAdmin(request, env)) return json({ fehler: "Passwort falsch." }, 401);

    const body = await request.json().catch(() => null);
    const id = String((body && body.id) || "");
    // Der Riegel ist wichtig: im selben Bin liegt unter "liste" jede Rezension.
    // Ohne diese Pruefung koennte ein Tippfehler im Frontend sie mitloeschen.
    if (!id.startsWith(ANFRAGE_PREFIX)) {
        return json({ fehler: "Das ist keine Anfrage." }, 400);
    }

    await env.REZENSIONEN.delete(id);
    return json({ anfragen: await leseAnfragen(env) });
}
