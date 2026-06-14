// Kitchen Chaos: The Heat Balance Game Logic

let currentLang = 'en';

const translations = {
  en: {
    kcTitle: "Kitchen Chaos",
    kcSubtitle: "The Heat Balance",
    kcTitleSmall: "Kitchen Chaos",
    howToPlay: "How to Play",
    kcInst1: "Manage up to 4 stovetops simultaneously.",
    kcInst2: "Keep heat in the Green Zone (40%-60%) for 8 seconds to cook!",
    kcInst3: "Tap to lower heat. Drag to cool rapidly. Tap glowing pot to deliver and earn money!",
    kcInst4: "Pots spoil if left too long in Orange or Brown zones.",
    kcInst5: "3 spoiled pots and you're fired!",
    play: "Play Now",
    backHub: "Back to Hub",
    paused: "Paused",
    resume: "Resume",
    quitToLounge: "Quit to Lounge",
    gameOver: "Game Over!",
    playAgain: "Play Again",
    difficultyLabel: "Difficulty Mode",
    diffVeryEasy: "Very Easy (2 Pots)",
    diffEasy: "Easy (Kids)",
    diffHard: "Hard (Chef)",
    Milk: "Milk", Meat: "Meat", Sauce: "Sauce", Soup: "Soup", Pasta: "Pasta", Curry: "Curry",
    Rice: "Rice", Stew: "Stew", Eggs: "Eggs", Tea: "Tea", Coffee: "Coffee", Beans: "Beans"
  },
  ml: {
    kcTitle: "കിച്ചൻ കയോസ്",
    kcSubtitle: "ചൂട് ബാലൻസ്",
    kcTitleSmall: "കിച്ചൻ കയോസ്",
    howToPlay: "എങ്ങനെ കളിക്കാം",
    kcInst1: "4 സ്റ്റൗകൾ വരെ ഒരുമിച്ച് നിയന്ത്രിക്കുക.",
    kcInst2: "പാകം ചെയ്യാൻ ചൂട് പച്ച സോണിൽ (40%-60%) 8 സെക്കൻഡ് നിലനിർത്തുക!",
    kcInst3: "ചൂട് കുറയ്ക്കാൻ തൊടുക. ഉരച്ചാൽ വേഗത്തിൽ തണുക്കും. തിളങ്ങുന്ന പാത്രത്തിൽ തൊട്ട് പണം നേടുക!",
    kcInst4: "ഓറഞ്ച് അല്ലെങ്കിൽ ബ്രൗൺ സോണുകളിൽ ദീർഘനേരം വെച്ചാൽ കേടാകും.",
    kcInst5: "3 പാത്രങ്ങൾ കേടായാൽ നിങ്ങളെ പുറത്താക്കും!",
    play: "കളിക്കാം",
    backHub: "ഹബ്ബിലേക്ക്",
    paused: "പോസ്",
    resume: "തുടരാം",
    quitToLounge: "ലൗഞ്ചിലേക്ക്",
    gameOver: "ഗെയിം ഓവർ!",
    playAgain: "വീണ്ടും കളിക്കാം",
    difficultyLabel: "കാഠിന്യം (Difficulty)",
    diffVeryEasy: "വളരെ എളുപ്പം (2 പാത്രങ്ങൾ)",
    diffEasy: "എളുപ്പം (കുട്ടികൾക്ക്)",
    diffHard: "കഠിനം (ഷെഫ്)",
    Milk: "പാൽ", Meat: "ഇറച്ചി", Sauce: "സോസ്", Soup: "സൂപ്പ്", Pasta: "പാസ്ത", Curry: "കറി",
    Rice: "ചോറ്", Stew: "സ്റ്റ്യൂ", Eggs: "മുട്ട", Tea: "ചായ", Coffee: "കാപ്പി", Beans: "ബീൻസ്"
  }
};

function setLanguage(lang) {
    document.documentElement.lang = lang;
  currentLang = lang;
  const t = translations[lang];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-ml').classList.toggle('active', lang === 'ml');
  
  // Update currently displayed pots
  pots.forEach((p, index) => {
    if (p && p.contentElement) {
      p.contentElement.textContent = t[p.type] || p.type;
    }
  });
}

let gameState = 'LOUNGE'; // 'LOUNGE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
let currentDifficulty = 'easy'; // 'easy' | 'hard'

// Game variables
let score = 0;
let level = 1;
let strikes = 0;
const MAX_STRIKES = 3;
let heatMultiplier = 1.0;

// Base pots configuration
const FOOD_TYPES = ['Milk', 'Meat', 'Sauce', 'Soup', 'Pasta', 'Curry', 'Rice', 'Stew', 'Eggs', 'Tea', 'Coffee', 'Beans'];
let pots = [];

let lastTime = 0;
let animId = null;
let eventTimer = 0;
let nextEventTime = 0;
let activeEvent = null;

// Audio context for ambient noise
let audioCtx = null;
let ambientSource = null;

// UI Elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const pauseOverlay = document.getElementById('pause-overlay');
const gameOverModal = document.getElementById('gameOverModal');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const strikesDisplay = document.getElementById('strikes-display');
const eventOverlay = document.getElementById('event-overlay');
const eventText = document.getElementById('event-text');
const gameOverReason = document.getElementById('game-over-reason');
const finalScore = document.getElementById('final-score');

// Pointer variables for stirring and double tap
let isPointerDown = false;
let activePotIndex = -1;
let lastPointerPos = { x: 0, y: 0 };
let lastTapTimes = [0, 0, 0, 0];

function generateNewOrder(index) {
  // Pick an item not currently on any pot if possible
  const currentTypes = pots.filter(p => p && p.type).map(p => p.type);
  const availableTypes = FOOD_TYPES.filter(t => !currentTypes.includes(t));
  let selectedType = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
  if (availableTypes.length > 0) {
    selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  }
  
  let foodRate = 1.5 + Math.random();
  const fastFoods = ['Milk', 'Tea', 'Coffee', 'Soup'];
  const slowFoods = ['Meat', 'Curry', 'Rice', 'Stew'];
  
  if (fastFoods.includes(selectedType)) {
    foodRate = 2.5 + Math.random() * 1.5; // Heats up very fast
  } else if (slowFoods.includes(selectedType)) {
    foodRate = 0.8 + Math.random() * 0.5; // Heats up slowly
  }

  return {
    heat: 0,
    progress: 0,
    spoilOrange: 0,
    spoilBrown: 0,
    rate: foodRate,
    cooked: false,
    type: selectedType,
    element: document.querySelector(`.stovetop[data-index="${index}"] .pot`),
    fillElement: document.getElementById(`heat-${index}`),
    pctElement: document.getElementById(`percent-${index}`),
    progElement: document.getElementById(`progress-${index}`),
    contentElement: document.getElementById(`content-${index}`)
  };
}

// Initialize pots
for (let i = 0; i < 4; i++) {
  pots.push(generateNewOrder(i));
}

// Event Listeners for UI
document.getElementById('play-btn').addEventListener('click', () => {
  requestFullscreen();
  startGame();
});
document.getElementById('pause-top-btn').addEventListener('click', pauseGame);
document.getElementById('resume-btn').addEventListener('click', resumeGame);
document.getElementById('quit-btn').addEventListener('click', quitToLounge);
document.getElementById('quitEndBtn').addEventListener('click', quitToLounge);
document.getElementById('restartBtn').addEventListener('click', startGame);

document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-ml').addEventListener('click', () => setLanguage('ml'));

document.getElementById('diff-very-easy').addEventListener('click', () => {
  currentDifficulty = 'very-easy';
  document.getElementById('diff-very-easy').classList.add('active');
  document.getElementById('diff-easy').classList.remove('active');
  document.getElementById('diff-hard').classList.remove('active');
});

document.getElementById('diff-easy').addEventListener('click', () => {
  currentDifficulty = 'easy';
  document.getElementById('diff-easy').classList.add('active');
  document.getElementById('diff-very-easy').classList.remove('active');
  document.getElementById('diff-hard').classList.remove('active');
});

document.getElementById('diff-hard').addEventListener('click', () => {
  currentDifficulty = 'hard';
  document.getElementById('diff-hard').classList.add('active');
  document.getElementById('diff-very-easy').classList.remove('active');
  document.getElementById('diff-easy').classList.remove('active');
});

pots.forEach((potObj, index) => {
  const potEl = potObj.element;
  
  potEl.addEventListener('pointerdown', (e) => {
    if (gameState !== 'PLAYING') return;
    if (!pots[index]) return;
    
    isPointerDown = true;
    activePotIndex = index;
    lastPointerPos = { x: e.clientX, y: e.clientY };
    
    if (pots[index].cooked) {
      // Serve order
      score += 50 * level;
      updateUI();
      playSfx('cash');
      
      // Reset order
      pots[index] = generateNewOrder(index);
      pots[index].contentElement.textContent = translations[currentLang][pots[index].type];
      pots[index].element.classList.remove('cooked');
      updatePotUI(pots[index]);
    } else {
      // Tap to reduce heat instantly by a chunk
      reduceHeat(index, 10);
      try { if (window.Sounds) Sounds.play('click'); } catch(e){}
    }
    e.preventDefault();
  });

  potEl.addEventListener('pointermove', (e) => {
    if (gameState !== 'PLAYING' || !isPointerDown || activePotIndex !== index) return;
    if (!pots[index] || pots[index].cooked) return; // Don't stir if cooked or disabled
    
    // Stirring calculation
    const dx = e.clientX - lastPointerPos.x;
    const dy = e.clientY - lastPointerPos.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist > 5) {
      reduceHeat(index, dist * 0.1); 
      lastPointerPos = { x: e.clientX, y: e.clientY };
    }
    e.preventDefault();
  });
});

window.addEventListener('pointerup', () => {
  isPointerDown = false;
  activePotIndex = -1;
});
window.addEventListener('pointercancel', () => {
  isPointerDown = false;
  activePotIndex = -1;
});

function requestFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().then(() => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(err => console.log("Orientation lock error:", err));
      }
    }).catch(err => console.log("Fullscreen error:", err));
  }
}

function startAmbientNoise() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  if (!ambientSource) {
    // Synthesize restaurant noise (pink noise + slight filtering)
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; 
    }
    
    ambientSource = audioCtx.createBufferSource();
    ambientSource.buffer = noiseBuffer;
    ambientSource.loop = true;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800; // Muffled crowd sound
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0.15;
    
    ambientSource.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    ambientSource.start();
  }
}
let lastOut = 0;

function stopAmbientNoise() {
  if (ambientSource) {
    ambientSource.stop();
    ambientSource.disconnect();
    ambientSource = null;
  }
}

function playSfx(type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  if (type === 'ding') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } else if (type === 'cash') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1800, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } else if (type === 'sizzle') {
    // simple noise burst
    try { if (window.Sounds) Sounds.play('place'); } catch(e){}
  }
}

function startGame() {
  startScreen.classList.add('hidden');
  gameOverModal.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  
  score = 0;
  level = 1;
  strikes = 0;
  heatMultiplier = 1.0;
  eventTimer = 0;
  setNextEventTime();
  activeEvent = null;
  eventOverlay.classList.add('hidden');
  
  updateUI();
  
  const activePotsCount = currentDifficulty === 'very-easy' ? 2 : 4;
  const stovetopGrid = document.querySelector('.stovetop-grid');
  if (currentDifficulty === 'very-easy') stovetopGrid.classList.add('very-easy');
  else stovetopGrid.classList.remove('very-easy');
  
  for (let i = 0; i < 4; i++) {
    const stovetopEl = document.querySelector(`.stovetop[data-index="${i}"]`);
    if (i < activePotsCount) {
      stovetopEl.style.display = 'flex';
      pots[i] = generateNewOrder(i);
      pots[i].contentElement.textContent = translations[currentLang][pots[i].type];
      pots[i].element.classList.remove('cooked');
      updatePotUI(pots[i]);
    } else {
      stovetopEl.style.display = 'none';
      pots[i] = null;
    }
  }
  
  startAmbientNoise();
  
  gameState = 'PLAYING';
  lastTime = performance.now();
  if (!animId) animId = requestAnimationFrame(gameLoop);
  
  try { if (window.Sounds) Sounds.play('place'); } catch(e){}
}

function pauseGame() {
  if (gameState !== 'PLAYING') return;
  gameState = 'PAUSED';
  pauseOverlay.classList.remove('hidden');
  try { if (window.Sounds) Sounds.play('click'); } catch(e){}
}

function resumeGame() {
  gameState = 'PLAYING';
  pauseOverlay.classList.add('hidden');
  lastTime = performance.now();
  if (!animId) animId = requestAnimationFrame(gameLoop);
  try { if (window.Sounds) Sounds.play('click'); } catch(e){}
}

function quitToLounge() {
  gameState = 'LOUNGE';
  gameContainer.classList.add('hidden');
  pauseOverlay.classList.add('hidden');
  gameOverModal.classList.add('hidden');
  startScreen.classList.remove('hidden');
  stopAmbientNoise();
  if (document.exitFullscreen) document.exitFullscreen().catch(()=>{});
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}

function endGame(reason) {
  gameState = 'GAME_OVER';
  gameOverReason.textContent = reason;
  finalScore.textContent = Math.floor(score);
  gameOverModal.classList.remove('hidden');
  stopAmbientNoise();
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  try { if (window.Sounds) Sounds.play('lose'); } catch(e){}
}

function addStrike(reason) {
  strikes++;
  updateUI();
  playSfx('sizzle');
  
  if (strikes >= MAX_STRIKES) {
    endGame("Too many mistakes! You're fired!");
  } else {
    // Show visual feedback
    eventText.textContent = `STRIKE! ${reason}`;
    eventOverlay.classList.remove('hidden');
    setTimeout(() => {
      if(activeEvent === null) eventOverlay.classList.add('hidden');
    }, 1000);
  }
}

function reduceHeat(index, amount) {
  pots[index].heat -= amount;
  if (pots[index].heat < 0) pots[index].heat = 0;
  updatePotUI(pots[index]);
}

function updateUI() {
  scoreDisplay.textContent = `$$ ${Math.floor(score)}`;
  levelDisplay.textContent = `Lvl ${level}`;
  
  // Display hearts for lives (strikes)
  const hearts = MAX_STRIKES - strikes;
  let heartsStr = '';
  for(let i=0; i<hearts; i++) heartsStr += '❤️';
  for(let i=0; i<strikes; i++) heartsStr += '🖤';
  strikesDisplay.textContent = heartsStr;
}

function updatePotUI(p) {
  p.fillElement.style.height = `${p.heat}%`;
  p.pctElement.innerHTML = `${Math.floor(p.heat)}&deg;`;
  p.progElement.style.width = `${p.progress}%`;
  
  let newZone = 'cool';
  if (p.heat > 80) {
    newZone = 'brown';
  } else if (p.heat > 60) {
    newZone = 'orange';
  } else if (p.heat >= 40) {
    newZone = 'perfect'; // green
  } else if (p.heat >= 20) {
    newZone = 'yellow';
  } else {
    newZone = 'cool'; // blue
  }
  
  p.element.setAttribute('data-zone', newZone);
}

function setNextEventTime() {
  const baseTime = currentDifficulty === 'easy' ? 20000 : 12000;
  nextEventTime = eventTimer + baseTime + Math.random() * 10000;
}

function triggerRandomEvent() {
  let events = ['RUSH HOUR!', 'FREEZE!'];
  
  // Only add FUSE BLOWN! if more than one pot is above 80 degrees
  let hotPots = 0;
  pots.forEach(p => {
    if (p && !p.cooked && p.heat > 80) hotPots++;
  });
  if (hotPots > 1) {
    events.push('FUSE BLOWN!');
  }
  
  const ev = events[Math.floor(Math.random() * events.length)];
  
  eventText.textContent = ev;
  eventOverlay.classList.remove('hidden');
  activeEvent = ev;
  
  try { if (window.Sounds) Sounds.play('capture'); } catch(e){}
  
  if (ev === 'FUSE BLOWN!') {
    document.getElementById('kitchen-area').style.background = '#000';
    pots.forEach(p => { if (p) p.element.style.opacity = '0.2'; });
    setTimeout(() => {
      document.getElementById('kitchen-area').style.background = '';
      pots.forEach(p => { if (p) p.element.style.opacity = '1'; });
      clearEvent();
    }, 2000);
  } else if (ev === 'RUSH HOUR!') {
    pots.forEach(p => { if(p && !p.cooked) p.heat += 20; });
    setTimeout(clearEvent, 1500);
  } else if (ev === 'FREEZE!') {
    pots.forEach(p => { if (p) p.heat = 0; });
    setTimeout(clearEvent, 1500);
  }
}

function clearEvent() {
  if (gameState !== 'PLAYING') return;
  eventOverlay.classList.add('hidden');
  activeEvent = null;
  setNextEventTime();
}

function gameLoop(timestamp) {
  if (gameState !== 'PLAYING') {
    animId = null;
    return;
  }
  
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  
  const rampUpRate = currentDifficulty === 'easy' ? 0.000005 : 0.000015;
  heatMultiplier += dt * rampUpRate;
  
  // Level progression
  const newLevel = Math.floor(score / 300) + 1;
  if (newLevel > level) {
    level = newLevel;
    updateUI();
  }
  
  for (let i = 0; i < 4; i++) {
    const p = pots[i];
    
    if (!p || p.cooked) continue;
    
    let isGreen = p.heat >= 40 && p.heat <= 60;
    
    if (activeEvent !== 'FUSE BLOWN!' && activeEvent !== 'FREEZE!') {
      const baseSpeed = currentDifficulty === 'hard' ? 4.5 : 2;
      let heatIncrease = p.rate * heatMultiplier * (dt / 1000) * baseSpeed;
      p.heat += heatIncrease;
    }
    
    // Evaluate Zones
    if (p.heat > 80) {
      // Brown zone
      p.spoilBrown += (dt / 1000) * (100 / 3); // 3 seconds to spoil
      p.spoilOrange = 0;
      p.progress -= (dt / 1000) * 10;
    } else if (p.heat > 60) {
      // Orange zone
      p.spoilOrange += (dt / 1000) * (100 / 5); // 5 seconds to spoil
      p.spoilBrown = 0;
      p.progress -= (dt / 1000) * 10;
    } else if (isGreen) {
      // Green zone
      p.progress += (dt / 1000) * (100 / 8); // 8 seconds to cook
      p.spoilOrange = 0;
      p.spoilBrown = 0;
    } else {
      // Blue/Yellow zone (< 40)
      p.progress -= (dt / 1000) * 5;
      p.spoilOrange = 0;
      p.spoilBrown = 0;
    }
    
    if (p.progress < 0) p.progress = 0;
    
    // Check if cooked
    if (p.progress >= 100) {
      p.progress = 100;
      p.cooked = true;
      p.element.classList.add('cooked');
      playSfx('ding');
    }
    
    updatePotUI(p);
    
    // Check for spoil (Burn)
    if (p.spoilBrown >= 100 || p.spoilOrange >= 100 || p.heat >= 100) {
      addStrike(`${translations[currentLang][p.type] || p.type} spoiled!`);
      // Reset pot
      pots[i] = generateNewOrder(i);
      pots[i].contentElement.textContent = translations[currentLang][pots[i].type];
      pots[i].element.classList.remove('cooked');
      updatePotUI(pots[i]);
    }
  }
  
  if (gameState === 'PLAYING') {
    eventTimer += dt;
    if (eventTimer > nextEventTime && !activeEvent) {
      triggerRandomEvent();
    }
    animId = requestAnimationFrame(gameLoop);
  }
}

// Initialize language
setLanguage('en');
