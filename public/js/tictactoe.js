const socket = io();
const gameType = 'tictactoe';
let mySymbol = '';
let myRoomId = '';
let currentTurn = 'X';
let gameActive = false;
let boardState = ['', '', '', '', '', '', '', '', ''];

const joinBtn = document.getElementById('join-btn');
const roomInput = document.getElementById('room-input');
const statusDiv = document.getElementById('status');
const setupArea = document.getElementById('setup-area');
const gameArea = document.getElementById('game-area');
const cells = document.querySelectorAll('.cell');
const playerSymbolSpan = document.getElementById('player-symbol');
const currentTurnSpan = document.getElementById('current-turn');
const resetBtn = document.getElementById('reset-btn');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

joinBtn.addEventListener('click', () => {
    const roomId = roomInput.value.trim();
    if (roomId) {
        socket.emit('join_game', { gameType, roomId });
        statusDiv.innerText = 'Connecting...';
    }
});

socket.on('joined', (data) => {
    mySymbol = data.symbol === 'player1' ? 'X' : 'O';
    myRoomId = data.roomId;
    playerSymbolSpan.innerText = mySymbol;
    statusDiv.innerText = `Joined room ${myRoomId}. Waiting for opponent...`;
});

socket.on('game_start', (data) => {
    setupArea.classList.add('hidden');
    gameArea.classList.remove('hidden');
    gameActive = true;
    currentTurn = 'X';
    updateTurnDisplay();
});

socket.on('error', (msg) => {
    statusDiv.innerText = msg;
    statusDiv.style.color = 'red';
});

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        if (boardState[index] === '' && gameActive && currentTurn === mySymbol) {
            makeMove(index, mySymbol);
            socket.emit('make_move', { roomId: myRoomId, move: index, gameType });
        }
    });
});

socket.on('opponent_move', (index) => {
    const opponentSymbol = mySymbol === 'X' ? 'O' : 'X';
    makeMove(index, opponentSymbol);
});

function makeMove(index, symbol) {
    boardState[index] = symbol;
    cells[index].innerText = symbol;
    cells[index].classList.add(symbol.toLowerCase());
    
    checkWin(symbol);
    
    if (gameActive) {
        currentTurn = currentTurn === 'X' ? 'O' : 'X';
        updateTurnDisplay();
    }
}

function updateTurnDisplay() {
    currentTurnSpan.innerText = currentTurn;
    if (currentTurn === mySymbol) {
        currentTurnSpan.style.color = 'var(--primary)';
    } else {
        currentTurnSpan.style.color = 'var(--secondary)';
    }
}

function checkWin(symbol) {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === symbol && boardState[b] === symbol && boardState[c] === symbol) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        currentTurnSpan.innerText = `${symbol} Wins!`;
        gameActive = false;
        resetBtn.classList.remove('hidden');
        return;
    }

    if (!boardState.includes('')) {
        currentTurnSpan.innerText = `Draw!`;
        gameActive = false;
        resetBtn.classList.remove('hidden');
        return;
    }
}

resetBtn.addEventListener('click', () => {
    socket.emit('reset_game', { roomId: myRoomId, gameType });
});

socket.on('reset_game', () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentTurn = 'X';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.className = 'cell';
    });
    resetBtn.classList.add('hidden');
    updateTurnDisplay();
});
