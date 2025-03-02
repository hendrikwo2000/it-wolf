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
        }, 500);
    }
}

function makeComputerMove() {
    if (!gameOver) {
        let bestMove = findBestMove();
        board[bestMove] = currentPlayer;
        document.getElementsByClassName('cell')[bestMove].textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function findBestMove() {
    // Priorität 1: Kann der Computer gewinnen?
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = currentPlayer;
            if (checkWinnerMinimax() === currentPlayer) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Priorität 2: Kann der Spieler im nächsten Zug gewinnen? Dann blockieren!
    let opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = opponent;
            if (checkWinnerMinimax() === opponent) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Priorität 3: Falls kein Gewinn oder Block notwendig ist → Minimax verwenden
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = currentPlayer;
            let score = minimax(board, 0, false);
            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerMinimax();
    if (result !== null) {
        return result === 'X' ? 1 : result === 'O' ? -1 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin() {
    var winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (var i = 0; i < winningCombinations.length; i++) {
        var [a, b, c] = winningCombinations[i];
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;

           
            setTimeout(function () {
                if (board[a] === "X") {
                    document.getElementById("ticinfo").innerHTML = "Du hast gewonnen";
                } else {
                    document.getElementById("ticinfo").innerHTML = "Du hast verloren";
                }
            }, 500);
            return;
        }
    }

    if (board.every(cell => cell !== '')) {
        gameOver = true;
        setTimeout(function () {
            document.getElementById("ticinfo").innerHTML = "Unentschieden";
        }, 500);
    }
}

function checkWinnerMinimax() {
    var winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (var i = 0; i < winningCombinations.length; i++) {
        var [a, b, c] = winningCombinations[i];
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'Tie';
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
