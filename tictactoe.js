// Tic Tac Toe – Spieler ist X (beginnt), Computer ist O.
// Alle Farben/Animationen laufen ueber tictactoe.css und die CSS-Variablen der
// Seite, damit Light-/Dark-/Individuell-Modus automatisch mitgehen.

var board = ['', '', '', '', '', '', '', '', ''];
var currentPlayer = 'X';
var gameOver = false;

// Sperrt Klicks, waehrend der Computer am Zug ist oder das Spiel vorbei ist.
// Behebt den Bug, dass man in den 500 ms Computer-Wartezeit mehrere X setzen
// und so die Zugreihenfolge zerschiessen konnte.
var locked = false;

// Timer-Handle des geplanten Computerzugs. Wird bei "Neues Spiel"/Schliessen
// abgebrochen, sonst wuerde ein bereits geplanter Zug auf ein frisches Brett fallen.
var computerTimer = null;

// 'unschlagbar' = Minimax (Standard, hoechstens Unentschieden moeglich).
// 'einfach'     = Computer zieht ueberwiegend zufaellig, dadurch gewinnbar.
var difficulty = 'unschlagbar';

// Punktestand – wird im Local Storage gespeichert und ueberlebt so einen Reload.
var TIC_SCORE_KEY = 'tictactoe-scores';
var scores = loadScores();

function loadScores() {
    try {
        var raw = localStorage.getItem(TIC_SCORE_KEY);
        if (raw) {
            var s = JSON.parse(raw);
            return { win: +s.win || 0, loss: +s.loss || 0, draw: +s.draw || 0 };
        }
    } catch (e) { /* Local Storage nicht verfuegbar -> bei 0 anfangen */ }
    return { win: 0, loss: 0, draw: 0 };
}

function saveScores() {
    try { localStorage.setItem(TIC_SCORE_KEY, JSON.stringify(scores)); } catch (e) { }
}

function resetScore() {
    scores = { win: 0, loss: 0, draw: 0 };
    saveScores();
    updateScore();
}

// Gespeicherten Stand anzeigen, sobald das DOM steht (Skript laeuft im <head>).
document.addEventListener('DOMContentLoaded', updateScore);

var winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Zellen immer frisch aus dem DOM holen (das Board steckt in einem Popup).
function cells() {
    return document.getElementById('board').querySelectorAll('.cell');
}

function setLocked(value) {
    locked = value;
    var b = document.getElementById('board');
    if (b) b.classList.toggle('locked', value);
}

// --- Spielzuege -----------------------------------------------------------

function makeMove(index) {
    if (gameOver || locked) return;
    if (currentPlayer !== 'X') return;
    if (board[index] !== '') return;

    placeSymbol(index, 'X');
    var result = evaluate();
    if (result) { endGame(result); return; }

    // Computer ist dran
    currentPlayer = 'O';
    setLocked(true);
    computerTimer = setTimeout(makeComputerMove, 500);
}

function makeComputerMove() {
    computerTimer = null;
    if (gameOver) return;

    // Im einfachen Modus zieht der Computer meistens zufaellig -> gewinnbar.
    var move;
    if (difficulty === 'einfach' && Math.random() < 0.6) {
        move = randomMove();
    } else {
        move = findBestMove();
    }

    placeSymbol(move, 'O');
    var result = evaluate();
    if (result) { endGame(result); return; }

    currentPlayer = 'X';
    setLocked(false);
}

// Setzt ein Symbol ins Modell und ins DOM (mit Pop-in-Animation).
function placeSymbol(index, symbol) {
    board[index] = symbol;
    var cell = cells()[index];
    cell.innerHTML = '<span class="tic-mark">' + symbol + '</span>';
    cell.classList.add('placed');
}

function randomMove() {
    var empty = [];
    for (var i = 0; i < board.length; i++) {
        if (board[i] === '') empty.push(i);
    }
    return empty[Math.floor(Math.random() * empty.length)];
}

// --- Auswertung -----------------------------------------------------------

// Liefert { winner: 'X'|'O', combo: [a,b,c] } bei Sieg,
// { winner: 'tie' } bei vollem Brett, sonst null.
function evaluate() {
    for (var i = 0; i < winningCombinations.length; i++) {
        var a = winningCombinations[i][0];
        var b = winningCombinations[i][1];
        var c = winningCombinations[i][2];
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], combo: winningCombinations[i] };
        }
    }
    if (board.every(function (cell) { return cell !== ''; })) {
        return { winner: 'tie' };
    }
    return null;
}

function endGame(result) {
    gameOver = true;
    setLocked(true);

    var info = document.getElementById('ticinfo');
    info.classList.remove('tic-win', 'tic-lose', 'tic-draw', 'tic-show');

    if (result.winner === 'tie') {
        info.textContent = 'Unentschieden';
        info.classList.add('tic-draw');
        scores.draw++;
    } else if (result.winner === 'X') {
        info.textContent = 'Du hast gewonnen';
        info.classList.add('tic-win');
        scores.win++;
        highlightWin(result.combo);
        drawWinLine(result.combo);
    } else {
        info.textContent = 'Du hast verloren';
        info.classList.add('tic-lose');
        scores.loss++;
        highlightWin(result.combo);
        drawWinLine(result.combo);
    }

    // Neustart der Einblend-Animation erzwingen.
    void info.offsetWidth;
    info.classList.add('tic-show');
    updateScore();
    saveScores();
}

// --- Gewinner-Optik -------------------------------------------------------

// Sanftes Hervorheben der drei Gewinnerfelder.
function highlightWin(combo) {
    var cs = cells();
    for (var i = 0; i < combo.length; i++) {
        cs[combo[i]].classList.add('cell--win');
    }
}

// Zeichnet eine langsam erscheinende Linie ueber die drei Gewinner-Symbole.
// Endpunkte werden aus den echten Zellmittelpunkten berechnet, damit die Linie
// unabhaengig von Zellgroesse/Abstand exakt sitzt.
function drawWinLine(combo) {
    var boardEl = document.getElementById('board');
    var cs = cells();
    var rect = boardEl.getBoundingClientRect();
    var aRect = cs[combo[0]].getBoundingClientRect();
    var cRect = cs[combo[2]].getBoundingClientRect();

    var x1 = aRect.left + aRect.width / 2 - rect.left;
    var y1 = aRect.top + aRect.height / 2 - rect.top;
    var x2 = cRect.left + cRect.width / 2 - rect.left;
    var y2 = cRect.top + cRect.height / 2 - rect.top;

    // Linie ueber die Symbole hinaus verlaengern, damit sie sauber ueberzeichnet.
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var over = aRect.width * 0.30;
    x1 -= (dx / len) * over; y1 -= (dy / len) * over;
    x2 += (dx / len) * over; y2 += (dy / len) * over;

    var svgns = 'http://www.w3.org/2000/svg';
    var svg = document.getElementById('win-line-svg');
    if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
    svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('id', 'win-line-svg');
    svg.classList.add('win-line-svg');
    svg.setAttribute('width', rect.width);
    svg.setAttribute('height', rect.height);
    svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
    boardEl.appendChild(svg);

    var line = document.createElementNS(svgns, 'line');
    line.setAttribute('class', 'win-line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    svg.appendChild(line);

    // Strich-"Zeichnen" per stroke-dashoffset. Erst ohne Transition auf volle
    // Laenge setzen (kein Aufblitzen), Layout erzwingen, dann Transition an
    // und auf 0 -> die Linie waechst langsam ein.
    var draw = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    line.style.strokeDasharray = draw;
    line.style.strokeDashoffset = draw;
    void line.getBoundingClientRect();
    line.style.transition = 'stroke-dashoffset 0.65s cubic-bezier(0.4, 0, 0.2, 1)';
    line.style.strokeDashoffset = '0';
}

// --- Punktestand ----------------------------------------------------------

function updateScore() {
    var w = document.getElementById('tic-score-win');
    var d = document.getElementById('tic-score-draw');
    var l = document.getElementById('tic-score-loss');
    if (w) w.textContent = scores.win;
    if (d) d.textContent = scores.draw;
    if (l) l.textContent = scores.loss;
}

// --- Schwierigkeitsgrad ---------------------------------------------------

function setDifficulty(level) {
    difficulty = level;
    var btns = document.getElementsByClassName('tic-diff-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('tic-diff-active', btns[i].getAttribute('data-diff') === level);
    }
    resetGame(); // beim Wechsel frisch starten
}

// --- Minimax (unschlagbar) ------------------------------------------------

function findBestMove() {
    // Prioritaet 1: Kann der Computer gewinnen?
    for (var i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = currentPlayer;
            if (checkWinnerMinimax() === currentPlayer) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Prioritaet 2: Kann der Spieler im naechsten Zug gewinnen? Dann blockieren!
    var opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (var j = 0; j < board.length; j++) {
        if (board[j] === '') {
            board[j] = opponent;
            if (checkWinnerMinimax() === opponent) {
                board[j] = '';
                return j;
            }
            board[j] = '';
        }
    }

    // Prioritaet 3: Sonst Minimax.
    var bestScore = -Infinity;
    var move;
    for (var k = 0; k < board.length; k++) {
        if (board[k] === '') {
            board[k] = currentPlayer;
            var score = minimax(board, 0, false);
            board[k] = '';
            if (score > bestScore) {
                bestScore = score;
                move = k;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    var result = checkWinnerMinimax();
    if (result !== null) {
        return result === 'X' ? 1 : result === 'O' ? -1 : 0;
    }

    if (isMaximizing) {
        var bestScore = -Infinity;
        for (var i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                var score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        var bestScore = Infinity;
        for (var j = 0; j < board.length; j++) {
            if (board[j] === '') {
                board[j] = 'O';
                var score = minimax(board, depth + 1, true);
                board[j] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerMinimax() {
    for (var i = 0; i < winningCombinations.length; i++) {
        var a = winningCombinations[i][0];
        var b = winningCombinations[i][1];
        var c = winningCombinations[i][2];
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'Tie';
}

// --- Zuruecksetzen --------------------------------------------------------

function resetGame() {
    if (computerTimer) { clearTimeout(computerTimer); computerTimer = null; }
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    setLocked(false);

    var cs = cells();
    for (var i = 0; i < cs.length; i++) {
        cs[i].textContent = '';
        cs[i].classList.remove('cell--win', 'placed');
    }

    var info = document.getElementById('ticinfo');
    info.textContent = '';
    info.classList.remove('tic-win', 'tic-lose', 'tic-draw', 'tic-show');

    var svg = document.getElementById('win-line-svg');
    if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
}
