


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


document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
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

var adminmode = false;
var mam = ""; // mam = Name
mam = window.localStorage.getItem("head");
console.log("Name: " + mam);


if (mam == null || mam == "" || mam == "null") {
    console.log("Kein Name");
    document.getElementById("headline").innerHTML = "";
} else
    if (mam.match("<")) {
        document.getElementById("headline").innerHTML = "";
    } else {
        document.getElementById("headline").innerHTML = "Moin " + mam + " - ";
        if (mam == "Admin"){
            adminmode = true;
            console.log("Admin:" + adminmode);
            toggleSecret();
            toggleEntwickler();
            document.getElementById("showadmin").style.display = "block";
            var elements = document.querySelectorAll('.toggleSecret');

        }
    };



document.onkeydown = function (event) {

    if (event.keyCode == 13) {
        auslesen();
        document.getElementById("aus").click();
    }};


function auslesen() {
    var mam = document.getElementById("namee").value;

    if (mam == window.localStorage.getItem("head")) {

    } else

        if (mam == "") {
            adminmode = false;   
            document.getElementById("headline").innerHTML = "";
            mam = "";
            const toastLiveExample = document.getElementById('liveToast2');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
            console.log("Admin:" + adminmode);
           

        } else if (mam.match("<")) {
            adminmode = false;   
            document.getElementById("headline").innerHTML = "";
            mam = "";
            const toastLiveExample = document.getElementById('liveToast3');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
            const fehler = new Audio('Sounds/error.mp3'); 
            fehler.play();
            console.log("Admin:" + adminmode);


        } else {
            if (mam == "Admin") {
                adminmode = true;
                document.getElementById("headline").innerHTML = "Moin " + mam + " - ";
                const toastLiveExample = document.getElementById('liveToast6');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                toggleSecret();
                toggleEntwickler();
                document.getElementById("showadmin").style.display = "block";
                toastBootstrap.show(); 
                console.log("Admin:" + adminmode);

            }else{
            adminmode = false;   
            document.getElementById("headline").innerHTML = "Moin " + mam + " - ";
            const toastLiveExample = document.getElementById('liveToast1');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show(); 
            console.log("Admin:" + adminmode);
            }

            
        }

    localStorage.setItem("head", mam);
   

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
    document.getElementById("showadmin").addEventListener("dblclick", meineFunktion);

    function meineFunktion() {
        document.getElementById("headline").innerHTML = "";
        document.getElementById("showadmin").style.display = "none";
        mam = "";
        localStorage.setItem("head", mam);
        toggleSecret();
        toggleEntwickler();
        updateFavoriteUI();
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

    favBtn.addEventListener("click", () => {
        const visible = favSection.style.display === "block";
        if (visible) {
            hideFavorites();
        } else {
            showFavorites();
        }
    });



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
            if (favSection.style.display === "block") {
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
    setTimeout(function () {
    }, 10);
    modee = "individuell";
    individuell();
    document.getElementById("color-picker").disabled = false;
    document.getElementById("color-picker1").disabled = false;
    document.getElementById("activ").setAttribute("d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");

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
    document.getElementById("color-picker").disabled = true;
    document.getElementById("color-picker1").disabled = true;



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
    document.getElementById("color-picker").disabled = true;
    document.getElementById("color-picker1").disabled = true;


};

// Individueller Modus
function individuell() {
    setTimeout(function () {

    }, 100);
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




window.addEventListener("load", startup, false);
function startup() {
    colorPicker = document.querySelector("#color-picker");
    colorPicker.value = defaultColor;
    colorPicker.addEventListener("input", updateFirst, false);
    colorPicker.select();
};

function updateFirst(event) {

   // console.log("hintergrund:" + event.target.value);
    document.documentElement.style.setProperty('--backg', event.target.value);
    localStorage.setItem("hintergrund", event.target.value);

};


window.addEventListener("load", startup1, false);
function startup1() {
    colorPicker1 = document.querySelector("#color-picker1");
    colorPicker1.value = defaultColor1;
    colorPicker1.addEventListener("input", updateFirst1, false);
    colorPicker1.select();
};

function updateFirst1(event) {

    //console.log("schrift" + event.target.value);
    document.documentElement.style.setProperty('--linkc', event.target.value);
    localStorage.setItem("schrift", event.target.value);

};



function activ() {

    if (individuell_pegel == "false") {
        document.getElementById("color-picker").disabled = false;
        document.getElementById("color-picker1").disabled = false;
        document.getElementById("activ").setAttribute("d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");
        setTimeout(function () {
            individuell_pegel = "true";
        }, 10);
        modee = "individuell";
        individuell();
    };


    if (individuell_pegel == "true") {
        document.getElementById("color-picker").disabled = true;
        document.getElementById("color-picker1").disabled = true;
        document.getElementById("mode").style.cursor = "default";
        document.getElementById("activ").setAttribute("d", "M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z");
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





// Toggle Rezensionen
function toggleRezensionen() {
    var elements = document.querySelectorAll('.toggleRezensionen');
    var anzeigenElement = document.getElementById('anzeigen');

    elements.forEach(function (element) {
        if (element.style.display === 'none') {
            element.style.display = 'block';
            if (anzeigenElement) {
                anzeigenElement.innerHTML = 'weniger anzeigen';
            }
        } else {
            element.style.display = 'none';
            if (anzeigenElement) {
                anzeigenElement.innerHTML = 'mehr anzeigen';
            }
        }
    });
}

// Toggle Rezensionen ende
//------------------------------------------------------------------------------------------------------------------------
// Formular zurücksetzen


function resetForm(event) {
    
    event.preventDefault(); // Verhindert das Standard-Absendeverhalten
    const form = event.target; // Holt das aktuelle Formular
    const actionUrl = form.action; // Holt die Action-URL
    const formData = new FormData(form); // Holt die Formulardaten
    document.getElementById("sendee").innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" 
        class="bi bi-hourglass-split" viewBox="0 0 16 16">
            <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
        </svg> 
        Bitte warten...
    `;



    // Senden der Formulardaten mit Fetch API
    fetch(actionUrl, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('Formular erfolgreich abgesendet:', form.id);
                //alert(`Formular ${form.id} wurde erfolgreich abgeschickt.`);
                form.reset(); // Setzt das Formular zurück

                document.getElementById("sendee").innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
         </svg>
        Senden
    `;

                const toastLiveExample = document.getElementById('liveToast5');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                toastBootstrap.show();
                
              
            } else {
                console.error('Fehler beim Absenden:', form.id);
                alert(`Es gab einen Fehler beim Absenden von Formular ${form.id}.`);
            }
        })
        .catch(error => {
            console.error('Netzwerkfehler:', error);
            alert(`Netzwerkfehler beim Absenden von Formular ${form.id}.`);
        });
    
}

//-----------------------------------------

function resetForm1(event) {
    event.preventDefault(); // Verhindert das Standard-Absendeverhalten
    const form = event.target; // Holt das aktuelle Formular
    const actionUrl = form.action; // Holt die Action-URL
    const formData = new FormData(form); // Holt die Formulardaten
    document.getElementById("sende").innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" 
        class="bi bi-hourglass-split" viewBox="0 0 16 16">
            <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
        </svg> 
        Bitte warten...
    `;

    // Senden der Formulardaten mit Fetch API
    fetch(actionUrl, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('Formular erfolgreich abgesendet:', form.id);
                //alert(`Formular ${form.id} wurde erfolgreich abgeschickt.`);
                form.reset(); // Setzt das Formular zurück
                
                document.getElementById("sende").innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
         </svg>
        Senden
    `;

                window.location.href = "EdankeE.html";
            } else {
                console.error('Fehler beim Absenden:', form.id);
                alert(`Es gab einen Fehler beim Absenden von Formular ${form.id}.`);
            }
        })
        .catch(error => {
            console.error('Netzwerkfehler:', error);
            alert(`Netzwerkfehler beim Absenden von Formular ${form.id}.`);
        });

}


//------------------------------------------------------------------------------------------------------------------------
// Favoriten Aktiveren und deaktivieren
/*
var heatChatGPT = false;
heatChatGPT = window.localStorage.getItem("heat");

var heatChatGPT1 = false;
heatChatGPT1 = window.localStorage.getItem("heat1");

if(heatChatGPT == "true") {
document.getElementById("heart").setAttribute("d", "M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1");
}

function ChatGPT() {;

    if (heatChatGPT == true) {
        document.getElementById("heart").setAttribute("d", "m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z");
        heatChatGPT = false;
        localStorage.setItem("heat", heatChatGPT);
        console.log(heatChatGPT);
    }

    else {
        document.getElementById("heart").setAttribute("d", "M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1");
        heatChatGPT = true;
        localStorage.setItem("heat", heatChatGPT);
        console.log(heatChatGPT);
    }

}


if (heatChatGPT1 == "true") {
    document.getElementById("heart1").setAttribute("d", "M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1");
}
function ChatGPT1() {
    

    if (heatChatGPT1 == true) {
        document.getElementById("heart1").setAttribute("d", "m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z");
        heatChatGPT1 = false;
        localStorage.setItem("heat1", heatChatGPT1);

        console.log(heatChatGPT1);
    }

    else {
        document.getElementById("heart1").setAttribute("d", "M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1");
        heatChatGPT1 = true;
        localStorage.setItem("heat1", heatChatGPT1);

        console.log(heatChatGPT1);
    }

}

*/



//------------------------------------------------------------------------------------------------------------------------
// Karten Link Hover effekt

const card = document.querySelector('#hov');
const imageLink = card.querySelector('.image-link');

imageLink.addEventListener('mouseenter', () => {
    card.classList.add('hovered');
});

imageLink.addEventListener('mouseleave', () => {
    card.classList.remove('hovered');
});

imageLink.addEventListener('mousedown', () => {
    card.classList.add('clicked');
});

imageLink.addEventListener('mouseup', () => {
    card.classList.remove('clicked');
});

//------------------------------------------------------------------------------------------------------------------------
