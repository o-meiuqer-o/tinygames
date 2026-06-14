(() => {
    // ── GRID: 14 cols x 28 rows keeps 1:2 ratio, blocks ~30% smaller than 10x20 ──
    const ROWS = 28, COLS = 14;
    const CW = 100 / COLS;   // cell width  % of board
    const CH = 100 / ROWS;   // cell height % of board

    const NORMAL_SPEED = 800, FAST_SPEED = 50;

    const COLORS = [
        'transparent',
        '#00FFFF', // I
        '#4466FF', // J
        '#FFA500', // L
        '#FFFF00', // O
        '#33FF66', // S
        '#CC44FF', // T
        '#FF3333'  // Z
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

    // ── DOM ────────────────────────────────────────────────────────────────────
    const boardEl        = document.getElementById('tetris-board');
    const scoreEl        = document.getElementById('score');
    const finalScoreEl   = document.getElementById('final-score');
    const startScreen    = document.getElementById('start-screen');
    const gameScreen     = document.getElementById('game-screen');
    const pauseScreen    = document.getElementById('pause-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    const pauseBtn       = document.getElementById('pause-btn');

    const langEn         = document.getElementById('lang-en');
    const langMl         = document.getElementById('lang-ml');
    const langEnPause    = document.getElementById('lang-en-pause');
    const langMlPause    = document.getElementById('lang-ml-pause');

    // Translations
    const translations = {
        en: {
            title: "Block Drop",
            subtitle: "Drop and clear blocks",
            startBtn: "▶   Start Game",
            backHub: "Back to Hub",
            scoreText: "Score: ",
            ruleRotate: "↻   ROTATE",
            paused: "PAUSED",
            resume: "Resume",
            quit: "Quit Game",
            playAgain: "Play Again",
            gameOverTitle: "Game Over!",
            instructionsTitle: "Controls & Zones",
            legendLeft: "Tap left 20% → Move Left",
            legendRight: "Tap right 20% → Move Right",
            legendCenter: "Hold centre → Soft Drop ▼",
            legendRotate: "Bottom bar → Rotate ↻",
            legendPause: "Top-right → Pause ⏸",
            lblLeftDiagram: "◀<br>Move<br>Left",
            lblRightDiagram: "▶<br>Move<br>Right"
        },
        ml: {
            title: "ബ്ലോക്ക് ഡ്രോപ്പ്",
            subtitle: "ബ്ലോക്കുകൾ നിരത്തി കള്ളികൾ ഒഴിവാക്കുക",
            startBtn: "▶   കളി തുടങ്ങാം",
            backHub: "തിരികെ പോകുക",
            scoreText: "സ്കോർ: ",
            ruleRotate: "↻   തിരിക്കുക",
            paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
            resume: "തുടരുക",
            quit: "കളി നിർത്തുക",
            playAgain: "വീണ്ടും കളിക്കുക",
            gameOverTitle: "കളി കഴിഞ്ഞു!",
            instructionsTitle: "കളിക്കുന്ന രീതി",
            legendLeft: "ഇടത് ഭാഗം അമർത്തുക → ഇടത്തോട്ട് നീക്കുക",
            legendRight: "വലത് ഭാഗം അമർത്തുക → വലത്തോട്ട് നീക്കുക",
            legendCenter: "നടുവിൽ അമർത്തിപ്പിടിക്കുക → വേഗത്തിൽ താഴെയിടുക ▼",
            legendRotate: "താഴത്തെ ബാർ → ബ്ലോക്ക് തിരിക്കുക ↻",
            legendPause: "മുകളിൽ വലത് വശം → കളി നിർത്തുക ⏸",
            lblLeftDiagram: "◀<br>ഇടത്തോട്ട്<br>നീക്കുക",
            lblRightDiagram: "▶<br>വലത്തോട്ട്<br>നീക്കുക"
        }
    };

    let currentLang = 'en';

    function setLanguage(lang) {
    document.documentElement.lang = lang;
        currentLang = lang;
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Set diagram HTML labels (since they contain HTML <br>)
        document.getElementById('lbl-left-diagram').innerHTML = translations[lang]['lblLeftDiagram'];
        document.getElementById('lbl-right-diagram').innerHTML = translations[lang]['lblRightDiagram'];

        if (lang === 'en') {
            langEn.classList.add('active');
            langMl.classList.remove('active');
            langEnPause.classList.add('active');
            langMlPause.classList.remove('active');
        } else {
            langMl.classList.add('active');
            langEn.classList.remove('active');
            langMlPause.classList.add('active');
            langEnPause.classList.remove('active');
        }
    }

    [langEn, langEnPause].forEach(btn => btn.addEventListener('click', () => setLanguage('en')));
    [langMl, langMlPause].forEach(btn => btn.addEventListener('click', () => setLanguage('ml')));

    setLanguage('en');

    // ── STATE ──────────────────────────────────────────────────────────────────
    let board, currentPiece, score, isGameOver, isPaused, isSoftDrop, gameInterval;

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

    // ── HARD RESET — clears EVERYTHING before a new game ──────────────────────
    function hardReset() {
        currentPiece = null;
        isGameOver   = true;

        clearInterval(gameInterval);
        gameInterval = null;

        while (boardEl.firstChild) boardEl.removeChild(boardEl.firstChild);

        board = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));

        score      = 0;
        isPaused   = false;
        isSoftDrop = false;
        isGameOver = false;

        scoreEl.textContent          = '0';
        pauseBtn.textContent         = '⏸';
        pauseScreen.style.display    = 'none';
        gameoverScreen.style.display = 'none';
    }

    // ── DRAW ───────────────────────────────────────────────────────────────────
    function draw() {
        const cells = boardEl.getElementsByClassName('t-cell');
        for (let i = cells.length - 1; i >= 0; i--) {
            cells[i].parentNode.removeChild(cells[i]);
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c]) placeCell(r, c, board[r][c]);
            }
        }

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
            left:${c * CW}%; top:${r * CH}%;
            width:${CW}%; height:${CH}%;
            background:${COLORS[val]};
            border:1px solid rgba(0,0,0,0.35);
            box-shadow:inset 2px 2px 4px rgba(255,255,255,0.2),inset -1px -1px 3px rgba(0,0,0,0.4);
        `;
        boardEl.appendChild(el);
    }

    // ── PIECE ──────────────────────────────────────────────────────────────────
    function spawn() {
        const type = Math.ceil(Math.random() * 7);
        const shape = SHAPES[type].map(r => [...r]);
        currentPiece = {
            shape,
            r: -shape.length,
            c: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2)
        };
        if (collides(0, 0, currentPiece.shape)) endGame();
    }

    function collides(dr, dc, shape) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const nr = currentPiece.r + r + dr;
                    const nc = currentPiece.c + c + dc;
                    if (nc < 0 || nc >= COLS || nr >= ROWS) return true;
                    if (nr >= 0 && board[nr][nc])           return true;
                }
            }
        }
        return false;
    }

    function move(dr, dc) {
        if (isGameOver || isPaused || !currentPiece) return;
        if (!collides(dr, dc, currentPiece.shape)) {
            currentPiece.r += dr;
            currentPiece.c += dc;
            if (dc !== 0) Sounds.play('move');
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
            Sounds.play('rotate');
            draw();
        }
    }

    function lock() {
        let topped = false;
        currentPiece.shape.forEach((row, r) => {
            row.forEach((val, c) => {
                if (val) {
                    if (currentPiece.r + r < 0) { topped = true; return; }
                    board[currentPiece.r + r][currentPiece.c + c] = val;
                }
            });
        });
        if (topped) { endGame(); return; }
        clearLines();
        spawn();
        draw();
    }

    function clearLines() {
        const bonuses = [0, 100, 300, 500, 800];
        let cleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r].every(v => v !== 0)) {
                board.splice(r, 1);
                board.unshift(new Array(COLS).fill(0));
                cleared++;
                r++;
            }
        }
        if (cleared) {
            score += bonuses[cleared] ?? cleared * 100;
            scoreEl.textContent = score;
            Sounds.play('lineClear');
        } else {
            Sounds.play('drop');
        }
    }

    // ── FLOW ───────────────────────────────────────────────────────────────────
    function startLoop() {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => move(1, 0), isSoftDrop ? FAST_SPEED : NORMAL_SPEED);
    }

    function startGame() {
        hardReset();
        startScreen.style.display = 'none';
        gameScreen.style.display  = 'flex';
        requestGameFullscreen();
        spawn();
        draw();
        startLoop();
    }

    function restartGame() {
        hardReset();
        spawn();
        draw();
        startLoop();
    }

    function endGame() {
        isGameOver   = true;
        currentPiece = null;
        clearInterval(gameInterval);
        gameInterval = null;
        finalScoreEl.textContent     = score;
        gameoverScreen.style.display = 'flex';
        if (typeof Sounds !== 'undefined') Sounds.play('gameOver');
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

    // ── BUTTONS ────────────────────────────────────────────────────────────────
    document.getElementById('start-game-btn')   .addEventListener('click', startGame);
    document.getElementById('restart-btn')      .addEventListener('click', restartGame);
    document.getElementById('pause-restart-btn').addEventListener('click', restartGame);
    document.getElementById('resume-btn')       .addEventListener('click', togglePause);
    
    document.getElementById('quit-home-btn')    .addEventListener('click', () => {
        isPaused = false;
        isGameOver = true;
        clearInterval(gameInterval);
        gameInterval = null;
        pauseScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        exitGameFullscreen();
    });
    
    document.getElementById('go-home-btn')      .addEventListener('click', () => {
        gameoverScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        exitGameFullscreen();
    });
    
    document.getElementById('btn-rotate')       .addEventListener('click', e => { e.preventDefault(); rotate(); });
    pauseBtn.addEventListener('click', togglePause);

    // ── TOUCH ZONES ────────────────────────────────────────────────────────────
    function wire(id, events, fn) {
        const el = document.getElementById(id);
        events.forEach(ev => el.addEventListener(ev, fn, { passive: false }));
    }

    wire('zone-left',  ['touchstart', 'mousedown'], e => { e.preventDefault(); move(0, -1); });
    wire('zone-right', ['touchstart', 'mousedown'], e => { e.preventDefault(); move(0,  1); });

    function softStart(e) {
        e.preventDefault();
        if (!isSoftDrop && !isPaused && !isGameOver) {
            isSoftDrop = true;
            move(1, 0);
            startLoop();
        }
    }
    function softStop() {
        if (isSoftDrop) { isSoftDrop = false; startLoop(); }
    }

    wire('zone-down', ['touchstart', 'mousedown'],               softStart);
    wire('zone-down', ['touchend',   'mouseup', 'mouseleave'],   softStop);

    // ── KEYBOARD ───────────────────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); move(0, -1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); move(0,  1); }
        if (e.key === 'ArrowUp')    { e.preventDefault(); rotate(); }
        if (e.key === 'ArrowDown' && !isSoftDrop) { isSoftDrop = true; startLoop(); }
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') togglePause();
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowDown') { isSoftDrop = false; startLoop(); }
    });

})();
