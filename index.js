let darkmode;



/*if(window.matchMedia('prefers-color-scheme: dark)').matches){
	darkmode = true;
	dakmode()
}else{
	darkmode = false;
	darkmode();
}
*/

if(darkmode == true){dakmode()};




function switchmode(){ 
	console.log(darkmode);
	darkmode = !darkmode;

	if (darkmode == true){
		dakmode();

}else{
	lightmode();
}

console.log(darkmode);



};




function dakmode(){
	console.log("dakmode is true = "+ darkmode);
	document.getElementById("nav").className = "navbar navbar-expand-lg bg-dark";
	document.getElementById("it-wolf").src = "it-wolf-weis.svg";
	document.getElementById("mode").src = "sun.svg";
	document.getElementById("body").className = "dark-mode";
	document.getElementById("link1").className = "dark-mode";
	document.getElementById("link2").className = "dark-mode";
	document.getElementById("card1").style.background = "#202020";
	document.getElementById("card2").style.background = "#202020";
	document.getElementById("card3").style.background = "#202020";
	document.getElementById("nav1").style.color = "white";
	document.getElementById("nav2").style.color = "white";
	document.getElementById("nav3").style.color = "white";
	document.getElementById("drop1").style.color = "white";
	document.getElementById("drop2").style.color = "white";
	document.getElementById("drop3").style.color = "white";
	document.getElementById("drop").style.background ="#202020";

}


function lightmode(){
	console.log("dakmode is false = "+ darkmode);
	document.getElementById("nav").className = "navbar navbar-expand-lg bg-light";
	document.getElementById("it-wolf").src = "it-wolf-schwarz.svg";
	document.getElementById("mode").src = "moon.svg";
	document.getElementById("body").className = "light-mode";
	document.getElementById("link1").className = "light-mode";
	document.getElementById("link2").className = "light-mode";
	document.getElementById("card1").style.background = "white";
	document.getElementById("card2").style.background = "white";
	document.getElementById("card3").style.background = "white";
	document.getElementById("nav1").style.color = "black";
	document.getElementById("nav2").style.color = "black";
	document.getElementById("nav3").style.color = "black";
	document.getElementById("drop1").style.color = "black";
	document.getElementById("drop2").style.color = "black";
	document.getElementById("drop3").style.color = "black";
	document.getElementById("drop").style.background ="white";

}

