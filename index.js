

var modee = "false";
modee = window.localStorage.getItem("thema");
console.log(modee);
modestart();


function modestart() {


	if (window.localStorage.getItem("thema") == "true") {
		
		//alert("Keine Ahnung warum der Darkmode nicht mehr an geht");
		dark2();
	} };


function dark2() {
	console.log("dark2 ausgelöst");
	switchmode();


}





function switchmode(){ 
	

	if (modee == "true"){
		modee = "false";
		light();
}else{
	modee = "true";
	
		dark();
}
localStorage.setItem("thema" , modee);
};




function dark(){
	document.getElementById("nav").className = "navbar navbar-expand-lg bg-dark";
	document.getElementById("it-wolf").src = "Bilder/it-wolf-weis.svg";
	document.getElementById("mode").src = "Bilder/mode-sun.svg";
	document.getElementById("body").className = "dark-mode";
	document.getElementById("link1").className = "dark-mode";
	document.getElementById("link2").className = "dark-mode";
	document.getElementById("card1").style.background = "#202020";
	document.getElementById("card2").style.background = "#202020";
	document.getElementById("card3").style.background = "#202020";
	document.getElementById("nav1").style.color = "white";
	document.getElementById("nav2").style.color = "white";
	document.getElementById("nav3").style.color = "white";

};

function light(){
	document.getElementById("nav").className = "navbar navbar-expand-lg bg-light";
	document.getElementById("it-wolf").src = "Bilder/it-wolf-schwarz.svg";
	document.getElementById("mode").src = "Bilder/mode-moon.svg";
	document.getElementById("body").className = "light-mode";
	document.getElementById("link1").className = "light-mode";
	document.getElementById("link2").className = "light-mode";
	document.getElementById("card1").style.background = "white";
	document.getElementById("card2").style.background = "white";
	document.getElementById("card3").style.background = "white";
	document.getElementById("nav1").style.color = "black";
	document.getElementById("nav2").style.color = "black";
	document.getElementById("nav3").style.color = "black";

};

