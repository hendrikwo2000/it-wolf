var board = ['', '', '', '', '', '', '', '', ''];
var currentPlayer = 'X';
var gameOver = false;

function makeMove(index) {
    if (!gameOver && board[index] === '') {
        board[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        setTimeout(function () {
            makeComputerMove();
        }, 500); // Verzögerung von 500 Millisekunden
    }
}

function makeComputerMove() {
    if (!gameOver) {
        var emptyCells = [];
        for (var i = 0; i < board.length; i++) {
            if (board[i] === '') {
                emptyCells.push(i);
            }
        }
        var randomIndex = Math.floor(Math.random() * emptyCells.length);
        var computerMove = emptyCells[randomIndex];
        board[computerMove] = currentPlayer;
        document.getElementsByClassName('cell')[computerMove].textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin() {
    var winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Reihen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Reihen
        [0, 4, 8], [2, 4, 6] // Diagonale Reihen
    ];

    for (var i = 0; i < winningCombinations.length; i++) {
        var [a, b, c] = winningCombinations[i];
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            setTimeout(function () {

                const huren = board[a];

                if (huren == "X"){
                   document.getElementById("ticinfo").innerHTML = "Du hast gewonnen";
                }
                if (huren == "O") {
                    document.getElementById("ticinfo").innerHTML = "Du hast verloren";
                }

              
               
            }, 500); // Verzögerung von 500 Millisekunden
            return;
        }
    }

    if (board.every(cell => cell !== '')) {
        gameOver = true;
        setTimeout(function () {
            document.getElementById("ticinfo").innerHTML = "Unentschieden";
        }, 500); // Verzögerung von 500 Millisekunden
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    var cells = document.getElementsByClassName('cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
    }
    document.getElementById("ticinfo").innerHTML = "";
}