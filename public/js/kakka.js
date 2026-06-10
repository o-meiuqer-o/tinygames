// kakka.js

const items = [
    // Flying
    { word: "Crow", emoji: "🦅", flies: true }, // Eagle emoji as crow approx for simplicity or 🐦
    { word: "Eagle", emoji: "🦅", flies: true },
    { word: "Airplane", emoji: "✈️", flies: true },
    { word: "Helicopter", emoji: "🚁", flies: true },
    { word: "Mosquito", emoji: "🦟", flies: true },
    { word: "Butterfly", emoji: "🦋", flies: true },
    { word: "Parrot", emoji: "🦜", flies: true },
    { word: "Rocket", emoji: "🚀", flies: true },
    { word: "Owl", emoji: "🦉", flies: true },
    { word: "Bat", emoji: "🦇", flies: true },
    { word: "Dragon", emoji: "🐉", flies: true },
    { word: "Bee", emoji: "🐝", flies: true },

    // Non-Flying
    { word: "Table", emoji: "🪑", flies: false },
    { word: "Dog", emoji: "🐶", flies: false },
    { word: "Cat", emoji: "🐱", flies: false },
    { word: "House", emoji: "🏠", flies: false },
    { word: "Car", emoji: "🚗", flies: false },
    { word: "Elephant", emoji: "🐘", flies: false },
    { word: "Tree", emoji: "🌳", flies: false },
    { word: "Computer", emoji: "💻", flies: false },
    { word: "Apple", emoji: "🍎", flies: false },
    { word: "Guitar", emoji: "🎸", flies: false },
    { word: "Bicycle", emoji: "🚲", flies: false },
    { word: "Penguin", emoji: "🐧", flies: false } // A classic trick!
];

// DOM Elements
const scoreEl = document.getElementById('score');
const emojiEl = document.getElementById('emoji-display');
const wordEl = document.getElementById('word-display');
const timerBar = document.getElementById('timer-bar');
const tapZone = document.getElementById('tap-zone');
const displayArea = document.getElementById('display-area');

// Overlays
const startScreen = document.getElementById('start-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const pauseScreen = document.getElementById('pause-screen');
const finalScoreEl = document.getElementById('final-score');
const reasonEl = document.getElementById('gameover-reason');

// State
let score = 0;
let isPlaying = false;
let isPaused = false;
let currentItem = null;
let itemStartTime = 0;
let currentDuration = 1800; // ms to react
let animationFrameId = null;

function startGame() {
    score = 0;
    currentDuration = 1800;
    scoreEl.textContent = score;
    isPlaying = true;
    isPaused = false;
    startScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    
    Sounds.play('place');
    nextItem();
}

function nextItem() {
    if (!isPlaying) return;

    // Remove animation classes to reset them
    emojiEl.classList.remove('animate-pop');
    displayArea.classList.remove('animate-shake');
    
    // Pick random
    currentItem = items[Math.floor(Math.random() * items.length)];
    emojiEl.textContent = currentItem.emoji;
    wordEl.textContent = currentItem.word;
    
    // Trigger pop animation via reflow
    void emojiEl.offsetWidth;
    emojiEl.classList.add('animate-pop');

    itemStartTime = performance.now();
    
    // Decrease duration to make it harder, down to 600ms
    currentDuration = Math.max(600, 1800 - (score * 50));

    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(updateTimer);
}

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

    timerBar.style.transform = `scaleX(${percent / 100})`;

    if (remaining <= 0) {
        // Time ran out!
        if (currentItem.flies) {
            // It flies, but user didn't tap!
            gameOver(`You missed the ${currentItem.word}! It flies!`);
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
    scoreEl.textContent = score;
    Sounds.play('claimBox'); // nice ding sound
    
    // Tiny pause before next item
    isPlaying = false;
    timerBar.style.transform = `scaleX(1)`;
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
    displayArea.classList.add('animate-shake');
    Sounds.play('lose');
    
    setTimeout(() => {
        finalScoreEl.textContent = score;
        reasonEl.textContent = reasonText;
        gameoverScreen.classList.remove('hidden');
    }, 500);
}

// Tap handling
tapZone.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!isPlaying || isPaused) return;

    if (currentItem.flies) {
        // Correct tap!
        success();
    } else {
        // Tapped a non-flying object!
        gameOver(`A ${currentItem.word} doesn't fly!`);
    }
});

// Pause Menu
let lastTickTime = 0;

document.getElementById('pause-btn').addEventListener('click', () => {
    if (!isPlaying || isPaused) return;
    isPaused = true;
    lastTickTime = performance.now();
    pauseScreen.classList.remove('hidden');
});

document.getElementById('resume-btn').addEventListener('click', () => {
    isPaused = false;
    lastTickTime = performance.now();
    pauseScreen.classList.add('hidden');
});

document.getElementById('quit-btn').addEventListener('click', () => {
    location.href = 'index.html';
});

// Start/Restart
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
document.getElementById('start-hub').addEventListener('click', () => location.href = 'index.html');
document.getElementById('go-hub').addEventListener('click', () => location.href = 'index.html');

// PWA Logic
const installBtn = document.getElementById('install-pwa-btn');
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});
installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') installBtn.style.display = 'none';
    deferredPrompt = null;
});
