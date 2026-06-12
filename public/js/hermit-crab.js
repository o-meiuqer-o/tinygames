// hermit-crab.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let joystickManager;
let joystickData = { vector: { x: 0, y: 0 } };

let isPlaying = false;
let isPaused = false;
let animationId;
let lastTime = 0;
let cameraX = 0;

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if(type === 'eat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'shell') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(900, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

// UI Elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const gameOverOverlay = document.getElementById('game-over-overlay');
const winOverlay = document.getElementById('win-overlay');
const pauseOverlay = document.getElementById('pause-overlay');
const levelDisplay = document.getElementById('level-display');
const hungerFill = document.getElementById('hunger-fill');
const growthFill = document.getElementById('growth-fill');

let canvasWidth, canvasHeight;

// Game State
const crab = {
    x: 0,
    y: 0,
    size: 20, 
    targetSize: 20,
    shellId: 'none',
    speed: 150,
    hunger: 100,
    growth: 0,
    facingRight: true,
    level: 1,
    isTransitioning: false,
    isLeftHanded: true
};

const shells = [
    { id: 'shell_small', size: 30, color: '#f0d0b0', capacity: 30, type: 'shell' },
    { id: 'shell_medium', size: 50, color: '#d0b090', capacity: 50, type: 'shell' },
    { id: 'shell_large', size: 80, color: '#a08060', capacity: 80, type: 'shell' },
    { id: 'cap', size: 40, color: '#ff3333', capacity: 40, type: 'cap' }
];

let items = [];
let dogs = [];

function resize() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    if (!isPlaying) {
        crab.x = canvasWidth / 2;
        crab.y = canvasHeight / 2;
    }
}
window.addEventListener('resize', resize);
resize();

function getDepth(y) {
    const minScale = 0.4;
    const maxScale = 1.2;
    let t = (y - canvasHeight * 0.2) / (canvasHeight * 0.8);
    t = Math.max(0, Math.min(1, t));
    return minScale + t * (maxScale - minScale);
}

function drawCrab() {
    const scale = getDepth(crab.y);
    const s = crab.size * scale;
    
    ctx.save();
    ctx.translate(crab.x - cameraX, crab.y);
    if (!crab.facingRight) ctx.scale(-1, 1);
    
    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 3 * scale;
    ctx.lineCap = 'round';
    
    const walkAnim = (joystickData.vector.x !== 0 || joystickData.vector.y !== 0 || crab.isTransitioning) ? Math.sin(Date.now() / 100) * 5 * scale : 0;
    
    for (let i=0; i<3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-10*scale, -10*scale + walkAnim * (i%2==0?1:-1), -15*scale - i*5*scale, 10*scale);
        ctx.stroke();
    }

    if (crab.shellId !== 'none') {
        const shellConfig = shells.find(s => s.id === crab.shellId);
        const shellSize = shellConfig.size * scale;
        
        ctx.fillStyle = shellConfig.color;
        if (shellConfig.type === 'cap') {
            ctx.beginPath();
            ctx.rect(-shellSize*0.6, -shellSize*0.8, shellSize, shellSize*0.6);
            ctx.fill();
            ctx.fillStyle = '#cc0000';
            for(let i=0; i<5; i++) {
                ctx.fillRect(-shellSize*0.5 + i*shellSize*0.2, -shellSize*0.8, shellSize*0.1, shellSize*0.6);
            }
        } else {
            ctx.beginPath();
            ctx.arc(-shellSize*0.3, -shellSize*0.3, shellSize*0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.arc(-shellSize*0.3, -shellSize*0.3, shellSize*0.4, 0, Math.PI);
            ctx.stroke();
        }
    }
    
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.ellipse(5*scale, 0, 10*scale, 8*scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.arc(15*scale, 5*scale, 6*scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(10*scale, -8*scale, 3*scale, 0, Math.PI * 2);
    ctx.arc(15*scale, -5*scale, 3*scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(11*scale, -8*scale, 1.5*scale, 0, Math.PI * 2);
    ctx.arc(16*scale, -5*scale, 1.5*scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawItems() {
    items.sort((a,b) => a.y - b.y).forEach(item => {
        if (item.x - cameraX < -200 || item.x - cameraX > canvasWidth + 200) return;
        
        const scale = getDepth(item.y) * (1 + crab.level * 0.1);
        ctx.save();
        ctx.translate(item.x - cameraX, item.y);
        
        if (item.type === 'food') {
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath();
            ctx.arc(0, 0, 5 * scale, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.type === 'shrimp') {
            ctx.fillStyle = '#ff7f50';
            ctx.beginPath();
            ctx.ellipse(0, 0, 10 * scale, 4 * scale, Math.PI/4, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(8*scale, -3*scale, 2*scale, 0, Math.PI*2);
            ctx.fill();
        } else if (item.type === 'shell' || item.type === 'cap') {
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 15 * scale;
            
            const shellSize = item.shellConfig.size * scale;
            ctx.fillStyle = item.shellConfig.color;
            if (item.type === 'cap') {
                ctx.fillRect(-shellSize*0.5, -shellSize*0.3, shellSize, shellSize*0.6);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, shellSize*0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.arc(shellSize*0.2, 0, shellSize*0.2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        } else if (item.type === 'rock') {
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            
            // Generate irregular geometry once per rock
            if (!item.offsets) {
                item.offsets = [];
                for(let k=0; k<8; k++) item.offsets.push(Math.random() * 0.4 + 0.8);
            }
            
            for (let k = 0; k < 8; k++) {
                const angle = (k / 8) * Math.PI * 2;
                const r = 20 * scale * item.offsets[k];
                if (k === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#95a5a6';
            ctx.beginPath();
            ctx.arc(-5 * scale, -5 * scale, 5 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
}

function drawDogs() {
    dogs.forEach(dog => {
        if (dog.x - cameraX < -500 || dog.x - cameraX > canvasWidth + 500) return;
        const scale = getDepth(dog.y);
        ctx.save();
        ctx.translate(dog.x - cameraX, dog.y);
        if (dog.vx < 0) ctx.scale(-1, 1);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-20*scale, -20*scale, 40*scale, 20*scale);
        ctx.fillRect(15*scale, -30*scale, 15*scale, 15*scale);
        const runAnim = Math.sin(Date.now() / 50) * 10 * scale;
        ctx.fillRect(-15*scale + runAnim, 0, 5*scale, 15*scale);
        ctx.fillRect(10*scale - runAnim, 0, 5*scale, 15*scale);
        
        ctx.restore();
    });
}

function spawnLevelItems() {
    items = [];
    
    // Determine where the joystick is to avoid spawning items there
    const joyXOffset = crab.isLeftHanded ? canvasWidth * 0.1 : canvasWidth * 0.9;
    const joyY = canvasHeight * 0.75;
    const avoidRadius = 150; // Joystick size is 150, so this gives a good buffer
    
    function getValidPos(fixedX = null) {
        let x, y;
        let attempts = 0;
        do {
            x = fixedX !== null ? fixedX : cameraX + 50 + Math.random() * (canvasWidth - 100);
            y = canvasHeight * 0.2 + Math.random() * (canvasHeight * 0.75);
            attempts++;
        } while (attempts < 20 && Math.hypot((x - cameraX) - joyXOffset, y - joyY) < avoidRadius);
        return {x, y};
    }
    
    // Spawn 1 shell
    const shellConfig = shells[Math.floor(Math.random() * shells.length)];
    const shellPos = getValidPos(cameraX + canvasWidth * 0.8);
    items.push({
        x: shellPos.x,
        y: shellPos.y,
        type: Math.random() > 0.3 ? 'shell' : 'cap',
        shellConfig: shellConfig
    });
    
    // Spawn foods and rocks
    const numItems = 20 + crab.level * 2;
    for(let i = 0; i < numItems; i++) {
        let type = 'food';
        if (crab.level >= 3 && Math.random() > 0.7) {
            type = 'shrimp';
        } else if (Math.random() > 0.7) {
            type = 'rock';
        }
        
        const pos = getValidPos();
        items.push({
            x: pos.x,
            y: pos.y,
            type: type
        });
    }
}

function spawnDog() {
    if (dogs.length > 0 || crab.isTransitioning) return;
    const y = canvasHeight * 0.3 + Math.random() * (canvasHeight * 0.6);
    const dir = Math.random() > 0.5 ? 1 : -1;
    dogs.push({
        x: cameraX + canvasWidth/2 + dir * (canvasWidth/2 + 200),
        y,
        vx: 300 * -dir,
        vy: 0
    });
}

function update(dt) {
    if (crab.isTransitioning) {
        const targetCameraX = crab.level * canvasWidth;
        const targetCrabX = targetCameraX + canvasWidth * 0.2;
        
        crab.facingRight = true;
        crab.x += (targetCrabX - crab.x) * 2 * dt;
        cameraX += (targetCameraX - cameraX) * 2 * dt;
        
        if (Math.abs(cameraX - targetCameraX) < 2) {
            cameraX = targetCameraX;
            crab.x = targetCrabX;
            crab.isTransitioning = false;
            
            crab.level++;
            
            if (crab.level > 15) {
                gameWon();
                return;
            }
            
            levelDisplay.innerText = `${crab.level} / 15`;
            crab.growth = 0;
            spawnLevelItems();
        }
        return;
    }

    const moveX = joystickData.vector.x;
    const moveY = -joystickData.vector.y;
    
    let speedMult = 1.0;
    if (crab.shellId !== 'none') {
        const shellConfig = shells.find(s => s.id === crab.shellId);
        // Level increases capacity slightly
        if (crab.size > shellConfig.capacity * (1 + crab.level * 0.1)) {
            speedMult = 0.5;
        }
    }

    crab.x += moveX * crab.speed * speedMult * dt;
    crab.y += moveY * crab.speed * speedMult * dt;
    
    if (moveX > 0) crab.facingRight = true;
    if (moveX < 0) crab.facingRight = false;
    
    // Strict screen bounds!
    crab.x = Math.max(cameraX + 20, Math.min(cameraX + canvasWidth - 20, crab.x));
    crab.y = Math.max(canvasHeight * 0.2, Math.min(canvasHeight - 20, crab.y));

    // Growth lerp
    crab.size += (crab.targetSize - crab.size) * 5 * dt;

    // Hunger drain
    crab.hunger -= (2 + crab.level * 0.1) * dt;
    if (crab.hunger <= 0) {
        crab.hunger = 0;
        gameOver("You starved! You must keep eating to survive.");
    }
    
    // Items and Collisions
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const dist = Math.hypot(crab.x - item.x, crab.y - item.y);
        
        if (item.type === 'rock') {
            const rockRadius = 20 * getDepth(item.y);
            if (dist < crab.size + rockRadius) {
                // Push crab away
                const overlap = (crab.size + rockRadius) - dist;
                const nx = (crab.x - item.x) / dist;
                const ny = (crab.y - item.y) / dist;
                crab.x += nx * overlap;
                crab.y += ny * overlap;
            }
        } else if (dist < crab.size + 15) {
            if (item.type === 'food' || item.type === 'shrimp') {
                playSound('eat');
                const hungerRestore = item.type === 'shrimp' ? 30 : 15;
                const growthAdd = item.type === 'shrimp' ? 20 : 10;
                
                crab.hunger = Math.min(100, crab.hunger + hungerRestore);
                crab.growth = Math.min(100, crab.growth + growthAdd);
                
                if (crab.growth >= 100) {
                    crab.growth = 100;
                    crab.targetSize += 2;
                }
                items.splice(i, 1);
            } else if ((item.type === 'shell' || item.type === 'cap') && !crab.isTransitioning) {
                if (crab.growth >= 100) {
                    playSound('shell');
                    crab.shellId = item.shellConfig.id;
                    items.splice(i, 1);
                    crab.isTransitioning = true;
                } else {
                    // Not grown enough! Push back gently.
                    const overlap = (crab.size + 15) - dist;
                    const nx = (crab.x - item.x) / dist;
                    const ny = (crab.y - item.y) / dist;
                    crab.x += nx * overlap;
                    crab.y += ny * overlap;
                }
            }
        }
    }
    
    for (let i = dogs.length - 1; i >= 0; i--) {
        const dog = dogs[i];
        dog.x += dog.vx * dt;
        
        const dist = Math.hypot(crab.x - dog.x, crab.y - dog.y);
        if (dist < 40 * getDepth(dog.y)) {
            gameOver("Caught by a dog!");
        }
        
        if (Math.abs(dog.x - cameraX - canvasWidth/2) > canvasWidth * 1.5) {
            dogs.splice(i, 1);
        }
    }

    hungerFill.style.width = crab.hunger + '%';
    growthFill.style.width = crab.growth + '%';
    
    if (crab.hunger < 25) hungerFill.style.background = '#f44336';
    else if (crab.hunger < 50) hungerFill.style.background = '#ff9800';
    else hungerFill.style.background = '#4CAF50';
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Endless water/sand
    ctx.fillStyle = '#4FC3F7';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.2);
    ctx.fillStyle = '#E0D6B9';
    ctx.fillRect(0, canvasHeight * 0.2, canvasWidth, canvasHeight * 0.8);
    
    ctx.save();
    ctx.translate(- (cameraX % 100), 0);
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for(let i=0; i<canvasWidth/100 + 2; i++) {
        ctx.fillRect(i*100, canvasHeight * 0.2, 2, canvasHeight * 0.8);
    }
    ctx.restore();

    drawItems();
    drawCrab();
    drawDogs();
}

function loop(time) {
    if (!isPlaying) return;
    if (isPaused) {
        lastTime = time;
        animationId = requestAnimationFrame(loop);
        return;
    }
    
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    
    if (dt < 0.1) {
        update(dt);
        draw();
    }
    
    animationId = requestAnimationFrame(loop);
}

// Translations
const translations = {
    en: {
        title: "Hermit Crab's Real Estate",
        subtitle: "Grow, adapt, and survive the coast.",
        rule1: "🦀 Find food to grow, but don't take too long or you'll starve!",
        rule2: "🐚 As you grow, your shell becomes tight. Find a bigger shell or bottle cap to move into.",
        rule3: "🐕 Watch out for dogs! They love to chase crabs.",
        selectHand: "Select Hand Preference",
        handPreferenceDesc: "This sets the position of your virtual joystick.",
        leftHandedBtn: "Left-Handed",
        leftHandedDesc: "Joystick on Left",
        rightHandedBtn: "Right-Handed",
        rightHandedDesc: "Joystick on Right",
        backHub: "Back to Hub",
        winTitle: "Victory!",
        winDesc: "Your crab has fully grown up and gone to lay eggs!",
        gameOverTitle: "Game Over",
        gameOverStarved: "You starved!",
        gameOverDog: "A dog caught you!",
        playAgain: "Play Again",
        mainMenu: "Main Menu",
        paused: "PAUSED",
        resume: "Resume",
        quit: "Quit Game",
        hudLevel: "Level: ",
        hudHunger: "Hunger: ",
        hudGrowth: "Growth: "
    },
    ml: {
        title: "ശങ്കുഭംഗിപ്പൂച്ച",
        subtitle: "വളരുക, അതിജീവിക്കുക, തീരങ്ങളിൽ ചുറ്റിനടക്കുക.",
        rule1: "🦀 വളരാൻ ഭക്ഷണം കണ്ടെത്തുക, വൈകിയാൽ വിശന്നു ചത്തുപോകും!",
        rule2: "🐚 വളരുന്നതിനനുസരിച്ച് നിങ്ങളുടെ ചിപ്പി ഇടുങ്ങിയതാകും. വലിയ ചിപ്പിയോ കുപ്പിയുടെ അടപ്പോ കണ്ടെത്തുക.",
        rule3: "🐕 നായ്ക്കളെ സൂക്ഷിക്കുക! അവയ്ക്ക് ഞണ്ടുകളെ പിടിക്കാൻ ഇഷ്ടമാണ്.",
        selectHand: "നിയന്ത്രണം തിരഞ്ഞെടുക്കുക",
        handPreferenceDesc: "ഇത് ജോയ്സ്റ്റിക്ക് സ്ക്രീനിന്റെ ഏത് ഭാഗത്ത് വേണമെന്ന് നിശ്ചയിക്കും.",
        leftHandedBtn: "ഇടത് കൈ ശൈലി",
        leftHandedDesc: "ജോയ്സ്റ്റിക്ക് ഇടത് ഭാഗത്ത്",
        rightHandedBtn: "വലത് കൈ ശൈലി",
        rightHandedDesc: "ജോയ്സ്റ്റിക്ക് വലത് ഭാഗത്ത്",
        backHub: "തിരികെ പോകുക",
        winTitle: "വിജയം!",
        winDesc: "നിങ്ങളുടെ ഞണ്ട് പൂർണ്ണമായി വളർന്നു മുട്ടയിടാൻ പോയിരിക്കുന്നു!",
        gameOverTitle: "കളി കഴിഞ്ഞു",
        gameOverStarved: "നിങ്ങൾക്ക് വിശപ്പ് സഹിക്കാനായില്ല!",
        gameOverDog: "നായ നിങ്ങളെ പിടികൂടി!",
        playAgain: "വീണ്ടും കളിക്കുക",
        mainMenu: "പ്രധാന പേജ്",
        paused: "നിർത്തിവെച്ചിരിക്കുന്നു",
        resume: "തുടരുക",
        quit: "കളി നിർത്തുക",
        hudLevel: "നില: ",
        hudHunger: "വിശപ്പ്: ",
        hudGrowth: "വളർച്ച: "
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

    const langEn = document.getElementById('lang-en');
    const langMl = document.getElementById('lang-ml');
    const langEnPause = document.getElementById('lang-en-pause');
    const langMlPause = document.getElementById('lang-ml-pause');

    if (lang === 'en') {
        if (langEn) langEn.classList.add('active');
        if (langMl) langMl.classList.remove('active');
        if (langEnPause) langEnPause.classList.add('active');
        if (langMlPause) langMlPause.classList.remove('active');
    } else {
        if (langMl) langMl.classList.add('active');
        if (langEn) langEn.classList.remove('active');
        if (langMlPause) langMlPause.classList.add('active');
        if (langEnPause) langEnPause.classList.remove('active');
    }
}

document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-ml').addEventListener('click', () => setLanguage('ml'));
document.getElementById('lang-en-pause').addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-ml-pause').addEventListener('click', () => setLanguage('ml'));

setLanguage('en');

function gameWon() {
    isPlaying = false;
    winOverlay.classList.remove('hidden');
    if (joystickManager) {
        joystickManager.destroy();
    }
}

function gameOver(reason) {
    playSound('die');
    isPlaying = false;
    
    let reasonText = translations[currentLang]['gameOverStarved'];
    if (reason && reason.includes('dog')) {
        reasonText = translations[currentLang]['gameOverDog'];
    }
    
    document.getElementById('game-over-reason').innerText = reasonText;
    gameOverOverlay.classList.remove('hidden');
    if (joystickManager) {
        joystickManager.destroy();
    }
}

async function forceLandscape() {
    try {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
            await document.documentElement.webkitRequestFullscreen();
        }
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
        }
    } catch (err) {
        console.warn("Fullscreen/Orientation lock failed:", err);
    }
}

function initGame(isLeftHanded) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    forceLandscape();
    
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    crab.x = canvasWidth / 2;
    crab.y = canvasHeight / 2;
    crab.size = 20;
    crab.targetSize = 20;
    crab.hunger = 100;
    crab.growth = 0;
    crab.shellId = 'none';
    crab.level = 1;
    crab.isTransitioning = false;
    crab.isLeftHanded = isLeftHanded;
    cameraX = 0;
    levelDisplay.innerText = `1 / 15`;
    
    dogs = [];
    spawnLevelItems();
    
    setInterval(spawnDog, 8000);
    
    const zone = document.getElementById('joystick-zone');
    zone.style.left = isLeftHanded ? '0' : '50%';
    
    joystickManager = nipplejs.create({
        zone: zone,
        mode: 'semi',
        position: isLeftHanded ? { left: '20%', bottom: '25%' } : { right: '20%', bottom: '25%' },
        size: 150, 
        color: '#2196F3',
        catchDistance: 150
    });
    
    joystickManager.on('move', (evt, data) => {
        joystickData.vector = data.vector;
    });
    joystickManager.on('end', () => {
        joystickData.vector = { x: 0, y: 0 };
    });
    
    isPlaying = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
}

document.getElementById('left-hand-btn').addEventListener('click', () => initGame(true));
document.getElementById('right-hand-btn').addEventListener('click', () => initGame(false));
document.getElementById('restart-btn').addEventListener('click', () => {
    gameOverOverlay.classList.add('hidden');
    const isLeftHanded = document.getElementById('joystick-zone').style.left === '0px';
    initGame(isLeftHanded);
});
document.getElementById('restart-win-btn').addEventListener('click', () => {
    winOverlay.classList.add('hidden');
    const isLeftHanded = document.getElementById('joystick-zone').style.left === '0px';
    initGame(isLeftHanded);
});

// Pause Menu Wiring
document.getElementById('pause-top-btn').addEventListener('click', () => {
    if (!isPlaying || isPaused) return;
    isPaused = true;
    pauseOverlay.classList.remove('hidden');
});
document.getElementById('resume-btn').addEventListener('click', () => {
    isPaused = false;
    pauseOverlay.classList.add('hidden');
});
document.getElementById('quit-btn').addEventListener('click', () => {
    location.reload(); // back to main lounge/start screen cleanly
});
document.getElementById('home-btn').addEventListener('click', () => {
    location.reload();
});

