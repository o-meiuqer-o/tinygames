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
    startScreen: document.getElementById('start-screen'),
    gameContainer: document.getElementById('game-container'),
    createBtn: document.getElementById('create-room-btn'),
    joinBtn: document.getElementById('join-room-btn'),
    localBtn: document.getElementById('local-mode-btn'),
    roomCodeInput: document.getElementById('room-code-input'),
    gameArea: document.getElementById('game-area'),
    roomInfo: document.getElementById('room-info'),
    displayRoomCode: document.getElementById('display-room-code'),
    status: document.getElementById('status'),
    pits: document.querySelectorAll('.pit'),
    store1Val: document.getElementById('store1-val'),
    store2Val: document.getElementById('store2-val'),
    p1Info: document.getElementById('player1-info'),
    p2Info: document.getElementById('player2-info'),
    resetBtn: document.getElementById('reset-btn'),
    
    pauseTopBtn: document.getElementById('pause-top-btn'),
    pauseOverlay: document.getElementById('pause-overlay'),
    resumeBtn: document.getElementById('resume-btn'),
    quitBtn: document.getElementById('quit-btn'),
    
    langEn: document.getElementById('lang-en'),
    langMl: document.getElementById('lang-ml'),
    langEnPause: document.getElementById('lang-en-pause'),
    langMlPause: document.getElementById('lang-ml-pause')
};

// --- i18n Localization ---
const translations = {
    en: {
        rotateMsg: "Please rotate your device to Landscape mode to play Pallanguzhi.",
        title: "Pallanguzhi",
        subtitle: "Traditional pit-and-pebble game.",
        premise: "Pallanguzhi is an ancient traditional board game of quick counting and strategy from South India. The board consists of 14 small pits (7 for each player) and 2 large stores. At the start, each pit holds 5 seeds. On your turn, you scoop up all the seeds from one of your pits and drop them one-by-one into consecutive pits. The goal is to out-calculate your opponent and capture the most seeds into your store!",
        rulesTitle: "Rules:",
        rule1: "Distribute your seeds counter-clockwise.",
        rule2: "If the NEXT pit has seeds, pick them up and continue.",
        rule3: "If the NEXT pit is empty, your turn ends.",
        rule4: "Capture seeds from the pit AFTER the empty one.",
        rule5: "The player with the most seeds in their store wins.",
        createRoom: "Create Room",
        joinRoom: "Join Room",
        orLocal: "Or play locally:",
        localMode: "Local 2-Player Mode",
        backHub: "Back to Hub",
        connecting: "Connecting...",
        roomCodeTxt: "Room Code:",
        waiting: "Waiting for opponent...",
        opponentTop: "Opponent (Top)",
        youBottom: "You (Bottom)",
        storeLabel: "Store:",
        playAgain: "Play Again",
        paused: "PAUSED",
        resume: "Resume",
        quit: "Quit Game",
        player1Wins: "Player 1 Wins!",
        player2Wins: "Player 2 Wins!",
        tie: "It's a Tie!",
        yourTurn: "Your Turn",
        opponentTurn: "Opponent's Turn",
        p1Turn: "Player 1's Turn (Bottom)",
        p2Turn: "Player 2's Turn (Top)"
    },
    ml: {
        rotateMsg: "പല്ലങ്കുഴി കളിക്കാൻ നിങ്ങളുടെ ഉപകരണം ലാൻഡ്‌സ്‌കേപ്പിലേക്ക് തിരിക്കുക.",
        title: "പല്ലങ്കുഴി",
        subtitle: "പരമ്പരാഗത ബോർഡ് ഗെയിം.",
        premise: "പല്ലങ്കുഴി ദക്ഷിണേന്ത്യയിലെ ഒരു പരമ്പരാഗത ബോർഡ് ഗെയിമാണ്. ബോർഡിൽ 14 ചെറിയ കുഴികളും (ഓരോ കളിക്കാരനും 7 എണ്ണം) 2 വലിയ ശേഖരണ കുഴികളും ഉണ്ട്. തുടക്കത്തിൽ എല്ലാ കുഴികളിലും 5 കുരുക്കൾ വീതം ഉണ്ടാകും. നിങ്ങളുടെ ഊഴത്തിൽ, സ്വന്തം ഭാഗത്തെ ഒരു കുഴിയിലെ മുഴുവൻ കുരുക്കളും എടുത്തു അടുത്തുള്ള കുഴികളിൽ ഓരോന്നായി ഇട്ടു വിതരണം ചെയ്യണം. തന്ത്രങ്ങൾ മെനഞ്ഞു എതിരാളിയേക്കാൾ കൂടുതൽ കുരുക്കൾ സ്വന്തമാക്കുക എന്നതാണ് ലക്ഷ്യം!",
        rulesTitle: "നിയമങ്ങൾ:",
        rule1: "നിങ്ങളുടെ കുരുക്കൾ എതിർ ഘടികാരദിശയിൽ വിതരണം ചെയ്യുക.",
        rule2: "അടുത്ത കുഴിയിൽ കുരുക്കൾ ഉണ്ടെങ്കിൽ, അവ എടുത്തു വിതരണം തുടരുക.",
        rule3: "അടുത്ത കുഴി കാലിയാണെങ്കിൽ, നിങ്ങളുടെ ഊഴം അവസാനിക്കും.",
        rule4: "കാലിയായ കുഴിക്ക് ശേഷമുള്ള കുഴിയിൽ നിന്ന് കുരുക്കൾ സ്വന്തമാക്കാം.",
        rule5: "കൂടുതൽ കുരുക്കൾ ഉള്ളയാൾ വിജയിക്കും.",
        createRoom: "റൂം ഉണ്ടാക്കുക",
        joinRoom: "റൂമിൽ ചേരുക",
        orLocal: "അല്ലെങ്കിൽ ഒരുമിച്ച് കളിക്കുക:",
        localMode: "രണ്ടുപേർക്കുള്ള കളി",
        backHub: "തിരികെ പോകുക",
        connecting: "ബന്ധിപ്പിക്കുന്നു...",
        roomCodeTxt: "റൂം കോഡ്:",
        waiting: "കൂട്ടുകാരനായി കാത്തിരിക്കുന്നു...",
        opponentTop: "എതിരാളി (മുകളിൽ)",
        youBottom: "നിങ്ങൾ (താഴെ)",
        storeLabel: "ശേഖരം:",
        playAgain: "വീണ്ടും കളിക്കുക",
        paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
        resume: "തുടരുക",
        quit: "കളി നിർത്തുക",
        player1Wins: "ഒന്നാമൻ വിജയിച്ചു!",
        player2Wins: "രണ്ടാമൻ വിജയിച്ചു!",
        tie: "സമനില!",
        yourTurn: "നിങ്ങളുടെ ഊഴം",
        opponentTurn: "എതിരാളിയുടെ ഊഴം",
        p1Turn: "ഒന്നാമന്റെ ഊഴം (താഴെ)",
        p2Turn: "രണ്ടാമന്റെ ഊഴം (മുകളിൽ)"
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
    
    // Refresh status text if in game
    updateBoardUI();
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
            await screen.orientation.lock('landscape');
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
        location.reload(); // Quick way to disconnect socket and reset
    }
});

// --- Game Logic ---
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

    let statusKey = '';
    if (currentPlayer === 'player1') {
        DOM.p1Info.classList.add('active');
        DOM.p2Info.classList.remove('active');
        statusKey = gameMode === 'online' ? (mySymbol === 'player1' ? "yourTurn" : "opponentTurn") : "p1Turn";
    } else {
        DOM.p2Info.classList.add('active');
        DOM.p1Info.classList.remove('active');
        statusKey = gameMode === 'online' ? (mySymbol === 'player2' ? "yourTurn" : "opponentTurn") : "p2Turn";
    }
    
    // Check if game is over before updating status to turn string
    if (!DOM.resetBtn.classList.contains('hidden') === false) {
       DOM.status.textContent = translations[currentLang][statusKey];
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
            DOM.status.textContent = translations[currentLang]['player1Wins'];
            winner = 'player1';
        } else if (stores.player2 > stores.player1) {
            DOM.status.textContent = translations[currentLang]['player2Wins'];
            winner = 'player2';
        } else {
            DOM.status.textContent = translations[currentLang]['tie'];
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

        const nextIndex = (currentIndex + 1) % 14;
        
        if (board[nextIndex] > 0) {
            hand = board[nextIndex];
            board[nextIndex] = 0;
            currentIndex = nextIndex; 
            
            const npEl = document.querySelector(`.pit[data-index="${nextIndex}"]`);
            npEl.classList.add('highlight');
            if (typeof Sounds !== 'undefined') Sounds.play('click');
            updateBoardUI();
            await delay(400);
            npEl.classList.remove('highlight');
        } else {
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
            break;
        }
    }

    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    isMyTurn = gameMode === 'online' ? (mySymbol === currentPlayer) : true;
    isAnimating = false;
    
    if (!checkWinCondition()) {
        updateBoardUI();
    }
}

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
    }
    updateBoardUI();
}

function startGameUI() {
    DOM.startScreen.classList.add('hidden');
    DOM.gameContainer.classList.remove('hidden');
    requestGameFullscreen();
}

// --- Multiplayer logic ---
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

DOM.createBtn.addEventListener('click', () => {
    roomId = generateRoomId();
    gameMode = 'online';
    socket.emit('join_game', { gameType: 'pallanguzhi', roomId });
    startGameUI();
});

DOM.joinBtn.addEventListener('click', () => {
    const code = DOM.roomCodeInput.value.trim().toUpperCase();
    if (code.length === 6) {
        roomId = code;
        gameMode = 'online';
        socket.emit('join_game', { gameType: 'pallanguzhi', roomId });
        startGameUI();
    } else {
        alert("Enter a valid 6-character room code.");
    }
});

DOM.localBtn.addEventListener('click', () => {
    gameMode = 'local';
    startGameUI();
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.classList.remove('hidden');
    resetGame();
});

socket.on('joined', (data) => {
    mySymbol = data.symbol;
    roomId = data.roomId;
    
    DOM.roomInfo.classList.remove('hidden');
    DOM.displayRoomCode.textContent = roomId;
    
    // Generate QR
    document.getElementById("qrcode").innerHTML = ""; // Clear existing
    const joinUrl = window.location.origin + window.location.pathname + '?room=' + roomId;
    new QRCode(document.getElementById("qrcode"), {
        text: joinUrl,
        width: 150,
        height: 150,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    });

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

// Auto-join from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const autoRoom = urlParams.get('room');
if (autoRoom) {
    roomId = autoRoom.toUpperCase();
    gameMode = 'online';
    socket.emit('join_game', { gameType: 'pallanguzhi', roomId });
    startGameUI();
}
