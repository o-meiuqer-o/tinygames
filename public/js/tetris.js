const ROWS = 20;
const COLS = 10;
const board = [];
let score = 0;
let gameInterval;
let currentPiece;
let isGameOver = false;

const COLORS = [
    '#000000', // 0: empty
    '#00FFFF', // 1: I (Cyan)
    '#0000FF', // 2: J (Blue)
    '#FFA500', // 3: L (Orange)
    '#FFFF00', // 4: O (Yellow)
    '#00FF00', // 5: S (Green)
    '#800080', // 6: T (Purple)
    '#FF0000'  // 7: Z (Red)
];

const SHAPES = [
    [],
    [[1, 1, 1, 1]], // I
    [[2, 0, 0], [2, 2, 2]], // J
    [[0, 0, 3], [3, 3, 3]], // L
    [[4, 4], [4, 4]], // O
    [[0, 5, 5], [5, 5, 0]], // S
    [[0, 6, 0], [6, 6, 6]], // T
    [[7, 7, 0], [0, 7, 7]]  // Z
];

const boardEl = document.getElementById('tetris-board');
const scoreEl = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

function initBoard() {
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            board[r][c] = 0;
        }
    }
}

function drawBoard() {
    boardEl.innerHTML = '';
    // Draw solid board
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const val = board[r][c];
            drawCell(r, c, val);
        }
    }
    // Draw current piece
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
    if (r < 0) return; // Don't draw above board
    const cell = document.createElement('div');
    cell.className = 't-cell';
    cell.style.backgroundColor = COLORS[val];
    if (val !== 0) {
        cell.style.border = '1px solid rgba(0,0,0,0.5)';
        cell.style.boxShadow = 'inset 2px 2px 5px rgba(255,255,255,0.2), inset -2px -2px 5px rgba(0,0,0,0.2)';
    }
    
    // Absolute positioning
    cell.style.left = `${c * 10}%`;
    cell.style.top = `${r * 5}%`;
    
    boardEl.appendChild(cell);
}

function spawnPiece() {
    const type = Math.floor(Math.random() * 7) + 1;
    currentPiece = {
        shape: SHAPES[type],
        r: -SHAPES[type].length, // Start above the board
        c: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2)
    };
    
    // Check instant collision (game over)
    if (checkCollision(0, 0, currentPiece.shape)) {
        gameOver();
    }
}

function checkCollision(dr, dc, newShape) {
    for (let r = 0; r < newShape.length; r++) {
        for (let c = 0; c < newShape[r].length; c++) {
            if (newShape[r][c] !== 0) {
                let nr = currentPiece.r + r + dr;
                let nc = currentPiece.c + c + dc;
                
                if (nc < 0 || nc >= COLS || nr >= ROWS) return true;
                if (nr >= 0 && board[nr][nc] !== 0) return true;
            }
        }
    }
    return false;
}

function movePiece(dr, dc) {
    if (isGameOver) return;
    if (!checkCollision(dr, dc, currentPiece.shape)) {
        currentPiece.r += dr;
        currentPiece.c += dc;
        drawBoard();
    } else if (dr > 0) {
        // Hit bottom
        lockPiece();
    }
}

function rotatePiece() {
    if (isGameOver) return;
    const oldShape = currentPiece.shape;
    const newShape = [];
    for (let c = 0; c < oldShape[0].length; c++) {
        newShape[c] = [];
        for (let r = 0; r < oldShape.length; r++) {
            newShape[c][r] = oldShape[oldShape.length - 1 - r][c];
        }
    }
    if (!checkCollision(0, 0, newShape)) {
        currentPiece.shape = newShape;
        drawBoard();
    }
}

function lockPiece() {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c] !== 0) {
                if (currentPiece.r + r < 0) {
                    gameOver();
                    return;
                }
                board[currentPiece.r + r][currentPiece.c + c] = currentPiece.shape[r][c];
            }
        }
    }
    clearLines();
    spawnPiece();
    drawBoard();
}

function clearLines() {
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        let isFull = true;
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            linesCleared++;
            board.splice(r, 1);
            board.unshift(new Array(COLS).fill(0));
            r++; // Check same row again
        }
    }
    
    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreEl.innerText = score;
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    initBoard();
    score = 0;
    scoreEl.innerText = score;
    isGameOver = false;
    gameOverScreen.classList.add('hidden');
    spawnPiece();
    drawBoard();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => movePiece(1, 0), 1000);
}

// Controls
document.getElementById('btn-left').addEventListener('click', () => movePiece(0, -1));
document.getElementById('btn-right').addEventListener('click', () => movePiece(0, 1));
document.getElementById('btn-down').addEventListener('click', () => movePiece(1, 0));
document.getElementById('btn-rotate').addEventListener('click', rotatePiece);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') movePiece(0, -1);
    if (e.key === 'ArrowRight') movePiece(0, 1);
    if (e.key === 'ArrowDown') movePiece(1, 0);
    if (e.key === 'ArrowUp') rotatePiece();
});

restartBtn.addEventListener('click', resetGame);

// Start
resetGame();
