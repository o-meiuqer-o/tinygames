const socket = io();
const gameType = 'dotsandboxes';
let myPlayer = ''; // 'p1' or 'p2'
let myRoomId = '';
let currentTurn = 'p1';
let gameActive = false;

let ROWS = 6;
let COLS = 6;
let scores = { p1: 0, p2: 0 };
let lines = {}; // 'x-y-type': player (e.g., '0-0-h': 'p1')
let boxes = {}; // 'r-c': player

const joinBtn = document.getElementById('join-btn');
const roomInput = document.getElementById('room-input');
const statusDiv = document.getElementById('status');
const setupArea = document.getElementById('setup-area');
const gameArea = document.getElementById('game-area');
const turnIndicator = document.getElementById('turn-indicator');
const boardContainer = document.getElementById('dab-board-container');
const resetBtn = document.getElementById('reset-btn');
const pauseOverlay = document.getElementById('dab-pause');
const pauseTopBtn = document.getElementById('pause-top-btn');

// ── Pause Menu ────────────────────────────────────────────────
pauseTopBtn.addEventListener('click', () => { pauseOverlay.style.display = 'flex'; });
document.getElementById('dab-resume').addEventListener('click', () => { pauseOverlay.style.display = 'none'; });
document.getElementById('dab-hub').addEventListener('click', () => { location.href = 'index.html'; });

// ── PWA install in pause menu ─────────────────────────────────
const dabInstallBtn = document.getElementById('dab-install');
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    dabInstallBtn.style.display = 'block';
});
dabInstallBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') dabInstallBtn.style.display = 'none';
    deferredInstallPrompt = null;
});

joinBtn.addEventListener('click', () => {
    const roomId = roomInput.value.trim().toUpperCase();
    let gridSizeInput = document.getElementById('grid-size').value;
    let gridSize = parseInt(gridSizeInput) || 6;
    if (gridSize < 6) gridSize = 6;
    if (gridSize > 12) gridSize = 12;

    if (roomId.length >= 4) {
        socket.emit('join_game', { gameType, roomId, gridSize });
        document.getElementById('setup-buttons').classList.add('hidden');
        statusDiv.innerText = 'Connecting...';
    } else {
        statusDiv.innerText = 'Room code must be at least 4 characters';
        statusDiv.style.color = 'red';
    }
});

const createRoomBtn = document.getElementById('create-room-btn');
if (createRoomBtn) {
    createRoomBtn.addEventListener('click', () => {
        let gridSizeInput = document.getElementById('grid-size').value;
        let gridSize = parseInt(gridSizeInput) || 6;
        if (gridSize < 6) gridSize = 6;
        if (gridSize > 12) gridSize = 12;

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        socket.emit('join_game', { gameType, roomId: code, gridSize });
        document.getElementById('setup-buttons').classList.add('hidden');
        document.getElementById('qr-container').classList.remove('hidden');
        document.getElementById('room-code-display').innerText = code;
        
        const joinUrl = window.location.origin + window.location.pathname + '?room=' + code;
        new QRCode(document.getElementById("qrcode"), {
            text: joinUrl,
            width: 150,
            height: 150,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.L
        });
    });
}

// Auto-join from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const autoRoom = urlParams.get('room');
if (autoRoom) {
    roomInput.value = autoRoom.toUpperCase();
    document.getElementById('setup-buttons').classList.add('hidden');
    socket.emit('join_game', { gameType, roomId: autoRoom.toUpperCase(), gridSize: 6 });
    statusDiv.innerText = 'Connecting via QR...';
}

socket.on('joined', (data) => {
    myPlayer = data.symbol === 'player1' ? 'p1' : 'p2';
    myRoomId = data.roomId;
    statusDiv.innerText = `Joined room ${myRoomId} as ${myPlayer.toUpperCase()}. Waiting for opponent...`;
});

socket.on('game_start', (data) => {
    if (data && data.gridSize) {
        ROWS = data.gridSize;
        COLS = data.gridSize;
    }
    setupArea.classList.add('hidden');
    gameArea.classList.remove('hidden');
    initBoard();
    gameActive = true;
    currentTurn = 'p1';
    updateUI();
});

socket.on('error', (msg) => {
    statusDiv.innerText = msg;
    statusDiv.style.color = 'red';
});

function initBoard() {
    boardContainer.innerHTML = '';
    // Generate rows of dots and horizontal lines
    for (let r = 0; r <= ROWS; r++) {
        // Dot + HLine Row
        const dotRow = document.createElement('div');
        dotRow.className = 'dab-row';
        for (let c = 0; c <= COLS; c++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dotRow.appendChild(dot);
            
            if (c < COLS) {
                const hLine = document.createElement('div');
                hLine.className = 'line-h';
                hLine.id = `h-${r}-${c}`;
                hLine.addEventListener('click', () => handleLineClick(r, c, 'h'));
                dotRow.appendChild(hLine);
            }
        }
        boardContainer.appendChild(dotRow);
        
        // VLine + Box Row
        if (r < ROWS) {
            const boxRow = document.createElement('div');
            boxRow.className = 'dab-row';
            for (let c = 0; c <= COLS; c++) {
                const vLine = document.createElement('div');
                vLine.className = 'line-v';
                vLine.id = `v-${r}-${c}`;
                vLine.addEventListener('click', () => handleLineClick(r, c, 'v'));
                boxRow.appendChild(vLine);
                
                if (c < COLS) {
                    const box = document.createElement('div');
                    box.className = 'box';
                    box.id = `b-${r}-${c}`;
                    boxRow.appendChild(box);
                }
            }
            boardContainer.appendChild(boxRow);
        }
    }
}

function handleLineClick(r, c, type) {
    const lineId = `${type}-${r}-${c}`;
    if (!gameActive || currentTurn !== myPlayer || lines[lineId]) return;
    
    makeMove(lineId, myPlayer);
    socket.emit('make_move', { roomId: myRoomId, move: lineId, gameType });
}

socket.on('opponent_move', (lineId) => {
    const opponent = myPlayer === 'p1' ? 'p2' : 'p1';
    makeMove(lineId, opponent);
});

function makeMove(lineId, player) {
    lines[lineId] = player;
    const el = document.getElementById(lineId);
    if(el) { el.classList.add(`line-active-${player}`); }
    Sounds.play('drawLine');

    const [type, rStr, cStr] = lineId.split('-');
    const r = parseInt(rStr);
    const c = parseInt(cStr);
    let boxFormed = false;

    if (type === 'h') {
        if (r > 0 && checkBox(r - 1, c, player)) boxFormed = true;
        if (r < ROWS && checkBox(r, c, player)) boxFormed = true;
    } else {
        if (c > 0 && checkBox(r, c - 1, player)) boxFormed = true;
        if (c < COLS && checkBox(r, c, player)) boxFormed = true;
    }

    if (!boxFormed) {
        currentTurn = currentTurn === 'p1' ? 'p2' : 'p1';
    }

    checkGameOver();
    updateUI();
}

function checkBox(r, c, player) {
    if (boxes[`${r}-${c}`]) return false;
    const top = lines[`h-${r}-${c}`];
    const bottom = lines[`h-${r+1}-${c}`];
    const left = lines[`v-${r}-${c}`];
    const right = lines[`v-${r}-${c+1}`];
    if (top && bottom && left && right) {
        boxes[`${r}-${c}`] = player;
        scores[player]++;
        const boxEl = document.getElementById(`b-${r}-${c}`);
        if(boxEl) {
            boxEl.innerText = player === 'p1' ? 'P1' : 'P2';
            boxEl.classList.add(player);
        }
        Sounds.play('claimBox');
        return true;
    }
    return false;
}

function updateUI() {
    document.getElementById('score-p1-disp').innerText = `P1: ${scores.p1}`;
    document.getElementById('score-p2-disp').innerText = `P2: ${scores.p2}`;
    
    if (gameActive) {
        turnIndicator.innerText = `Turn: ${currentTurn.toUpperCase()}`;
        turnIndicator.style.color = currentTurn === 'p1' ? 'var(--primary)' : 'var(--secondary)';
    }
}

function checkGameOver() {
    if (Object.keys(boxes).length === ROWS * COLS) {
        gameActive = false;
        if (scores.p1 > scores.p2) {
            turnIndicator.innerText = 'P1 WINS!';
            turnIndicator.style.color = 'var(--primary)';
            Sounds.play(myPlayer === 'p1' ? 'win' : 'lose');
        } else if (scores.p2 > scores.p1) {
            turnIndicator.innerText = 'P2 WINS!';
            turnIndicator.style.color = 'var(--secondary)';
            Sounds.play(myPlayer === 'p2' ? 'win' : 'lose');
        } else {
            turnIndicator.innerText = 'DRAW!';
            turnIndicator.style.color = 'white';
            Sounds.play('lose');
        }
        resetBtn.classList.remove('hidden');
    }
}

resetBtn.addEventListener('click', () => {
    socket.emit('reset_game', { roomId: myRoomId, gameType });
});

socket.on('reset_game', () => {
    scores = { p1: 0, p2: 0 };
    lines = {};
    boxes = {};
    gameActive = true;
    currentTurn = 'p1';
    resetBtn.classList.add('hidden');
    initBoard();
    updateUI();
});
