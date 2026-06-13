# Skill: HTML/JS Game Development for TinyGames

## Project Architecture

```
d:\tinygames\
├── server.js              ← Express + Socket.io backend
├── package.json           ← Node 18, express 5, socket.io 4
├── Dockerfile             ← HuggingFace deployment
├── public/
│   ├── index.html         ← Game hub (lists all games)
│   ├── <game-name>.html   ← One HTML file per game
│   ├── css/
│   │   ├── style.css      ← Global shared design system
│   │   └── <game>.css     ← Game-specific styles
│   ├── js/
│   │   ├── app.js         ← PWA install prompt
│   │   ├── sounds.js      ← Web Audio API sound effects (shared)
│   │   └── <game>.js      ← Game-specific logic
│   ├── sounds/
│   │   ├── en/            ← English TTS audio (mp3)
│   │   └── ml/            ← Malayalam TTS audio (mp3)
│   ├── manifest.json      ← PWA manifest
│   └── sw.js              ← Service worker (cache v27+)
└── skills/                ← Project skill files (this folder)
```

---

## Standard Game HTML Structure

Every game page follows this pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Game Name</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/game-name.css">
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <!-- 1. START SCREEN / LOUNGE -->
  <div id="start-screen" class="container hub-container">
    <header>
      <h1 data-i18n="title">Game Name</h1>
      <p data-i18n="subtitle">Game tagline</p>
    </header>
    <!-- Language selector (EN/ML) -->
    <div style="text-align: center; margin: 10px 0;">
      <button id="lang-en" class="btn outline-btn active">English</button>
      <button id="lang-ml" class="btn outline-btn">മലയാളം</button>
    </div>
    <!-- Game instructions -->
    <div class="instructions">...</div>
    <button id="play-btn" class="btn primary-btn" data-i18n="play">Play Now</button>
    <a href="index.html" class="back-link" data-i18n="backHub">Back to Hub</a>
  </div>

  <!-- 2. GAME CONTAINER -->
  <div id="game-container" class="app-container hidden">
    <header class="compact-header">
      <a href="index.html" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </a>
      <h1 data-i18n="title">Game Name</h1>
      <button id="pause-top-btn">⏸</button>
    </header>
    <!-- Game area here -->
    <!-- Pause overlay -->
    <div id="pause-overlay" class="hidden overlay">...</div>
    <!-- Game over modal -->
    <div class="game-over-modal" id="gameOverModal">...</div>
  </div>

  <script src="/socket.io/socket.io.js"></script>  <!-- only for multiplayer -->
  <script src="js/sounds.js"></script>
  <script src="js/game-name.js"></script>
</body>
</html>
```

---

## Game State Machine Pattern

All games follow this state machine:

```
LOUNGE → PLAYING → PAUSED → PLAYING → GAME_OVER → LOUNGE
```

```javascript
// State management
let gameState = 'LOUNGE'; // 'LOUNGE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'

document.getElementById('play-btn').addEventListener('click', startGame);
document.getElementById('pause-top-btn').addEventListener('click', pauseGame);
document.getElementById('resume-btn').addEventListener('click', resumeGame);
document.getElementById('quit-btn').addEventListener('click', quitToLounge);
document.getElementById('restartBtn').addEventListener('click', startGame);

function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');
  gameState = 'PLAYING';
  // init game logic...
}

function pauseGame() {
  gameState = 'PAUSED';
  document.getElementById('pause-overlay').classList.remove('hidden');
}

function resumeGame() {
  gameState = 'PLAYING';
  document.getElementById('pause-overlay').classList.add('hidden');
}

function quitToLounge() {
  document.getElementById('game-container').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
  gameState = 'LOUNGE';
}

function showGameOver(winner) {
  document.getElementById('gameOverModal').style.display = 'flex';
  gameState = 'GAME_OVER';
}
```

---

## Game Loop Pattern (requestAnimationFrame)

```javascript
let animId = null;
let lastTime = 0;

function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  
  if (gameState !== 'PLAYING') return;
  
  update(dt);
  render();
  
  animId = requestAnimationFrame(gameLoop);
}

function startLoop() {
  lastTime = performance.now();
  animId = requestAnimationFrame(gameLoop);
}

function stopLoop() {
  if (animId) cancelAnimationFrame(animId);
  animId = null;
}
```

---

## Timer Pattern (Score/Countdown)

```javascript
let score = 0;
let timeLeft = 60;
let timerInterval = null;

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
```

---

## Adding a New Game to the Hub

1. Create `public/<game-name>.html`
2. Create `public/css/<game-name>.css`
3. Create `public/js/<game-name>.js`
4. Add card to `public/index.html`:
   ```html
   <a href="game-name.html" class="game-card" data-category="single-player">
     <div class="card-icon">🎮</div>
     <h2>Game Name</h2>
     <p>Short description.</p>
   </a>
   ```
5. Add JS file to `public/sw.js` ASSETS array
6. Bump sw.js cache version

### Category Values
- `single-player` — solo games
- `multi-player` — 2-player (online/local)
- `play-learn` — educational games
- Games can belong to multiple: `"single-player play-learn"`

---

## Successful Games Built

| Game | Type | Notable Tech |
|------|------|-------------|
| Tic-Tac-Toe | Multi-player | Socket.io |
| Dots & Boxes | Multi-player | Socket.io, dynamic grid |
| Pallanguzhi | Multi-player | Socket.io, traditional game logic |
| Aadu Puli Aattam | Multi-player | Socket.io, SVG board, QR code room join |
| Kakka Parannal (Crow Flies) | Single-player | TTS audio, bilingual, emoji icons |
| Hermit Crab's Real Estate | Single-player | Nipple.js joystick, mobile fullscreen |
| Block Drop (Tetris) | Single-player | requestAnimationFrame, grid |
| Signal Green | Single-player + Educational | Complex simulation |
| Syn-Ant Switchback | Single-player + Educational | Word matching, reflex |

---

## Mobile-First Rules

- Always add: `maximum-scale=1.0, user-scalable=no` in viewport meta
- Use `position: fixed` for game containers that should fill screen
- Use `100dvh` or `100vh` carefully — prefer `height: 100%` with flex-grow
- Touch events: prefer `touchstart`/`touchend` over `click` for responsiveness
- Joystick: use `nipplejs` for analog movement controls

---

## Web Audio API Sound Pattern

Sounds are synthesized (no audio files needed for UI sounds):
```javascript
// In sounds.js — already included in all games
Sounds.play('click');
Sounds.play('win');
Sounds.play('lose');
Sounds.play('place');   // board placement
Sounds.play('capture'); // piece captured
```

For game-specific voice audio (pre-generated MP3):
```javascript
function playVoice(word, lang = 'en') {
  const audio = new Audio(`/sounds/${lang}/${word.toLowerCase()}.mp3`);
  audio.play().catch(() => {});
}
```
