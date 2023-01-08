<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="keywords" content="it wolf, itwolf, hendrik wolf, impressum">
	<meta name="author" content="Hendrik Wolf">
	<meta name="description" content="IT Wolf is Created by Hendrik Wolf in 2023, this is a website to show my skills.">
	<title>Impressum - IT Wolf</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
	<script src="impressum.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
		crossorigin="anonymous"></script>
	<link href="index.css" rel="stylesheet">
	<link href="load.css" rel="stylesheet">
		<link rel="icon" href="Bilder/ico.svg">
</head>

<body id="body">

	<div>




<nav class="navbar navbar-expand-lg bg-light" id="nav">
	<div class="container-fluid">
		<a class="navbar-brand" href="index.html"> <img id="it-wolf" class="Logo" src="Bilder/it-wolf-schwarz.svg"
				alt="IT Wolf Logo"> </a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent" id="navbardark">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<a id="nav1" class="nav-link active" aria-current="page" href="logo.html">Logo / Grafik Design</a>
				</li>
				<li class="nav-item">
					<a id="nav2" class="nav-link active" aria-current="page" href="web.html">Web Entwicklung</a>
				</li>
				<li class="nav-item">
					<a id="nav3" class="nav-link active" aria-current="page" href="qr.html">QR-Codes Entwickeln</a>
				</li>
				<li class="nav-item">
					<a id="nav4" class="nav-link active" aria-current="page" href="mich.html">Über mich</a>
				</li>
			</ul>
			<img id="mode" class="mode" onclick="switchmode()" src="Bilder/mode-moon.svg">
		</div>

	</div>
</nav>





		<div class="p-4">
		
			<h2 data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="headline">Impressum</h2>
		
		
			<!-- Modal -->
			<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
				aria-labelledby="staticBackdropLabel" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header" id="pop-head">
							<h1 class="modal-title fs-5" id="staticBackdropLabel">Dein Name</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body" id="pop-body">
							<div class="form-floating mb-3">
								<input type="text" class="form-control" id="namee" placeholder="name">
								<label for="floatingInput">Name</label>
							</div>
						</div>
						<div class="modal-footer" id="pop-food">
							<button type="button" class="btn btn-primary" data-bs-dismiss="modal"
								onclick="auslesen()">Bestätigen</button>
						</div>
					</div>
				</div>
			</div>
		
		
		</div>



		<div class="row row-cols-1 row-cols-md-3 g-4 p-4">

			<div class="col">

				<div id="hov" class="card h-100">
					<div class="card-body" title="Klicke hier um mehr zu erfahren" id="card1" onClick="location.href='mich.html'">
						<h5 class="card-title">Disclaimer</h5>
						<p class="card-text">
							Es handelt sich hier um eine fiktive Firma. <br>
							Die genannten Leistungen wereden nicht angeboten.<br>
							Klicke für mehr Infos.
						</p>
						<p class="card-text"><small class="text-muted">Created by Hendrik Wolf in 2023</small></p>
					
						</div>
				</div>
			</div>



			<div class="col">
				<div id="hov" class="card h-100" title="Klicke hier um mehr zu erfahren" onclick="window.open('https://www.youtube.com/watch?v=Vl0v1au0Zm0', '_blank',), card_2()">
					<div class="card-body" id="card2">
						<h5 class="card-title">Wird geladen...</h5>
						<div class="loader">
							<div class="inner one"></div>
							<div class="inner two"></div>
							<div class="inner three"></div>
						</div>

					</div>
				</div>
			</div>

			<div class="col">
				<div id="hov" class="card h-100" title="Klicke hier um mehr zu erfahren" onclick="window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank',), card_3()">
					<div class="card-body" id="card3" >
						<h5 class="card-title">Wird geladen...</h5>
						<div class="loader">
							<div class="inner one"></div>
							<div class="inner two"></div>
							<div class="inner three"></div>
						</div>
					
					</div>
				</div>
			</div>


		</div>


<div class="p-4">
	<p><a onclick="tippen()">Tippe</a> auf die jeweilige Karte um mehr <a onclick="imp()">zu erfahren.</a></p>
	<p onclick="javascript:location.href='v1.html'" style="cursor: pointer;">Hier kommen Sie zur ersten Version der Seite.</p>
</div>

		<div class="mail"
			onclick="location.href= href='mailto:it.wolf.kontakt@gmail.com?subject=Anfrage&body=Sehr geehrtes  IT Wolf Team,'">
			<p>Kontaktieren Sie uns per Mail: <br> it.wolf.kontakt@gmail.com</p>
		</div>

		<footer>
		
			<p class="text-center text-muted">
				<a class="light-mode" id="link2" href="index.html"> &copy; IT Wolf 2023</a>
				|
				<a class="light-mode" id="link1" href="impressum.html">Impressum</a>
			</p>
		
		
			</footer>




</body>

<script>
	var mam = "";
	mam = window.localStorage.getItem("head");

	console.log("Name: " + mam);

	if (mam == null || mam == "") {
		console.log("Kein Name");
		document.getElementById("headline").innerHTML = "Impressum";
	} else {
		document.getElementById("headline").innerHTML = "Moin " + mam + " - Impressum";
	};



	function auslesen() {
		var mam = document.getElementById("namee").value;
		console.log(mam);

		if (mam == "") {
			document.getElementById("headline").innerHTML = "Impressum";
		} else {
			document.getElementById("headline").innerHTML = "Moin " + mam + " - Impressum";
		}
		console.log(mam);
		localStorage.setItem("head", mam);
		console.log(window.localStorage.getItem("head"));

	};
</script>

<script>

	var kontroll = "falsch";
	var modee = "light";
	modee = window.localStorage.getItem("thema");
	console.log("Thema= " + modee);


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




	function dark() {
		document.getElementById("nav").className = "navbar navbar-expand-lg bg-dark";
		document.getElementById("nav1").style.color = "white";
		document.getElementById("nav2").style.color = "white";
		document.getElementById("nav3").style.color = "white";
		document.getElementById("nav4").style.color = "white";
		document.getElementById("it-wolf").src = "Bilder/it-wolf-weis.svg";
		document.getElementById("mode").src = "Bilder/mode-sun.svg";
		document.getElementById("body").className = "dark-mode";
		document.getElementById("link1").className = "dark-mode";
		document.getElementById("link2").className = "dark-mode";
		document.getElementById("card1").style.background = "#202020";
		document.getElementById("card2").style.background = "#202020";
		document.getElementById("card3").style.background = "#202020";
		document.getElementById("pop-head").style.background = "#202020";
		document.getElementById("pop-body").style.background = "#202020";
		document.getElementById("namee").style.background = "#202020";
		document.getElementById("namee").style.color = "white";
		document.getElementById("pop-food").style.background = "#202020";


	};

	function light() {
		document.getElementById("nav").className = "navbar navbar-expand-lg bg-light";
		document.getElementById("nav1").style.color = "black";
		document.getElementById("nav2").style.color = "black";
		document.getElementById("nav3").style.color = "black";
		document.getElementById("nav4").style.color = "black";
		document.getElementById("it-wolf").src = "Bilder/it-wolf-schwarz.svg";
		document.getElementById("mode").src = "Bilder/mode-moon.svg";
		document.getElementById("body").className = "light-mode";
		document.getElementById("link1").className = "light-mode";
		document.getElementById("link2").className = "light-mode";
		document.getElementById("card1").style.background = "white";
		document.getElementById("card2").style.background = "white";
		document.getElementById("card3").style.background = "white";
		document.getElementById("pop-head").style.background = "white";
		document.getElementById("pop-body").style.background = "white";
		document.getElementById("namee").style.background = "white";
		document.getElementById("namee").style.color = "black";
		document.getElementById("pop-food").style.background = "white";

	};


</script>


</html>
