/**
 * Syn-Ant Switchback
 * Cognitive reflex word relationship game for kids.
 */

const WORDS_DB = {
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

// DOM Elements
const gameWrapper = document.getElementById('game-wrapper');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives-display');
const ruleIndicator = document.getElementById('rule-indicator');
const targetWordEl = document.getElementById('target-word');
const flashBanner = document.getElementById('flash-banner');
const cells = document.querySelectorAll('.cell');

const startScreen = document.getElementById('start-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const pauseScreen = document.getElementById('pause-screen');
const finalScoreEl = document.getElementById('final-score');
const gameoverReasonEl = document.getElementById('gameover-reason');

// Game State
let score = 0;
let lives = 3;
let currentLevel = 1;
let isPlaying = false;
let isPaused = false;
let currentMode = 'synonym'; // 'synonym' or 'antonym'
let currentTarget = null; // { word, synonyms, antonyms }
let loopInterval = null;
let ruleSwitchInterval = null;

let bubbleLifespan = 2000; // ms
let spawnRate = 1200; // ms

// Audio
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
    switchRule(true); // Pick random initial rule
    
    isPlaying = true;
    isPaused = false;
    
    startLoops();
}

function stopGame(reason) {
    isPlaying = false;
    stopLoops();
    clearBoard();
    playSound('gameOver');
    
    finalScoreEl.innerText = score;
    gameoverReasonEl.innerText = reason;
    
    gameoverScreen.classList.remove('hidden');
}

function loseLife(reason) {
    if (!isPlaying) return;
    
    lives--;
    updateLives();
    playSound('lose');
    
    gameWrapper.classList.add('animate-shake');
    setTimeout(() => gameWrapper.classList.remove('animate-shake'), 300);
    
    if (lives <= 0) {
        stopGame(reason || "Out of lives!");
    }
}

function updateScore() {
    scoreEl.innerText = score;
    checkLevelUp();
}

function updateLives() {
    livesEl.innerText = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
}

function updateLevel() {
    levelEl.innerText = currentLevel;
}

function checkLevelUp() {
    let nextLevel = currentLevel;
    if (score >= 150) nextLevel = 3;
    else if (score >= 60) nextLevel = 2;
    
    if (nextLevel > currentLevel && WORDS_DB[nextLevel]) {
        currentLevel = nextLevel;
        updateLevel();
        
        // Make it faster
        if (currentLevel === 2) {
            bubbleLifespan = 1600;
            spawnRate = 1000;
        } else if (currentLevel === 3) {
            bubbleLifespan = 1200;
            spawnRate = 800;
        }
        
        showFlash("LEVEL " + currentLevel + "!");
        playSound('win');
        
        // Restart loops with new speed
        stopLoops();
        startLoops();
    }
}

function switchRule(initial = false) {
    if (!isPlaying && !initial) return;
    
    // Pick target word from current level or below
    const availablePool = [];
    for (let l = 1; l <= currentLevel; l++) {
        availablePool.push(...WORDS_DB[l]);
    }
    
    const randomTarget = availablePool[Math.floor(Math.random() * availablePool.length)];
    currentTarget = randomTarget;
    targetWordEl.innerText = currentTarget.word;
    
    // Pick mode
    currentMode = Math.random() > 0.5 ? 'synonym' : 'antonym';
    
    gameWrapper.className = 'game-wrapper mode-' + currentMode;
    ruleIndicator.innerText = "TAP " + currentMode.toUpperCase() + "S";
    
    if (!initial) {
        showFlash("SWITCH TO " + currentMode.toUpperCase() + "S!");
    }
}

function showFlash(text) {
    flashBanner.innerText = text;
    flashBanner.classList.remove('hidden');
    // Restart animation
    flashBanner.style.animation = 'none';
    void flashBanner.offsetWidth; // trigger reflow
    flashBanner.style.animation = null;
    
    setTimeout(() => {
        flashBanner.classList.add('hidden');
    }, 800);
}

function spawnBubble() {
    if (!isPlaying || isPaused) return;
    
    // Find empty cells
    const emptyCells = Array.from(cells).filter(c => c.children.length === 0);
    if (emptyCells.length === 0) return; // Board full
    
    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Decide if it should be a correct answer or distraction
    // We want a good mix. 40% chance correct, 60% distraction.
    const isCorrectTarget = Math.random() < 0.4;
    
    let bubbleWord = "";
    let isMatch = false; // Is this a match for the CURRENT rule?
    
    if (isCorrectTarget) {
        if (currentMode === 'synonym') {
            bubbleWord = currentTarget.synonyms[Math.floor(Math.random() * currentTarget.synonyms.length)];
            isMatch = true;
        } else {
            bubbleWord = currentTarget.antonyms[Math.floor(Math.random() * currentTarget.antonyms.length)];
            isMatch = true;
        }
    } else {
        // Distraction: could be the opposite rule of the current target, or a random word
        if (Math.random() < 0.5) {
            // Opposite of current rule
            if (currentMode === 'synonym') {
                bubbleWord = currentTarget.antonyms[Math.floor(Math.random() * currentTarget.antonyms.length)];
            } else {
                bubbleWord = currentTarget.synonyms[Math.floor(Math.random() * currentTarget.synonyms.length)];
            }
        } else {
            // Random word from database entirely
            const randLevel = Math.floor(Math.random() * currentLevel) + 1;
            const randItem = WORDS_DB[randLevel][Math.floor(Math.random() * WORDS_DB[randLevel].length)];
            const sublist = Math.random() < 0.5 ? randItem.synonyms : randItem.antonyms;
            bubbleWord = sublist[Math.floor(Math.random() * sublist.length)];
        }
        
        // Double check it's not accidentally correct
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
    
    // Trigger timer animation
    requestAnimationFrame(() => {
        timerBar.style.transform = 'scaleX(0)';
    });
    
    // Handle Click
    let handled = false;
    
    // Store timeout ID on the bubble
    bubble.dataset.timeoutId = setTimeout(() => {
        if (!handled && isPlaying && !isPaused) {
            handled = true;
            // It expired
            if (isMatch) {
                // Player missed a correct word!
                loseLife("Missed a correct word!");
                bubble.classList.add('bubble-wrong');
            }
            // Remove it
            setTimeout(() => { if (parent.contains(bubble)) parent.removeChild(bubble); }, 300);
            bubble.style.animation = 'fadeOut 0.3s forwards';
        }
    }, bubbleLifespan);
    
    // Interaction Event (Touch/Click)
    const onInteract = (e) => {
        e.preventDefault();
        if (handled || !isPlaying || isPaused) return;
        handled = true;
        clearTimeout(Number(bubble.dataset.timeoutId));
        
        if (isMatch) {
            // Correct Tap
            score += 10;
            updateScore();
            playSound('click');
            bubble.classList.add('bubble-correct');
            setTimeout(() => { if (parent.contains(bubble)) parent.removeChild(bubble); }, 300);
        } else {
            // Wrong Tap
            loseLife("Tapped the wrong word!");
            bubble.classList.add('bubble-wrong');
            setTimeout(() => { if (parent.contains(bubble)) parent.removeChild(bubble); }, 300);
        }
    };
    
    bubble.addEventListener('mousedown', onInteract);
    bubble.addEventListener('touchstart', onInteract, { passive: false });
}

function clearBoard() {
    cells.forEach(c => {
        c.innerHTML = '';
    });
}

function startLoops() {
    loopInterval = setInterval(spawnBubble, spawnRate);
    ruleSwitchInterval = setInterval(() => {
        switchRule(false);
    }, 7000); // Change rule every 7 seconds
}

function stopLoops() {
    clearInterval(loopInterval);
    clearInterval(ruleSwitchInterval);
}

// Controls
document.getElementById('start-btn').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    initGame();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    gameoverScreen.classList.add('hidden');
    initGame();
});

document.getElementById('pause-btn').addEventListener('click', () => {
    if (!isPlaying) return;
    isPaused = true;
    pauseScreen.classList.remove('hidden');
    
    // Pause all active bubble timers? 
    // It's a bit complex with CSS transitions, so we just let them visually finish but ignore logic
    // Actually, simple pause is fine for a kids game
});

document.getElementById('resume-btn').addEventListener('click', () => {
    pauseScreen.classList.add('hidden');
    isPaused = false;
});

document.getElementById('quit-btn').addEventListener('click', () => {
    pauseScreen.classList.add('hidden');
    stopGame("Quit");
});

document.getElementById('start-hub').addEventListener('click', () => { window.location.href = 'index.html'; });
document.getElementById('go-hub').addEventListener('click', () => { window.location.href = 'index.html'; });
