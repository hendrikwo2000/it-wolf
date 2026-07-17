


console.log(
    "\n" +
    "!@5777777777777777777777777777777777777??????7G@~     \n" +
    "!@7                   J7!^                    Y@~   ~@@@&.P@&@@@@@&@P  \n" +
    "!@7               7BJ?B.^JPY?7^               Y@~   ^@@@B ::.Y@@@J ..  \n" +
    "!@7              :?&P@&~. :@@@@BJ~.           Y@~   ^@@@G    J@@@?     \n" +
    "!@7              :?&P@&~. :@@@@BJ~.           Y@~   ^@@@G    J@@@?     \n" +
    "!@7           5#PYYB@@@@@@@@@@#55B&@@@P~      Y@~   ~@@@B    5@@@Y\n" +
    "!@7         :!&&B#JG@@@@@@@@@@G?:~P&@@@&?:    Y@~   7@@@#    P@@@5\n" +
    "7@7     .^?5PP5?::~7JYYY5&@@@@#7.~~!Y#@@@B?.  Y@~   .~~~^    :~~~: \n" +
    "7@7     5#J.   :!7!.    ^&@@@@@#J7P&&&@@@&G7. Y@~                              \n" +
    "7@7      ..^YPGP5J7^.?PJG@@@@@#57~:!P@@@@@@&J.Y@~   ~???^  ^???^  ^???~            ?J??.  !YPB? \n" +
    "7@7         ..          .^75B@@BJ~~GB&@@@@@@#!Y@~   5@@@7  J@@@J  ?@@@5            B@@@: 5@@@G? \n" +
    "!@PJJJJJJJJJJJJJJJJJJJJJJJ?J??YB@@&&@@@@@@@@@@&@~   P@@@~  ?@@@?  !@@@P  :!JYJ?~   G@@#.^#@@#~~  \n" +
    " !@@@@@@@@@@@@@@@@@@@@@@@@@@@@@BPP#@@@@@@@@@@@@@@~   !@@@5  P@@@P  5@@@! J&@@&@@@B^ G@@B.#@@@@@&. \n" +
    "^YYYYYYYYYYYYYYYYYYB@@@@@@@@@@BYYJYYYYYYYYYYYYYY:    7@@@Y?@@@@@JY@@@! ~@@@! .5@@B G@@B ~G@@&7~ \n" +
    "                  J&@@@@@@@@@@&!                      7@@@@@&J@@@@@@!  ~@@@?:^G@@G G@@B  5@@&: \n" +
    ".^^^^^^^^^^^^^^^?#@@@@@@@@@@@@@@G!^^^^^^^^^^^^^^.      7@@@@7 ?@@@@!    7B@@@@@&P: G@@#. P@@@^ \n" +
    ":7777777777777777777777777777777?7!7777777777777.       ^!!~   ~!!^       ^!77~:   ^!!~  ^!!!. \n",
);


// In DOMContentLoaded gekapselt, damit Bootstrap sicher schon geladen ist: Bootstrap
// wird jetzt ebenfalls per defer eingebunden, und index.js ist auf jeder Seite das
// erste (deferred) Skript - liefe die Tooltip-Initialisierung auf oberster Ebene,
// waere `bootstrap` hier noch undefined. Deferred Skripte laufen alle vor DOMContentLoaded.
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

//------------------------------------------------------------------------------------------------------------------------
// Elemente langsam erscheinen 


document.addEventListener('DOMContentLoaded', function () {
    var boxes = document.querySelectorAll('.box');
    boxes.forEach(function (box) {
        if (isElementPartiallyInViewport(box)) {
            box.classList.add('visible');
        }
    });
});

window.addEventListener('scroll', function () {
    var boxes = document.querySelectorAll('.box');
    boxes.forEach(function (box) {
        if (isElementPartiallyInViewport(box)) {
            box.classList.add('visible');
        }
    });
});


function isElementPartiallyInViewport(el) {
    var rect = el.getBoundingClientRect();
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

    

    return (
        rect.bottom >= 0 &&
        rect.top <= windowHeight
    );
}



//------------------------------------------------------------------------------------------------------------------------
// Button -> go to Top


let mybutton = document.getElementById("myBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
};

function topFunction() {   
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

};

//------------------------------------------------------------------------------------------------------------------------
// Netz deaktivieren und aktivieren

var netzpegel = window.localStorage.getItem("netzpegel");
if (netzpegel == "true") {
    includeScript();
    const netzon = document.getElementById("netzon");
    if (netzon) {
        netzon.setAttribute("d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");
    }

   
}

if (netzpegel == null) {
    netzpegel = "false";
}

function netzon() {

    if (netzpegel == "false") {
        document.getElementById("netzon").setAttribute("d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");
        includeScript()
        setTimeout(function () {
            netzpegel = "true";
        }, 10);
        localStorage.setItem("netzpegel", "true");

    }
    if (netzpegel == "true") {
        document.getElementById("netzon").setAttribute("d", "M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z");
        removeScript()
        setTimeout(function () {
            netzpegel = "false";
        }, 10);
        localStorage.setItem("netzpegel", "false");
        location.reload()
    }
}


// Funktion Ausbinden Einbinden der JavaScript-Datei
function removeScript() {
    const scriptElement = document.querySelector('script[src="netz.js"]');
    if (scriptElement) {
        scriptElement.remove();
    }
}

// Funktion Einbinden der JavaScript-Datei
function includeScript() {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'netz.js'; // Passe den Dateinamen und Pfad an
    document.body.appendChild(scriptElement);
}




//------------------------------------------------------------------------------------------------------------------------
// Namen ändern + admin
//
// Zwei Stufen, beide über das Namensfeld im Impressum:
//   Name "Admin"               -> Stufe 1: die erweiterten Seiten bei "Nützliche Seiten"
//   Name = Rezensions-Passwort -> Stufe 2: zusätzlich Rezensionen bearbeiten
//
// In der Überschrift steht "Admin" für Stufe 1 und "Admin!" für Stufe 2, das
// Schloss erscheint in beiden Fällen - auf ebook.html allerdings erst ab Stufe 2.
// Das Passwort wird nie angezeigt und steht nie in der Überschrift.
//
// Es liegt im localStorage und bleibt dort, bis man sich per Doppelklick auf das
// Schloss abmeldet oder einen anderen Namen einträgt. Vorher lag es im
// sessionStorage, also pro Tab - das hiess: der Rezensions-Link aus der E-Mail
// oeffnet immer einen neuen Tab, und der fragte jedes Mal neu nach dem Passwort.
//
// Der Preis ist ehrlich zu benennen: das Passwort steht damit im Klartext im
// Browser-Profil. Wer an den entsperrten Rechner kommt, kann Rezensionen
// aendern. Die Alternative waere, die Berechtigung an den Link zu haengen - das
// waere deutlich schlimmer: baueRezensionsLink steht in dieser oeffentlichen
// Datei, jeder koennte sich einen Link mit beliebigem Text bauen und damit
// ungefragt auf der Seite veroeffentlichen.

var adminmode = false;
var mam = ""; // mam = Name
mam = window.localStorage.getItem("head");
console.log("Name: " + mam);

// Schlüssel für das Rezensions-Passwort. Steht hier statt in rezensionen.js,
// weil der Login im Impressum sitzt, rezensionen.js aber nur auf ebook.html
// läuft - zwei const-Deklarationen desselben Namens wären ein SyntaxError.
const REZ_PASSWORT_KEY = "rezension-admin";
// Ein eigener Speicher, damit die Umstellung von sessionStorage an genau einer
// Stelle steht und nicht an sieben.
const rezPasswortSpeicher = window.localStorage;


if (mam == null || mam == "" || mam == "null") {
    console.log("Kein Name");
    document.getElementById("headline").innerHTML = "";
} else
    if (mam.match("<")) {
        document.getElementById("headline").innerHTML = "";
    } else if (mam == "Admin") {
        document.getElementById("headline").innerHTML = adminUeberschrift();
        adminAnschalten();
    } else {
        document.getElementById("headline").innerHTML = "Moin " + mam + " - ";
    };

// Nochmal ausserhalb: auf ebook.html haengt das Schloss an Stufe 2, und die kann
// auch ohne den Namen "Admin" aktiv sein - naemlich nach einer Anmeldung am
// Passwortfeld dort. Dann laeuft adminAnschalten oben nie.
schlossAktualisieren();


// Stufe 2 hat, wer das Rezensions-Passwort im Speicher hat. Etwas anderes
// entscheidet das hier nicht - und die Function fragt sowieso nochmal.
function hatRezensionsrechte() {
    return !!rezPasswortSpeicher.getItem(REZ_PASSWORT_KEY);
}

// "Moin Admin! - " für Stufe 2, "Moin Admin - " für Stufe 1. Das Ausrufezeichen
// wird jedes Mal aus den Rechten abgeleitet und nirgends gespeichert: im
// localStorage steht weiter "Admin", sonst müsste jede Abfrage auf den Namen
// zwei Schreibweisen kennen.
function adminUeberschrift() {
    return "Moin Admin" + (hatRezensionsrechte() ? "!" : "") + " - ";
}

// Auf seiten.html gehört das Schloss zu Stufe 1: es erklärt die gelben Karten.
// Auf ebook.html hängt dasselbe Schloss an Stufe 2, weil es dort nur den
// Rezensionsbereich betrifft - erkennbar am data-nur-rezension im HTML.
function schlossAktualisieren() {
    const schloss = document.getElementById("showadmin");
    if (!schloss) return;
    const zeigen = schloss.dataset.nurRezension ? hatRezensionsrechte() : adminmode;
    schloss.style.display = zeigen ? "block" : "none";
}

// Der zweite Weg in Stufe 2 ist das Passwortfeld auf ebook.html (rezensionen.js).
// Überschrift und Schloss hängen an denselben Rechten und müssen dort ohne
// Neuladen nachziehen.
function adminAnzeigeAktualisieren() {
    const kopf = document.getElementById("headline");
    // Nur bei "Admin": ein echter Name gehört dem Nutzer, den überschreibt ein
    // Login nicht.
    if (kopf && window.localStorage.getItem("head") == "Admin") {
        kopf.innerHTML = adminUeberschrift();
    }
    schlossAktualisieren();
}

// Schaltet Stufe 1 ein. toggleSecret und toggleEntwickler sind Umschalter, keine
// Setzer: ein zweiter Aufruf würde die Seiten wieder verstecken. Deshalb der
// Riegel auf adminmode - sonst blendet ein Passwort-Login die erweiterten Seiten
// wieder aus, wenn "Admin" vorher schon aktiv war.
function adminAnschalten() {
    if (adminmode) return;
    adminmode = true;
    toggleSecret();
    toggleEntwickler();
    schlossAktualisieren();
    console.log("Admin:" + adminmode);
}

// Schaltet beide Stufen ab. Derselbe Riegel wie oben, nur andersherum.
// Das Rezensions-Passwort fliegt immer mit raus - auch wenn Stufe 1 gar nicht
// aktiv war -, sonst dürfte nach dem Verlassen weiter jemand Rezensionen ändern.
function adminAbschalten() {
    rezPasswortSpeicher.removeItem(REZ_PASSWORT_KEY);
    if (adminmode) {
        adminmode = false;
        toggleSecret();
        toggleEntwickler();
        console.log("Admin:" + adminmode);
    }
    // Bewusst hinter dem Riegel: das Schloss auf ebook.html hängt an Stufe 2 und
    // muss auch dann verschwinden, wenn Stufe 1 nie an war.
    schlossAktualisieren();
}

// Prüft eine Eingabe gegen das Rezensions-Passwort. Die Function antwortet auf
// { pruefen: true } mit 200, wenn das Passwort stimmt, und sonst mit 401.
// Alles andere (kein Netz, keine API) gilt als "stimmt nicht" - im Zweifel
// lieber keine Rechte vergeben.
async function pruefeRezensionsPasswort(passwort) {
    try {
        const antwort = await fetch("/api/rezensionen", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-Admin-Passwort": passwort },
            body: JSON.stringify({ pruefen: true }),
        });
        if (!antwort.ok) return false;
        const ergebnis = await antwort.json().catch(() => ({}));
        return ergebnis.ok === true;
    } catch (e) {
        console.log("Passwortprüfung nicht möglich:", e.message);
        return false;
    }
}

//------------------------------------------------------------------------------------------------------------------------
// Turnstile (Cloudflares Captcha)
//
// Das Kaestchen laesst sich NICHT in die Farben dieser Seite bringen: es steckt
// in einem iframe von Cloudflare. Anpassbar sind nur Thema (hell/dunkel), Groesse
// und Sprache - Farben, Schrift und Rahmen gehoeren ihnen.
//
// Deshalb wenigstens das Thema richtig: "auto" wuerde dem Betriebssystem folgen
// und nicht dem Umschalter dieser Seite - wer hier auf dunkel stellt, waehrend
// Windows auf hell steht, bekaeme ein grelles Kaestchen ins dunkle Formular.
// Also zeichnen wir selbst (render=explicit im Skript-Tag) und lesen das Thema
// aus dem localStorage.

const TURNSTILE_KEY = "0x4AAAAAAD3wPeCZoZf3Unrh";
// Container-Id -> Widget-Id von Turnstile. Fuers Neuzeichnen und fuers
// Zuruecksetzen nach dem Absenden.
const turnstileWidgets = {};

// Cloudflare kennt nur hell und dunkel. Beim individuellen Modus gibt es keine
// passende Antwort - dann entscheidet, was zuletzt als Thema galt.
const turnstileThema = () =>
    window.localStorage.getItem("thema") === "dark" ? "dark" : "light";

// Zeichnet jedes Kaestchen auf der Seite neu - erkannt an der Klasse
// js-turnstile, nicht mehr an einer festen Liste: so bekommt jedes Formular,
// das eins braucht, seins, ohne dass diese Funktion davon wissen muss.
// Der zweite Aufruf ist Absicht: beim Moduswechsel muss das alte Widget weg,
// sonst bliebe es im alten Thema stehen.
function turnstileZeichnen() {
    if (!window.turnstile) return;

    document.querySelectorAll(".js-turnstile").forEach((el) => {
        const id = el.id;
        if (turnstileWidgets[id] !== undefined) turnstile.remove(turnstileWidgets[id]);
        turnstileWidgets[id] = turnstile.render(el, {
            sitekey: TURNSTILE_KEY,
            theme: turnstileThema(),
            // interaction-only: fuer echte Besucher bleibt das Kaestchen
            // unsichtbar und loest still im Hintergrund - nur wer verdaechtig
            // wirkt, sieht ueberhaupt eine Aufgabe. Das war der Wunsch: es soll
            // nicht ins Seitendesign stoeren. Die Pruefung selbst laeuft weiter.
            appearance: "interaction-only",
            size: "flexible",
            language: "de",
        });
    });
}

// Ruft Cloudflare auf, sobald ihr Skript geladen ist (?onload=onloadTurnstile).
function onloadTurnstile() {
    turnstileZeichnen();
}

// Ein Token gilt genau einmal. Ohne Reset scheitert der zweite Versuch mit
// "timeout-or-duplicate", obwohl der Besucher nichts falsch gemacht hat.
function turnstileZuruecksetzen(id) {
    if (window.turnstile && turnstileWidgets[id] !== undefined) {
        turnstile.reset(turnstileWidgets[id]);
    }
}

function zeigeToast(id) {
    const kasten = document.getElementById(id);
    if (kasten) bootstrap.Toast.getOrCreateInstance(kasten).show();
}


// Enter im Namensfeld = Bestätigen. Namensfeld und Knopf gibt es nur auf
// impressum.html.
//
// Der Riegel auf activeElement ist der Kern: vorher hing das am ganzen Dokument.
// Ein Enter im Kontaktformular - oder ganz ohne Fokus irgendwo auf der Seite -
// klickte "Bestätigen", während das Namensfeld im ungeöffneten Popup leer stand.
// Leere Eingabe heißt für auslesen() aber "Name löschen": Besucher verloren so
// ihre Begrüßung, und ich flog aus dem Admin, samt Rezensionsrechten.
//
// Nur aus.click() - der Knopf trägt selbst onclick="auslesen()", ein direkter
// Aufruf davor hätte alles doppelt ausgeführt (und würde das Passwort zweimal
// zur Prüfung schicken).
document.onkeydown = function (event) {
    if (event.keyCode != 13) return;

    const namee = document.getElementById("namee");
    if (!namee || document.activeElement !== namee) return;

    const aus = document.getElementById("aus");
    if (aus) aus.click();
};


async function auslesen() {
    const namee = document.getElementById("namee");
    if (!namee) return;
    const eingabe = namee.value;

    // Unverändert: nichts tun.
    if (eingabe == window.localStorage.getItem("head")) return;

    if (eingabe == "") {
        adminAbschalten();
        document.getElementById("headline").innerHTML = "";
        localStorage.setItem("head", "");
        zeigeToast('liveToast2');
        return;
    }

    if (eingabe.match("<")) {
        adminAbschalten();
        document.getElementById("headline").innerHTML = "";
        localStorage.setItem("head", "");
        zeigeToast('liveToast3');
        new Audio('Sounds/error.mp3').play();
        return;
    }

    if (eingabe == "Admin") {
        adminAnschalten();
        document.getElementById("headline").innerHTML = adminUeberschrift();
        localStorage.setItem("head", "Admin");
        zeigeToast('liveToast6');
        return;
    }

    // Kein bekannter Name - könnte das Rezensions-Passwort sein. Das schickt
    // jeden eingetippten Namen einmal an die eigene API. Sie speichert und
    // protokolliert ihn nicht, aber ganz "nur lokal" ist die Namenseingabe
    // damit nicht mehr.
    if (await pruefeRezensionsPasswort(eingabe)) {
        rezPasswortSpeicher.setItem(REZ_PASSWORT_KEY, eingabe);
        adminAnschalten();
        // Bewusst "Admin" und nicht die Eingabe: das Passwort gehört weder in
        // die Überschrift noch in den localStorage. Das Ausrufezeichen kommt aus
        // adminUeberschrift - das Passwort liegt eine Zeile weiter oben schon im
        // Speicher.
        document.getElementById("headline").innerHTML = adminUeberschrift();
        localStorage.setItem("head", "Admin");
        zeigeToast('liveToast7');
        return;
    }

    // Ganz normaler Name.
    adminAbschalten();
    document.getElementById("headline").innerHTML = "Moin " + eingabe + " - ";
    localStorage.setItem("head", eingabe);
    zeigeToast('liveToast1');
};

//------------------------------------------------------------------------------------------------------------------------
// Favoriten Logic


document.addEventListener("DOMContentLoaded", () => {
    const heartFilled = "M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1";
    const heartEmpty = "m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z";

    const cards = document.querySelectorAll(".card");
    const favBtnContainer = document.getElementById("toggle-favorites-btn-container");
    const favBtn = document.getElementById("toggle-favorites-btn");
    const favSection = document.getElementById("favorites-section");
    const favContainer = document.getElementById("favorites-container");

    // Die Favoritenoberflaeche steht nur auf seiten.html. Ohne diese Pruefung
    // stirbt der ganze Block auf den anderen Seiten.
    const hatFavoritenUI = !!(favBtnContainer && favBtn && favSection && favContainer);

    function isFavorite(id) {
        return localStorage.getItem(`fav-${id}`) === "true";
    }

    function updateHeart(card, isFav) {
        const heartPath = card.querySelector(".heart path");
        if (heartPath) {
            heartPath.setAttribute("d", isFav ? heartFilled : heartEmpty);
        }
    }


// Admin deaktivieren
    const showadmin = document.getElementById("showadmin");
    if (showadmin) showadmin.addEventListener("dblclick", meineFunktion);

    function meineFunktion() {
        document.getElementById("headline").innerHTML = "";
        mam = "";
        localStorage.setItem("head", mam);
        // Kümmert sich um Schloss, beide Toggles und das Rezensions-Passwort.
        adminAbschalten();
        updateFavoriteUI();
        // Auf ebook.html hängt der Rezensionsbereich an denselben Rechten und
        // muss mit verschwinden. Die Funktionen kommen aus rezensionen.js und
        // anfragen.js und gibt es nur dort.
        if (typeof adminUiZeichnen === "function") adminUiZeichnen();
        if (typeof zeichneListe === "function") zeichneListe();
        if (typeof anfragenLaden === "function") anfragenLaden();
    }


    function updateFavoriteUI() {
        let visibleFavCount = 0;

        cards.forEach(card => {
            const cardId = card.dataset.id;
            const isFav = isFavorite(cardId);
            updateHeart(card, isFav);

            // Sichtbarkeit über das übergeordnete .col prüfen!
            const col = card.closest(".col");
            const isVisible = col && window.getComputedStyle(col).display !== "none";

            if (isFav && isVisible) {
                visibleFavCount++;
            }
        });

        if (!hatFavoritenUI) return;

        // Button anzeigen/verstecken
        favBtnContainer.style.display = visibleFavCount > 0 ? "block" : "none";

        if (visibleFavCount === 0) {
            favSection.style.display = "none";
            favContainer.innerHTML = "";
            favBtn.innerText = "Favoriten anzeigen";
        }
    }







    function cloneCard(card) {
        const col = card.closest(".col");
        const categoriesRaw = card.dataset.category || "Unbekannt";
        const categories = categoriesRaw.split(/[,;]\s*/);

        const cloneCol = col.cloneNode(true);
        const cloneCard = cloneCol.querySelector(".card");
        cloneCard.dataset.id = card.dataset.id;

        const textElement = cloneCard.querySelector(".card-text");
        if (textElement) {
            textElement.innerHTML += `<br><small> ${categories.map(cat => `<span class="badge bg-secondary me-1">${cat}</span>`).join(" ")}</small>`;
        }

        // Herz-Interaktion im Favoritenbereich aktivieren
        const favHeart = cloneCard.querySelector(".heart");
        if (favHeart) {
            favHeart.addEventListener("click", () => {
                const favId = cloneCard.dataset.id || card.dataset.id;
                localStorage.setItem(`fav-${favId}`, "false");

                cloneCol.remove();

                const originalCard = document.querySelector(`.card[data-id="${favId}"]`);
                if (originalCard) updateHeart(originalCard, false);

                updateFavoriteUI();
            });
        }

        return cloneCol;
    }



    function showFavorites() {
        favContainer.innerHTML = "";
        cards.forEach(card => {
            const cardId = card.dataset.id;
            if (isFavorite(cardId)) {
                favContainer.appendChild(cloneCard(card));
            }
        });
        favSection.style.display = "block";
        favBtn.innerText = "Favoriten ausblenden";

        // Nach unten scrollen
        document.getElementById("favorites-section").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function hideFavorites() {
        favSection.style.display = "none";
        favContainer.innerHTML = "";
        favBtn.innerText = "Favoriten anzeigen";
    }

    if (hatFavoritenUI) {
        favBtn.addEventListener("click", () => {
            const visible = favSection.style.display === "block";
            if (visible) {
                hideFavorites();
            } else {
                showFavorites();
            }
        });
    }



    // Initialisiere alle Herzen
    cards.forEach(card => {
        const cardId = card.dataset.id;
        const heart = card.querySelector(".heart");

        if (!heart) return;

        updateHeart(card, isFavorite(cardId));

        heart.addEventListener("click", () => {
            const currentlyFav = isFavorite(cardId);
            const nowFav = !currentlyFav;

            localStorage.setItem(`fav-${cardId}`, nowFav.toString());
            updateHeart(card, nowFav);
            updateFavoriteUI();

            // ▶️ Live aktualisieren, wenn Favoritenbereich sichtbar
            if (hatFavoritenUI && favSection.style.display === "block") {
                const existingFavCard = favContainer.querySelector(`[data-id="${cardId}"]`);

                if (nowFav && !existingFavCard) {
                    // Karte hinzufügen
                    favContainer.appendChild(cloneCard(card));
                } else if (!nowFav && existingFavCard) {
                    // Karte entfernen
                    const parent = existingFavCard.closest(".col") || existingFavCard;
                    parent.remove();
                }
            }
        });

    });

    updateFavoriteUI();
});


//------------------------------------------------------------------------------------------------------------------------
// Dark, Light und Individuell Mode 

var individuell_pegel = "false";
individuell_pegel = window.localStorage.getItem("individuell_pegel");
if (individuell_pegel == null) {
    individuell_pegel = "false";

}
//console.log("individuell_pegel: " + individuell_pegel);

var modee = "light";
modee = window.localStorage.getItem("thema");
//console.log("Mode: " + modee);



let colorPicker;
const hintergrund = window.localStorage.getItem("hintergrund");
defaultColor = hintergrund;
//console.log("hintergrund: " + hintergrund);



// CSS-Variable aus dem :root-Element auslesen
const rootStyles = getComputedStyle(document.documentElement);
const sternColor = rootStyles.getPropertyValue('--stern-color').trim();


// Die Farbwähler stehen nur auf impressum.html, deshalb überall ohne Annahme über ihre Existenz
function setColorPickerDisabled(disabled) {
    document.querySelectorAll("input#color-picker, input#color-picker1").forEach(el => {
        el.disabled = disabled;
    });
}

// Der Umschalter für den individuellen Modus steht nur auf impressum.html.
// Ausdrücklich path#activ, weil auf den anderen Seiten das <body> dieselbe id trägt.
function setActivIcon(d) {
    const icon = document.querySelector("path#activ");
    if (icon) icon.setAttribute("d", d);
}




let colorPicker1;
const schrift = window.localStorage.getItem("schrift");
defaultColor1 = schrift;

//console.log("schrift: " + schrift);

if (window.localStorage.getItem("thema") == null) {
    //console.log("Thema hat er nicht");

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dark();
        modee = "dark";
        localStorage.setItem("thema", modee);

    };
};

if (individuell_pegel == "false") {

    if (window.localStorage.getItem("thema") == "dark") {
        //console.log("Thema war dark");
        dark();

    };
    if (window.localStorage.getItem("thema") == "light") {
        //console.log("Thema war light");
        light();
    }
};

if (individuell_pegel == "true") {
    //console.log("individuell");
    modee = "individuell";
    individuell();
    setColorPickerDisabled(false);
    setActivIcon("M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");

}



// Funktion für Mode Wechsel 
function switchmode() {

    if (individuell_pegel == "false") {

        if (modee == "dark") {
            light();
        };

        if (modee == "light") {
            dark();
        };
    }

    if (individuell_pegel == "true") {

        const fehler = new Audio('Sounds/error.mp3');
        fehler.play();
        const toastLiveExample = document.getElementById('liveToast4');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();

    };
}


// Darkmode
function dark() { 

    setTimeout(function () {
        modee = "dark";
    }, 100);
    //console.log("dark");
    document.getElementById("modee").setAttribute("d", "M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z");
    document.getElementById('modeee').setAttribute("d", "");
    document.documentElement.style.setProperty('--backg', '#0f172a');           // Hintergrund Farbe Darkmode
    document.documentElement.style.setProperty('--linkc', '#fff7f7ff');           // Schrift Farbe Darkmode
    document.documentElement.style.setProperty('--circle-color', '#adb5bd');    // Farbe Netz Kreis Darkmode
    document.documentElement.style.setProperty('--line-color', '#adb5bd');      // Farbe Netz Linie Darkmode
    document.documentElement.style.setProperty('--popupborder', '#dee2e644');   // Farbe für Border der Popups Darkmode
    document.documentElement.style.setProperty('--stern-color', sternColor);   // Farbe für Stern Darkmode
    document.documentElement.style.setProperty('--herz-color', '#ff0000ff');   // Farbe für Herz Darkmode
    localStorage.setItem("thema", "dark");
    // Das Turnstile-Kaestchen steckt in einem fremden iframe - CSS-Variablen
    // erreichen es nicht. Es muss neu gezeichnet werden, sonst bliebe es hell.
    turnstileZeichnen();
    setColorPickerDisabled(true);



};

// Lightmode
function light() {

    setTimeout(function () {
        modee = "light";
    }, 100);
    //console.log("hell");
    document.getElementById("modee").setAttribute("d", "M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z");
    document.getElementById('modeee').setAttribute("d", "");
    document.documentElement.style.setProperty('--backg', '#ffffff');           // Hintergrund Farbe Lightmode
    document.documentElement.style.setProperty('--linkc', 'black');             // Schrift Farbe Lightmode
    document.documentElement.style.setProperty('--circle-color', '#0693e3');    // Farbe Netz Kreis Lightmode
    document.documentElement.style.setProperty('--line-color', '#0693e3');      // Farbe Netz Linie Lightmode
    document.documentElement.style.setProperty('--popupborder', '#dee2e6');     // Farbe für Border der Popups Lightmode
    document.documentElement.style.setProperty('--stern-color', sternColor);    // Farbe für Stern Lightmode
    document.documentElement.style.setProperty('--herz-color', '#ff0000ff');            // Farbe für Herz Lightmode
    localStorage.setItem("thema", "light");
    turnstileZeichnen(); // siehe dark(): das iframe folgt den CSS-Variablen nicht
    setColorPickerDisabled(true);


};

// Individueller Modus
function individuell() {
    //console.log("indi");
    document.getElementById("modee").setAttribute("d", "M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z");
    document.getElementById('modeee').setAttribute("d", "M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z");
    document.documentElement.style.setProperty('--linkc', schrift);           // Hintergrund Farbe Individuell Mode  
    document.documentElement.style.setProperty('--backg', hintergrund);       // Schrift Farbe Individuell Mode  
    document.documentElement.style.setProperty('--circle-color', schrift);    // Farbe Netz Kreis Individuell Mode  
    document.documentElement.style.setProperty('--line-color', schrift);      // Farbe Netz Linie Individuell Mode  
    document.documentElement.style.setProperty('--popupborder', schrift);     // Farbe für Border der Popups Individuell Mode
    document.documentElement.style.setProperty('--stern-color', schrift);     // Farbe für Stern Individuell Mode
    document.documentElement.style.setProperty('--herz-color', schrift);      // Farbe für Herz  Individuell Modee
    document.getElementById("mode").style.cursor = "no-drop";
    localStorage.setItem("individuell_pegel", "true");

};




// Die Farbwähler gibt es nur auf impressum.html
window.addEventListener("load", startup, false);
function startup() {
    colorPicker = document.querySelector("input#color-picker");
    if (!colorPicker) return;
    if (defaultColor) colorPicker.value = defaultColor;
    colorPicker.addEventListener("input", updateFirst, false);
};

function updateFirst(event) {

   // console.log("hintergrund:" + event.target.value);
    document.documentElement.style.setProperty('--backg', event.target.value);
    localStorage.setItem("hintergrund", event.target.value);

};


window.addEventListener("load", startup1, false);
function startup1() {
    colorPicker1 = document.querySelector("input#color-picker1");
    if (!colorPicker1) return;
    if (defaultColor1) colorPicker1.value = defaultColor1;
    colorPicker1.addEventListener("input", updateFirst1, false);
};

function updateFirst1(event) {

    //console.log("schrift" + event.target.value);
    document.documentElement.style.setProperty('--linkc', event.target.value);
    localStorage.setItem("schrift", event.target.value);

};



function activ() {

    if (individuell_pegel == "false") {
        setColorPickerDisabled(false);
        setActivIcon("M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");
        setTimeout(function () {
            individuell_pegel = "true";
        }, 10);
        modee = "individuell";
        individuell();
    };


    if (individuell_pegel == "true") {
        setColorPickerDisabled(true);
        document.getElementById("mode").style.cursor = "default";
        setActivIcon("M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z");
        setTimeout(function () {
            individuell_pegel = "false";
        }, 10);
        localStorage.setItem("individuell_pegel", "false");
        modee = window.localStorage.getItem("thema");

        if (modee == "dark") {
            dark();
        };
        if (modee == "light") {
            light();
        };
    };



};








//------------------------------------------------------------------------------------------------------------------------
// Toggle Karten Entwickler Tools und Secret


// Toggle Entwickler Tools Anfang
function toggleEntwickler() {
    var elements = document.querySelectorAll('.toggleEntwickler');
    elements.forEach(function (element) {
        if (element.style.display === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}
// Toggle Entwickler Tools Ende


// Toggle Secret Anfang

function toggleSecret() {
    var elements = document.querySelectorAll('.toggleSecret');
    elements.forEach(function (element) {
        if (element.style.display === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}
// Toggle Secret Ende





// Toggle Rezensionen: umgezogen nach rezensionen.js. Die Karten stehen nicht
// mehr fest im HTML, sondern werden dort gezeichnet - der Umschalter gehoert
// zum selben Zustand und nur auf ebook.html.
//------------------------------------------------------------------------------------------------------------------------
// Formular zurücksetzen


// Beide Formulare gehen direkt aus dem Browser an formsubmit.
//
// Der Umweg über eine eigene Pages Function ist gescheitert, und zwar
// grundsätzlich: formsubmit lehnt jede Anfrage ohne Referer ab, und diesen
// Header darf ein Cloudflare Worker in Produktion nicht setzen - der Versuch
// killt die Function (blankes 502 von der Plattform). Lokal in "wrangler dev"
// wird die Sperre nicht durchgesetzt, dort lief es; das hat den Fehler bis auf
// die Live-Seite durchgelassen. Der Browser schickt den Referer von allein,
// deshalb funktioniert dieser Weg seit Jahren.
//
// Preis: die formsubmit-Adresse steht wieder im Quelltext. Sie stand dort
// ohnehin immer, und wer sie hat, kann mir nur Mails schicken. Das echte
// Geheimnis - das E-Book-Passwort - bleibt in der Function.
const FORMSUBMIT = "https://formsubmit.co/ajax/fe15abf088e090210d1d03807c630d3b";

// Welches Formular gesendet hat, steht im versteckten Feld "formular".
const BETREFF = {
    ebook: "E-Book Feedback!",
    kontakt: "Impressum Kontakt!",
};

// Gibt true zurück, wenn die Mail wirklich raus ist.
//
// Achtung: formsubmit antwortet auch bei Ablehnung mit HTTP 200 und packt die
// Wahrheit in das Feld success. Ein Check auf response.ok winkt den Fehler
// durch - genau daran ist die Passwort-Mail lange still gescheitert.
async function sendeAnFormsubmit(inhalt) {
    const antwort = await fetch(FORMSUBMIT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _template: "table", _captcha: "false", ...inhalt }),
    });
    const ergebnis = await antwort.json().catch(() => ({}));
    if (ergebnis.success !== "true") {
        console.error("formsubmit hat abgelehnt:", ergebnis.message || "HTTP " + antwort.status);
        return false;
    }
    return true;
}

// Baut den Link, der in der E-Book-Mail steht und das Admin-Formular auf
// ebook.html vorausfüllt - damit aus einer Rezension kein Abtippen wird.
//
// Die Daten stehen im Fragment hinter dem #. Das schickt der Browser nicht an
// den Server: der Rezensionstext taucht in keinem Zugriffslog auf und läuft
// durch keinen Proxy. Gespeichert wird ohnehin erst beim Klick auf "anlegen".
//
// base64 statt encodeURIComponent, weil deutsche Texte sonst aufblähen - aus
// jedem "ü" würden neun Zeichen (%C3%BC), und der Link ist lang genug.
function baueRezensionsLink(rezension) {
    const bytes = new TextEncoder().encode(JSON.stringify(rezension));
    // btoa versteht nur Latin-1. Der Umweg über die Bytes macht daraus
    // gültiges UTF-8 - sonst wirft schon der erste Umlaut einen Fehler.
    let binaer = "";
    bytes.forEach((b) => (binaer += String.fromCharCode(b)));
    const b64 = btoa(binaer).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return "https://it-wolf.org/ebook#rezension=" + b64;
}

// Feedback (ebook.html) und Kontakt (impressum.html).
async function resetForm(event) {
    event.preventDefault();
    const form = event.target;
    const knopf = document.getElementById("sendee");
    const daten = new FormData(form);
    const formular = daten.get("formular");

    if (knopf) knopf.innerHTML = WARTE_ICON;

    try {
        const inhalt = {
            name: daten.get("name"),
            email: daten.get("email"),
            message: daten.get("message"),
            _subject: BETREFF[formular] || "Nachricht von it-wolf.org",
        };
        // Sterne gibt es nur im E-Book-Formular und auch dort freiwillig.
        const sterne = Number(daten.get("rating"));
        if (sterne >= 1 && sterne <= 5) inhalt.rating = sterne;

        if (daten.get("titel")) inhalt.titel = daten.get("titel");

        // Kontaktformular: hier gibt es keine Function, die die Mail selbst
        // schickt und dabei das Token prüfen könnte. Also erst separat prüfen,
        // dann erst an formsubmit. Beim E-Book-Feedback ist das nicht nötig -
        // dort prüft /api/feedback beim Speichern.
        if (formular === "kontakt" && !(await turnstileGeprueft(daten.get("cf-turnstile-response")))) {
            alert("Bitte bestätige noch, dass du kein Bot bist, und versuche es erneut.");
            return;
        }

        // Nur beim E-Book-Feedback: der Link zum Übernehmen. Beim
        // Kontaktformular wäre er sinnlos, daraus wird keine Rezension.
        //
        // Der Link bleibt, obwohl die Anfrage jetzt auch im Admin-Bereich steht:
        // er kostet nichts und hilft, wenn die Anfrage per Mail auf einem
        // anderen Gerät ankommt.
        if (formular === "ebook") {
            inhalt["Rezension übernehmen"] = baueRezensionsLink({
                name: daten.get("name"),
                titel: daten.get("titel") || "",
                text: daten.get("message"),
                sterne: sterne >= 1 && sterne <= 5 ? sterne : 5,
                datum: new Date().toISOString().slice(0, 10),
            });

            // Zuerst speichern, dann mailen: die Mail hängt am Browser des
            // Besuchers und damit an seinem Adblocker - was hier liegt, nicht.
            // Schlägt das Speichern fehl, bricht das Formular trotzdem nicht ab;
            // die Mail ist dann wie früher der einzige Weg.
            await speichereAnfrage(daten, sterne);
        }

        if (!(await sendeAnFormsubmit(inhalt))) {
            alert("Die Nachricht konnte nicht zugestellt werden. Bitte versuche es später noch einmal.");
            return;
        }

        form.reset();
        const toast = document.getElementById("liveToast5");
        if (toast) bootstrap.Toast.getOrCreateInstance(toast).show();
    } catch (e) {
        console.error("Netzwerkfehler:", e);
        alert("Keine Verbindung. Bist du online?");
    } finally {
        if (knopf) knopf.innerHTML = SENDE_ICON;
        // Beide zurücksetzen: das jeweils nicht vorhandene ignoriert die
        // Funktion. resetForm bedient Feedback (ebook) und Kontakt (impressum).
        turnstileZuruecksetzen("turnstile-feedback");
        turnstileZuruecksetzen("turnstile-kontakt");
    }
}

// Fragt /api/pruefung, ob das Turnstile-Token gültig ist. Bei kaputter Antwort
// oder fehlendem Netz bewusst true: der Server entscheidet im Zweifel, ob er das
// Secret gesetzt hat - ein Aussetzer hier soll niemanden am Schreiben hindern.
async function turnstileGeprueft(token) {
    try {
        const antwort = await fetch("/api/pruefung", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ turnstile: token || "" }),
        });
        const ergebnis = await antwort.json().catch(() => ({}));
        return ergebnis.ok === true;
    } catch (e) {
        console.error("Turnstile-Prüfung nicht möglich:", e.message);
        return true;
    }
}

// Legt die Rezensions-Anfrage in KV ab, damit sie im Admin-Bereich steht statt
// nur in einer Mail. Fehler landen bewusst nur im Log: der Besucher hat sein
// Feedback abgeschickt, das ist aus seiner Sicht erledigt - er soll deswegen
// keine Fehlermeldung sehen. Die Mail geht gleich danach ohnehin raus.
async function speichereAnfrage(daten, sterne) {
    try {
        const antwort = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: daten.get("name"),
                email: daten.get("email"),
                titel: daten.get("titel") || "",
                text: daten.get("message"),
                sterne: sterne >= 1 && sterne <= 5 ? sterne : null,
                turnstile: daten.get("cf-turnstile-response") || "",
            }),
        });
        if (!antwort.ok) {
            const ergebnis = await antwort.json().catch(() => ({}));
            console.error("Anfrage nicht gespeichert:", ergebnis.fehler || antwort.status);
        }
    } catch (e) {
        console.error("Anfrage nicht gespeichert:", e.message);
    }
}

//-----------------------------------------

// Passwort-Anfrage. Das Passwort selbst kommt aus der Function /api/passwort und
// steht dadurch in keiner statischen Datei - das war und bleibt der Sinn der
// Sache. Die Mail mit Name und Adresse schickt dagegen der Browser, weil die
// Function das nicht kann (Referer, siehe oben bei FORMSUBMIT).
const SENDE_ICON = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
         </svg>
        Senden
    `;
const WARTE_ICON = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
        class="bi bi-hourglass-split" viewBox="0 0 16 16">
            <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
        </svg>
        Bitte warten...
    `;

async function resetForm1(event) {
    event.preventDefault();
    const form = event.target;
    const knopf = document.getElementById("sende");
    const kasten = document.getElementById("passwort-kasten");
    const ausgabe = document.getElementById("passwort-ausgabe");

    const daten = new FormData(form);
    if (knopf) knopf.innerHTML = WARTE_ICON;
    // Beide Ausgaben zuruecksetzen, sonst steht bei einem Fehler noch das
    // Passwort vom letzten Versuch daneben.
    versteckePasswortAusgaben();

    try {
        const antwort = await fetch("/api/passwort", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: daten.get("name"),
                email: daten.get("email"),
                // Legt Turnstile selbst ins Formular. Fehlt das Feld (Skript
                // blockiert), schickt der Browser einen leeren String - die
                // Function entscheidet, ob sie das durchgehen lässt.
                turnstile: daten.get("cf-turnstile-response") || "",
            }),
        });
        const ergebnis = await antwort.json().catch(() => ({}));

        if (!antwort.ok || !ergebnis.passwort) {
            zeigePasswortFehler(ergebnis.fehler || "Das hat leider nicht geklappt. Bitte versuche es später erneut.");
            return;
        }

        // Lead an mich. Läuft bewusst nebenher und ohne await: klappt der
        // Versand nicht, soll der Besucher trotzdem sein Passwort sehen - sein
        // Download hängt nicht an meinem Postfach.
        sendeAnFormsubmit({
            name: daten.get("name"),
            email: daten.get("email"),
            _subject: "E-Book Passwort angefordert",
        }).catch((e) => console.error("Lead-Mail nicht gesendet:", e));

        form.reset();
        if (ausgabe && kasten) {
            // textContent statt innerHTML: das Passwort ist Text, kein Markup.
            ausgabe.textContent = ergebnis.passwort;
            kasten.style.display = "block";
            kasten.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            alert("Dein Passwort: " + ergebnis.passwort);
        }
    } catch (e) {
        console.error("Netzwerkfehler:", e);
        zeigePasswortFehler("Keine Verbindung zum Server. Bist du online?");
    } finally {
        if (knopf) knopf.innerHTML = SENDE_ICON;
        turnstileZuruecksetzen("turnstile-passwort");
    }
}

function versteckePasswortAusgaben() {
    const kasten = document.getElementById("passwort-kasten");
    const fehler = document.getElementById("passwort-fehler");
    if (kasten) kasten.style.display = "none";
    if (fehler) fehler.style.display = "none";
}

function zeigePasswortFehler(text) {
    const feld = document.getElementById("passwort-fehler");
    if (feld) {
        feld.textContent = text;
        feld.style.display = "block";
    } else {
        alert(text);
    }
}


//------------------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------------------
// Karten Link Hover effekt
//
// Entfernt: der Effekt laeuft komplett ueber CSS (#hov:has(.image-link:hover) in
// index.css) und gilt damit fuer alle Karten. Das JS hier hat per
// document.querySelector('#hov') immer nur die erste Karte erwischt - id="hov"
// steht in seiten.html 29-mal - und dieselben .hovered/.clicked-Regeln doppelt
// gesetzt. Auf allen anderen Seiten warf es zudem einen TypeError, weil #hov fehlt.

//------------------------------------------------------------------------------------------------------------------------
