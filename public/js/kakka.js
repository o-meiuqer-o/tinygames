// kakka.js

const items = [
    // Flying (30)
    { word: "Crow", mlWord: "കാക്ക", emoji: "🦅", flies: true },
    { word: "Eagle", mlWord: "കഴുകൻ", emoji: "🦅", flies: true },
    { word: "Airplane", mlWord: "വിമാനം", emoji: "✈️", flies: true },
    { word: "Helicopter", mlWord: "ഹെലികോപ്റ്റർ", emoji: "🚁", flies: true },
    { word: "Mosquito", mlWord: "കൊതുക്", emoji: "🦟", flies: true },
    { word: "Butterfly", mlWord: "ചിത്രശലഭം", emoji: "🦋", flies: true },
    { word: "Parrot", mlWord: "തത്ത", emoji: "🦜", flies: true },
    { word: "Rocket", mlWord: "റോക്കറ്റ്", emoji: "🚀", flies: true },
    { word: "Owl", mlWord: "മൂങ്ങ", emoji: "🦉", flies: true },
    { word: "Bat", mlWord: "വവ്വാൽ", emoji: "🦇", flies: true },
    { word: "Dragon", mlWord: "വ്യാളി", emoji: "🐉", flies: true },
    { word: "Bee", mlWord: "തേനീച്ച", emoji: "🐝", flies: true },
    { word: "Dove", mlWord: "പ്രാവ്", emoji: "🕊️", flies: true },
    { word: "Kite", mlWord: "പട്ടം", emoji: "🪁", flies: true },
    { word: "Drone", mlWord: "ഡ്രോൺ", emoji: "🛸", flies: true },
    { word: "Beetle", mlWord: "വണ്ട്", emoji: "🪲", flies: true },
    { word: "Duck", mlWord: "താറാവ്", emoji: "🦆", flies: true },
    { word: "Swan", mlWord: "അരയന്നം", emoji: "🦢", flies: true },
    { word: "Crane", mlWord: "കൊക്ക്", emoji: "🦩", flies: true },
    { word: "Balloon", mlWord: "ബലൂൺ", emoji: "🎈", flies: true },
    { word: "Firefly", mlWord: "മിന്നാമിനുങ്ങ്", emoji: "✨", flies: true },
    { word: "Sparrow", mlWord: "കുരുവി", emoji: "🐦", flies: true },
    { word: "Peacock", mlWord: "മയിൽ", emoji: "🦚", flies: true },
    { word: "Superman", mlWord: "സൂപ്പർമാൻ", emoji: "🦸", flies: true },
    { word: "Cloud", mlWord: "മേഘം", emoji: "☁️", flies: true },
    { word: "Arrow", mlWord: "അമ്പ്", emoji: "🏹", flies: true },
    { word: "Fly", mlWord: "ഈച്ച", emoji: "🪰", flies: true },
    { word: "Spaceship", mlWord: "പേടകം", emoji: "🚀", flies: true },
    { word: "Missile", mlWord: "മിസൈൽ", emoji: "🚀", flies: true },
    { word: "Fairy", mlWord: "മാലാഖ", emoji: "🧚", flies: true },

    // Non-Flying (20)
    { word: "Chair", mlWord: "കസേര", emoji: "🪑", flies: false },
    { word: "Tree Stump", mlWord: "മരക്കുറ്റി", emoji: "🪵", flies: false },
    { word: "Dog", mlWord: "നായ", emoji: "🐶", flies: false },
    { word: "Cat", mlWord: "പൂച്ച", emoji: "🐱", flies: false },
    { word: "House", mlWord: "വീട്", emoji: "🏠", flies: false },
    { word: "Car", mlWord: "കാർ", emoji: "🚗", flies: false },
    { word: "Elephant", mlWord: "ആന", emoji: "🐘", flies: false },
    { word: "Tree", mlWord: "മരം", emoji: "🌳", flies: false },
    { word: "Computer", mlWord: "കമ്പ്യൂട്ടർ", emoji: "💻", flies: false },
    { word: "Apple", mlWord: "ആപ്പിൾ", emoji: "🍎", flies: false },
    { word: "Guitar", mlWord: "ഗിറ്റാർ", emoji: "🎸", flies: false },
    { word: "Bicycle", mlWord: "സൈക്കിൾ", emoji: "🚲", flies: false },
    { word: "Penguin", mlWord: "പെൻഗ്വിൻ", emoji: "🐧", flies: false },
    { word: "Lion", mlWord: "സിംഹം", emoji: "🦁", flies: false },
    { word: "Tiger", mlWord: "കടുവ", emoji: "🐯", flies: false },
    { word: "Snake", mlWord: "പാമ്പ്", emoji: "🐍", flies: false },
    { word: "Monkey", mlWord: "കുരങ്ങ്", emoji: "🐒", flies: false },
    { word: "Train", mlWord: "ട്രെയിൻ", emoji: "🚂", flies: false },
    { word: "Bus", mlWord: "ബസ്", emoji: "🚌", flies: false },
    { word: "Ship", mlWord: "കപ്പൽ", emoji: "🚢", flies: false }
];

// DOM Elements
const DOM = {
    startScreen: document.getElementById('start-screen'),
    gameContainer: document.getElementById('game-container'),
    scoreEl: document.getElementById('score'),
    emojiEl: document.getElementById('emoji-display'),
    wordEl: document.getElementById('word-display'),
    timerBar: document.getElementById('timer-bar'),
    tapZone: document.getElementById('tap-zone'),
    displayArea: document.getElementById('display-area'),
    gameoverScreen: document.getElementById('gameover-screen'),
    pauseScreen: document.getElementById('pause-screen'),
    finalScoreEl: document.getElementById('final-score'),
    reasonEl: document.getElementById('gameover-reason'),
    langEn: document.getElementById('lang-en'),
    langMl: document.getElementById('lang-ml'),
    langEnPause: document.getElementById('lang-en-pause'),
    langMlPause: document.getElementById('lang-ml-pause'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    resumeBtn: document.getElementById('resume-btn'),
    quitBtn: document.getElementById('quit-btn')
};

// Translations
const translations = {
    en: {
        title: "Kakka Parannal",
        subtitle: "A high-speed reflex game",
        instructionsPremise: "If the object CAN FLY, tap the pink zone before time runs out. If it CANNOT FLY, do nothing and wait for the timer to end!",
        startBtn: "Play Now",
        backHub: "Back to Hub",
        scoreText: "Score: ",
        ruleTapZone: "Tap if it Flies!",
        paused: "PAUSED",
        resume: "Resume",
        quit: "Quit Game",
        playAgain: "Play Again",
        gameOverTitle: "Game Over!",
        gameoverReasonFly: "You missed the {item}! It flies!",
        gameoverReasonNoFly: "A {item} doesn't fly!"
    },
    ml: {
        title: "കാക്ക പറക്കൽ",
        subtitle: "ഒരു അതിവേഗ റിഫ്ലെക്സ് കളി",
        instructionsPremise: "കാണിക്കുന്ന വസ്തുവിനു പറക്കാൻ കഴിയുമെങ്കിൽ, സമയം കഴിയുന്നതിന് മുൻപ് താഴെയുള്ള പിങ്ക് ഭാഗത്ത് തൊടുക. പറക്കാൻ കഴിയില്ലെങ്കിൽ ഒന്നും ചെയ്യാതെ കാത്തിരിക്കുക!",
        startBtn: "കളി തുടങ്ങാം",
        backHub: "തിരികെ പോകുക",
        scoreText: "സ്കോർ: ",
        ruleTapZone: "പറക്കുമെങ്കിൽ തൊടുക!",
        paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
        resume: "തുടരുക",
        quit: "കളി നിർത്തുക",
        playAgain: "വീണ്ടും കളിക്കുക",
        gameOverTitle: "കളി കഴിഞ്ഞു!",
        gameoverReasonFly: "{item} നിങ്ങൾക്ക് വിട്ടുപോയി! അത് പറക്കും!",
        gameoverReasonNoFly: "{item} പറക്കില്ലല്ലോ!"
    }
};

// State — declared first so setLanguage() has no TDZ risk
let score = 0;
let isPlaying = false;
let isPaused = false;
let currentItem = null;
let itemStartTime = 0;
let currentDuration = 1800; // ms to react
let animationFrameId = null;
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
    
    // update current item display language if game active
    if (currentItem && isPlaying) {
        DOM.wordEl.textContent = currentLang === 'ml' ? currentItem.mlWord : currentItem.word;
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

// Speak text using pre-generated audio files
let currentAudio = null;
function playChorusAudio(wordEn, lang) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    const safeWord = wordEn.toLowerCase();
    currentAudio = new Audio(`sounds/${lang}/${safeWord}.mp3`);
    currentAudio.play().catch(e => console.log("Audio play failed:", e));
}

function startGame() {
    score = 0;
    currentDuration = 1800;
    DOM.scoreEl.textContent = score;
    isPlaying = true;
    isPaused = false;
    
    DOM.startScreen.classList.add('hidden');
    DOM.gameContainer.classList.remove('hidden');
    DOM.gameoverScreen.classList.add('hidden');
    DOM.pauseScreen.classList.add('hidden');
    
    requestGameFullscreen();
    if (typeof Sounds !== 'undefined') Sounds.play('place');
    nextItem();
}

function nextItem() {
    if (!isPlaying) return;

    // Remove animation classes to reset them
    DOM.emojiEl.classList.remove('animate-pop');
    DOM.displayArea.classList.remove('animate-shake');
    
    // Pick random
    currentItem = items[Math.floor(Math.random() * items.length)];
    DOM.emojiEl.textContent = currentItem.emoji;
    
    // Set text and play the pre-generated chorus audio
    if (currentLang === 'ml') {
        DOM.wordEl.textContent = currentItem.mlWord;
        playChorusAudio(currentItem.word, 'ml');
    } else {
        DOM.wordEl.textContent = currentItem.word;
        playChorusAudio(currentItem.word, 'en');
    }
    
    // Trigger pop animation via reflow
    void DOM.emojiEl.offsetWidth;
    DOM.emojiEl.classList.add('animate-pop');

    itemStartTime = performance.now();
    
    // Decrease duration to make it harder, down to 600ms
    currentDuration = Math.max(600, 1800 - (score * 50));

    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(updateTimer);
}

let lastTickTime = 0;

function updateTimer(timestamp) {
    if (!isPlaying) return;
    if (isPaused) {
        // Adjust start time so timer doesn't jump after unpause
        itemStartTime += (timestamp - lastTickTime);
        lastTickTime = timestamp;
        animationFrameId = requestAnimationFrame(updateTimer);
        return;
    }

    lastTickTime = timestamp;
    const elapsed = timestamp - itemStartTime;
    const remaining = Math.max(0, currentDuration - elapsed);
    const percent = (remaining / currentDuration) * 100;

    DOM.timerBar.style.transform = `scaleX(${percent / 100})`;

    if (remaining <= 0) {
        // Time ran out!
        if (currentItem.flies) {
            // It flies, but user didn't tap!
            const itemLabel = currentLang === 'ml' ? currentItem.mlWord : currentItem.word;
            const reason = translations[currentLang]['gameoverReasonFly'].replace('{item}', itemLabel);
            gameOver(reason);
        } else {
            // It doesn't fly, and user correctly did nothing.
            success();
        }
    } else {
        animationFrameId = requestAnimationFrame(updateTimer);
    }
}

function success() {
    score++;
    DOM.scoreEl.textContent = score;
    if (typeof Sounds !== 'undefined') Sounds.play('claimBox'); // nice ding sound
    
    // Tiny pause before next item
    isPlaying = false;
    DOM.timerBar.style.transform = `scaleX(1)`;
    setTimeout(() => {
        if (!isPaused) {
            isPlaying = true;
            nextItem();
        }
    }, 300);
}

function gameOver(reasonText) {
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);
    DOM.displayArea.classList.add('animate-shake');
    if (typeof Sounds !== 'undefined') Sounds.play('lose');
    
    setTimeout(() => {
        DOM.finalScoreEl.textContent = score;
        DOM.reasonEl.textContent = reasonText;
        DOM.gameoverScreen.classList.remove('hidden');
    }, 500);
}

// Tap handling
DOM.tapZone.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!isPlaying || isPaused) return;

    if (currentItem.flies) {
        // Correct tap!
        success();
    } else {
        // Tapped a non-flying object!
        const itemLabel = currentLang === 'ml' ? currentItem.mlWord : currentItem.word;
        const reason = translations[currentLang]['gameoverReasonNoFly'].replace('{item}', itemLabel);
        gameOver(reason);
    }
});

DOM.pauseBtn.addEventListener('click', () => {
    if (!isPlaying || isPaused) return;
    isPaused = true;
    lastTickTime = performance.now();
    DOM.pauseScreen.classList.remove('hidden');
});

DOM.resumeBtn.addEventListener('click', () => {
    isPaused = false;
    lastTickTime = performance.now();
    DOM.pauseScreen.classList.add('hidden');
});

DOM.quitBtn.addEventListener('click', () => {
    isPaused = false;
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);
    DOM.pauseScreen.classList.add('hidden');
    DOM.gameContainer.classList.add('hidden');
    DOM.startScreen.classList.remove('hidden');
    exitGameFullscreen();
});

// Start/Restart/Back to Hub
DOM.startBtn.addEventListener('click', startGame);
DOM.restartBtn.addEventListener('click', startGame);

