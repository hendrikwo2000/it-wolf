document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calorie-form");
    const calculateButton = document.querySelector(".button");

    // Funktion zur Validierung eines Eingabefelds
    function validateField(field, errorId, min, max, showErrors = true) {
        const value = parseFloat(field.value);
        const errorMessage = document.getElementById(errorId);

        if (!value || value < min || value > max) {
            if (showErrors) {
                field.classList.add("error");
                if (errorMessage) errorMessage.style.display = "block";
            }
            return false;
        } else {
            field.classList.remove("error");
            if (errorMessage) errorMessage.style.display = "none";
            return true;
        }
    }

    // Funktion zur Validierung der Radio-Buttons
    function validateRadios(name, errorId, showErrors = true) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        const errorMessage = document.getElementById(errorId);

        if (!selected) {
            if (showErrors && errorMessage) errorMessage.style.display = "block";
            return false;
        } else {
            if (errorMessage) errorMessage.style.display = "none";
            return true;
        }
    }

    // Funktion zur Validierung des gesamten Formulars
    function validateForm(showErrors = true) {
        const isAgeValid = validateField(document.getElementById("age"), "age-error", 1, 120, showErrors);
        const isWeightValid = validateField(document.getElementById("weight"), "weight-error", 30, 300, showErrors);
        const isHeightValid = validateField(document.getElementById("height"), "height-error", 50, 300, showErrors);
        const isGenderValid = validateRadios("gender", "gender-error", showErrors);
        const isActivityValid = validateRadios("activity", "activity-error", showErrors);
        const isGoalValid = validateRadios("goal", "goal-error", showErrors);

        return isAgeValid && isWeightValid && isHeightValid && isGenderValid && isActivityValid && isGoalValid;
    }

    // Funktion zur Aktualisierung des Button-Status
    function updateButtonState() {
        if (validateForm(false)) { // Button-Status ohne Fehleranzeige validieren
            calculateButton.classList.add("valid-button");
            calculateButton.classList.remove("invalid-button");
        } else {
            calculateButton.classList.add("invalid-button");
            calculateButton.classList.remove("valid-button");
        }
    }

    // Eingabe-Event-Listener, um den Button-Status zu aktualisieren
    form.addEventListener("input", () => {
        updateButtonState(); // Button-Farbe bei Eingabe anpassen
        document.getElementById('results').style.display = 'none'; // Ergebnisse ausblenden bei Eingabe
    });




    
    //--------------------------------------------------------------------------------
    // Berechnung des Kalorienbedarfs
    function calculateCalories() {
        const genderRadio = document.querySelector('input[name="gender"]:checked');
        const activityRadio = document.querySelector('input[name="activity"]:checked');
        const goalRadio = document.querySelector('input[name="goal"]:checked');

        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);

        let bmr = genderRadio.value === 'male'
            ? 66.5 + (13.7 * weight) + (5.0 * height) - (6.8 * age)
            : 655.1 + (9.6 * weight) + (1.8 * height) - (4.7 * age);

        const activity = parseFloat(activityRadio.value);
        const totalCalories = Math.round(bmr * activity);
        const protein = Math.round(weight * 2);
        const fat = weight;
        const carbCalories = totalCalories - (protein * 4 + fat * 9);
        const carbs = Math.round(carbCalories / 4);

        let adjustedCalories;
        let adjustedCarbs;

        if (goalRadio.value === 'abnehmen') {
            adjustedCalories = totalCalories - 400;
            adjustedCarbs = carbs - 100;
        } else if (goalRadio.value === 'halten') {
            adjustedCalories = totalCalories;
            adjustedCarbs = carbs;
        } else if (goalRadio.value === 'zunehmen') {
            adjustedCalories = totalCalories + 400;
            adjustedCarbs = carbs + 100;
        }

        // Anzeige der Ergebnisse
        document.getElementById('results').style.display = 'block';
        document.getElementById('result-calories').textContent = Math.round(adjustedCalories);
        document.getElementById('result-protein').textContent = protein;
        document.getElementById('result-carbs').textContent = adjustedCarbs;
        document.getElementById('result-fats').textContent = fat;
    }

    // Button-Klick, um die Berechnung auszuführen
    calculateButton.addEventListener("click", (event) => {
        event.preventDefault(); // Verhindert das Standardverhalten
        if (validateForm(true)) { // Fehler anzeigen beim Klick
            calculateCalories();
        } else {
            console.log("Bitte füllen Sie alle erforderlichen Felder aus.");
        }
    });

    // Button-Status direkt zu Beginn aktualisieren (ohne Fehleranzeige)
    updateButtonState();
});


//------------------------------------------------------------------------------------------------

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

const svgElement = document.getElementById("popoverButton");
svgElement.addEventListener("mouseenter", function () {
    svgElement.setAttribute("title", "Aktivitätslevel"); // Tooltip-Text setzen
});

// Initialize Bootstrap Popovers
var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
var popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

// Schließen des Popovers bei Klick außerhalb
document.addEventListener('click', function (event) {
    var popoverButton = document.getElementById('popoverButton');

    if (!popoverButton.contains(event.target)) {
        // Schließe das Popover, wenn außerhalb des Popovers geklickt wird
        popoverList.forEach(popover => popover.hide());
    }
});



//-------------------------------------------------------------------------------------




function calculateProgression() {
    let oldWeight = parseFloat(document.getElementById("oldWeight").value);
    let oldReps = parseInt(document.getElementById("oldReps").value);
    let newWeight = parseFloat(document.getElementById("newWeight").value);
    let newReps = parseInt(document.getElementById("newReps").value);
    let result = document.getElementById("result");

    result.style.display = "none";
    result.innerText = "";
    let errors = false;
    document.querySelectorAll(".error").forEach(e => e.innerText = "");

    if (!oldWeight || oldWeight <= 0) {
        document.getElementById("error-oldWeight").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }
    if (!oldReps || oldReps <= 0) {
        document.getElementById("error-oldReps").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }
    if (!newWeight || newWeight <= 0) {
        document.getElementById("error-newWeight").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }
    if (!newReps || newReps <= 0) {
        document.getElementById("error-newReps").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }

    if (errors) return;

    let old1RM = (oldWeight * 36) / (37 - oldReps);
    let new1RM = (newWeight * 36) / (37 - newReps);
    let progression = ((new1RM - old1RM) / old1RM) * 100;

    result.innerHTML = `<div class="result-grid">
                                    <div class="result-item">
                                        <p>Alter 1RM:</p>
                                        <strong>${old1RM.toFixed(2)} kg</strong>
                                    </div>
                                    <div class="result-item">
                                        <p>Neuer 1RM:</p>
                                        <strong>${new1RM.toFixed(2)} kg</strong>
                                    </div>
                                </div>
                                <p class="${progression >= 0 ? 'progression-positive' : 'progression-negative'}">
                                    ${progression >= 0 ? 'Leistungssteigerung' : 'Leistungsrückgang'}: 
                                    <strong>${Math.abs(progression).toFixed(2)}%</strong>
                                </p>`;
    result.style.display = "block";
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
        // Verstecke Fehler und Ergebnisse bei jeder Eingabeänderung
        document.querySelectorAll(".error").forEach(e => e.innerText = "");
        document.getElementById("result").style.display = "none";
    });
});



//-------------------------------------------------------------------------------------
// Progrss


function calculateProgression() {
    let oldWeight = parseFloat(document.getElementById("oldWeight").value);
    let oldReps = parseInt(document.getElementById("oldReps").value);
    let newWeight = parseFloat(document.getElementById("newWeight").value);
    let newReps = parseInt(document.getElementById("newReps").value);
    let result = document.getElementById("result");

    result.style.display = "none";
    result.innerText = "";
    let errors = false;

    if (!oldWeight || oldWeight <= 0) {
        document.getElementById("error-oldWeight").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }
    if (!oldReps || oldReps <= 0) {
        document.getElementById("error-oldReps").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }
    if (!newWeight || newWeight <= 0) {
        document.getElementById("error-newWeight").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }
    if (!newReps || newReps <= 0) {
        document.getElementById("error-newReps").innerText = "Bitte eine gültige Zahl eingeben";
        errors = true;
    }

    if (errors) return;

    let old1RM = (oldWeight * 36) / (37 - oldReps);
    let new1RM = (newWeight * 36) / (37 - newReps);
    let progression = ((new1RM - old1RM) / old1RM) * 100;

    result.innerHTML = `<div class="result-grid">
                            <div class="result-item">
                                <p>Alter 1RM:<br>
                               <strong>${old1RM.toFixed(2)} kg</strong></p>
                               
                            </div>

                            <div class="result-item">
                                <p>Neuer 1RM:
                                 <strong>${new1RM.toFixed(2)} kg</strong></p>
                               
                            </div>
                        </div><br>
                        <p class="${progression >= 0 ? 'progression-positive' : 'progression-negative'}">
                            ${progression >= 0 ? 'Fortschritt' : 'Rückschritt'}: 
                            <strong>${Math.abs(progression).toFixed(2)}%</strong>
                        </p>`;
    result.style.display = "block";
}

function validateInputs() {
    let oldWeight = parseFloat(document.getElementById("oldWeight").value);
    let oldReps = parseInt(document.getElementById("oldReps").value);
    let newWeight = parseFloat(document.getElementById("newWeight").value);
    let newReps = parseInt(document.getElementById("newReps").value);
    let buttonpro = document.getElementById("calculateButton"); // Verwende die ID des Buttons

    let errors = false;

    if (!oldWeight || oldWeight <= 0) errors = true;
    if (!oldReps || oldReps <= 0) errors = true;
    if (!newWeight || newWeight <= 0) errors = true;
    if (!newReps || newReps <= 0) errors = true;

    

    if (errors) {
        buttonpro.classList.remove("valid-button");
        buttonpro.classList.add("invalid-button");
    } else {
        buttonpro.classList.remove("invalid-button");
        buttonpro.classList.add("valid-button");
    }
}

// Event Listener für Input-Felder zur Live-Validierung
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", (event) => {
        let field = event.target;
        let errorElement = document.getElementById("error-" + field.id);

        if (field.value && parseFloat(field.value) > 0) {
            errorElement.innerText = ""; // Entfernt die Fehlermeldung nur für dieses Feld
        }

        validateInputs();
        document.getElementById("result").style.display = "none";
    });
});

// Initiale Validierung beim Laden der Seite
validateInputs();

//----------------------------------------------------------------------------------------------
// Quiz

const quizData = [
    { question: "Wie viel Lieter Wasser am Tag sollte ich trinke?", options: ["0 L", "1 L", "2 - 3 L", "10 L"], correct: 2 },
    { question: "Wie oft Krakttraining als Anfänger pro Woche?", options: ["1 x", "2 - 3 x", "5 - 6 x", "7 x"], correct: 1 },
    { question: "Wie viel Stunden sollte ich por Nacht schalfen?", options: ["1 h", "3 - 6 h", "7 - 9 h", "12 h"], correct: 2 },
    { question: "Welche Makronährstoffe haben den höchsten thermischen Effekt?", options: ["Fette", "Kohlenhydrate", "Proteine", "Ballaststoffe"], correct: 2 },
    { question: "Welches Hormon ist entscheidend für Muskelaufbau?", options: ["Cortisol", "Testosteron", "Insulin", "Melatonin"], correct: 1 },
    { question: "Welche Superfoods enthalten die meisten Antioxidantien?", options: ["Kartoffeln", "Heidelbeeren", "Weizenbrot", "Gurken"], correct: 1 },
    { question: "Warum ist Schlaf so wichtig für den Muskelaufbau?", options: ["Schlaf hat keinen Einfluss", "Schlaf fördert die Regeneration und Testosteronproduktion", "Schlaf verringert die Muskelmasse", "Schlaf ist nur für Ausdauersportler wichtig"], correct: 1 },
    { question: "Wie kann ein starkes soziales Umfeld beim Erreichen von Gesundheitszielen helfen?", options: ["Durch gegenseitige Motivation und Unterstützung", "Durch Ablenkung vom Training", "Durch mehr soziale Verpflichtungen, die das Training erschweren", "Durch ständigen Wettbewerb, der zu Übertraining führt"], correct: 0 },
    { question: "Welche Regenerationsmethode wird oft unterschätzt?", options: ["Massage", "Ernährung", "Aktive Erholung wie Spaziergänge oder leichtes Radfahren", "Keine Bewegung nach dem Training"], correct: 2 },
    { question: "Welche soziale Gewohnheit kann die körperliche und geistige Gesundheit verbessern?", options: ["Regelmäßige Diskussionen über Ernährung", "Ein aktives soziales Umfeld mit Bewegung und gesundem Lebensstil", "Gemeinsames Fast-Food-Essen mit Freunden", "Stundenlanges Scrollen durch Social Media"], correct: 1 },

];

let currentQuestion = 0;
let score = 0;

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('resultsquiz');
const nextButton = document.getElementById('next-btn');
const retryButton = document.getElementById('retry-btn');
const progressBar = document.getElementById('progress-bar');

function updateProgressBar() {
    const progress = Math.floor(((currentQuestion + 1) / quizData.length) * 100);
    document.getElementById('progress-bar').style.width = progress + "%";
}

function renderQuestion() {
    quizContainer.innerHTML = '';

    const data = quizData[currentQuestion];
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.textContent = data.question;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options';

    data.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => handleAnswer(index));
        optionsContainer.appendChild(optionElement);
    });

    quizContainer.appendChild(questionElement);
    quizContainer.appendChild(optionsContainer);

    

   
    nextButton.textContent = (currentQuestion === quizData.length - 1) ? "Ergebniss" : "Nächste Frage";

    nextButton.classList.remove('active');
    nextButton.style.opacity = 0.5;
    nextButton.style.pointerEvents = "none";
}


function handleAnswer(selectedIndex, selectedOption) {
    const data = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');

    options.forEach((option, index) => {
        if (index === data.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('wrong');
        }
        option.style.pointerEvents = 'none';
    });

    if (selectedIndex === data.correct) {
        score++;
    }
    updateProgressBar();

    nextButton.classList.add('active');
    nextButton.style.opacity = 1;
    nextButton.style.pointerEvents = "auto";
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizContainer.innerHTML = '';
    resultsContainer.style.display = 'block';
    resultsContainer.textContent = `Du hast ${score} von ${quizData.length} Punkten erreicht!`;
    nextButton.style.display = 'none';
    retryButton.style.display = 'inline-block';
    retryButton.classList.add('active');

    const percentage = Math.floor((score / quizData.length) * 100); // Abrunden auf ganze Zahl
    let message;

    if (percentage === 100) {
        message = "🎉 Fantastisch! Du bist ein wahrer Quiz-Meister!";
    } else if (percentage >= 70) {
        message = "👍 Gut gemacht! Du hast ein tolles Wissen!";
    } else {
        message = "💡 Übung macht den Meister! Versuch es nochmal!";
    }

    resultsContainer.innerHTML = `Du hast ${score} von ${quizData.length} Punkten erreicht (${percentage}%). <br><br>${message}<br><br> `;


}





function retryQuiz() {
    currentQuestion = 0;
    score = 0;
    resultsContainer.style.display = 'none';
    retryButton.style.display = 'none';
    nextButton.style.display = 'inline-block'; //
    nextButton.textContent = "Nächste Frage";
    nextButton.classList.remove('active');
    nextButton.style.opacity = 0.5;
    nextButton.style.pointerEvents = "none";
    document.getElementById('progress-bar').style.width = "0%";
    renderQuestion();
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

renderQuestion();