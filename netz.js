const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false; // Oder false, abhängig von deinen Anforderungen
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * devicePixelRatio;
canvas.height = canvas.offsetHeight * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);
const circleCount = 40; // Anzahl der Kreise
const maxConnections = 1; // Anzahl der Verbindungen untereinander
const maxMouseConnections = 8; // Anzahl der Verbindungen mit der Maus
const circleSize = 3; // Ändere den Wert auf die gewünschte Größe der Kreise
const normalLineThickness = 0; // Dicke der Linien zwischen den normalen Kreisen
const mouseLineThickness = 0.2; // Dicke der Linien zwischen Maus und Kreisen
let circles = [];
const svg = document.getElementById('backgroundSvg');
checkScreenSize();



window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Überprüfe, ob die Maus sich über dem Canvas befindet
    const canvasRect = canvas.getBoundingClientRect();
    if (
        mouseX >= canvasRect.left &&
        mouseX <= canvasRect.right &&
        mouseY >= canvasRect.top &&
        mouseY <= canvasRect.bottom
    ) {
        mouseInsideCanvas = true;
    } else {
        mouseInsideCanvas = false;
    }
});


Circle.prototype.connectWithNearestCircles = function (otherCircles) {
    this.connections = [];

    const distances = otherCircles
        .filter(circle => circle !== this)
        .map((circle) => ({
            circle,
            distance: Math.sqrt((circle.x - this.x) ** 2 + (circle.y - this.y) ** 2),
        }))
        .sort((a, b) => a.distance - b.distance);

    let connectionsCount = 0;
    for (let i = 0; i < distances.length; i++) {
        if (connectionsCount >= maxConnections) break;

        const nearestCircle = distances[i].circle;
        if (nearestCircle.connections.length < maxConnections && !this.connections.includes(nearestCircle)) {
            this.connections.push(nearestCircle);
            nearestCircle.connections.push(this);
            connectionsCount++;
        }
    }
};




function resizeCanvas() {
    canvas.width = window.innerWidth * 0.97;
    canvas.height = window.innerHeight;
}

function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.size = circleSize;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.connections = [];
}

Circle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;

    // Randprüfung, damit sich die Kreise innerhalb des sichtbaren Bereichs des Canvas bewegen
    if (this.x < 0 || this.x > canvas.width) {
        this.speedX = -this.speedX;
    }
    if (this.y < 0 || this.y > canvas.height) {
        this.speedY = -this.speedY;
    }
};

Circle.prototype.draw = function () {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--circle-color');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
};

Circle.prototype.connectWithNearestCircles = function (otherCircles) {
    this.connections = [];

    const distances = otherCircles
        .filter(circle => circle !== this)
        .map((circle) => ({
            circle,
            distance: Math.sqrt((circle.x - this.x) ** 2 + (circle.y - this.y) ** 2),
        }))
        .sort((a, b) => a.distance - b.distance);

    for (let i = 0; i < Math.min(maxConnections, distances.length); i++) {
        this.connections.push(distances[i].circle);
    }
};

function connectMouseWithNearestCircles(mouseX, mouseY) {
    const distances = [];

    for (const circle of circles) {
        const distance = Math.sqrt((circle.x - mouseX) ** 2 + (circle.y - mouseY) ** 2);
        distances.push({
            circle,
            distance,
        });
    }

    const nearestCirclesToMouse = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxMouseConnections)
        .map(entry => entry.circle);

    for (const circle of circles) {
        if (nearestCirclesToMouse.includes(circle)) {
            circle.connections.push({ x: mouseX, y: mouseY });
        }
    }
}

function createCircles() {
    for (let i = 0; i < circleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        circles.push(new Circle(x, y));
    }
}

function updateConnections() {
    for (const circle of circles) {
        circle.connectWithNearestCircles(circles);
    }
}

function drawNormalLines() {
    ctx.lineWidth = normalLineThickness;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--line-color');
    for (const circle of circles) {
        for (const connectedCircle of circle.connections) {
            ctx.beginPath();
            ctx.moveTo(circle.x, circle.y);
            ctx.lineTo(connectedCircle.x, connectedCircle.y);
            ctx.stroke();
        }
    }
}

function drawMouseLines() {
    ctx.lineWidth = mouseLineThickness;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--line-color');
    for (const circle of circles) {
        for (const connectedCircle of circle.connections) {
            ctx.beginPath();
            ctx.moveTo(circle.x, circle.y);
            ctx.lineTo(connectedCircle.x, connectedCircle.y);
            ctx.stroke();
        }
    }
}

function animateCircles() {
    requestAnimationFrame(animateCircles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const circle of circles) {
        circle.update();
        circle.draw();
    }

    updateConnections();
    connectMouseWithNearestCircles(mouseX, mouseY); // Die Maus mit den nächsten Kreisen verbinden
    drawNormalLines(); // Linien zwischen den normalen Kreisen zeichnen
    drawMouseLines(); // Linien zwischen Maus und Kreisen zeichnen
}

function animateCircles() {
    requestAnimationFrame(animateCircles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const circle of circles) {
        circle.update();
        circle.draw();
    }

    updateConnections();

    // Nur verbinden, wenn die Maus über dem Canvas ist
    if (mouseInsideCanvas) {
        connectMouseWithNearestCircles(mouseX, mouseY);
        drawMouseLines();
    }

    drawNormalLines();
}




window.addEventListener('resize', () => {
    resizeCanvas();
    circles = [];
    createCircles();
});





function animateCircles() {
    requestAnimationFrame(animateCircles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const circle of circles) {
        circle.update();
        circle.draw();
    }

    updateConnections();

    // Nur verbinden, wenn die Maus über dem Canvas und im Fenster ist
    if (mouseInsideCanvas && mouseInsideWindow) {
        // Berücksichtige die Scroll-Offset-Werte für die Mausposition
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        connectMouseWithNearestCircles(mouseX + scrollX, mouseY + scrollY);
        drawMouseLines();
    }

    drawNormalLines();
}

let mouseX = 0;
let mouseY = 0;
let mouseInsideCanvas = false; // Verfolgt, ob die Maus über dem Canvas ist
let mouseInsideWindow = true; // Verfolgt, ob die Maus sich im Browserfenster befindet




window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Überprüfe, ob die Maus sich über dem Canvas befindet
    const canvasRect = canvas.getBoundingClientRect();
    if (
        mouseX >= canvasRect.left &&
        mouseX <= canvasRect.right &&
        mouseY >= canvasRect.top &&
        mouseY <= canvasRect.bottom
    ) {
        mouseInsideCanvas = true;
    } else {
        mouseInsideCanvas = false;
    }
});

// Überprüfe, ob die Maus sich im Browserfenster befindet
window.addEventListener('mouseout', () => {
    mouseInsideWindow = false;

});
window.addEventListener('mouseover', () => {
    mouseInsideWindow = true;
  
});



window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Überprüfe, ob die Maus sich über dem Canvas befindet
    const canvasRect = canvas.getBoundingClientRect();
    if (
        mouseX >= canvasRect.left &&
        mouseX <= canvasRect.right &&
        mouseY >= canvasRect.top &&
        mouseY <= canvasRect.bottom
    ) {
        mouseInsideCanvas = true;
    } else {
        mouseInsideCanvas = false;
    }
});



window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});


function checkScreenSize() {
    if (window.innerWidth <= 768) { // Beispielgrenze für mobile Geräte
        canvas.classList.add('hidden');
    } else {
        canvas.classList.remove('hidden');
    }
}

window.addEventListener('resize', checkScreenSize);

window.addEventListener('load', () => {
    checkScreenSize();
    createCircles();
    animateCircles();
});

resizeCanvas();
createCircles();
animateCircles();

