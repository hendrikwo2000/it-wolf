              var kontroll = "falsch";
                var modee = "light";
                modee = window.localStorage.getItem("thema");
                console.log("Thema= " + modee);

document.getElementById("namechange").style.display = "none";
document.getElementById("namedel").style.display = "none";
document.getElementById("error").style.display = "none";





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



function auslesen() {
    var mam = document.getElementById("namee").value;

    if (mam == window.localStorage.getItem("head")) {


    } else




        if (mam == "") {
            document.getElementById("headline").innerHTML = "";
            mam = "";
            document.getElementById("namedel").style.display = "block";


            setTimeout(function () {
                document.getElementById("namedel").style.display = "none";
            }, 3000);



        } else if (mam.match("<")) {
            document.getElementById("headline").innerHTML = "";
            mam = "";
            document.getElementById("error").style.display = "block";
            const fehler = new Audio('Sounds/error.mp3');
            fehler.play();
            setTimeout(function () {
                document.getElementById("error").style.display = "none";
            }, 3000);


        } else {
            document.getElementById("headline").innerHTML = "Moin " + mam + " - ";
            document.getElementById("namechange").style.display = "block";
            setTimeout(function () {
                document.getElementById("namechange").style.display = "none";
            }, 3000);

        }

    localStorage.setItem("head", mam);
    console.log("Name: " + window.localStorage.getItem("head"));

};



                if (window.localStorage.getItem("thema") == null) {
                    console.log("Thema har er nicht");

                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        dark();
                        modee = "dark";
                        localStorage.setItem("thema", modee);

                    }
                } else {
                    if (window.localStorage.getItem("thema") == "dark") {
                        console.log("Thema war dark");
                        dark();

                    }
                };


                function switchmode() {


                    if (modee == "dark") {
                        modee = "light";
                        light();
                    } else {
                        modee = "dark";

                        dark();
                    }
                    localStorage.setItem("thema", modee);
                };


        function dark(){
            document.documentElement.setAttribute('data-bs-theme', "dark");
            document.getElementById("it-wolf").src = "Bilder/it-wolf-weis.svg";
            document.getElementById("mode").src = "Bilder/moon.svg";
            document.documentElement.style.cssText = "--linkc: #adb5bd";       
        }

        function light(){
            document.documentElement.setAttribute('data-bs-theme', "light");
            document.getElementById("it-wolf").src = "Bilder/it-wolf-schwarz.svg";
            document.getElementById("mode").src = "Bilder/sun.svg";
            document.documentElement.style.cssText = "--linkc: black";
        }
   
