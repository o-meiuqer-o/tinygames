const socket = io();
const gameType = 'dotsandboxes';
let myPlayer = ''; // 'p1' or 'p2' (in online mode), or local players
let myRoomId = '';
let currentTurn = 'p1';
let gameActive = false;
let gameMode = 'local'; // 'local' or 'online'

let ROWS = 6;
let COLS = 6;
let scores = { p1: 0, p2: 0 };
let lines = {}; // 'x-y-type': player (e.g., '0-0-h': 'p1')
let boxes = {}; // 'r-c': player

const DOM = {
    startScreen: document.getElementById('start-screen'),
    gameContainer: document.getElementById('game-container'),
    createBtn: document.getElementById('create-room-btn'),
    joinBtn: document.getElementById('join-room-btn'),
    localBtn: document.getElementById('local-mode-btn'),
    roomCodeInput: document.getElementById('room-code-input'),
    displayRoomCode: document.getElementById('display-room-code'),
    roomInfo: document.getElementById('room-info'),
    gameArea: document.getElementById('game-area'),
    turnIndicator: document.getElementById('turn-indicator'),
    boardContainer: document.getElementById('dab-board-container'),
    resetBtn: document.getElementById('reset-btn'),
    pauseTopBtn: document.getElementById('pause-top-btn'),
    pauseOverlay: document.getElementById('dab-pause'),
    resumeBtn: document.getElementById('dab-resume'),
    quitBtn: document.getElementById('dab-hub'),
    langEn: document.getElementById('lang-en'),
    langMl: document.getElementById('lang-ml'),
    langEnPause: document.getElementById('lang-en-pause'),
    langMlPause: document.getElementById('lang-ml-pause')
};

// Translations
const translations = {
    en: {
        title: "Dots & Boxes",
        subtitle: "Connect dots to claim boxes",
        gridSizeLabel: "Grid Size (5-10):",
        createRoom: "Create Room",
        joinRoom: "Join Room",
        orLocal: "Or play locally:",
        localMode: "Local 2-Player Mode",
        backHub: "Back to Hub",
        roomCodeTxt: "Room Code:",
        shareText: "Scan to join automatically\nor share with a friend to invite them to play",
        waiting: "Waiting for opponent...",
        paused: "PAUSED",
        resume: "Resume",
        quit: "Quit Game",
        playAgain: "Play Again",
        premise: "Dots and Boxes is a classic strategy game where players take turns drawing horizontal or vertical lines between dots. Completing a 1x1 box earns a point and a free turn.",
        rulesTitle: "Rules:",
        rule1: "On your turn, click a gray line between two adjacent dots to color it.",
        rule2: "If you complete a square box, you claim that box (colored with your color) and score 1 point.",
        rule3: "When you complete a box, you get another turn immediately.",
        rule4: "The game ends when all lines are drawn. The player with the most boxes wins.",
        scoreP1: "P1: ",
        scoreP2: "P2: ",
        turnP1: "Turn: P1",
        turnP2: "Turn: P2",
        winP1: "P1 WINS!",
        winP2: "P2 WINS!",
        draw: "DRAW!",
        connecting: "Connecting...",
        yourTurn: "Your Turn",
        opponentTurn: "Opponent's Turn",
        invalidCode: "Enter a valid room code."
    },
    ml: {
        title: "ഡോട്ട്സും ബോക്സും",
        subtitle: "ബിന്ദുക്കൾ യോജിപ്പിച്ചു കളങ്ങൾ സ്വന്തമാക്കുക",
        gridSizeLabel: "ഗ്രിഡ് വലുപ്പം (5-10):",
        createRoom: "റൂം ഉണ്ടാക്കുക",
        joinRoom: "റൂമിൽ ചേരുക",
        orLocal: "അല്ലെങ്കിൽ ഒരുമിച്ച് കളിക്കുക:",
        localMode: "രണ്ടുപേർക്കുള്ള കളി",
        backHub: "തിരികെ പോകുക",
        roomCodeTxt: "റൂം കോഡ്:",
        shareText: "കളിക്കാൻ കൂട്ടുകാരനെ ക്ഷണിക്കാൻ ഈ QR കോഡ് പങ്കുവെക്കുക",
        waiting: "കൂട്ടുകാരനായി കാത്തിരിക്കുന്നു...",
        paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
        resume: "തുടരുക",
        quit: "കളി നിർത്തുക",
        playAgain: "വീണ്ടും കളിക്കുക",
        premise: "ബിന്ദുക്കളെ തമ്മിൽ വരകൾ വഴി ബന്ധിപ്പിച്ചു പരമാവധി കളങ്ങൾ വരച്ചുണ്ടാക്കുന്ന ഒരു ലളിതമായ തന്ത്രപ്രധാന കളിയാണ് ഡോട്ട്സും ബോക്സും. ഒരു കളം പൂർത്തിയാക്കുന്നയാൾക്ക് 1 പോയിന്റും അതോടൊപ്പം ഒരു ഊഴം കൂടി അധികമായി ലഭിക്കും.",
        rulesTitle: "നിയമങ്ങൾ:",
        rule1: "നിങ്ങളുടെ ഊഴത്തിൽ, തൊട്ടടുത്തുള്ള രണ്ട് ബിന്ദുക്കൾക്കിടയിലുള്ള ഒരു വരയിൽ ക്ലിക്ക് ചെയ്തു നിറം നൽകുക.",
        rule2: "ഒരു ചതുര കളം പൂർത്തിയാക്കിയാൽ കളം നിങ്ങൾക്ക് ലഭിക്കുകയും 1 പോയിന്റ് നേടുകയും ചെയ്യും.",
        rule3: "ഒരു കളം പൂർത്തിയാക്കുമ്പോൾ നിങ്ങൾക്ക് ഉടൻ തന്നെ അടുത്ത ഒരു ഊഴം കൂടി ലഭിക്കും.",
        rule4: "എല്ലാ വരകളും വരച്ചു കഴിയുമ്പോൾ കളി അവസാനിക്കും. ഏറ്റവും കൂടുതൽ കളങ്ങൾ നേടിയയാൾ വിജയിക്കും.",
        scoreP1: "കളിക്കാരൻ 1: ",
        scoreP2: "കളിക്കാരൻ 2: ",
        turnP1: "ഊഴം: കളിക്കാരൻ 1",
        turnP2: "ഊഴം: കളിക്കാരൻ 2",
        winP1: "കളിക്കാരൻ 1 വിജയിച്ചു!",
        winP2: "കളിക്കാരൻ 2 വിജയിച്ചു!",
        draw: "സമനില!",
        connecting: "ബന്ധിപ്പിക്കുന്നു...",
        yourTurn: "നിങ്ങളുടെ ഊഴം",
        opponentTurn: "എതിരാളിയുടെ ഊഴം",
        invalidCode: "ശരിയായ റൂം കോഡ് നൽകുക."
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    if (lang === 'en') {
        DOM.langEn.classList.add('active');
        DOM.langMl.classList.remove('active');
        DOM.langEnPause.classList.add('active');
        DOM.langMlPause.classList.remove('active');
    } else {
        DOM.langMl.classList.add('active');
        DOM.langEn.classList.remove('active');
        DOM.langMlPause.classList.add('active');
        DOM.langEnPause.classList.remove('active');
    }
    updateUI();
}

[DOM.langEn, DOM.langEnPause].forEach(btn => btn.addEventListener('click', () => setLanguage('en')));
[DOM.langMl, DOM.langMlPause].forEach(btn => btn.addEventListener('click', () => setLanguage('ml')));

// Set initial language
setLanguage('en');

// --- Fullscreen & Orientation ---
async function requestGameFullscreen() {
    try {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
        }
    } catch (err) {
        console.warn("Fullscreen failed:", err);
    }

    try {
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('portrait');
        }
    } catch (err) {
        console.warn("Orientation lock failed:", err);
    }
}

function exitGameFullscreen() {
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } catch (err) {
        console.warn("Exit Fullscreen failed:", err);
    }
}

// --- Pause Menu ---
DOM.pauseTopBtn.addEventListener('click', () => {
    DOM.pauseOverlay.classList.remove('hidden');
});
DOM.resumeBtn.addEventListener('click', () => {
    DOM.pauseOverlay.classList.add('hidden');
});
DOM.quitBtn.addEventListener('click', () => {
    DOM.pauseOverlay.classList.add('hidden');
    DOM.gameContainer.classList.add('hidden');
    DOM.startScreen.classList.remove('hidden');
    exitGameFullscreen();
    if (gameMode === 'online') {
        location.reload();
    }
});

function startGameUI() {
    DOM.startScreen.classList.add('hidden');
    DOM.gameContainer.classList.remove('hidden');
    requestGameFullscreen();
}

DOM.createBtn.addEventListener('click', () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    let gridSizeInput = document.getElementById('grid-size').value;
    let gridSize = parseInt(gridSizeInput) || 6;
    if (gridSize < 5) gridSize = 5;
    if (gridSize > 10) gridSize = 10;

    gameMode = 'online';
    socket.emit('join_game', { gameType, roomId: code, gridSize });
    startGameUI();
});

DOM.joinBtn.addEventListener('click', () => {
    const code = DOM.roomCodeInput.value.trim().toUpperCase();
    let gridSizeInput = document.getElementById('grid-size').value;
    let gridSize = parseInt(gridSizeInput) || 6;
    if (gridSize < 5) gridSize = 5;
    if (gridSize > 10) gridSize = 10;

    if (code.length >= 4) {
        myRoomId = code;
        gameMode = 'online';
        socket.emit('join_game', { gameType, roomId: code, gridSize });
        startGameUI();
    } else {
        alert(translations[currentLang]['invalidCode']);
    }
});

DOM.localBtn.addEventListener('click', () => {
    let gridSizeInput = document.getElementById('grid-size').value;
    let gridSize = parseInt(gridSizeInput) || 6;
    if (gridSize < 5) gridSize = 5;
    if (gridSize > 10) gridSize = 10;

    ROWS = gridSize;
    COLS = gridSize;
    gameMode = 'local';
    
    startGameUI();
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.classList.remove('hidden');
    
    scores = { p1: 0, p2: 0 };
    lines = {};
    boxes = {};
    gameActive = true;
    currentTurn = 'p1';
    DOM.resetBtn.classList.add('hidden');
    initBoard();
    updateUI();
});

// Auto-join from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const autoRoom = urlParams.get('room');
if (autoRoom) {
    gameMode = 'online';
    socket.emit('join_game', { gameType, roomId: autoRoom.toUpperCase(), gridSize: 6 });
    startGameUI();
}

socket.on('joined', (data) => {
    myPlayer = data.symbol === 'player1' ? 'p1' : 'p2';
    myRoomId = data.roomId;
    
    DOM.roomInfo.classList.remove('hidden');
    DOM.displayRoomCode.textContent = myRoomId;
    
    // Generate QR
    document.getElementById("qrcode").innerHTML = "";
    const joinUrl = window.location.origin + window.location.pathname + '?room=' + myRoomId;
    new QRCode(document.getElementById("qrcode"), {
        text: joinUrl,
        width: 150,
        height: 150,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    });
});

socket.on('game_start', (data) => {
    if (data && data.gridSize) {
        ROWS = data.gridSize;
        COLS = data.gridSize;
    }
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.classList.remove('hidden');
    initBoard();
    gameActive = true;
    currentTurn = 'p1';
    scores = { p1: 0, p2: 0 };
    lines = {};
    boxes = {};
    updateUI();
});

socket.on('error', (msg) => {
    alert(msg);
    if (msg === 'Opponent disconnected.') {
        location.reload();
    }
});

function initBoard() {
    DOM.boardContainer.innerHTML = '';
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
        DOM.boardContainer.appendChild(dotRow);
        
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
            DOM.boardContainer.appendChild(boxRow);
        }
    }
}

function handleLineClick(r, c, type) {
    const lineId = `${type}-${r}-${c}`;
    if (!gameActive || lines[lineId]) return;
    
    if (gameMode === 'online') {
        if (currentTurn !== myPlayer) return;
        makeMove(lineId, myPlayer);
        socket.emit('make_move', { roomId: myRoomId, move: lineId, gameType });
    } else {
        makeMove(lineId, currentTurn);
    }
}

socket.on('opponent_move', (lineId) => {
    const opponent = myPlayer === 'p1' ? 'p2' : 'p1';
    makeMove(lineId, opponent);
});

function makeMove(lineId, player) {
    lines[lineId] = player;
    const el = document.getElementById(lineId);
    if (el) { el.classList.add(`line-active-${player}`); }
    if (typeof Sounds !== 'undefined') Sounds.play('drawLine');

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
        if (boxEl) {
            boxEl.innerText = player === 'p1' ? 'P1' : 'P2';
            boxEl.classList.add(player);
        }
        if (typeof Sounds !== 'undefined') Sounds.play('claimBox');
        return true;
    }
    return false;
}

function updateUI() {
    if (!DOM.turnIndicator) return;
    document.getElementById('score-p1-disp').innerText = `${translations[currentLang]['scoreP1']}${scores.p1}`;
    document.getElementById('score-p2-disp').innerText = `${translations[currentLang]['scoreP2']}${scores.p2}`;
    
    if (gameActive) {
        let turnText = translations[currentLang][`turn${currentTurn.toUpperCase()}`];
        if (gameMode === 'online') {
            const isMyTurn = (currentTurn === myPlayer);
            const playerLabel = isMyTurn ? translations[currentLang]['yourTurn'] : translations[currentLang]['opponentTurn'];
            turnText = `${currentTurn.toUpperCase()} (${playerLabel})`;
        }
        DOM.turnIndicator.innerText = turnText;
        DOM.turnIndicator.style.color = currentTurn === 'p1' ? 'var(--primary)' : 'var(--secondary)';
    }
}

function checkGameOver() {
    if (Object.keys(boxes).length === ROWS * COLS) {
        gameActive = false;
        if (scores.p1 > scores.p2) {
            DOM.turnIndicator.innerText = translations[currentLang]['winP1'];
            DOM.turnIndicator.style.color = 'var(--primary)';
            if (typeof Sounds !== 'undefined') Sounds.play(gameMode === 'online' ? (myPlayer === 'p1' ? 'win' : 'lose') : 'win');
        } else if (scores.p2 > scores.p1) {
            DOM.turnIndicator.innerText = translations[currentLang]['winP2'];
            DOM.turnIndicator.style.color = 'var(--secondary)';
            if (typeof Sounds !== 'undefined') Sounds.play(gameMode === 'online' ? (myPlayer === 'p2' ? 'win' : 'lose') : 'win');
        } else {
            DOM.turnIndicator.innerText = translations[currentLang]['draw'];
            DOM.turnIndicator.style.color = 'white';
            if (typeof Sounds !== 'undefined') Sounds.play('lose');
        }
        DOM.resetBtn.classList.remove('hidden');
    }
}

DOM.resetBtn.addEventListener('click', () => {
    if (gameMode === 'online') {
        socket.emit('reset_game', { roomId: myRoomId, gameType });
    } else {
        scores = { p1: 0, p2: 0 };
        lines = {};
        boxes = {};
        gameActive = true;
        currentTurn = 'p1';
        DOM.resetBtn.classList.add('hidden');
        initBoard();
        updateUI();
    }
});

socket.on('reset_game', () => {
    scores = { p1: 0, p2: 0 };
    lines = {};
    boxes = {};
    gameActive = true;
    currentTurn = 'p1';
    DOM.resetBtn.classList.add('hidden');
    initBoard();
    updateUI();
});

