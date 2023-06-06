
let imphover = "false";
let tip = "false";

function imp() {
    imphover = "true";
    if (tip == "true") {
        location.href = 'sounds.html';

    }
    imphover = "false";
    tip = "false";

};

function tippen() {
    tip = "true";
};

function card_2() {
    const schlag = new Audio('Sounds/schlag.mp3');
    schlag.play();

};

function card_3() {
    const entscheidung = new Audio('Sounds/entscheidung.mp3');
    entscheidung.play();

};



function rick() {
    const rick = new Audio('Sounds/rick.mp3');
    rick.play();
};