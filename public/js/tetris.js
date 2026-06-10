(() => {
    // ── CONSTANTS ──────────────────────────────────────────────────────────────
    const ROWS = 20, COLS = 10;
    const NORMAL_SPEED = 800, FAST_SPEED = 50;

    const COLORS = [
        'transparent','#00FFFF','#4466FF','#FFA500',
        '#FFFF00','#33FF66','#CC44FF','#FF3333'
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

    // ── DOM REFS ───────────────────────────────────────────────────────────────
    const boardEl          = document.getElementById('tetris-board');
    const scoreEl          = document.getElementById('score');
    const finalScoreEl     = document.getElementById('final-score');
    const setupScreen      = document.getElementById('setup-screen');
    const gameScreen       = document.getElementById('game-screen');
    const pauseScreen      = document.getElementById('pause-screen');
    const gameoverScreen   = document.getElementById('gameover-screen');
    const pauseBtn         = document.getElementById('pause-btn');

    // ── STATE (module-level, reset fully on every new game) ────────────────────
    let board        = [];
    let currentPiece = null;
    let score        = 0;
    let isGameOver   = false;
    let isPaused     = false;
    let isSoftDrop   = false;
    let gameInterval = null;

    // ── FULL RESET ─────────────────────────────────────────────────────────────
    function hardReset() {
        // 1. Kill any running interval
        clearInterval(gameInterval);
        gameInterval = null;

        // 2. Wipe the board element completely
        boardEl.innerHTML = '';

        // 3. Reset all state variables to defaults
        board        = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
        currentPiece = null;
        score        = 0;
        isGameOver   = false;
        isPaused     = false;
        isSoftDrop   = false;

        // 4. Reset UI
        scoreEl.textContent      = '0';
        pauseBtn.textContent     = '⏸';
        pauseScreen.style.display    = 'none';
        gameoverScreen.style.display = 'none';
    }

    // ── DRAW ───────────────────────────────────────────────────────────────────
    function draw() {
        // Remove only game cells (not pause overlays etc.)
        boardEl.querySelectorAll('.t-cell').forEach(c => c.remove());

        // Draw locked board
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                if (board[r][c]) placeCell(r, c, board[r][c]);

        // Draw active piece
        if (currentPiece) {
            currentPiece.shape.forEach((row, r) =>
                row.forEach((val, c) => {
                    if (val && currentPiece.r + r >= 0)
                        placeCell(currentPiece.r + r, currentPiece.c + c, val);
                })
            );
        }
    }

    function placeCell(r, c, val) {
        const el = document.createElement('div');
        el.className = 't-cell';
        el.style.cssText = `
            left:${c*10}%; top:${r*5}%;
            background:${COLORS[val]};
            border:1px solid rgba(0,0,0,0.4);
            box-shadow:inset 2px 2px 4px rgba(255,255,255,0.2),inset -2px -2px 4px rgba(0,0,0,0.3);
        `;
        boardEl.appendChild(el);
    }

    // ── PIECE LOGIC ────────────────────────────────────────────────────────────
    function spawn() {
        const type = Math.ceil(Math.random() * 7);
        currentPiece = {
            shape: SHAPES[type].map(r => [...r]), // deep copy
            r: -SHAPES[type].length,
            c: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2)
        };
        if (collides(0, 0, currentPiece.shape)) endGame();
    }

    function collides(dr, dc, shape) {
        for (let r = 0; r < shape.length; r++)
            for (let c = 0; c < shape[r].length; c++)
                if (shape[r][c]) {
                    const nr = currentPiece.r + r + dr;
                    const nc = currentPiece.c + c + dc;
                    if (nc < 0 || nc >= COLS || nr >= ROWS) return true;
                    if (nr >= 0 && board[nr][nc]) return true;
                }
        return false;
    }

    function move(dr, dc) {
        if (isGameOver || isPaused || !currentPiece) return;
        if (!collides(dr, dc, currentPiece.shape)) {
            currentPiece.r += dr;
            currentPiece.c += dc;
            draw();
        } else if (dr > 0) {
            lock();
        }
    }

    function rotate() {
        if (isGameOver || isPaused || !currentPiece) return;
        const s = currentPiece.shape;
        const rotated = s[0].map((_, c) => s.map((row, r) => s[s.length - 1 - r][c]));
        if (!collides(0, 0, rotated)) {
            currentPiece.shape = rotated;
            draw();
        }
    }

    function lock() {
        currentPiece.shape.forEach((row, r) =>
            row.forEach((val, c) => {
                if (val) {
                    if (currentPiece.r + r < 0) { endGame(); return; }
                    board[currentPiece.r + r][currentPiece.c + c] = val;
                }
            })
        );
        clearLines();
        spawn();
        draw();
    }

    function clearLines() {
        const scores = [0, 100, 300, 500, 800];
        let cleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r].every(v => v !== 0)) {
                board.splice(r, 1);
                board.unshift(new Array(COLS).fill(0));
                cleared++; r++;
            }
        }
        if (cleared) {
            score += scores[cleared] ?? cleared * 100;
            scoreEl.textContent = score;
        }
    }

    // ── GAME FLOW ──────────────────────────────────────────────────────────────
    function startLoop() {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => move(1, 0), isSoftDrop ? FAST_SPEED : NORMAL_SPEED);
    }

    function startGame() {
        hardReset();         // full memory cleanup first
        setupScreen.style.display = 'none';
        gameScreen.style.display  = 'flex';
        spawn();
        draw();
        startLoop();
    }

    function restartGame() {
        hardReset();         // full memory cleanup first
        spawn();
        draw();
        startLoop();
    }

    function endGame() {
        isGameOver = true;
        clearInterval(gameInterval);
        gameInterval = null;
        finalScoreEl.textContent     = score;
        gameoverScreen.style.display = 'flex';
    }

    function togglePause() {
        if (isGameOver) return;
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(gameInterval);
            gameInterval = null;
            pauseScreen.style.display = 'flex';
            pauseBtn.textContent = '▶';
        } else {
            pauseScreen.style.display = 'none';
            pauseBtn.textContent = '⏸';
            startLoop();
        }
    }

    // ── BUTTON WIRING ──────────────────────────────────────────────────────────
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('pause-restart-btn').addEventListener('click', restartGame);
    document.getElementById('resume-btn').addEventListener('click', togglePause);
    document.getElementById('quit-home-btn').addEventListener('click', () => { window.location.href = 'index.html'; });
    document.getElementById('go-home-btn').addEventListener('click',   () => { window.location.href = 'index.html'; });
    pauseBtn.addEventListener('click', togglePause);
    document.getElementById('btn-rotate').addEventListener('click', (e) => { e.preventDefault(); rotate(); });

    // ── TOUCH ZONES ────────────────────────────────────────────────────────────
    function on(id, evts, fn) {
        const el = document.getElementById(id);
        evts.forEach(ev => el.addEventListener(ev, fn, { passive: false }));
    }

    on('zone-left',  ['touchstart','mousedown'], e => { e.preventDefault(); move(0, -1); });
    on('zone-right', ['touchstart','mousedown'], e => { e.preventDefault(); move(0,  1); });

    function softStart(e) {
        e.preventDefault();
        if (!isSoftDrop && !isPaused && !isGameOver) {
            isSoftDrop = true; move(1, 0); startLoop();
        }
    }
    function softStop(e) {
        if (isSoftDrop) { isSoftDrop = false; startLoop(); }
    }

    on('zone-down', ['touchstart','mousedown'], softStart);
    on('zone-down', ['touchend','mouseup','mouseleave'], softStop);

    // ── KEYBOARD ───────────────────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  move(0, -1);
        if (e.key === 'ArrowRight') move(0,  1);
        if (e.key === 'ArrowUp')    rotate();
        if (e.key === 'ArrowDown' && !isSoftDrop) { isSoftDrop = true; startLoop(); }
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') togglePause();
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowDown') { isSoftDrop = false; startLoop(); }
    });

})(); // IIFE — zero global pollution
