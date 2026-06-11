// pallanguzhi.js
const socket = io();
let roomId = null;
let mySymbol = null;
let currentPlayer = 'player1'; // player1 goes first
let isMyTurn = false;
let gameMode = 'local'; // 'local' or 'online'
let isAnimating = false;

// Game State
let board = Array(14).fill(5);
let stores = { player1: 39, player2: 39 };

const DOM = {
    createBtn: document.getElementById('create-room-btn'),
    joinBtn: document.getElementById('join-room-btn'),
    localBtn: document.getElementById('local-mode-btn'),
    roomCodeInput: document.getElementById('room-code-input'),
    roomControls: document.getElementById('room-controls'),
    gameArea: document.getElementById('game-area'),
    roomInfo: document.getElementById('room-info'),
    displayRoomCode: document.getElementById('display-room-code'),
    status: document.getElementById('status'),
    waitingMsg: document.getElementById('waiting-msg'),
    pits: document.querySelectorAll('.pit'),
    store1Val: document.getElementById('store1-val'),
    store2Val: document.getElementById('store2-val'),
    p1Info: document.getElementById('player1-info'),
    p2Info: document.getElementById('player2-info'),
    resetBtn: document.getElementById('reset-btn')
};

function updateBoardUI() {
    DOM.pits.forEach(pit => {
        const idx = parseInt(pit.dataset.index);
        pit.querySelector('.pit-value').textContent = board[idx];
        
        pit.classList.remove('active-turn', 'disabled');
        if (!isAnimating) {
            if (gameMode === 'online') {
                if (mySymbol === currentPlayer) {
                    if ((mySymbol === 'player1' && idx >= 0 && idx <= 6) || 
                        (mySymbol === 'player2' && idx >= 7 && idx <= 13)) {
                        if (board[idx] > 0) pit.classList.add('active-turn');
                        else pit.classList.add('disabled');
                    } else {
                        pit.classList.add('disabled');
                    }
                } else {
                    pit.classList.add('disabled');
                }
            } else { // Local
                if ((currentPlayer === 'player1' && idx >= 0 && idx <= 6) ||
                    (currentPlayer === 'player2' && idx >= 7 && idx <= 13)) {
                    if (board[idx] > 0) pit.classList.add('active-turn');
                    else pit.classList.add('disabled');
                } else {
                    pit.classList.add('disabled');
                }
            }
        } else {
            pit.classList.add('disabled');
        }
    });

    DOM.store1Val.textContent = stores.player1;
    DOM.store2Val.textContent = stores.player2;
    document.getElementById('p1-store-count').textContent = `Store: ${stores.player1}`;
    document.getElementById('p2-store-count').textContent = `Store: ${stores.player2}`;

    if (currentPlayer === 'player1') {
        DOM.p1Info.classList.add('active');
        DOM.p2Info.classList.remove('active');
        DOM.status.textContent = gameMode === 'online' ? (mySymbol === 'player1' ? "Your Turn" : "Opponent's Turn") : "Player 1's Turn (Bottom)";
    } else {
        DOM.p2Info.classList.add('active');
        DOM.p1Info.classList.remove('active');
        DOM.status.textContent = gameMode === 'online' ? (mySymbol === 'player2' ? "Your Turn" : "Opponent's Turn") : "Player 2's Turn (Top)";
    }
}

function checkWinCondition() {
    let p1HasSeeds = false;
    for (let i = 0; i <= 6; i++) {
        if (board[i] > 0) p1HasSeeds = true;
    }
    
    let p2HasSeeds = false;
    for (let i = 7; i <= 13; i++) {
        if (board[i] > 0) p2HasSeeds = true;
    }

    if (!p1HasSeeds || !p2HasSeeds) {
        // Game Over
        let winner = null;
        if (stores.player1 > stores.player2) {
            DOM.status.textContent = "Player 1 Wins!";
            winner = 'player1';
        } else if (stores.player2 > stores.player1) {
            DOM.status.textContent = "Player 2 Wins!";
            winner = 'player2';
        } else {
            DOM.status.textContent = "It's a Tie!";
        }
        
        DOM.resetBtn.classList.remove('hidden');
        
        if (winner === 'player1') {
            document.getElementById('row1').classList.add('winner');
            document.getElementById('store1').classList.add('winner');
            document.getElementById('row2').classList.add('loser');
            document.getElementById('store2').classList.add('loser');
        } else if (winner === 'player2') {
            document.getElementById('row2').classList.add('winner');
            document.getElementById('store2').classList.add('winner');
            document.getElementById('row1').classList.add('loser');
            document.getElementById('store1').classList.add('loser');
        }

        if (typeof Sounds !== 'undefined') {
            if (winner) Sounds.play('happyWin');
            else Sounds.play('win');
        }
        return true;
    }
    return false;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function executeMove(startIndex) {
    if (board[startIndex] === 0) return;
    
    isAnimating = true;
    updateBoardUI();

    let currentIndex = startIndex;
    let hand = board[currentIndex];
    board[currentIndex] = 0;
    
    const pitEl = document.querySelector(`.pit[data-index="${currentIndex}"]`);
    pitEl.classList.add('highlight');
    if (typeof Sounds !== 'undefined') Sounds.play('click');
    await delay(300);
    pitEl.classList.remove('highlight');

    while (hand > 0) {
        // Distribute seeds
        while (hand > 0) {
            currentIndex = (currentIndex + 1) % 14;
            board[currentIndex]++;
            hand--;
            
            const pEl = document.querySelector(`.pit[data-index="${currentIndex}"]`);
            pEl.classList.add('highlight');
            if (typeof Sounds !== 'undefined') Sounds.play('seedDrop');
            updateBoardUI();
            await delay(400);
            pEl.classList.remove('highlight');
        }

        // Check if the next pit has seeds to continue
        const nextIndex = (currentIndex + 1) % 14;
        
        if (board[nextIndex] > 0) {
            // Pick up and continue
            hand = board[nextIndex];
            board[nextIndex] = 0;
            currentIndex = nextIndex; // Fix: Move currentIndex forward so we don't drop a seed back into the pit we just emptied
            
            const npEl = document.querySelector(`.pit[data-index="${nextIndex}"]`);
            npEl.classList.add('highlight');
            if (typeof Sounds !== 'undefined') Sounds.play('click');
            updateBoardUI();
            await delay(400);
            npEl.classList.remove('highlight');
        } else {
            // Next pit is empty, so capture the pit after that
            const captureIndex = (nextIndex + 1) % 14;
            if (board[captureIndex] > 0) {
                const capturedAmount = board[captureIndex];
                board[captureIndex] = 0;
                stores[currentPlayer] += capturedAmount;
                
                const cEl = document.querySelector(`.pit[data-index="${captureIndex}"]`);
                cEl.classList.add('highlight');
                if (typeof Sounds !== 'undefined') Sounds.play('capture');
                
                const sEl = currentPlayer === 'player1' ? document.getElementById('store1') : document.getElementById('store2');
                sEl.classList.add('highlight');
                
                updateBoardUI();
                await delay(600);
                cEl.classList.remove('highlight');
                sEl.classList.remove('highlight');
            }
            break; // Turn ends
        }
    }

    // Switch turns
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    isMyTurn = gameMode === 'online' ? (mySymbol === currentPlayer) : true;
    isAnimating = false;
    
    if (!checkWinCondition()) {
        updateBoardUI();
    }
}

// Interaction
DOM.pits.forEach(pit => {
    pit.addEventListener('click', () => {
        if (isAnimating) return;
        const idx = parseInt(pit.dataset.index);
        
        if (gameMode === 'online') {
            if (!isMyTurn || mySymbol !== currentPlayer) return;
            if (mySymbol === 'player1' && (idx < 0 || idx > 6)) return;
            if (mySymbol === 'player2' && (idx < 7 || idx > 13)) return;
            if (board[idx] === 0) return;
            
            socket.emit('make_move', { roomId, move: idx, gameType: 'pallanguzhi' });
            executeMove(idx);
        } else {
            // Local mode
            if (currentPlayer === 'player1' && (idx < 0 || idx > 6)) return;
            if (currentPlayer === 'player2' && (idx < 7 || idx > 13)) return;
            if (board[idx] === 0) return;
            
            executeMove(idx);
        }
    });
});

DOM.resetBtn.addEventListener('click', () => {
    if (gameMode === 'online') {
        socket.emit('reset_game', { roomId, gameType: 'pallanguzhi' });
    } else {
        resetGame();
    }
});

function resetGame() {
    board = Array(14).fill(5);
    stores = { player1: 39, player2: 39 };
    currentPlayer = 'player1';
    isAnimating = false;
    DOM.resetBtn.classList.add('hidden');
    
    ['row1', 'row2', 'store1', 'store2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('winner', 'loser');
    });

    if (gameMode === 'online') {
        isMyTurn = (mySymbol === 'player1');
        DOM.status.textContent = isMyTurn ? "Your Turn" : "Opponent's Turn";
    } else {
        DOM.status.textContent = "Player 1's Turn";
    }
    updateBoardUI();
}

// --- Multiplayer logic ---

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

DOM.createBtn.addEventListener('click', () => {
    roomId = generateRoomId();
    gameMode = 'online';
    socket.emit('join_game', { gameType: 'pallanguzhi', roomId });
});

DOM.joinBtn.addEventListener('click', () => {
    const code = DOM.roomCodeInput.value.trim().toUpperCase();
    if (code.length === 6) {
        roomId = code;
        gameMode = 'online';
        socket.emit('join_game', { gameType: 'pallanguzhi', roomId });
    } else {
        alert("Enter a valid 6-character room code.");
    }
});

DOM.localBtn.addEventListener('click', () => {
    gameMode = 'local';
    DOM.roomControls.classList.add('hidden');
    DOM.gameArea.classList.remove('hidden');
    resetGame();
});

socket.on('joined', (data) => {
    mySymbol = data.symbol;
    roomId = data.roomId;
    
    DOM.roomControls.classList.add('hidden');
    DOM.roomInfo.classList.remove('hidden');
    DOM.displayRoomCode.textContent = roomId;
    DOM.status.textContent = `You are ${mySymbol === 'player1' ? 'Player 1 (Bottom)' : 'Player 2 (Top)'}`;
    
    isMyTurn = (mySymbol === 'player1');
});

socket.on('game_start', () => {
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.classList.remove('hidden');
    resetGame();
});

socket.on('opponent_move', (moveIndex) => {
    executeMove(moveIndex);
});

socket.on('reset_game', () => {
    resetGame();
});

socket.on('error', (msg) => {
    alert(msg);
    if (msg === 'Opponent disconnected.') {
        location.reload();
    }
});
