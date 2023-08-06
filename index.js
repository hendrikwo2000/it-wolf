
// Button -> go to Top


let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
};

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

};



//------------------------------------------------------------------------------------------------------------------------
// Name Change


var mam = "";
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
    console.log("Name: " + window.localStorage.getItem("head"));

};

//------------------------------------------------------------------------------------------------------------------------
// Dark, Light and Individuell Mode 

var individuell_pegel = "false";
individuell_pegel = window.localStorage.getItem("individuell_pegel");
if (individuell_pegel == null){
    individuell_pegel = "false";
    
}
console.log("individuell_pegel: " + individuell_pegel);

var modee = "light";
modee = window.localStorage.getItem("thema");
console.log("Mode: " + modee);



let colorPicker;
const hintergrund = window.localStorage.getItem("hintergrund");
defaultColor = hintergrund;

console.log("hintergrund: " + hintergrund);


let colorPicker1;
const schrift = window.localStorage.getItem("schrift");
defaultColor1 = schrift;

console.log("schrift: " + schrift);

if (window.localStorage.getItem("thema") == null) {
    console.log("Thema hat er nicht");

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dark();
        modee = "dark";
        localStorage.setItem("thema", modee);

    };
};

if(individuell_pegel == "false"){

    if (window.localStorage.getItem("thema") == "dark") {
        console.log("Thema war dark");
        dark();

    };
    if (window.localStorage.getItem("thema") == "light") {
        console.log("Thema war light");
        light();
    }
};

if (individuell_pegel == "true") {
    console.log("individuell");
    setTimeout(function () {
    }, 10);
    modee = "individuell";
    individuell();
    document.getElementById("color-picker").disabled = false;
    document.getElementById("color-picker1").disabled = false;
    document.getElementById("activ").setAttribute("d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z");

}




function switchmode() {

    if (individuell_pegel == "false") {

        if (modee == "dark") {
            light();
        };

        if (modee == "light") {
            dark();
        };
    }

if(individuell_pegel == "true"){

    const fehler = new Audio('Sounds/error.mp3');
    fehler.play();
    const toastLiveExample = document.getElementById('liveToast4');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();

};   }



       function dark(){
          
           setTimeout(function () {
               modee = "dark";
           }, 100);
           console.log("dark");
            document.getElementById("modee").setAttribute("d", "M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z");
            document.getElementById('modeee').setAttribute("d", "");
            document.documentElement.style.setProperty('--backg', '#1e293b');
            document.documentElement.style.setProperty('--linkc', '#adb5bd');
           document.documentElement.style.setProperty('--circle-color', '#adb5bd');
           document.documentElement.style.setProperty('--line-color', '#adb5bd');
           localStorage.setItem("thema", "dark");
           document.getElementById("color-picker").disabled = true;
           document.getElementById("color-picker1").disabled = true;
         
            
            
        };


        function light(){
            
            setTimeout(function () {
                modee = "light";
            }, 100);
            console.log("hell");
            document.getElementById("modee").setAttribute("d", "M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z");
            document.getElementById('modeee').setAttribute("d", "");
            document.documentElement.style.setProperty('--backg', '#ffffff');
            document.documentElement.style.setProperty('--linkc', 'black');
            document.documentElement.style.setProperty('--circle-color', '#0693e3');
            document.documentElement.style.setProperty('--line-color', '#0693e3');
            localStorage.setItem("thema", "light");          
            document.getElementById("color-picker").disabled = true;
            document.getElementById("color-picker1").disabled = true;
          
           
          };


        function individuell() {
            setTimeout(function () {
                
            }, 100);
            console.log("indi");
            document.getElementById("modee").setAttribute("d", "M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z");
            document.getElementById('modeee').setAttribute("d", "M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z");
            document.documentElement.style.setProperty('--linkc', schrift);
            document.documentElement.style.setProperty('--backg', hintergrund);
            document.documentElement.style.setProperty('--circle-color', schrift);
            document.documentElement.style.setProperty('--line-color', schrift);
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

        console.log("hintergrund:" + event.target.value);
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

        console.log("schrift" + event.target.value);
        document.documentElement.style.setProperty('--linkc', event.target.value);
        localStorage.setItem("schrift", event.target.value);

    };



function activ() {

    if (individuell_pegel == "false"){
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
        modee =window.localStorage.getItem("thema");

        if (modee == "dark") {
             dark(); 
            };
        if (modee == "light") { 
            light(); 
        };
    };

    

};


//------------------------------------------------------------------------------------------------------------------------
