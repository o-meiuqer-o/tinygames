// aadu-puli-aattam.js
const socket = io();
let roomId = null;
let mySymbol = null; // 'goat' or 'tiger' (online only)
let turn = 'goat'; // 'goat' or 'tiger'
let phase = 'placement'; // 'placement' or 'movement'
let goatsToPlace = 15;
let goatsCaptured = 0;
let selectedNode = null;
let validMoves = [];
let gameMode = 'local'; // 'local' or 'online'
let isAnimating = false;

const nodes = [
    { id: 0, x: 200, y: 80 },
    { id: 1, x: 60, y: 180 }, { id: 2, x: 162.5, y: 180 }, { id: 3, x: 187.5, y: 180 }, { id: 4, x: 212.5, y: 180 }, { id: 5, x: 237.5, y: 180 }, { id: 6, x: 340, y: 180 },
    { id: 7, x: 60, y: 280 }, { id: 8, x: 125, y: 280 }, { id: 9, x: 175, y: 280 }, { id: 10, x: 225, y: 280 }, { id: 11, x: 275, y: 280 }, { id: 12, x: 340, y: 280 },
    { id: 13, x: 60, y: 380 }, { id: 14, x: 87.5, y: 380 }, { id: 15, x: 162.5, y: 380 }, { id: 16, x: 237.5, y: 380 }, { id: 17, x: 312.5, y: 380 }, { id: 18, x: 340, y: 380 },
    { id: 19, x: 50, y: 480 }, { id: 20, x: 150, y: 480 }, { id: 21, x: 250, y: 480 }, { id: 22, x: 350, y: 480 }
];

const edges = [
    [1,2], [2,3], [3,4], [4,5], [5,6],
    [7,8], [8,9], [9,10], [10,11], [11,12],
    [13,14], [14,15], [15,16], [16,17], [17,18],
    [19,20], [20,21], [21,22],
    [1,7], [7,13],
    [6,12], [12,18],
    [0,2], [2,8], [8,14], [14,19],
    [0,3], [3,9], [9,15], [15,20],
    [0,4], [4,10], [10,16], [16,21],
    [0,5], [5,11], [11,17], [17,22]
];

// Adjacency list
const adj = Array.from({length: 23}, () => []);
edges.forEach(([u, v]) => {
    adj[u].push(v);
    adj[v].push(u);
});

let boardState = Array(23).fill(null);

// DOM elements
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
    boardSvg: document.getElementById('boardSvg'),
    nodesContainer: document.getElementById('nodesContainer'),
    piecesContainer: document.getElementById('piecesContainer'),
    turnIndicator: document.getElementById('turnIndicator'),
    capturedGoatsContainer: document.getElementById('capturedGoatsContainer'),
    liveGoatsContainer: document.getElementById('liveGoatsContainer'),
    instructionEl: document.getElementById('instruction'),
    gameOverModal: document.getElementById('gameOverModal'),
    winnerText: document.getElementById('winnerText'),
    winReason: document.getElementById('winReason'),
    restartBtn: document.getElementById('restartBtn'),
    pauseTopBtn: document.getElementById('pause-top-btn'),
    pauseOverlay: document.getElementById('pause-overlay'),
    resumeBtn: document.getElementById('resume-btn'),
    quitBtn: document.getElementById('quit-btn'),
    langEn: document.getElementById('lang-en'),
    langMl: document.getElementById('lang-ml'),
    langEnPause: document.getElementById('lang-en-pause'),
    langMlPause: document.getElementById('lang-ml-pause')
};

// Translations
const translations = {
    en: {
        title: "Aadu Puli Aattam",
        subtitle: "Goats and Tigers Strategy Game",
        premise: "Aadu Puli Aattam (Goats and Tigers) is a traditional strategic, asymmetric two-player board game from South India. One player controls 3 Tigers, and the other controls 15 Goats. Tigers try to capture Goats, while Goats try to trap all Tigers so they cannot move.",
        rulesTitle: "Rules:",
        rule1: "Tigers start at the top points of the board. Goats start off-board.",
        rule2: "In the Placement phase, the Goats player places one goat per turn on any empty intersection.",
        rule3: "Once all 15 Goats are placed, the Movement phase starts. Goats can now move to adjacent connected spots.",
        rule4: "A Tiger captures a Goat by jumping over it along a line onto an empty spot immediately behind it.",
        rule5: "Tigers win if they capture 5 Goats. Goats win if they block all Tigers from making any valid moves.",
        createRoom: "Create Room",
        joinRoom: "Join Room",
        orLocal: "Or play locally:",
        localMode: "Local 2-Player Mode",
        backHub: "Back to Hub",
        roomCodeTxt: "Room Code:",
        shareText: "Scan to join automatically\nor share with a friend to invite them to play",
        waiting: "Waiting for opponent...",
        placeGoat: "Place a goat on an empty spot.",
        selectGoat: "Select a goat to move.",
        selectTiger: "Select a tiger to move or jump.",
        goatTurn: "Goat's Turn",
        tigerTurn: "Tiger's Turn",
        yourTurn: "Your Turn",
        opponentTurn: "Opponent's Turn",
        tigersWin: "Tigers Win!",
        goatsWin: "Goats Win!",
        captured5: "Tigers captured 5 goats.",
        trapped: "Tigers are completely trapped.",
        noMovesLeft: "Goats have no valid moves left.",
        playAgain: "Play Again",
        paused: "PAUSED",
        resume: "Resume",
        quit: "Quit Game"
    },
    ml: {
        title: "ആട് പുലി ആട്ടം",
        subtitle: "തന്ത്രപ്രധാനമായ പരമ്പരാഗത കളി",
        premise: "ആടുപുലി ആട്ടം ദക്ഷിണേന്ത്യയിലെ ഒരു പരമ്പരാഗത തന്ത്രപ്രധാനമായ കളിയാണ്. ഒരു കളിക്കാരൻ 3 പുലികളെയും മറ്റേയാൾ 15 ആടുകളെയും നിയന്ത്രിക്കുന്നു. പുലികൾ ആടുകളെ പിടിക്കാൻ ശ്രമിക്കുന്നു, ആടുകൾ പുലികളുടെ വഴി തടഞ്ഞു അവയെ കുടുക്കാൻ ശ്രമിക്കുന്നു.",
        rulesTitle: "നിയമങ്ങൾ:",
        rule1: "കുടുംബത്തിൽ 3 പുലികൾ ബോർഡിലുണ്ടാകും. ആടുകൾ പുറത്തായിരിക്കും.",
        rule2: "ആദ്യ ഘട്ടത്തിൽ ഓരോ ആടുകളെ വീതം ബോർഡിലെ ഒഴിഞ്ഞ സ്ഥലങ്ങളിൽ വെക്കുന്നു.",
        rule3: "15 ആടുകളെയും വെച്ചുകഴിഞ്ഞാൽ ആടുകളെ അടുത്തുള്ള ഒഴിഞ്ഞ സ്ഥലങ്ങളിലേക്ക് നീക്കാൻ സാധിക്കും.",
        rule4: "ഒരു പുലിക്ക് തൊട്ടടുത്തുള്ള ഒരു ആടിന് മുകളിലൂടെ ചാടി തൊട്ടുപിന്നിലെ ഒഴിഞ്ഞ സ്ഥലത്ത് എത്തി ആടിനെ വെട്ടിയെടുക്കാം.",
        rule5: "5 ആടുകളെ വെട്ടിയാൽ പുലികൾ വിജയിക്കും. പുലികളുടെ എല്ലാ വഴികളും തടഞ്ഞാൽ ആടുകൾ വിജയിക്കും.",
        createRoom: "റൂം ഉണ്ടാക്കുക",
        joinRoom: "റൂമിൽ ചേരുക",
        orLocal: "അല്ലെങ്കിൽ ഒരുമിച്ച് കളിക്കുക:",
        localMode: "രണ്ടുപേർക്കുള്ള കളി",
        backHub: "തിരികെ പോകുക",
        roomCodeTxt: "റൂം കോഡ്:",
        shareText: "കളിക്കാൻ കൂട്ടുകാരനെ ക്ഷണിക്കാൻ ഈ QR കോഡ് പങ്കുവെക്കുക",
        waiting: "കൂട്ടുകാരനായി കാത്തിരിക്കുന്നു...",
        placeGoat: "ഒരു ആടിനെ ഒഴിഞ്ഞ സ്ഥലത്ത് വെക്കുക.",
        selectGoat: "നീക്കാൻ ഒരു ആടിനെ തിരഞ്ഞെടുക്കുക.",
        selectTiger: "നീക്കാനോ വെട്ടാനോ ഒരു പുലിയെ തിരഞ്ഞെടുക്കുക.",
        goatTurn: "ആടിന്റെ ഊഴം",
        tigerTurn: "പുലിയുടെ ഊഴം",
        yourTurn: "നിങ്ങളുടെ ഊഴം",
        opponentTurn: "എതിരാളിയുടെ ഊഴം",
        tigersWin: "പുലികൾ വിജയിച്ചു!",
        goatsWin: "ആടുകൾ വിജയിച്ചു!",
        captured5: "പുലികൾ 5 ആടുകളെ വെട്ടിപ്പിടിച്ചു.",
        trapped: "പുലികൾ പൂർണ്ണമായും കുടുങ്ങിപ്പോയി.",
        noMovesLeft: "ആടുകൾക്ക് നീങ്ങാൻ ഒരിടവുമില്ല.",
        playAgain: "വീണ്ടും കളിക്കുക",
        paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
        resume: "തുടരുക",
        quit: "കളി നിർത്തുക"
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
        location.reload(); // Quick disconnect & reset
    }
});

function initBoard() {
    DOM.boardSvg.innerHTML = '';
    // Draw lines
    edges.forEach(([u, v]) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", nodes[u].x);
        line.setAttribute("y1", nodes[u].y);
        line.setAttribute("x2", nodes[v].x);
        line.setAttribute("y2", nodes[v].y);
        DOM.boardSvg.appendChild(line);
    });

    DOM.nodesContainer.innerHTML = '';
    // Create interactive nodes
    nodes.forEach(node => {
        const div = document.createElement('div');
        div.className = 'node';
        div.style.left = `${(node.x / 400) * 100}%`;
        div.style.top = `${(node.y / 560) * 100}%`;
        div.dataset.id = node.id;
        div.addEventListener('click', () => handleNodeClick(node.id));
        DOM.nodesContainer.appendChild(div);
    });

    startGame();
}

function startGame() {
    boardState.fill(null);
    DOM.piecesContainer.innerHTML = '';
    
    // Initial tigers
    placePiece(0, 'tiger');
    placePiece(3, 'tiger');
    placePiece(4, 'tiger');

    turn = 'goat';
    phase = 'placement';
    goatsToPlace = 15;
    goatsCaptured = 0;
    selectedNode = null;
    validMoves = [];
    
    updateUI();
    DOM.gameOverModal.classList.remove('show');
}

function updatePiecePositionAndOrientation(piece, nodeId, type) {
    piece.style.left = `${(nodes[nodeId].x / 400) * 100}%`;
    piece.style.top = `${(nodes[nodeId].y / 560) * 100}%`;
    
    if (type === 'tiger') {
        let rot = 0;
        if (nodes[nodeId].x < 200) {
            rot = -90; // Look left
        } else if (nodes[nodeId].x > 200) {
            rot = 90; // Look right
        } else {
            rot = 180; // Look down
        }
        piece.style.setProperty('--rot', `${rot}deg`);
    } else if (type === 'goat') {
        piece.style.setProperty('--rot', `0deg`);
    }
}

function placePiece(nodeId, type) {
    boardState[nodeId] = type;
    const piece = document.createElement('div');
    piece.className = `piece ${type}`;
    piece.id = `piece-${nodeId}`;
    piece.dataset.id = nodeId;
    
    updatePiecePositionAndOrientation(piece, nodeId, type);
    
    piece.addEventListener('pointerdown', function(e) {
        onPointerDown(e, parseInt(this.dataset.id));
    });
    piece.addEventListener('touchstart', function(e) {
        if(e.cancelable) e.preventDefault();
        onPointerDown(e, parseInt(this.dataset.id));
    }, {passive: false});
    DOM.piecesContainer.appendChild(piece);
}

function movePiece(fromId, toId) {
    const type = boardState[fromId];
    boardState[fromId] = null;
    boardState[toId] = type;
    
    const piece = document.getElementById(`piece-${fromId}`);
    if (piece) {
        piece.id = `piece-${toId}`;
        piece.dataset.id = toId;
        updatePiecePositionAndOrientation(piece, toId, type);
        piece.classList.remove('selected');
    }
}

function removePiece(nodeId) {
    boardState[nodeId] = null;
    const piece = document.getElementById(`piece-${nodeId}`);
    if (piece) {
        piece.classList.add('captured');
        setTimeout(() => piece.remove(), 300);
    }
}

let draggedPiece = null;
let dragStartX = 0;
let dragStartY = 0;
let hasMoved = false;

function isMyPieceControl() {
    if (gameMode === 'online') {
        return turn === mySymbol;
    }
    return true; // Local mode controls both
}

function onPointerDown(e, initialNodeId) {
    if (!isMyPieceControl()) return;
    if (boardState[initialNodeId] !== turn) return;
    if (turn === 'goat' && phase === 'placement') return;

    if (typeof Sounds !== 'undefined') Sounds.play('click');

    let nodeId = initialNodeId;
    
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (clientX === undefined && e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    const elementsUnderPointer = document.elementsFromPoint(clientX, clientY);
    const overlappingPieces = elementsUnderPointer.filter(el => el.classList && el.classList.contains('piece') && boardState[el.dataset.id] === turn);
    
    if (overlappingPieces.length > 1) {
        let selectedIndex = overlappingPieces.findIndex(el => el.dataset.id == selectedNode);
        if (selectedIndex !== -1) {
            let nextIndex = (selectedIndex + 1) % overlappingPieces.length;
            nodeId = parseInt(overlappingPieces[nextIndex].dataset.id);
        } else {
            nodeId = parseInt(overlappingPieces[0].dataset.id);
        }
    }

    selectedNode = nodeId;
    validMoves = [];
    hasMoved = false;

    // Get normal moves
    adj[nodeId].forEach(neighbor => {
        if (boardState[neighbor] === null) {
            validMoves.push({ to: neighbor });
        }
    });

    // Get jumps for tiger
    if (turn === 'tiger') {
        const jumps = getValidJumps(nodeId);
        validMoves.push(...jumps);
    }

    renderSelection();

    draggedPiece = document.getElementById(`piece-${nodeId}`);
    if (draggedPiece) {
        draggedPiece.classList.add('dragging');
        
        dragStartX = clientX;
        dragStartY = clientY;
        
        const rect = DOM.nodesContainer.getBoundingClientRect();
        
        function onPointerMove(moveEvent) {
            hasMoved = true;
            let mx = moveEvent.clientX;
            let my = moveEvent.clientY;
            if (mx === undefined && moveEvent.touches) {
                mx = moveEvent.touches[0].clientX;
                my = moveEvent.touches[0].clientY;
            }
            
            const dx = mx - dragStartX;
            const dy = my - dragStartY;
            
            const originalXPercent = (nodes[nodeId].x / 400) * 100;
            const originalYPercent = (nodes[nodeId].y / 560) * 100;
            
            const dxPercent = (dx / rect.width) * 100;
            const dyPercent = (dy / rect.height) * 100;
            
            draggedPiece.style.left = `${originalXPercent + dxPercent}%`;
            draggedPiece.style.top = `${originalYPercent + dyPercent}%`;
        }

        function onPointerUp(upEvent) {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('touchmove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('touchend', onPointerUp);
            
            if (draggedPiece) {
                draggedPiece.classList.remove('dragging');
                
                if (hasMoved) {
                    let dropX = upEvent.clientX;
                    let dropY = upEvent.clientY;
                    if (dropX === undefined && upEvent.changedTouches) {
                        dropX = upEvent.changedTouches[0].clientX;
                        dropY = upEvent.changedTouches[0].clientY;
                    }
                    
                    let closestMove = null;
                    let minDist = Infinity;
                    
                    validMoves.forEach(move => {
                        const targetNodeEl = document.querySelector(`.node[data-id='${move.to}']`);
                        const nRect = targetNodeEl.getBoundingClientRect();
                        const nX = nRect.left + nRect.width / 2;
                        const nY = nRect.top + nRect.height / 2;
                        
                        const dist = Math.hypot(dropX - nX, dropY - nY);
                        if (dist < 60 && dist < minDist) { // 60px snap radius
                            minDist = dist;
                            closestMove = move;
                        }
                    });
                    
                    if (closestMove) {
                        const fromNode = selectedNode;
                        const toNode = closestMove.to;
                        const captureNode = closestMove.capture;

                        if (gameMode === 'online') {
                            socket.emit('make_move', {
                                roomId,
                                move: { type: 'move', from: fromNode, to: toNode, capture: captureNode },
                                gameType: 'aadupuliaattam'
                            });
                        }
                        
                        movePiece(fromNode, toNode);
                        if (captureNode !== undefined) {
                            removePiece(captureNode);
                            goatsCaptured++;
                            if (typeof Sounds !== 'undefined') Sounds.play('capture');
                        } else {
                            if (typeof Sounds !== 'undefined') Sounds.play('move');
                        }
                        selectedNode = null;
                        validMoves = [];
                        renderSelection();
                        endTurn();
                    } else {
                        updatePiecePositionAndOrientation(draggedPiece, selectedNode, boardState[selectedNode]);
                    }
                }
                draggedPiece = null;
            }
        }

        document.addEventListener('pointermove', onPointerMove, {passive: false});
        document.addEventListener('touchmove', onPointerMove, {passive: false});
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('touchend', onPointerUp);
    }
}

function handleNodeClick(nodeId) {
    if (!isMyPieceControl()) return;

    if (turn === 'goat' && phase === 'placement') {
        if (boardState[nodeId] === null) {
            if (gameMode === 'online') {
                socket.emit('make_move', {
                    roomId,
                    move: { type: 'place', to: nodeId },
                    gameType: 'aadupuliaattam'
                });
            }
            placePiece(nodeId, 'goat');
            if (typeof Sounds !== 'undefined') Sounds.play('place');
            goatsToPlace--;
            if (goatsToPlace === 0) {
                phase = 'movement';
            }
            endTurn();
        }
        return;
    }

    if (selectedNode !== null) {
        const move = validMoves.find(m => m.to === nodeId);
        if (move) {
            const fromNode = selectedNode;
            const toNode = nodeId;
            const captureNode = move.capture;

            if (gameMode === 'online') {
                socket.emit('make_move', {
                    roomId,
                    move: { type: 'move', from: fromNode, to: toNode, capture: captureNode },
                    gameType: 'aadupuliaattam'
                });
            }

            movePiece(fromNode, toNode);
            if (captureNode !== undefined) {
                removePiece(captureNode);
                goatsCaptured++;
                if (typeof Sounds !== 'undefined') Sounds.play('capture');
            } else {
                if (typeof Sounds !== 'undefined') Sounds.play('move');
            }
            selectedNode = null;
            validMoves = [];
            renderSelection();
            endTurn();
        } else {
            selectedNode = null;
            validMoves = [];
            renderSelection();
        }
    }
}

function renderSelection() {
    document.querySelectorAll('.piece').forEach(p => p.classList.remove('selected'));
    if (selectedNode !== null) {
        const pEl = document.getElementById(`piece-${selectedNode}`);
        if (pEl) pEl.classList.add('selected');
    }

    document.querySelectorAll('.node').forEach(n => {
        n.classList.remove('valid-move');
    });
    
    validMoves.forEach(move => {
        const nodeEl = document.querySelector(`.node[data-id='${move.to}']`);
        if (nodeEl) nodeEl.classList.add('valid-move');
    });
}

function getValidJumps(tigerId) {
    const jumps = [];
    const nA = nodes[tigerId];
    
    adj[tigerId].forEach(b => {
        if (boardState[b] === 'goat') {
            const nB = nodes[b];
            adj[b].forEach(c => {
                if (c !== tigerId && boardState[c] === null) {
                    const nC = nodes[c];
                    // Cross product collinear check
                    const cross = (nB.x - nA.x) * (nC.y - nB.y) - (nB.y - nA.y) * (nC.x - nB.x);
                    // Dot product direction check
                    const dot = (nB.x - nA.x) * (nC.x - nB.x) + (nB.y - nA.y) * (nC.y - nB.y);
                    
                    if (Math.abs(cross) < 0.1 && dot > 0) {
                        jumps.push({ to: c, capture: b });
                    }
                }
            });
        }
    });
    return jumps;
}

function checkWinCondition() {
    if (goatsCaptured >= 5) {
        showGameOver(translations[currentLang]['tigersWin'], translations[currentLang]['captured5']);
        return true;
    }

    if (turn === 'tiger') {
        let canMove = false;
        for (let i = 0; i < 23; i++) {
            if (boardState[i] === 'tiger') {
                const moves = adj[i].filter(n => boardState[n] === null);
                const jumps = getValidJumps(i);
                if (moves.length > 0 || jumps.length > 0) {
                    canMove = true;
                    break;
                }
            }
        }
        if (!canMove) {
            showGameOver(translations[currentLang]['goatsWin'], translations[currentLang]['trapped']);
            return true;
        }
    }
    
    if (turn === 'goat' && phase === 'movement') {
        let canMove = false;
        for (let i = 0; i < 23; i++) {
            if (boardState[i] === 'goat') {
                const moves = adj[i].filter(n => boardState[n] === null);
                if (moves.length > 0) {
                    canMove = true;
                    break;
                }
            }
        }
        if (!canMove) {
            showGameOver(translations[currentLang]['tigersWin'], translations[currentLang]['noMovesLeft']);
            return true;
        }
    }
    return false;
}

function endTurn() {
    turn = turn === 'goat' ? 'tiger' : 'goat';
    updateUI();
    
    setTimeout(() => {
        checkWinCondition();
    }, 100);
}

function updateUI() {
    let turnText = turn === 'goat' ? translations[currentLang]['goatTurn'] : translations[currentLang]['tigerTurn'];
    if (gameMode === 'online') {
        const isMyTurn = (turn === mySymbol);
        const playerLabel = isMyTurn ? translations[currentLang]['yourTurn'] : translations[currentLang]['opponentTurn'];
        turnText = `${turnText} (${playerLabel})`;
    }
    DOM.turnIndicator.textContent = turnText;
    DOM.turnIndicator.className = `turn-indicator ${turn}-turn`;
    
    // Live goats UI
    DOM.liveGoatsContainer.innerHTML = '';
    for(let i = 0; i < goatsToPlace; i++) {
        const icon = document.createElement('div');
        icon.className = 'goat-icon';
        DOM.liveGoatsContainer.appendChild(icon);
    }
    
    // Captured goats UI
    DOM.capturedGoatsContainer.innerHTML = '';
    for(let i = 0; i < goatsCaptured; i++) {
        const icon = document.createElement('div');
        icon.className = 'goat-icon dead';
        DOM.capturedGoatsContainer.appendChild(icon);
    }
    
    if (turn === 'goat') {
        DOM.instructionEl.textContent = phase === 'placement' ? translations[currentLang]['placeGoat'] : translations[currentLang]['selectGoat'];
    } else {
        DOM.instructionEl.textContent = translations[currentLang]['selectTiger'];
    }
}

function showGameOver(title, reason) {
    DOM.winnerText.textContent = title;
    DOM.winReason.textContent = reason;
    DOM.gameOverModal.classList.add('show');
    if (typeof Sounds !== 'undefined') Sounds.play('happyWin');
}

DOM.restartBtn.addEventListener('click', () => {
    if (gameMode === 'online') {
        socket.emit('reset_game', { roomId, gameType: 'aadupuliaattam' });
    } else {
        startGame();
    }
});

// --- Multiplayer lounge triggers ---
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function startGameUI() {
    DOM.startScreen.classList.add('hidden');
    DOM.gameContainer.classList.remove('hidden');
    requestGameFullscreen();
}

DOM.createBtn.addEventListener('click', () => {
    roomId = generateRoomId();
    gameMode = 'online';
    socket.emit('join_game', { gameType: 'aadupuliaattam', roomId });
    startGameUI();
});

DOM.joinBtn.addEventListener('click', () => {
    const code = DOM.roomCodeInput.value.trim().toUpperCase();
    if (code.length === 6) {
        roomId = code;
        gameMode = 'online';
        socket.emit('join_game', { gameType: 'aadupuliaattam', roomId });
        startGameUI();
    } else {
        alert(currentLang === 'en' ? "Enter a valid 6-character room code." : "ശരിയായ 6 അക്ക റൂം കോഡ് നൽകുക.");
    }
});

DOM.localBtn.addEventListener('click', () => {
    gameMode = 'local';
    startGameUI();
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.style.display = 'flex';
    initBoard();
});

socket.on('joined', (data) => {
    mySymbol = data.symbol === 'player1' ? 'goat' : 'tiger';
    roomId = data.roomId;
    
    DOM.roomInfo.classList.remove('hidden');
    DOM.gameArea.style.display = 'none';
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
});

socket.on('game_start', () => {
    DOM.roomInfo.classList.add('hidden');
    DOM.gameArea.style.display = 'flex';
    initBoard();
});

socket.on('opponent_move', (move) => {
    if (move.type === 'place') {
        placePiece(move.to, 'goat');
        if (typeof Sounds !== 'undefined') Sounds.play('place');
        goatsToPlace--;
        if (goatsToPlace === 0) {
            phase = 'movement';
        }
        endTurn();
    } else if (move.type === 'move') {
        movePiece(move.from, move.to);
        if (move.capture !== undefined && move.capture !== null) {
            removePiece(move.capture);
            goatsCaptured++;
            if (typeof Sounds !== 'undefined') Sounds.play('capture');
        } else {
            if (typeof Sounds !== 'undefined') Sounds.play('move');
        }
        endTurn();
    }
});

socket.on('reset_game', () => {
    startGame();
});

socket.on('error', (msg) => {
    alert(msg);
    if (msg === 'Opponent disconnected.') {
        location.reload();
    }
});

// Auto-join from URL param
const urlParams = new URLSearchParams(window.location.search);
const autoRoom = urlParams.get('room');
if (autoRoom) {
    roomId = autoRoom.toUpperCase();
    gameMode = 'online';
    socket.emit('join_game', { gameType: 'aadupuliaattam', roomId });
    startGameUI();
}
