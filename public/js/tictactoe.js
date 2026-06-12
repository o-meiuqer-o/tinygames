const socket = io();
const gameType = 'tictactoe';
let mySymbol = '';
let myRoomId = '';
let currentTurn = 'X';
let gameActive = false;
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameMode = 'local'; // 'local' or 'online'
let localPlayer = 'X'; // X goes first

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
    status: document.getElementById('status'),
    cells: document.querySelectorAll('.cell'),
    playerSymbolSpan: document.getElementById('player-symbol'),
    currentTurnSpan: document.getElementById('current-turn'),
    resetBtn: document.getElementById('reset-btn'),
    pauseTopBtn: document.getElementById('pause-top-btn'),
    pauseOverlay: document.getElementById('ttt-pause'),
    resumeBtn: document.getElementById('ttt-resume'),
    quitBtn: document.getElementById('ttt-hub'),
    langEn: document.getElementById('lang-en'),
    langMl: document.getElementById('lang-ml'),
    langEnPause: document.getElementById('lang-en-pause'),
    langMlPause: document.getElementById('lang-ml-pause')
};

// Translations
const translations = {
    en: {
        title: "Tic-Tac-Toe",
        subtitle: "The classic game of Xs and Os",
        createRoom: "Create Room",
        joinRoom: "Join Room",
        orLocal: "Or play locally:",
        localMode: "Local 2-Player Mode",
        backHub: "Back to Hub",
        roomCodeTxt: "Room Code:",
        shareText: "Scan to join automatically\nor share with a friend to invite them to play",
        waiting: "Waiting for opponent...",
        scoreYou: "You",
        scoreTurn: "Turn",
        playAgain: "Play Again",
        paused: "PAUSED",
        resume: "Resume",
        quit: "Quit Game",
        premise: "Tic-Tac-Toe is a classic two-player board game where the objective is to place three of your marks in a horizontal, vertical, or diagonal row.",
        rulesTitle: "Rules:",
        rule1: "The game is played on a grid that's 3 squares by 3 squares.",
        rule2: "One player is X, and the other is O. Players take turns putting their marks in empty squares.",
        rule3: "The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.",
        rule4: "When all 9 squares are full, the game is over. If no player has 3 in a row, the game ends in a tie.",
        connecting: "Connecting...",
        winX: "Player X Wins!",
        winO: "Player O Wins!",
        tie: "It's a Tie!",
        yourTurn: "Your Turn",
        opponentTurn: "Opponent's Turn"
    },
    ml: {
        title: "ടിക്-ടാക്-ടോ",
        subtitle: "എക്സ്, ഓ കളിയുടെ കളരി",
        createRoom: "റൂം ഉണ്ടാക്കുക",
        joinRoom: "റൂമിൽ ചേരുക",
        orLocal: "അല്ലെങ്കിൽ ഒരുമിച്ച് കളിക്കുക:",
        localMode: "രണ്ടുപേർക്കുള്ള കളി",
        backHub: "തിരികെ പോകുക",
        roomCodeTxt: "റൂം കോഡ്:",
        shareText: "കളിക്കാൻ കൂട്ടുകാരനെ ക്ഷണിക്കാൻ ഈ QR കോഡ് പങ്കുവെക്കുക",
        waiting: "കൂട്ടുകാരനായി കാത്തിരിക്കുന്നു...",
        scoreYou: "നിങ്ങൾ",
        scoreTurn: "ഊഴം",
        playAgain: "വീണ്ടും കളിക്കുക",
        paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
        resume: "തുടരുക",
        quit: "കളി നിർത്തുക",
        premise: "രണ്ടു കളിക്കാർ തമ്മിൽ കളിക്കുന്ന ലളിതമായ പരമ്പരാഗത തന്ത്രപ്രധാന കളിയാണ് ടിക്-ടാക്-ടോ. തങ്ങളുടെ അടയാളം 3 എണ്ണം നേർരേഖയിലോ ചരിഞ്ഞോ ആദ്യം വെക്കുന്നയാൾ വിജയിക്കും.",
        rulesTitle: "നിയമങ്ങൾ:",
        rule1: "3x3 ചതുരങ്ങൾ ഉള്ള ബോർഡിലാണ് ഈ കളി കളിക്കുന്നത്.",
        rule2: "ഒരു കളിക്കാരൻ X അടയാളവും മറ്റേയാൾ O അടയാളവും ഉപയോഗിക്കും. ഊഴം അനുസരിച്ചു ചിഹ്നങ്ങൾ ഇടാം.",
        rule3: "തങ്ങളുടെ 3 ചിഹ്നങ്ങൾ ആദ്യം ഒരേ വരിയിലോ ചരിഞ്ഞോ നിരത്തുന്നയാൾ വിജയിക്കും.",
        rule4: "എല്ലാ 9 കള്ളികളും നിറഞ്ഞാൽ കളി കഴിയും. ആരും ജയിച്ചില്ലെങ്കിൽ കളി സമനിലയാകും.",
        connecting: "ബന്ധിപ്പിക്കുന്നു...",
        winX: "കളിക്കാരൻ X വിജയിച്ചു!",
        winO: "കളിക്കാരൻ O വിജയിച്ചു!",
        tie: "സമനില!",
        yourTurn: "നിങ്ങളുടെ ഊഴം",
        opponentTurn: "എതിരാളിയുടെ ഊഴം"
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
        location.reload(); // Quick disconnect & reset
    }
});

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startGameUI() {
    DOM.startScreen.classList.add('hidden');
    DOM.gameContainer.classList.remove('hidden');
    requestGameFullscreen();
}

DOM.createBtn.addEventListener('click', () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    gameMode = 'online';
    socket.emit('join_game', { gameType, roomId: code });
    startGameUI();
});

DOM.joinBtn.addEventListener('click', () => {
    const code = DOM.roomCodeInput.value.trim().toUpperCase();
    if (code.length >= 4) {
        myRoomId = code;
        gameMode = 'online';
        socket.emit('join_game', { gameType, roomId: code });
        startGameUI();
    } else {
        alert(currentLang === 'en' ? "Enter a valid room code." : "ശരിയായ റൂം കോഡ് നൽകുക.");
    }
});

DOM.localBtn.addEventListener('click', () => {
    gameMode = 'local';
    startGameUI();
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.classList.remove('hidden');
    resetGame();
});

// Auto-join from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const autoRoom = urlParams.get('room');
if (autoRoom) {
    gameMode = 'online';
    socket.emit('join_game', { gameType, roomId: autoRoom.toUpperCase() });
    startGameUI();
}

socket.on('joined', (data) => {
    mySymbol = data.symbol === 'player1' ? 'X' : 'O';
    myRoomId = data.roomId;
    DOM.playerSymbolSpan.innerText = mySymbol;
    
    DOM.roomInfo.classList.remove('hidden');
    DOM.displayRoomCode.textContent = myRoomId;
    
    // Generate QR
    document.getElementById("qrcode").innerHTML = ""; // Clear existing
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

socket.on('game_start', () => {
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.classList.remove('hidden');
    resetGame();
});

socket.on('error', (msg) => {
    alert(msg);
    if (msg === 'Opponent disconnected.') {
        location.reload();
    }
});

DOM.cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        if (boardState[index] === '' && gameActive) {
            if (gameMode === 'online') {
                if (currentTurn === mySymbol) {
                    makeMove(index, mySymbol);
                    socket.emit('make_move', { roomId: myRoomId, move: index, gameType });
                }
            } else {
                makeMove(index, localPlayer);
                localPlayer = localPlayer === 'X' ? 'O' : 'X';
            }
        }
    });
});

socket.on('opponent_move', (index) => {
    const opponentSymbol = mySymbol === 'X' ? 'O' : 'X';
    makeMove(index, opponentSymbol);
});

function makeMove(index, symbol) {
    boardState[index] = symbol;
    DOM.cells[index].innerText = symbol;
    DOM.cells[index].classList.add(symbol.toLowerCase());
    if (typeof Sounds !== 'undefined') Sounds.play('place');
    
    checkWin(symbol);
    if (gameActive) {
        currentTurn = currentTurn === 'X' ? 'O' : 'X';
        updateTurnDisplay();
    }
}

function updateTurnDisplay() {
    let turnText = currentTurn;
    if (gameMode === 'online') {
        const isMyTurn = (currentTurn === mySymbol);
        const playerLabel = isMyTurn ? translations[currentLang]['yourTurn'] : translations[currentLang]['opponentTurn'];
        turnText = `${currentTurn} (${playerLabel})`;
    }
    DOM.currentTurnSpan.innerText = turnText;
    if (currentTurn === 'X') {
        DOM.currentTurnSpan.style.color = 'var(--primary)';
    } else {
        DOM.currentTurnSpan.style.color = 'var(--secondary)';
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
        gameActive = false;
        if (typeof Sounds !== 'undefined') Sounds.play('win');
        DOM.resetBtn.classList.remove('hidden');
        alert(translations[currentLang][`win${symbol}`]);
        return;
    }

    const roundDraw = !boardState.includes('');
    if (roundDraw) {
        gameActive = false;
        if (typeof Sounds !== 'undefined') Sounds.play('lose');
        DOM.resetBtn.classList.remove('hidden');
        alert(translations[currentLang]['tie']);
    }
}

DOM.resetBtn.addEventListener('click', () => {
    if (gameMode === 'online') {
        socket.emit('reset_game', { roomId: myRoomId, gameType });
    } else {
        resetGame();
    }
});

socket.on('reset_game', () => {
    resetGame();
});

function resetGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentTurn = 'X';
    localPlayer = 'X';
    DOM.cells.forEach(cell => {
        cell.innerText = '';
        cell.className = 'cell';
    });
    DOM.resetBtn.classList.add('hidden');
    updateTurnDisplay();
}
