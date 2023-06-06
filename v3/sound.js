
const wichser = new Audio('../Sounds/wichser.mp3');



document.onkeydown = function (event) {

    if (event.keyCode == 48) {
        wichser.play();
    }
};

function deutschalnd(){
    const deutschalnd = new Audio('../Sounds/deutschland.mp3');
    deutschalnd.play();
}


function wirhaben() {
    const wirhaben = new Audio('../Sounds/2022.mp3');
    wirhaben.play();
}


function sui() {
    const sui = new Audio('../Sounds/sui.mp3');
    sui.play();
}


function krise() {
    const krise = new Audio('../Sounds/krise.mp3');
    krise.play();
}


function schwanz() {
    const schwanz = new Audio('../Sounds/schwanz.mp3');
    schwanz.play();
}


function n6() {
    const n6 = new Audio('../Sounds/n6.mp3');
    n6.play();
}


function erika() {
    const erika = new Audio('../Sounds/erika.mp3');
    erika.play();
}


function alarm() {
    const alarm = new Audio('../Sounds/alarm.mp3');
    alarm.play();
}


function anzeige() {
    const anzeige = new Audio('../Sounds/anzeige.mp3');
    anzeige.play();
}


function hurt() {
    const hurt = new Audio('../Sounds/hurt.mp3');
    hurt.play();
}


function na() {
    const na = new Audio('../Sounds/na.mp3');
    na.play();
}


function halt_stop() {
    const halt_stop = new Audio('../Sounds/halt_stop.mp3');
    halt_stop.play();
}











function fehler(){
    const fehler = new Audio('../Sounds/error.mp3');
    fehler.play();
};


function rick() {
    const rick = new Audio('../Sounds/rick.mp3');
    rick.play();

    document.getElementById("butt").disabled = true;
   
    setTimeout(function () {
        document.getElementById("butt").disabled = false;
    }, 17000);
    

};