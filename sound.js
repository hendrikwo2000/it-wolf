








const halt = new Audio('Sounds/halt_stop.mp3');
const hurt = new Audio('Sounds/hurt.mp3');
const na = new Audio('Sounds/na.mp3');
const deutschland = new Audio('Sounds/deutschland.mp3');
const sui = new Audio('Sounds/sui.mp3');
const krise = new Audio('Sounds/krise.mp3');
const me = new Audio('Sounds/2022.mp3');
const schwanz = new Audio('Sounds/schwanz.mp3');
const erika = new Audio('Sounds/erika.mp3');
const n6 = new Audio('Sounds/n6.mp3');
const alarm = new Audio('Sounds/alarm.mp3');
const anzeige = new Audio('Sounds/anzeige.mp3');
const wichser = new Audio('Sounds/wichser.mp3');



document.onkeydown = function (event) {


    if (event.keyCode == 54) {
        n6.play();
    }
    if (event.keyCode == 32) {
        halt.play();
    }
    if (event.keyCode == 46) {
        hurt.play();
    }
    if (event.keyCode == 8) {
        hurt.play();
    }
    if (event.keyCode == 13) {
        na.play();
    }
    if (event.keyCode == 49) {
        deutschland.play();
    }
    if (event.keyCode == 50) {
        me.play();
    }
    if (event.keyCode == 51) {
        sui.play();
    }
    if (event.keyCode == 52) {
        krise.play();
    }
    if (event.keyCode == 53) {
        schwanz.play();
    }
    if (event.keyCode == 54) {
        n6.play();
    }
    if (event.keyCode == 55) {
        erika.play();
    }
    if (event.keyCode == 56) {
        alarm.play();
    }
    if (event.keyCode == 57) {
        anzeige.play();
    }
    if (event.keyCode == 48) {
        wichser.play();
    }
};


function fehler(){
    const fehler = new Audio('Sounds/error.mp3');
    fehler.play();
};


function rick() {
    const rick = new Audio('Sounds/rick.mp3');
    rick.play();

    document.getElementById("butt").disabled = true;
   
    setTimeout(function () {
        document.getElementById("butt").disabled = false;
    }, 17000);
    

};
