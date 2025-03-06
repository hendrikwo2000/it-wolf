


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
// Namen ändern


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
            document.getElementById("headline").innerHTML = "";
            mam = "";
            const toastLiveExample = document.getElementById('liveToast2');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
           

        } else if (mam.match("<")) {
            document.getElementById("headline").innerHTML = "";
            mam = "";
            const toastLiveExample = document.getElementById('liveToast3');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
            const fehler = new Audio('Sounds/error.mp3'); 
            fehler.play();


        } else {
            document.getElementById("headline").innerHTML = "Moin " + mam + " - ";
            const toastLiveExample = document.getElementById('liveToast1');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        }

    localStorage.setItem("head", mam);
   

};



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
    document.documentElement.style.setProperty('--linkc', '#ffffff');           // Schrift Farbe Darkmode
    document.documentElement.style.setProperty('--circle-color', '#adb5bd');    // Farbe Netz Kreis Darkmode
    document.documentElement.style.setProperty('--line-color', '#adb5bd');      // Farbe Netz Linie Darkmode
    document.documentElement.style.setProperty('--popupborder', '#dee2e644');   // Farbe für Border der Popups Darkmode
    document.documentElement.style.setProperty('--stern-color', sternColor);   // Farbe für Stern Darkmode
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
// Netz deaktivieren und aktivieren

var netzpegel = window.localStorage.getItem("netzpegel");
if(netzpegel == "true"){
    includeScript();
    document.getElementById("netzon").setAttribute("d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");
    
}

if (netzpegel == null){
    netzpegel = "false";
}

function netzon(){

    if (netzpegel == "false"){
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
const secret = document.getElementById('secret');
let clickCount = 0;
secret.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 3) { // Bei 3 Mausklicks
        toggleSecret()
        clickCount = 0;
    }
});

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

// Toggle Rezensionen
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





