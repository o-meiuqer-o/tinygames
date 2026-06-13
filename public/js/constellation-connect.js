// constellation-connect.js

const translations = {
  en: {
    title: "Constellation Connect",
    subtitle: "Find the hidden stars in the night sky!",
    inst1: "A reference card will show you a constellation.",
    inst2: "Scan the moving starfield to find it.",
    inst3: "Trace the constellation with your finger before the stars drift apart!",
    play: "Play Now",
    backHub: "Back to Hub",
    paused: "Paused",
    resume: "Resume",
    quit: "Quit",
    gameOver: "Game Over",
    playAgain: "Play Again",
    mainMenu: "Main Menu",
    continue: "Continue",
    foundIt: "Found it!",
    timesUp: "Time's Up!",
    findPrefix: "Find ",
    hardMode: "Hard Mode (No Hints)"
  },
  ml: {
    title: "നക്ഷത്ര കൂട്ടങ്ങൾ (Constellations)",
    subtitle: "രാത്രിയിലെ ആകാശത്ത് മറഞ്ഞിരിക്കുന്ന നക്ഷത്രങ്ങളെ കണ്ടെത്തുക!",
    inst1: "ഒരു കാർഡിൽ നിങ്ങൾക്ക് കണ്ടെത്തേണ്ട നക്ഷത്രക്കൂട്ടം കാണിക്കും.",
    inst2: "നക്ഷത്രങ്ങളെ നിരീക്ഷിച്ച് അവ കണ്ടെത്തുക.",
    inst3: "നക്ഷത്രങ്ങൾ അകന്നുപോകുന്നതിന് മുമ്പ് വിരലുകൊണ്ട് അവയെ യോജിപ്പിക്കുക!",
    play: "ഇപ്പോൾ കളിക്കുക",
    backHub: "തിരികെ പോവുക",
    paused: "നിർത്തിവച്ചു",
    resume: "തുടരുക",
    quit: "പുറത്തുകടക്കുക",
    gameOver: "ഗെയിം അവസാനിച്ചു",
    playAgain: "വീണ്ടും കളിക്കുക",
    mainMenu: "മെനു",
    continue: "തുടരുക",
    foundIt: "കണ്ടെത്തി!",
    timesUp: "സമയം കഴിഞ്ഞു!",
    findPrefix: "കണ്ടെത്തുക: ",
    assistanceOff: "സഹായം അവസാനിച്ചു! ഇനി സൂചനകളില്ലാതെ നക്ഷത്രങ്ങളെ കണ്ടെത്തുക.",
    hardMode: "കഠിനമായ മോഡ് (സൂചനകളില്ല)"
  }
};

let currentLang = 'en';

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.innerText = translations[currentLang][key];
    }
  });
  
  if (gameState === 'PLAYING') {
    document.getElementById('constellation-name').innerText = currentLang === 'ml' ? targetConstellation.mlName : targetConstellation.name;
  }
}

document.getElementById('lang-en').addEventListener('click', () => {
  currentLang = 'en';
  document.getElementById('lang-en').classList.add('active');
  document.getElementById('lang-ml').classList.remove('active');
  applyTranslations();
});

document.getElementById('lang-ml').addEventListener('click', () => {
  currentLang = 'ml';
  document.getElementById('lang-ml').classList.add('active');
  document.getElementById('lang-en').classList.remove('active');
  applyTranslations();
});

document.getElementById('diff-easy').addEventListener('click', () => {
  document.getElementById('diff-easy').classList.add('active');
  document.getElementById('diff-hard').classList.remove('active');
});

document.getElementById('diff-hard').addEventListener('click', () => {
  document.getElementById('diff-hard').classList.add('active');
  document.getElementById('diff-easy').classList.remove('active');
});

let gameState = 'LOUNGE';
let animId = null;
let lastTime = 0;

let score = 0;
let strikes = 0;
const MAX_STRIKES = 3;
let currentLevel = 1;

const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
const refCanvas = document.getElementById('reference-canvas');
const refCtx = refCanvas.getContext('2d');
const lcCanvas = document.getElementById('lc-canvas');
const lcCtx = lcCanvas.getContext('2d');

function playSfx(id) {
  const el = document.getElementById(id);
  if (el) {
    el.currentTime = 0;
    el.volume = 0.7;
    el.play().catch(e => {});
  }
}

let stars = [];
let targetConstellation = null;
let targetStars = [];
let connections = [];
let shuffledConstellations = [];
let isDriftingApart = false;

// Tracing state
let isTracing = false;
let tracePath = [];
let activatedTargetStars = new Set();

// Resize handling
function resizeCanvas() {
  const container = document.querySelector('.game-area');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}
window.addEventListener('resize', resizeCanvas);

// Setup buttons
document.getElementById('play-btn').addEventListener('click', startGame);
document.getElementById('pause-top-btn').addEventListener('click', pauseGame);
document.getElementById('resume-btn').addEventListener('click', resumeGame);
document.getElementById('quit-btn').addEventListener('click', quitToLounge);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('menuBtn').addEventListener('click', quitToLounge);
document.getElementById('nextLevelBtn').addEventListener('click', startNextLevel);

function initLevel() {
  resizeCanvas();
  isDriftingApart = false;
  isTracing = false;
  tracePath = [];
  activatedTargetStars.clear();
  
  if (shuffledConstellations.length === 0) {
    shuffledConstellations = [...CONSTELLATIONS].sort(() => Math.random() - 0.5);
  }
  targetConstellation = shuffledConstellations[(currentLevel - 1) % shuffledConstellations.length];
  document.getElementById('constellation-name').innerText = currentLang === 'ml' ? targetConstellation.mlName : targetConstellation.name;
  
  drawReferenceCanvas(refCtx, refCanvas.width, refCanvas.height, targetConstellation);
  
  stars = [];
  const numBgStars = 150;
  
  // Create background stars
  for (let i = 0; i < numBgStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() * 5 + 5,      // Bottom-left to top-right
      vy: -(Math.random() * 5 + 5),
      radius: Math.random() * 1.5 + 0.5,
      isTarget: false,
      activated: false
    });
  }
  
  // Determine hint status
  const isHardMode = document.getElementById('diff-hard').classList.contains('active');
  const noHints = isHardMode;

  const targetVx = Math.random() * 3 + 6;
  const targetVy = -(Math.random() * 3 + 6);
  const scale = Math.min(canvas.width, canvas.height) * 0.3;

  targetStars = [];

  function spawnConstellation(constell, isTarget, cx, cy, addFakeStars = 0) {
    const rotation = Math.random() * Math.PI * 2;
    
    constell.stars.forEach((s, idx) => {
      const rx = s.x * Math.cos(rotation) - s.y * Math.sin(rotation);
      const ry = s.x * Math.sin(rotation) + s.y * Math.cos(rotation);
      
      const starObj = {
        id: isTarget ? idx : -1,
        x: cx + rx * scale,
        y: cy + ry * scale,
        vx: targetVx,
        vy: targetVy,
        radius: noHints ? (Math.random() * 1.5 + 0.5) : 3, 
        isTarget: isTarget,
        isDecoy: !isTarget,
        activated: false
      };
      if (isTarget) targetStars.push(starObj);
      stars.push(starObj);
    });

    // Sneak in wrong stars inside the target constellation to confuse the player
    for (let i = 0; i < addFakeStars; i++) {
      const fakeRx = (Math.random() - 0.5) * 1.5;
      const fakeRy = (Math.random() - 0.5) * 1.5;
      
      const fakeStarObj = {
        id: -1,
        x: cx + fakeRx * scale,
        y: cy + fakeRy * scale,
        vx: targetVx,
        vy: targetVy,
        radius: noHints ? (Math.random() * 1.5 + 0.5) : 3, 
        isTarget: false,
        isDecoy: true,
        activated: false
      };
      stars.push(fakeStarObj);
    }
  }

  // Spawn Target
  const targetCx = scale + Math.random() * (canvas.width - 2 * scale);
  const targetCy = scale + Math.random() * (canvas.height - 2 * scale);
  
  let numDecoys = 0;
  let numFakeStars = 0;
  if (currentLevel >= 3) {
    numDecoys = 1;
    numFakeStars = 2;
  } else if (currentLevel == 2) {
    numDecoys = 0;
    numFakeStars = 1;
  }
  
  if (isHardMode) {
    numDecoys += 1;
    numFakeStars += 1;
  }

  spawnConstellation(targetConstellation, true, targetCx, targetCy, numFakeStars);

  // Spawn Decoys further away
  for(let i = 0; i < numDecoys; i++) {
    let decoy = CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
    let decoyCx, decoyCy;
    let attempts = 0;
    do {
      decoyCx = (Math.random() * canvas.width * 1.5) - canvas.width * 0.25;
      decoyCy = (Math.random() * canvas.height * 1.5) - canvas.height * 0.25;
      let dist = Math.hypot(decoyCx - targetCx, decoyCy - targetCy);
      if (dist > scale * 2.5) break; 
      attempts++;
    } while (attempts < 15);
    
    spawnConstellation(decoy, false, decoyCx, decoyCy, 0);
  }
  
  updateStrikesDisplay();
  
  const msgPrefix = translations[currentLang].findPrefix;
  const msgName = currentLang === 'ml' ? targetConstellation.mlName : targetConstellation.name;
  showMessage(msgPrefix + msgName);
}

function drawReferenceCanvas(ctx, width, height, constellation) {
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.35;
  
  ctx.strokeStyle = 'rgba(0, 210, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  constellation.edges.forEach(edge => {
    const s1 = constellation.stars[edge[0]];
    const s2 = constellation.stars[edge[1]];
    ctx.moveTo(cx + s1.x * scale, cy + s1.y * scale);
    ctx.lineTo(cx + s2.x * scale, cy + s2.y * scale);
  });
  ctx.stroke();
  
  ctx.fillStyle = '#fff';
  constellation.stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(cx + s.x * scale, cy + s.y * scale, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  const bgm = document.getElementById('bg-music');
  if (bgm) {
    bgm.volume = 0.25;
    bgm.play().catch(e => console.log("Audio play prevented:", e));
  }
  
  shuffledConstellations = [...CONSTELLATIONS].sort(() => Math.random() - 0.5);
  
  document.getElementById('game-container').classList.remove('hidden');
  document.getElementById('gameOverModal').classList.add('hidden');
  document.getElementById('levelCompleteModal').classList.add('hidden');
  
  score = 0;
  strikes = 0;
  currentLevel = 1;
  document.getElementById('score-display').innerText = `Score: ${score}`;
  updateStrikesDisplay();
  gameState = 'PLAYING';
  
  initLevel();
  
  lastTime = performance.now();
  if (!animId) animId = requestAnimationFrame(gameLoop);
}

function showLevelComplete() {
  gameState = 'PAUSED';
  stopTimer();
  playSfx('sfx-complete');
  
  score += 100 + (currentLevel * 50);
  document.getElementById('score-display').innerText = `Score: ${score}`;
  
  // Setup modal content
  document.getElementById('lc-title').innerText = translations[currentLang].foundIt;
  document.getElementById('lc-name').innerText = currentLang === 'ml' ? targetConstellation.mlName : targetConstellation.name;
  document.getElementById('lc-info').innerText = currentLang === 'ml' ? targetConstellation.mlInfo : targetConstellation.info;
  
  // Determine stars
  let starsHtml = '⭐';
  if (strikes == 1) starsHtml = '⭐⭐';
  if (strikes == 0) starsHtml = '⭐⭐⭐';
  document.getElementById('lc-stars').innerHTML = starsHtml;
  
  drawReferenceCanvas(lcCtx, lcCanvas.width, lcCanvas.height, targetConstellation);
  
  document.getElementById('levelCompleteModal').classList.remove('hidden');
}

function startNextLevel() {
  document.getElementById('levelCompleteModal').classList.add('hidden');
  currentLevel++;
  gameState = 'PLAYING';
  initLevel();
}

function pauseGame() {
  if (gameState !== 'PLAYING') return;
  gameState = 'PAUSED';
  document.getElementById('pause-overlay').classList.remove('hidden');
  stopTimer();
}

function resumeGame() {
  gameState = 'PLAYING';
  document.getElementById('pause-overlay').classList.add('hidden');
  startTimer();
  lastTime = performance.now();
  if (!animId) animId = requestAnimationFrame(gameLoop);
}

function quitToLounge() {
  document.getElementById('game-container').classList.add('hidden');
  document.getElementById('start-screen').style.display = 'block';
  const bgm = document.getElementById('bg-music');
  if (bgm) {
    bgm.pause();
    bgm.currentTime = 0;
  }
  document.getElementById('pause-overlay').classList.add('hidden');
  document.getElementById('gameOverModal').classList.add('hidden');
  document.getElementById('levelCompleteModal').classList.add('hidden');
  gameState = 'LOUNGE';
  stopTimer();
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}

function showGameOver() {
  gameState = 'GAME_OVER';
  document.getElementById('final-score').innerText = `Final Score: ${score}`;
  document.getElementById('gameOverModal').classList.remove('hidden');
}

function updateStrikesDisplay() {
  document.getElementById('strikes-display').innerText = `Strikes: ${strikes}/${MAX_STRIKES}`;
}

function registerStrike() {
  playSfx('sfx-error');
  strikes++;
  updateStrikesDisplay();
  if (strikes >= MAX_STRIKES) {
    driftApart();
  } else {
    showMessage("Missed it!", 2000);
    setTimeout(() => {
      if (gameState === 'PLAYING') initLevel();
    }, 2000);
  }
}

function startTimer() {}
function stopTimer() {}

function driftApart() {
  isDriftingApart = true;
  showMessage(translations[currentLang].gameOver, 2000);
  
  // Randomize velocities of target stars to make them scatter
  targetStars.forEach(s => {
    s.vx = (Math.random() - 0.5) * 100;
    s.vy = (Math.random() - 0.5) * 100;
  });
  
  setTimeout(() => {
    if (gameState === 'PLAYING') showGameOver();
  }, 2000);
}

function showMessage(msg, duration=2000) {
  const el = document.getElementById('game-message');
  el.innerText = msg;
  el.classList.remove('hidden');
  setTimeout(() => {
    el.classList.add('hidden');
  }, duration);
}

function update(dt) {
  const dts = dt / 1000;
  let targetOutBoundsCount = 0;
  stars.forEach(s => {
    s.x += s.vx * dts;
    s.y += s.vy * dts;
    
    if (s.isTarget) {
      if (s.x > canvas.width + 50 || s.x < -50 || s.y > canvas.height + 50 || s.y < -50) {
        targetOutBoundsCount++;
      }
    } else if (!s.isDecoy) {
      // Wrap around correctly for background stars ONLY
      if (s.x > canvas.width) s.x -= canvas.width;
      if (s.y < 0) s.y += canvas.height;
      if (s.x < 0) s.x += canvas.width;
      if (s.y > canvas.height) s.y -= canvas.height;
    }
  });

  if (targetOutBoundsCount > 0 && targetOutBoundsCount === targetStars.length && !isDriftingApart && gameState === 'PLAYING') {
    isDriftingApart = true;
    registerStrike();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const isHardMode = document.getElementById('diff-hard').classList.contains('active');
  const noHints = isHardMode;

  // Draw stars
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    
    if (s.isTarget && s.activated) {
      ctx.fillStyle = '#00d2ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00d2ff';
    } else {
      // Assistance coloring
      if (!noHints && (s.isTarget || s.isDecoy)) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ffffff';
      } else {
        ctx.fillStyle = '#aaaaaa';
        ctx.shadowBlur = 0;
      }
    }
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  });
  
  // Draw trace path
  if (tracePath.length > 0) {
    ctx.beginPath();
    ctx.moveTo(tracePath[0].x, tracePath[0].y);
    for (let i = 1; i < tracePath.length; i++) {
      ctx.lineTo(tracePath[i].x, tracePath[i].y);
    }
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  
  if (gameState !== 'PLAYING') {
    if (gameState === 'GAME_OVER' || gameState === 'PAUSED') {
      animId = requestAnimationFrame(gameLoop); // Keep loop running for renders but don't update state
      return;
    } else {
      animId = null;
      return;
    }
  }
  
  update(dt);
  render();
  
  animId = requestAnimationFrame(gameLoop);
}

// Input Handling
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

let hoveredStar = null;

function handleStart(e) {
  if (gameState !== 'PLAYING' || isDriftingApart) return;
  isTracing = true;
  tracePath = [getCanvasPos(e)];
  checkTraceCollision();
}

function handleMove(e) {
  if (gameState !== 'PLAYING' || isDriftingApart) return;
  e.preventDefault(); // prevent scrolling
  const pos = getCanvasPos(e);
  
  if (isTracing) {
    tracePath.push(pos);
    if (tracePath.length > 200) tracePath.shift(); 
    checkTraceCollision();
  }
  
  // Hover logic
  let prevHover = hoveredStar;
  hoveredStar = null;
  stars.forEach(s => {
    let dx = pos.x - s.x;
    let dy = pos.y - s.y;
    if (dx * dx + dy * dy < (s.radius + 15) * (s.radius + 15)) {
      hoveredStar = s;
    }
  });
  if (hoveredStar && hoveredStar !== prevHover) {
    playSfx('sfx-hover');
  }
}

function handleEnd(e) {
  if (!isTracing || gameState !== 'PLAYING') return;
  isTracing = false;
  // If they didn't get them all, clear activation
  if (activatedTargetStars.size < targetStars.length) {
    activatedTargetStars.clear();
    targetStars.forEach(s => s.activated = false);
    tracePath = [];
  }
}

function checkTraceCollision() {
  if (tracePath.length === 0) return;
  const currentPos = tracePath[tracePath.length - 1];
  
  const isHardMode = document.getElementById('diff-hard').classList.contains('active');
  const noHints = isHardMode;
  const hitRadius = noHints ? 30 : 20;
  
  targetStars.forEach(s => {
    if (!s.activated) {
      const dx = s.x - currentPos.x;
      const dy = s.y - currentPos.y;
      if (Math.sqrt(dx*dx + dy*dy) < hitRadius) {
        s.activated = true;
        activatedTargetStars.add(s.id);
        playSfx('sfx-connect');
      }
    }
  });
  
  if (activatedTargetStars.size === targetStars.length) {
    isTracing = false;
    showLevelComplete();
  }
}

canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);

canvas.addEventListener('touchstart', handleStart, {passive: false});
canvas.addEventListener('touchmove', handleMove, {passive: false});
window.addEventListener('touchend', handleEnd);
window.addEventListener('touchcancel', handleEnd);

// Init on load
resizeCanvas();
applyTranslations();
