// Serverloser Endpoint fuer die Rezensionen (Cloudflare Pages Function).
//
// Warum es das gibt: Vorher standen neun erfundene Rezensionen fest in
// ebook.html. Echtes Feedback kam nur per E-Mail an und tauchte auf der Seite
// nie auf. Jetzt liegen die Rezensionen in KV und werden von hier ausgeliefert.
//
// Lesen darf jeder, Schreiben nur mit dem Passwort aus dem Secret
// REZENSION_ADMIN. Der "Admin-Modus" im Browser (Name = "Admin" im
// localStorage) blendet nur die Knoepfe ein - entschieden wird hier.
//
// Ehrliche Grenze: Es gibt keine Sperre gegen Passwort-Raten. Das Passwort ist
// die einzige Huerde, also sollte es lang sein. Fuer eine Seite mit einem
// einzigen Admin und einer Handvoll Rezensionen ist das vertretbar.

const KV_SCHLUESSEL = "liste";

const json = (daten, status = 200) =>
    new Response(JSON.stringify(daten), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // Nicht cachen: sonst steht nach einer Korrektur minutenlang noch
            // der alte Text auf der Seite und man haelt es fuer einen Bug.
            "Cache-Control": "no-store",
        },
    });

// Liest die Liste aus KV. Ein leeres oder kaputtes Bin ergibt eine leere Liste
// statt eines Fehlers - dann zeigt die Seite "noch keine Rezensionen" und nicht
// eine Fehlermeldung.
async function leseListe(env) {
    const roh = await env.REZENSIONEN.get(KV_SCHLUESSEL);
    if (!roh) return [];
    try {
        const liste = JSON.parse(roh);
        return Array.isArray(liste) ? liste : [];
    } catch {
        console.log("Rezensionen-Bin ist kein gueltiges JSON - liefere leere Liste.");
        return [];
    }
}

// Schreibt die ganze Liste zurueck. Race-Bedingung ist bekannt: zwei
// gleichzeitige Aenderungen ueberschreiben sich. Bei einem einzigen Admin ist
// das kein realistisches Problem.
const schreibeListe = (env, liste) =>
    env.REZENSIONEN.put(KV_SCHLUESSEL, JSON.stringify(liste));

function istAdmin(request, env) {
    const gesendet = request.headers.get("X-Admin-Passwort") || "";
    return Boolean(env.REZENSION_ADMIN) && gesendet === env.REZENSION_ADMIN;
}

// Prueft und normalisiert die Felder einer Rezension.
// Gibt entweder { fehler } oder { wert } zurueck.
function pruefeFelder(body) {
    const name = String(body.name || "").trim();
    const titel = String(body.titel || "").trim();
    const text = String(body.text || "").trim();
    const sterne = Number(body.sterne);
    const datum = String(body.datum || "").trim();

    if (!name || name.length > 60) {
        return { fehler: "Name fehlt oder ist zu lang (max. 60 Zeichen)." };
    }
    if (!titel || titel.length > 120) {
        return { fehler: "Titel fehlt oder ist zu lang (max. 120 Zeichen)." };
    }
    if (!text || text.length > 2000) {
        return { fehler: "Text fehlt oder ist zu lang (max. 2000 Zeichen)." };
    }
    if (!Number.isInteger(sterne) || sterne < 1 || sterne > 5) {
        return { fehler: "Sterne muessen zwischen 1 und 5 liegen." };
    }
    // Datum ist optional - fehlt es, nehmen wir heute.
    if (datum && !/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
        return { fehler: "Datum muss im Format JJJJ-MM-TT sein." };
    }

    return {
        wert: {
            name,
            titel,
            text,
            sterne,
            datum: datum || new Date().toISOString().slice(0, 10),
        },
    };
}

async function leseBody(request) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

// Neueste zuerst. Bei gleichem Datum entscheidet die Reihenfolge im Bin, damit
// mehrere Rezensionen vom selben Tag nicht bei jedem Aufruf springen.
const sortiert = (liste) =>
    [...liste].sort((a, b) => String(b.datum || "").localeCompare(String(a.datum || "")));

export async function onRequestGet({ env }) {
    if (!env.REZENSIONEN) {
        return json({ fehler: "Serverkonfiguration unvollständig." }, 503);
    }
    return json({ rezensionen: sortiert(await leseListe(env)) });
}

export async function onRequestPost({ request, env }) {
    if (!env.REZENSIONEN) return json({ fehler: "Serverkonfiguration unvollständig." }, 503);
    if (!istAdmin(request, env)) return json({ fehler: "Passwort falsch." }, 401);

    const body = await leseBody(request);
    if (!body) return json({ fehler: "Anfrage konnte nicht gelesen werden." }, 400);

    const geprueft = pruefeFelder(body);
    if (geprueft.fehler) return json({ fehler: geprueft.fehler }, 400);

    const liste = await leseListe(env);
    const neu = { id: crypto.randomUUID(), ...geprueft.wert };
    liste.push(neu);
    await schreibeListe(env, liste);

    return json({ rezension: neu, rezensionen: sortiert(liste) }, 201);
}

export async function onRequestPut({ request, env }) {
    if (!env.REZENSIONEN) return json({ fehler: "Serverkonfiguration unvollständig." }, 503);
    if (!istAdmin(request, env)) return json({ fehler: "Passwort falsch." }, 401);

    const body = await leseBody(request);
    if (!body) return json({ fehler: "Anfrage konnte nicht gelesen werden." }, 400);

    // Passwort-Probe fuer den Login: Wer hier ankommt, ist schon an istAdmin
    // vorbei, also stimmt das Passwort. Es gibt diesen Weg, damit der Login
    // nicht raten muss - sonst muesste er aus einem 400er ("keine ID")
    // schliessen, dass das Passwort stimmte, und ein 404 einer fehlenden API
    // saehe genauso nach Erfolg aus.
    if (body.pruefen === true) return json({ ok: true });

    if (!body.id) return json({ fehler: "Keine ID angegeben." }, 400);

    const geprueft = pruefeFelder(body);
    if (geprueft.fehler) return json({ fehler: geprueft.fehler }, 400);

    const liste = await leseListe(env);
    const index = liste.findIndex((r) => r.id === body.id);
    if (index === -1) return json({ fehler: "Rezension nicht gefunden." }, 404);

    liste[index] = { id: body.id, ...geprueft.wert };
    await schreibeListe(env, liste);

    return json({ rezension: liste[index], rezensionen: sortiert(liste) });
}

export async function onRequestDelete({ request, env }) {
    if (!env.REZENSIONEN) return json({ fehler: "Serverkonfiguration unvollständig." }, 503);
    if (!istAdmin(request, env)) return json({ fehler: "Passwort falsch." }, 401);

    const body = await leseBody(request);
    if (!body) return json({ fehler: "Anfrage konnte nicht gelesen werden." }, 400);
    if (!body.id) return json({ fehler: "Keine ID angegeben." }, 400);

    const liste = await leseListe(env);
    const uebrig = liste.filter((r) => r.id !== body.id);
    if (uebrig.length === liste.length) return json({ fehler: "Rezension nicht gefunden." }, 404);

    await schreibeListe(env, uebrig);
    return json({ rezensionen: sortiert(uebrig) });
}
