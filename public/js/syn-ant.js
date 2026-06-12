/**
 * Syn-Ant Switchback
 * Cognitive reflex word relationship game for kids.
 */

const WORDS_DB_EN = {
    1: [
        { word: "BIG", synonyms: ["Huge", "Large", "Giant"], antonyms: ["Small", "Tiny", "Little"] },
        { word: "HOT", synonyms: ["Warm", "Boiling", "Fiery"], antonyms: ["Cold", "Cool", "Chilly"] },
        { word: "HAPPY", synonyms: ["Glad", "Joyful", "Cheerful"], antonyms: ["Sad", "Angry", "Upset"] },
        { word: "FAST", synonyms: ["Quick", "Speedy", "Rapid"], antonyms: ["Slow", "Lazy", "Poky"] },
        { word: "CLEAN", synonyms: ["Neat", "Tidy", "Pure"], antonyms: ["Dirty", "Messy", "Filthy"] }
    ],
    2: [
        { word: "BRAVE", synonyms: ["Bold", "Fearless", "Daring"], antonyms: ["Scared", "Coward", "Afraid"] },
        { word: "BRIGHT", synonyms: ["Shining", "Brilliant", "Glowing"], antonyms: ["Dull", "Dark", "Dim"] },
        { word: "HEAVY", synonyms: ["Weighty", "Bulky", "Massive"], antonyms: ["Light", "Airy", "Flimsy"] },
        { word: "ROUGH", synonyms: ["Bumpy", "Uneven", "Coarse"], antonyms: ["Smooth", "Flat", "Even"] },
        { word: "SHARP", synonyms: ["Pointed", "Keen", "Spiky"], antonyms: ["Blunt", "Dull", "Rounded"] }
    ],
    3: [
        { word: "GIGANTIC", synonyms: ["Massive", "Enormous", "Colossal"], antonyms: ["Mini", "Tiny", "Micro"] },
        { word: "STURDY", synonyms: ["Strong", "Solid", "Firm"], antonyms: ["Weak", "Fragile", "Shaky"] },
        { word: "TIMID", synonyms: ["Shy", "Bashful", "Nervous"], antonyms: ["Bold", "Confident", "Brave"] },
        { word: "GENEROUS", synonyms: ["Kind", "Giving", "Helpful"], antonyms: ["Greedy", "Selfish", "Mean"] },
        { word: "CLUMSY", synonyms: ["Awkward", "Careless", "Bumbling"], antonyms: ["Graceful", "Careful", "Neat"] }
    ]
};

const WORDS_DB_ML = {
    1: [
        { word: "വലുത്", synonyms: ["വലിയ", "ഭീമൻ", "വമ്പൻ"], antonyms: ["ചെറുത്", "കുഞ്ഞ്", "ഇത്തിരി"] },
        { word: "ചൂട്", synonyms: ["ഉഷ്ണം", "ചൂടുള്ള", "വേനൽ"], antonyms: ["തണുപ്പ്", "കുളിര്", "ഹിമം"] },
        { word: "സന്തോഷം", synonyms: ["ആനന്ദം", "ഉല്ലാസം", "പ്രീതി"], antonyms: ["സങ്കടം", "വിഷമം", "ദേഷ്യം"] },
        { word: "വേഗത", synonyms: ["വേഗം", "ഓട്ടം", "ത്വര"], antonyms: ["പതുക്കെ", "മെല്ലെ", "മടി"] },
        { word: "വൃത്തി", synonyms: ["വെടിപ്പ്", "ശുദ്ധി", "നന്മ"], antonyms: ["അഴുക്ക്", "വഷളൻ", "കാടത്തം"] }
    ],
    2: [
        { word: "ധീരൻ", synonyms: ["ധൈര്യശാലി", "നെഞ്ചൂക്ക്", "പോരാളി"], antonyms: ["പേടിത്തൊണ്ടൻ", "പേടി", "ഭീരു"] },
        { word: "വെളിച്ചം", synonyms: ["പ്രകാശം", "തിളക്കം", "ദീപ്തി"], antonyms: ["ഇരുട്ട്", "മങ്ങൽ", "കറുപ്പ്"] },
        { word: "ഭാരം", synonyms: ["കട്ടി", "തൂക്കം", "വലിപ്പം"], antonyms: ["ലഘു", "കാറ്റ്", "ഇളപ്പം"] },
        { word: "കടുപ്പം", synonyms: ["പരുക്കൻ", "പരുപരുത്ത", "കട്ടി"], antonyms: ["മൃദുലം", "മിനുസമുള്ള", "നേർത്ത"] },
        { word: "കൂർത്തത്", synonyms: ["മൂർച്ചയുള്ളത്", "അമ്പ്", "മുനയുള്ളത്"], antonyms: ["മുനയില്ലാത്തത്", "പരന്നത്", "വട്ടത്തിലുള്ളത്"] }
    ],
    3: [
        { word: "വളരെ വലിയ", synonyms: ["ഭീമൻ", "ഭീമാകാരമായ", "അതിഭയങ്കര"], antonyms: ["കുഞ്ഞു", "സൂക്ഷ്മ", "തരിപ്പണം"] },
        { word: "കരുത്തുള്ള", synonyms: ["ബലമുള്ള", "ശക്തമായ", "ഉറപ്പുള്ള"], antonyms: ["ബലമില്ലാത്ത", "ഉറപ്പില്ലാത്ത", "പതറുന്ന"] },
        { word: "ശങ്കയുള്ള", synonyms: ["നാണമുള്ള", "പേടിയുള്ള", "വിറയ്ക്കുന്ന"], antonyms: ["ധൈര്യമുള്ള", "ഉറച്ച", "ധീരമായ"] },
        { word: "ദയാലു", synonyms: ["ഉദാരൻ", "കരുണയുള്ള", "നല്ല"], antonyms: ["പിശുക്കൻ", "ക്രൂരൻ", "ദയയില്ലാത്ത"] },
        { word: "അശ്രദ്ധൻ", synonyms: ["അബദ്ധം", "വയ്യാവേലി", "വഷളൻ"], antonyms: ["ശ്രദ്ധയുള്ള", "മിടുക്കൻ", "വൃത്തിപൂർവ്വം"] }
    ]
};

// DOM Elements
const DOM = {
    startScreen: document.getElementById('start-screen'),
    gameContainer: document.getElementById('game-container'),
    gameWrapper: document.getElementById('game-container'),
    scoreEl: document.getElementById('score'),
    levelEl: document.getElementById('level'),
    livesEl: document.getElementById('lives-display'),
    ruleIndicator: document.getElementById('rule-indicator'),
    targetWordEl: document.getElementById('target-word'),
    flashBanner: document.getElementById('flash-banner'),
    cells: document.querySelectorAll('.cell'),
    gameoverScreen: document.getElementById('gameover-screen'),
    pauseScreen: document.getElementById('pause-screen'),
    finalScoreEl: document.getElementById('final-score'),
    gameoverReasonEl: document.getElementById('gameover-reason'),
    langEn: document.getElementById('lang-en'),
    langMl: document.getElementById('lang-ml'),
    langEnPause: document.getElementById('lang-en-pause'),
    langMlPause: document.getElementById('lang-ml-pause'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    resumeBtn: document.getElementById('resume-btn'),
    quitBtn: document.getElementById('quit-btn'),
    goHub: document.getElementById('go-hub')
};

// Translations
const translations = {
    en: {
        title: "Syn-Ant Switchback",
        subtitle: "A high-speed word matching game!",
        rulesTitle: "How to Play",
        ruleBlue: "If the screen is BLUE, tap the SYNONYMS (words with same meaning).",
        ruleRed: "If the screen flashes RED, switch to ANTONYMS (words with opposite meaning).",
        ruleTimer: "Don't let correct words disappear!",
        startBtn: "Play Now",
        backHub: "Back to Hub",
        paused: "PAUSED",
        resume: "Resume",
        quit: "Quit Game",
        playAgain: "Play Again",
        gameOverTitle: "Game Over!",
        gameoverReasonIncorrect: "Tapped the wrong word!",
        gameoverReasonMissed: "Missed a correct word!",
        gameoverReasonOut: "Out of lives!",
        scoreText: "Score: ",
        levelText: "Level: ",
        alertSwitchSyn: "SWITCH TO SYNONYMS!",
        alertSwitchAnt: "SWITCH TO ANTONYMS!",
        ruleIndicatorSyn: "TAP SYNONYMS",
        ruleIndicatorAnt: "TAP ANTONYMS",
        levelLabel: "LEVEL "
    },
    ml: {
        title: "പര്യായ-വിപരീത കളി",
        subtitle: "അതിവേഗ പദ ബന്ധ കളി!",
        rulesTitle: "കളിക്കുന്ന രീതി",
        ruleBlue: "സ്ക്രീൻ നീല നിറമാണെങ്കിൽ, പര്യായപദങ്ങളിൽ (ഒരേ അർത്ഥമുള്ള വാക്കുകൾ) തൊടുക.",
        ruleRed: "സ്ക്രീൻ ചുവപ്പ് നിറമാണെങ്കിൽ, വിപരീതപദങ്ങളിൽ (എതിർ അർത്ഥമുള്ള വാക്കുകൾ) തൊടുക.",
        ruleTimer: "ശരിയായ പദങ്ങൾ സമയം തീരുന്നതിന് മുൻപ് തൊട്ടു മാറ്റുക!",
        startBtn: "കളി തുടങ്ങാം",
        backHub: "തിരികെ പോകുക",
        paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
        resume: "തുടരുക",
        quit: "കളി നിർത്തുക",
        playAgain: "വീണ്ടും കളിക്കുക",
        gameOverTitle: "കളി കഴിഞ്ഞു!",
        gameoverReasonIncorrect: "തെറ്റായ പദം തിരഞ്ഞെടുത്തു!",
        gameoverReasonMissed: "ശരിയായ പദം വിട്ടുപോയി!",
        gameoverReasonOut: "ജീവനുകൾ തീർന്നുപോയി!",
        scoreText: "സ്കോർ: ",
        levelText: "നില: ",
        alertSwitchSyn: "പര്യായപദങ്ങളിലേക്ക് മാറുക!",
        alertSwitchAnt: "വിപരീതപദങ്ങളിലേക്ക് മാറുക!",
        ruleIndicatorSyn: "പര്യായങ്ങൾ തൊടുക",
        ruleIndicatorAnt: "വിപരീതങ്ങൾ തൊടുക",
        levelLabel: "നില "
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
    
    if (isPlaying && currentTarget) {
        DOM.ruleIndicator.innerText = translations[currentLang][currentMode === 'synonym' ? 'ruleIndicatorSyn' : 'ruleIndicatorAnt'];
    }
}

[DOM.langEn, DOM.langEnPause].forEach(btn => btn.addEventListener('click', () => setLanguage('en')));
[DOM.langMl, DOM.langMlPause].forEach(btn => btn.addEventListener('click', () => setLanguage('ml')));

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

let score = 0;
let lives = 3;
let currentLevel = 1;
let isPlaying = false;
let isPaused = false;
let currentMode = 'synonym';
let currentTarget = null;
let loopInterval = null;
let ruleSwitchInterval = null;

let bubbleLifespan = 2000;
let spawnRate = 1200;

setLanguage('en');

const playSound = (name) => {
    if (window.Sounds && typeof window.Sounds.play === 'function') {
        window.Sounds.play(name);
    }
};

function initGame() {
    score = 0;
    lives = 3;
    currentLevel = 1;
    bubbleLifespan = 2000;
    spawnRate = 1200;
    
    updateScore();
    updateLives();
    updateLevel();
    
    clearBoard();
    switchRule(true);
    
    isPlaying = true;
    isPaused = false;
    
    DOM.startScreen.classList.add('hidden');
    DOM.gameContainer.classList.remove('hidden');
    DOM.gameoverScreen.classList.add('hidden');
    DOM.pauseScreen.classList.add('hidden');
    
    requestGameFullscreen();
    startLoops();
}

function stopGame(reason) {
    isPlaying = false;
    stopLoops();
    clearBoard();
    playSound('gameOver');
    
    DOM.finalScoreEl.innerText = score;
    DOM.gameoverReasonEl.innerText = reason;
    
    DOM.gameoverScreen.classList.remove('hidden');
}

function loseLife(reason) {
    if (!isPlaying) return;
    
    lives--;
    updateLives();
    playSound('lose');
    
    DOM.gameWrapper.classList.add('animate-shake');
    setTimeout(() => DOM.gameWrapper.classList.remove('animate-shake'), 300);
    
    if (lives <= 0) {
        stopGame(translations[currentLang]['gameoverReasonOut']);
    }
}

function getGameOverReasonText(reasonCode) {
    if (reasonCode === 'incorrect') {
        return translations[currentLang]['gameoverReasonIncorrect'];
    }
    return translations[currentLang]['gameoverReasonMissed'];
}

function updateScore() {
    DOM.scoreEl.innerText = score;
    checkLevelUp();
}

function updateLives() {
    DOM.livesEl.innerText = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
}

function updateLevel() {
    DOM.levelEl.innerText = currentLevel;
}

function checkLevelUp() {
    let nextLevel = currentLevel;
    if (score >= 150) nextLevel = 3;
    else if (score >= 60) nextLevel = 2;
    
    const db = currentLang === 'ml' ? WORDS_DB_ML : WORDS_DB_EN;
    if (nextLevel > currentLevel && db[nextLevel]) {
        currentLevel = nextLevel;
        updateLevel();
        
        if (currentLevel === 2) {
            bubbleLifespan = 1600;
            spawnRate = 1000;
        } else if (currentLevel === 3) {
            bubbleLifespan = 1200;
            spawnRate = 800;
        }
        
        showFlash(translations[currentLang]['levelLabel'] + currentLevel + "!");
        playSound('win');
        
        stopLoops();
        startLoops();
    }
}

function switchRule(initial = false) {
    if (!isPlaying && !initial) return;
    
    const db = currentLang === 'ml' ? WORDS_DB_ML : WORDS_DB_EN;
    
    const availablePool = [];
    for (let l = 1; l <= currentLevel; l++) {
        availablePool.push(...db[l]);
    }
    
    const randomTarget = availablePool[Math.floor(Math.random() * availablePool.length)];
    currentTarget = randomTarget;
    DOM.targetWordEl.innerText = currentTarget.word;
    
    currentMode = Math.random() > 0.5 ? 'synonym' : 'antonym';
    
    DOM.gameWrapper.className = 'game-wrapper mode-' + currentMode;
    DOM.ruleIndicator.innerText = translations[currentLang][currentMode === 'synonym' ? 'ruleIndicatorSyn' : 'ruleIndicatorAnt'];
    
    if (!initial) {
        showFlash(translations[currentLang][currentMode === 'synonym' ? 'alertSwitchSyn' : 'alertSwitchAnt']);
    }
}

function showFlash(text) {
    DOM.flashBanner.innerText = text;
    DOM.flashBanner.classList.remove('hidden');
    DOM.flashBanner.style.animation = 'none';
    void DOM.flashBanner.offsetWidth;
    DOM.flashBanner.style.animation = null;
    
    setTimeout(() => {
        DOM.flashBanner.classList.add('hidden');
    }, 800);
}

function spawnBubble() {
    if (!isPlaying || isPaused) return;
    
    const emptyCells = Array.from(DOM.cells).filter(c => c.children.length === 0);
    if (emptyCells.length === 0) return;
    
    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const isCorrectTarget = Math.random() < 0.4;
    
    let bubbleWord = "";
    let isMatch = false;
    const db = currentLang === 'ml' ? WORDS_DB_ML : WORDS_DB_EN;
    
    if (isCorrectTarget) {
        if (currentMode === 'synonym') {
            bubbleWord = currentTarget.synonyms[Math.floor(Math.random() * currentTarget.synonyms.length)];
            isMatch = true;
        } else {
            bubbleWord = currentTarget.antonyms[Math.floor(Math.random() * currentTarget.antonyms.length)];
            isMatch = true;
        }
    } else {
        if (Math.random() < 0.5) {
            if (currentMode === 'synonym') {
                bubbleWord = currentTarget.antonyms[Math.floor(Math.random() * currentTarget.antonyms.length)];
            } else {
                bubbleWord = currentTarget.synonyms[Math.floor(Math.random() * currentTarget.synonyms.length)];
            }
        } else {
            const randLevel = Math.floor(Math.random() * currentLevel) + 1;
            const randItem = db[randLevel][Math.floor(Math.random() * db[randLevel].length)];
            const sublist = Math.random() < 0.5 ? randItem.synonyms : randItem.antonyms;
            bubbleWord = sublist[Math.floor(Math.random() * sublist.length)];
        }
        if (currentMode === 'synonym' && currentTarget.synonyms.includes(bubbleWord)) isMatch = true;
        if (currentMode === 'antonym' && currentTarget.antonyms.includes(bubbleWord)) isMatch = true;
    }
    
    createBubbleElement(cell, bubbleWord, isMatch);
}

function createBubbleElement(parent, word, isMatch) {
    const bubble = document.createElement('div');
    bubble.className = 'candidate-bubble';
    bubble.innerText = word;
    
    const timerBar = document.createElement('div');
    timerBar.className = 'bubble-timer';
    timerBar.style.transition = `transform ${bubbleLifespan}ms linear`;
    bubble.appendChild(timerBar);
    
    parent.appendChild(bubble);
    
    requestAnimationFrame(() => {
        timerBar.style.transform = 'scaleX(0)';
    });
    
    let handled = false;
    bubble.dataset.timeoutId = setTimeout(() => {
        if (!handled && isPlaying && !isPaused) {
            handled = true;
            if (isMatch) {
                loseLife(getGameOverReasonText('missed'));
                bubble.classList.add('bubble-wrong');
            }
            setTimeout(() => { if (parent.contains(bubble)) parent.removeChild(bubble); }, 300);
            bubble.style.animation = 'fadeOut 0.3s forwards';
        }
    }, bubbleLifespan);
    
    const onInteract = (e) => {
        e.preventDefault();
        if (handled || !isPlaying || isPaused) return;
        handled = true;
        clearTimeout(Number(bubble.dataset.timeoutId));
        
        if (isMatch) {
            score += 10;
            updateScore();
            playSound('click');
            bubble.classList.add('bubble-correct');
            setTimeout(() => { if (parent.contains(bubble)) parent.removeChild(bubble); }, 300);
        } else {
            loseLife(getGameOverReasonText('incorrect'));
            bubble.classList.add('bubble-wrong');
            setTimeout(() => { if (parent.contains(bubble)) parent.removeChild(bubble); }, 300);
        }
    };
    
    bubble.addEventListener('mousedown', onInteract);
    bubble.addEventListener('touchstart', onInteract, { passive: false });
}

function clearBoard() {
    DOM.cells.forEach(c => {
        c.innerHTML = '';
    });
}

function startLoops() {
    loopInterval = setInterval(spawnBubble, spawnRate);
    ruleSwitchInterval = setInterval(() => {
        switchRule(false);
    }, 7000);
}

function stopLoops() {
    clearInterval(loopInterval);
    clearInterval(ruleSwitchInterval);
}

DOM.startBtn.addEventListener('click', () => {
    initGame();
});

DOM.restartBtn.addEventListener('click', () => {
    initGame();
});

DOM.pauseBtn.addEventListener('click', () => {
    if (!isPlaying || isPaused) return;
    isPaused = true;
    DOM.pauseScreen.classList.remove('hidden');
});

DOM.resumeBtn.addEventListener('click', () => {
    DOM.pauseScreen.classList.remove('hidden');
    DOM.pauseScreen.classList.add('hidden');
    isPaused = false;
});

DOM.quitBtn.addEventListener('click', () => {
    DOM.pauseScreen.classList.add('hidden');
    stopLoops();
    clearBoard();
    isPlaying = false;
    DOM.gameContainer.classList.add('hidden');
    DOM.startScreen.classList.remove('hidden');
    exitGameFullscreen();
});

DOM.goHub.addEventListener('click', () => {
    DOM.gameoverScreen.classList.add('hidden');
    DOM.gameContainer.classList.add('hidden');
    DOM.startScreen.classList.remove('hidden');
    exitGameFullscreen();
});
