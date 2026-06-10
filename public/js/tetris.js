const ROWS = 20;
const COLS = 10;
const board = [];
let score = 0;
let gameInterval;
let currentPiece;
let isGameOver = false;
let isPaused = false;
let isSoftDropping = false;
const NORMAL_SPEED = 800;
const FAST_SPEED = 50;

const COLORS = [
    'transparent', // 0: empty
    '#00FFFF', // 1: I
    '#4444FF', // 2: J
    '#FFA500', // 3: L
    '#FFFF00', // 4: O
    '#00FF00', // 5: S
    '#AA00FF', // 6: T
    '#FF3333'  // 7: Z
];

const SHAPES = [
    [],
    [[1,1,1,1]],
    [[2,0,0],[2,2,2]],
    [[0,0,3],[3,3,3]],
    [[4,4],[4,4]],
    [[0,5,5],[5,5,0]],
    [[0,6,0],[6,6,6]],
    [[7,7,0],[0,7,7]]
];

const boardEl        = document.getElementById('tetris-board');
const scoreEl        = document.getElementById('score');
const finalScoreEl   = document.getElementById('final-score');
const setupScreen    = document.getElementById('setup-screen');
const gameScreen     = document.getElementById('game-screen');
const pauseScreen    = document.getElementById('pause-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const pauseBtn       = document.getElementById('pause-btn');

function initBoard() {
    board.length = 0;
    for (let r = 0; r < ROWS; r++) {
        board[r] = new Array(COLS).fill(0);
    }
}

function drawBoard() {
    // Only re-render cells — keep pause-screen child if present
    // Clear all t-cell children
    const cells = boardEl.querySelectorAll('.t-cell');
    cells.forEach(c => c.remove());

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            drawCell(r, c, board[r][c]);
        }
    }
    if (currentPiece) {
        for (let r = 0; r < currentPiece.shape.length; r++) {
            for (let c = 0; c < currentPiece.shape[r].length; c++) {
                if (currentPiece.shape[r][c] !== 0) {
                    drawCell(currentPiece.r + r, currentPiece.c + c, currentPiece.shape[r][c], true);
                }
            }
        }
    }
}

function drawCell(r, c, val, isPiece = false) {
    if (r < 0) return;
    const cell = document.createElement('div');
    cell.className = 't-cell';
    cell.style.left = `${c * 10}%`;
    cell.style.top  = `${r * 5}%`;
    cell.style.backgroundColor = COLORS[val];
    if (val !== 0) {
        cell.style.border = '1px solid rgba(0,0,0,0.4)';
        cell.style.boxShadow = 'inset 2px 2px 4px rgba(255,255,255,0.25), inset -2px -2px 4px rgba(0,0,0,0.3)';
    }
    boardEl.appendChild(cell);
}

function spawnPiece() {
    const type = Math.floor(Math.random() * 7) + 1;
    currentPiece = {
        shape: SHAPES[type],
        r: -SHAPES[type].length,
        c: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2)
    };
    if (checkCollision(0, 0, currentPiece.shape)) {
        gameOver();
    }
}

function checkCollision(dr, dc, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] !== 0) {
                const nr = currentPiece.r + r + dr;
                const nc = currentPiece.c + c + dc;
                if (nc < 0 || nc >= COLS || nr >= ROWS) return true;
                if (nr >= 0 && board[nr][nc] !== 0) return true;
            }
        }
    }
    return false;
}

function movePiece(dr, dc) {
    if (isGameOver || isPaused) return;
    if (!checkCollision(dr, dc, currentPiece.shape)) {
        currentPiece.r += dr;
        currentPiece.c += dc;
        drawBoard();
    } else if (dr > 0) {
        lockPiece();
    }
}

function rotatePiece() {
    if (isGameOver || isPaused) return;
    const old = currentPiece.shape;
    const rotated = [];
    for (let c = 0; c < old[0].length; c++) {
        rotated[c] = [];
        for (let r = 0; r < old.length; r++) {
            rotated[c][r] = old[old.length - 1 - r][c];
        }
    }
    if (!checkCollision(0, 0, rotated)) {
        currentPiece.shape = rotated;
        drawBoard();
    }
}

function lockPiece() {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c] !== 0) {
                if (currentPiece.r + r < 0) { gameOver(); return; }
                board[currentPiece.r + r][currentPiece.c + c] = currentPiece.shape[r][c];
            }
        }
    }
    clearLines();
    spawnPiece();
    drawBoard();
}

function clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(v => v !== 0)) {
            cleared++;
            board.splice(r, 1);
            board.unshift(new Array(COLS).fill(0));
            r++;
        }
    }
    if (cleared > 0) {
        score += [0, 100, 300, 500, 800][cleared] || cleared * 100;
        scoreEl.innerText = score;
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScoreEl.innerText = score;
    gameoverScreen.style.display = 'flex';
}

function startGameLoop() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => movePiece(1, 0), isSoftDropping ? FAST_SPEED : NORMAL_SPEED);
}

function resetGame() {
    initBoard();
    score = 0;
    scoreEl.innerText = 0;
    isGameOver = false;
    isPaused = false;
    isSoftDropping = false;
    pauseScreen.style.display = 'none';
    gameoverScreen.style.display = 'none';
    pauseBtn.textContent = '⏸';
    spawnPiece();
    drawBoard();
    startGameLoop();
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
        pauseScreen.style.display = 'flex';
        pauseBtn.textContent = '▶';
    } else {
        pauseScreen.style.display = 'none';
        pauseBtn.textContent = '⏸';
        startGameLoop();
    }
}

// ── CONTROLS ──
document.getElementById('start-game-btn').addEventListener('click', () => {
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    resetGame();
});

pauseBtn.addEventListener('click', togglePause);
document.getElementById('resume-btn').addEventListener('click', togglePause);
document.getElementById('pause-restart-btn').addEventListener('click', resetGame);
document.getElementById('quit-home-btn').addEventListener('click', () => { window.location.href = 'index.html'; });
document.getElementById('restart-btn').addEventListener('click', resetGame);
document.getElementById('go-home-btn').addEventListener('click', () => { window.location.href = 'index.html'; });
document.getElementById('btn-rotate').addEventListener('click', (e) => { e.preventDefault(); rotatePiece(); });

// Touch zones
const zoneLeft  = document.getElementById('zone-left');
const zoneRight = document.getElementById('zone-right');
const zoneDown  = document.getElementById('zone-down');

zoneLeft.addEventListener('touchstart',  (e) => { e.preventDefault(); movePiece(0, -1); }, { passive: false });
zoneLeft.addEventListener('mousedown',   (e) => { e.preventDefault(); movePiece(0, -1); });

zoneRight.addEventListener('touchstart', (e) => { e.preventDefault(); movePiece(0,  1); }, { passive: false });
zoneRight.addEventListener('mousedown',  (e) => { e.preventDefault(); movePiece(0,  1); });

function startSoftDrop(e) {
    e.preventDefault();
    if (!isSoftDropping && !isPaused && !isGameOver) {
        isSoftDropping = true;
        movePiece(1, 0);
        startGameLoop();
    }
}
function stopSoftDrop(e) {
    if (isSoftDropping) {
        isSoftDropping = false;
        startGameLoop();
    }
}

zoneDown.addEventListener('touchstart',  startSoftDrop, { passive: false });
zoneDown.addEventListener('touchend',    stopSoftDrop);
zoneDown.addEventListener('mousedown',   startSoftDrop);
zoneDown.addEventListener('mouseup',     stopSoftDrop);
zoneDown.addEventListener('mouseleave',  stopSoftDrop);

// Keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  movePiece(0, -1);
    if (e.key === 'ArrowRight') movePiece(0,  1);
    if (e.key === 'ArrowUp')    rotatePiece();
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') togglePause();
    if (e.key === 'ArrowDown' && !isSoftDropping) {
        isSoftDropping = true; startGameLoop();
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown') { isSoftDropping = false; startGameLoop(); }
});
