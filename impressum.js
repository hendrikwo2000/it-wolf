
let imphover = "false";
let tip = "false";
function imp() {
    imphover = "true";
    if (tip == "true") {
        location.href = 'secret.html';

    }
    imphover = "false";
    tip = "false";

};

function tippen() {
    tip = "true";
};


function card_1() {
    const thud = new Audio('Sounds/thud.mp3');
    thud.play();

};

function card_2() {
    const entscheidung = new Audio('Sounds/entscheidung.mp3');
    entscheidung.play();

};

function card_3() {
    const moment = new Audio('Sounds/moment.mp3');
    moment.play();

};

function rick() {
    const rick = new Audio('Sounds/rick.mp3');
    rick.play();
};