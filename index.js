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


        function dark(){
            document.documentElement.setAttribute('data-bs-theme', "dark");
            document.getElementById("it-wolf").src = "Bilder/it-wolf-weis.svg";
            document.getElementById("mode").src = "Bilder/mode-sun.svg";
            document.documentElement.style.cssText = "--linkc: #adb5bd";       
        }

        function light(){
            document.documentElement.setAttribute('data-bs-theme', "light");
            document.getElementById("it-wolf").src = "Bilder/it-wolf-schwarz.svg";
            document.getElementById("mode").src = "Bilder/mode-moon.svg";
            document.documentElement.style.cssText = "--linkc: black";
        }
   
