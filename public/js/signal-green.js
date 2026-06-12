/**
 * Signal Green - Traffic Flow Logic Game
 * Synthesizes audio, manages dynamic vehicle lanes, tracks collisions, and handles touch gestures.
 */

// Web Audio API custom synthesizer for Signal Green
const TrafficAudio = (() => {
    let ctx = null;
    let isMuted = false;
    let sirenInterval = null;

    function getContext() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        return ctx;
    }

    return {
        toggleMute() {
            isMuted = !isMuted;
            if (isMuted && sirenInterval) {
                clearInterval(sirenInterval);
                sirenInterval = null;
            }
            return isMuted;
        },
        playClick() {
            if (isMuted) return;
            const c = getContext();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.frequency.setValueAtTime(800, c.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.08);
            gain.gain.setValueAtTime(0.15, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.08);
            osc.start();
            osc.stop(c.currentTime + 0.08);
        },
        playBrake() {
            if (isMuted) return;
            const c = getContext();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, c.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);
            gain.gain.setValueAtTime(0.2, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);
            osc.start();
            osc.stop(c.currentTime + 0.15);
        },
        playBoost() {
            if (isMuted) return;
            const c = getContext();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, c.currentTime);
            osc.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.25);
            gain.gain.setValueAtTime(0.15, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.25);
            osc.start();
            osc.stop(c.currentTime + 0.25);
        },
        playHonk() {
            if (isMuted) return;
            const c = getContext();
            const osc1 = c.createOscillator();
            const osc2 = c.createOscillator();
            const gain = c.createGain();
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(c.destination);
            
            osc1.type = 'square';
            osc2.type = 'square';
            osc1.frequency.setValueAtTime(440, c.currentTime);
            osc2.frequency.setValueAtTime(445, c.currentTime);
            
            gain.gain.setValueAtTime(0.1, c.currentTime);
            gain.gain.setValueAtTime(0.1, c.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);
            
            osc1.start();
            osc2.start();
            osc1.stop(c.currentTime + 0.15);
            osc2.stop(c.currentTime + 0.15);
        },
        startSiren() {
            if (isMuted || sirenInterval) return;
            const c = getContext();
            let state = 0;
            
            sirenInterval = setInterval(() => {
                if (isMuted) return;
                const osc = c.createOscillator();
                const gain = c.createGain();
                osc.connect(gain);
                gain.connect(c.destination);
                
                osc.type = 'sine';
                const fStart = state === 0 ? 600 : 900;
                const fEnd = state === 0 ? 900 : 600;
                state = 1 - state;
                
                osc.frequency.setValueAtTime(fStart, c.currentTime);
                osc.frequency.linearRampToValueAtTime(fEnd, c.currentTime + 0.25);
                gain.gain.setValueAtTime(0.1, c.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.25);
                
                osc.start();
                osc.stop(c.currentTime + 0.25);
            }, 260);
        },
        stopSiren() {
            if (sirenInterval) {
                clearInterval(sirenInterval);
                sirenInterval = null;
            }
        },
        playBuzzer() {
            if (isMuted) return;
            const c = getContext();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, c.currentTime);
            gain.gain.setValueAtTime(0.25, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.2);
            osc.start();
            osc.stop(c.currentTime + 0.2);
        },
        playCrash() {
            if (isMuted) return;
            const c = getContext();
            // low rumble
            const osc = c.createOscillator();
            const oscGain = c.createGain();
            osc.connect(oscGain);
            oscGain.connect(c.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, c.currentTime);
            osc.frequency.linearRampToValueAtTime(30, c.currentTime + 0.8);
            oscGain.gain.setValueAtTime(0.4, c.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.8);
            
            osc.start();
            osc.stop(c.currentTime + 0.8);

            // noise crash
            try {
                const bufferSize = c.sampleRate * 1.0;
                const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = c.createBufferSource();
                noise.buffer = buffer;
                const noiseFilter = c.createBiquadFilter();
                noiseFilter.type = 'lowpass';
                noiseFilter.frequency.setValueAtTime(800, c.currentTime);
                noiseFilter.frequency.exponentialRampToValueAtTime(50, c.currentTime + 0.6);
                
                const noiseGain = c.createGain();
                noiseGain.gain.setValueAtTime(0.3, c.currentTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.7);
                
                noise.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(c.destination);
                
                noise.start();
                noise.stop(c.currentTime + 1.0);
            } catch (e) {}
        }
    };
})();

// Core Game Settings
const Game = {
    canvas: null,
    ctx: null,
    gameState: 'SETUP', // SETUP, PLAYING, PAUSED, GAMEOVER
    difficulty: 'standard', // standard, rush
    
    // Grid sizes
    width: 0,
    height: 0,
    
    // Core parameters
    vehicles: [],
    particles: [],
    spawnTimer: 0,
    spawnInterval: 1800, // ms
    minSpawnInterval: 650, // scaling floor
    elapsedTime: 0,
    score: 0,
    highScore: 0,
    multiplier: 1.0,
    emergenciesHandled: 0,
    
    // Interaction
    draggedVehicle: null,
    dragStartX: 0,
    dragStartY: 0,
    dragMinDistance: 25, // px to register swipe
    
    // Lanes definitions (computed on resize)
    lanes: {
        horizontal: [], // arrays of lane configurations: { y, dir: 1 (east) or -1 (west), name }
        vertical: []    // arrays: { x, dir: 1 (south) or -1 (north), name }
    },
    
    roadWidth: 90, // computed dynamic size
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.highScore = parseInt(localStorage.getItem('signal-green-highscore')) || 0;
        document.getElementById('hud-highscore').textContent = String(this.highScore).padStart(3, '0');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.setupEventListeners();
        
        // Start animation loop
        requestAnimationFrame((t) => this.loop(t));
    },
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Recompute lanes based on new aspect ratio
        this.computeLanes();
    },
    
    computeLanes() {
        this.lanes.horizontal = [];
        this.lanes.vertical = [];
        
        const cy = this.height / 2;
        const cx = this.width / 2;
        
        if (this.difficulty === 'standard') {
            this.roadWidth = Math.min(100, Math.floor(this.height * 0.15));
            // Standard has 1 lane in each direction
            // Horizontal lanes:
            // West to East (dir = 1): moves along y = cy - roadWidth/2
            this.lanes.horizontal.push({
                y: cy - this.roadWidth / 2,
                dir: 1,
                name: 'H_EAST'
            });
            // East to West (dir = -1): y = cy + roadWidth/2
            this.lanes.horizontal.push({
                y: cy + this.roadWidth / 2,
                dir: -1,
                name: 'H_WEST'
            });
            
            // Vertical lanes:
            // North to South (dir = 1): x = cx - roadWidth/2
            this.lanes.vertical.push({
                x: cx - this.roadWidth / 2,
                dir: 1,
                name: 'V_SOUTH'
            });
            // South to North (dir = -1): x = cx + roadWidth/2
            this.lanes.vertical.push({
                x: cx + this.roadWidth / 2,
                dir: -1,
                name: 'V_NORTH'
            });
        } else {
            // Rush Hour: 2 lanes in each direction
            this.roadWidth = Math.min(160, Math.floor(this.height * 0.22));
            const lw = this.roadWidth / 4; // lane offset width
            
            // West to East
            this.lanes.horizontal.push({ y: cy - 3 * lw, dir: 1, name: 'H_EAST_1' });
            this.lanes.horizontal.push({ y: cy - 1 * lw, dir: 1, name: 'H_EAST_2' });
            // East to West
            this.lanes.horizontal.push({ y: cy + 1 * lw, dir: -1, name: 'H_WEST_1' });
            this.lanes.horizontal.push({ y: cy + 3 * lw, dir: -1, name: 'H_WEST_2' });
            
            // North to South
            this.lanes.vertical.push({ x: cx - 3 * lw, dir: 1, name: 'V_SOUTH_1' });
            this.lanes.vertical.push({ x: cx - 1 * lw, dir: 1, name: 'V_SOUTH_2' });
            // South to North
            this.lanes.vertical.push({ x: cx + 1 * lw, dir: -1, name: 'V_NORTH_1' });
            this.lanes.vertical.push({ x: cx + 3 * lw, dir: -1, name: 'V_NORTH_2' });
        }
    },
    
    setupEventListeners() {
        // Difficulty toggle buttons
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                TrafficAudio.playClick();
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
                this.computeLanes();
            });
        });
        
        // Navigation & Menu actions
        document.getElementById('start-btn').addEventListener('click', () => {
            TrafficAudio.playClick();
            this.startGame();
        });
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            TrafficAudio.playClick();
            this.startGame();
        });
        
        document.getElementById('resume-btn').addEventListener('click', () => {
            TrafficAudio.playClick();
            this.resumeGame();
        });
        
        document.getElementById('restart-paused-btn').addEventListener('click', () => {
            TrafficAudio.playClick();
            this.startGame();
        });
        
        // HUD buttons
        const soundBtn = document.getElementById('btn-sound');
        soundBtn.addEventListener('click', () => {
            const isMuted = TrafficAudio.toggleMute();
            soundBtn.textContent = isMuted ? '🔇' : '🔊';
            TrafficAudio.playClick();
        });
        
        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            TrafficAudio.playClick();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen();
            }
        });
        
        document.getElementById('btn-pause').addEventListener('click', () => {
            TrafficAudio.playClick();
            this.pauseGame();
        });
        
        // Canvas mouse/touch gesture inputs
        const handleStart = (clientX, clientY) => {
            if (this.gameState !== 'PLAYING') return;
            const clicked = this.findVehicleAt(clientX, clientY);
            if (clicked) {
                this.draggedVehicle = clicked;
                this.dragStartX = clientX;
                this.dragStartY = clientY;
            }
        };
        
        const handleEnd = (clientX, clientY) => {
            if (this.gameState !== 'PLAYING' || !this.draggedVehicle) return;
            
            const dx = clientX - this.dragStartX;
            const dy = clientY - this.dragStartY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > this.dragMinDistance) {
                // Swipe detected: verify swipe direction matches vehicle heading
                let isSwipeForward = false;
                const v = this.draggedVehicle;
                if (v.axis === 'h') {
                    if ((v.dir === 1 && dx > 15) || (v.dir === -1 && dx < -15)) {
                        isSwipeForward = true;
                    }
                } else {
                    if ((v.dir === 1 && dy > 15) || (v.dir === -1 && dy < -15)) {
                        isSwipeForward = true;
                    }
                }
                
                if (isSwipeForward) {
                    if (v.type === 'ambulance') {
                        TrafficAudio.playBuzzer();
                    } else {
                        v.boost();
                        TrafficAudio.playBoost();
                    }
                } else {
                    // Swiped backward / stopped
                    if (v.type === 'ambulance') {
                        TrafficAudio.playBuzzer();
                    } else {
                        v.hold();
                        TrafficAudio.playBrake();
                    }
                }
            } else {
                // Tapping: Toggle Stop/Go
                const v = this.draggedVehicle;
                if (v.type === 'ambulance') {
                    TrafficAudio.playBuzzer();
                    this.showAlert("🚨 AMBULANCES CANNOT BE STOPPED!");
                } else {
                    if (v.state === 'HOLD') {
                        v.release();
                        TrafficAudio.playClick();
                    } else {
                        v.hold();
                        TrafficAudio.playBrake();
                    }
                }
            }
            this.draggedVehicle = null;
        };
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (e.changedTouches.length > 0) {
                handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            handleStart(e.clientX, e.clientY);
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            handleEnd(e.clientX, e.clientY);
        });
    },
    
    findVehicleAt(x, y) {
        // Return matching vehicle starting from top z-order (newest/most prominent)
        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            const v = this.vehicles[i];
            const bounds = v.getBounds();
            if (x >= bounds.x1 && x <= bounds.x2 && y >= bounds.y1 && y <= bounds.y2) {
                return v;
            }
        }
        return null;
    },
    
    startGame() {
        this.gameState = 'PLAYING';
        this.vehicles = [];
        this.particles = [];
        this.score = 0;
        this.multiplier = 1.0;
        this.emergenciesHandled = 0;
        this.spawnTimer = Date.now() + 1000; // First spawn in 1 sec
        this.spawnInterval = 2000;
        this.elapsedTime = 0;
        
        // Hide menus, show HUD
        document.getElementById('setup-screen').classList.remove('active');
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('hud-score').textContent = '000';
        document.getElementById('hud-mult').textContent = 'x1.0';
        
        this.showAlert("TRAFFIC FLOW ACTIVATED");
    },
    
    pauseGame() {
        if (this.gameState !== 'PLAYING') return;
        this.gameState = 'PAUSED';
        TrafficAudio.stopSiren();
        document.getElementById('pause-screen').classList.add('active');
    },
    
    resumeGame() {
        if (this.gameState !== 'PAUSED') return;
        this.gameState = 'PLAYING';
        document.getElementById('pause-screen').classList.remove('active');
        // Resume siren if ambulance is currently on field
        if (this.vehicles.some(v => v.type === 'ambulance')) {
            TrafficAudio.startSiren();
        }
    },
    
    triggerGameOver() {
        this.gameState = 'GAMEOVER';
        TrafficAudio.playCrash();
        TrafficAudio.stopSiren();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('signal-green-highscore', this.highScore);
            document.getElementById('hud-highscore').textContent = String(this.highScore).padStart(3, '0');
        }
        
        // Update Stats
        document.getElementById('stat-score').textContent = this.score;
        document.getElementById('stat-multiplier').textContent = `x${this.multiplier.toFixed(1)}`;
        document.getElementById('stat-emergencies').textContent = this.emergenciesHandled;
        document.getElementById('stat-best').textContent = this.highScore;
        
        // Show panel
        document.getElementById('game-over-screen').classList.add('active');
    },
    
    showAlert(text) {
        const alertEl = document.getElementById('hud-alert');
        alertEl.textContent = text;
        alertEl.classList.add('active');
        setTimeout(() => {
            if (alertEl.textContent === text) {
                alertEl.classList.remove('active');
            }
        }, 2500);
    },
    
    spawnVehicle() {
        // Select random lane configuration
        const axes = ['horizontal', 'vertical'];
        const chosenAxis = axes[Math.floor(Math.random() * 2)];
        const laneConfigs = this.lanes[chosenAxis];
        const lane = laneConfigs[Math.floor(Math.random() * laneConfigs.length)];
        
        // Check if spawning point is blocked by another vehicle
        let startPos = 0;
        if (chosenAxis === 'horizontal') {
            startPos = lane.dir === 1 ? -40 : this.width + 40;
        } else {
            startPos = lane.dir === 1 ? -40 : this.height + 40;
        }
        
        // Prevent spawning right on top of another vehicle in the same lane
        const isBlocked = this.vehicles.some(v => {
            if (v.axis === (chosenAxis === 'horizontal' ? 'h' : 'v') && v.laneName === lane.name) {
                const dist = Math.abs(v.pos - startPos);
                return dist < 90; // Too close
            }
            return false;
        });
        
        if (isBlocked) return;
        
        // Decide vehicle type
        const roll = Math.random();
        let type = 'normal';
        if (roll < 0.12) {
            type = 'ambulance';
        } else if (roll < 0.24) {
            type = 'truck';
        } else if (roll < 0.30) {
            type = 'vip';
        }
        
        // Create vehicle
        const vehicle = new Vehicle(type, chosenAxis === 'horizontal' ? 'h' : 'v', lane.y || lane.x, lane.dir, lane.name);
        this.vehicles.push(vehicle);
        
        if (type === 'ambulance') {
            TrafficAudio.startSiren();
            this.showAlert("🚨 EMERGENCY: AMBULANCE INCOMING!");
        }
    },
    
    // Main Game Update loop
    update(dt) {
        if (this.gameState !== 'PLAYING') return;
        
        this.elapsedTime += dt;
        
        // Handle spawning
        if (Date.now() > this.spawnTimer) {
            this.spawnVehicle();
            // Scaling spawn frequency
            const progressRatio = Math.min(1.0, this.elapsedTime / 180000); // Max speed at 3 mins
            const currentInterval = this.spawnInterval - progressRatio * (this.spawnInterval - this.minSpawnInterval);
            this.spawnTimer = Date.now() + currentInterval + (Math.random() * 300);
        }
        
        // Check if sirens can stop
        if (!this.vehicles.some(v => v.type === 'ambulance')) {
            TrafficAudio.stopSiren();
        }
        
        // Update vehicles
        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            const v = this.vehicles[i];
            v.update(dt, this.vehicles);
            
            // If vehicle cleared the screen successfully
            if (v.isCleared) {
                this.score += Math.floor(1 * this.multiplier);
                document.getElementById('hud-score').textContent = String(this.score).padStart(3, '0');
                
                if (v.type === 'ambulance') {
                    this.emergenciesHandled++;
                }
                
                // Spawn clear particle puff
                this.spawnPuff(v.axis === 'h' ? (v.dir === 1 ? this.width - 20 : 20) : v.pos, v.axis === 'v' ? (v.dir === 1 ? this.height - 20 : 20) : v.pos);
                
                this.vehicles.splice(i, 1);
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(dt);
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Check Collisions
        this.checkCollisions();
        
        // Multiplier management: grows for close-calls or continuous flow
        let hasVehiclesIntersectingCore = false;
        const cx = this.width / 2;
        const cy = this.height / 2;
        const rBound = this.roadWidth;
        
        this.vehicles.forEach(v => {
            const inside = v.axis === 'h' ? 
                (v.pos > cx - rBound && v.pos < cx + rBound) : 
                (v.pos > cy - rBound && v.pos < cy + rBound);
            if (inside) hasVehiclesIntersectingCore = true;
        });
        
        if (hasVehiclesIntersectingCore) {
            this.multiplier = Math.min(4.0, this.multiplier + dt * 0.15);
        } else {
            this.multiplier = Math.max(1.0, this.multiplier - dt * 0.1);
        }
        
        document.getElementById('hud-mult').textContent = `x${this.multiplier.toFixed(1)}`;
    },
    
    checkCollisions() {
        for (let i = 0; i < this.vehicles.length; i++) {
            const v1 = this.vehicles[i];
            const b1 = v1.getBounds();
            
            for (let j = i + 1; j < this.vehicles.length; j++) {
                const v2 = this.vehicles[j];
                const b2 = v2.getBounds();
                
                // Bounding boxes intersection
                if (b1.x1 < b2.x2 && b1.x2 > b2.x1 && b1.y1 < b2.y2 && b1.y2 > b2.y1) {
                    // Collision coordinates for particles
                    const px = (Math.max(b1.x1, b2.x1) + Math.min(b1.x2, b2.x2)) / 2;
                    const py = (Math.max(b1.y1, b2.y1) + Math.min(b1.y2, b2.y2)) / 2;
                    this.spawnExplosion(px, py);
                    this.triggerGameOver();
                    return;
                }
            }
        }
    },
    
    spawnExplosion(x, y) {
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 8;
            const size = 3 + Math.random() * 7;
            const life = 0.5 + Math.random() * 0.8;
            const color = Math.random() < 0.4 ? 'var(--neon-pink)' : (Math.random() < 0.5 ? 'var(--neon-yellow)' : '#ff5500');
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, size, color, life));
        }
    },
    
    spawnPuff(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 4, 'rgba(0, 210, 255, 0.4)', 0.4));
        }
    },
    
    // Main Render Loop
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw roads & intersection backgrounds
        this.drawRoads();
        
        // Draw particles
        this.particles.forEach(p => p.draw(ctx));
        
        // Draw vehicles
        this.vehicles.forEach(v => v.draw(ctx));
    },
    
    drawRoads() {
        const ctx = this.ctx;
        const cx = this.width / 2;
        const cy = this.height / 2;
        const rw = this.roadWidth;
        
        // Dark road background
        ctx.fillStyle = '#181a20';
        // Horizontal road
        ctx.fillRect(0, cy - rw, this.width, rw * 2);
        // Vertical road
        ctx.fillRect(cx - rw, 0, rw * 2, this.height);
        
        // Intersection Center area overlay for neon glow outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - rw, cy - rw, rw * 2, rw * 2);
        
        // Paint yellow cross dashed divider markers
        ctx.strokeStyle = '#dfb020';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 15]);
        
        // Horizontal centerline
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(cx - rw, cy);
        ctx.moveTo(cx + rw, cy);
        ctx.lineTo(this.width, cy);
        ctx.stroke();
        
        // Vertical centerline
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, cy - rw);
        ctx.moveTo(cx, cy + rw);
        ctx.lineTo(cx, this.height);
        ctx.stroke();
        
        // Multi-lane white dashed dividers
        if (this.difficulty === 'rush') {
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.setLineDash([8, 12]);
            const lw = rw / 4;
            
            ctx.beginPath();
            // horizontal lanes subdividers
            ctx.moveTo(0, cy - 2 * lw); ctx.lineTo(cx - rw, cy - 2 * lw);
            ctx.moveTo(cx + rw, cy - 2 * lw); ctx.lineTo(this.width, cy - 2 * lw);
            ctx.moveTo(0, cy + 2 * lw); ctx.lineTo(cx - rw, cy + 2 * lw);
            ctx.moveTo(cx + rw, cy + 2 * lw); ctx.lineTo(this.width, cy + 2 * lw);
            
            // vertical lanes subdividers
            ctx.moveTo(cx - 2 * lw, 0); ctx.lineTo(cx - 2 * lw, cy - rw);
            ctx.moveTo(cx - 2 * lw, cy + rw); ctx.lineTo(cx - 2 * lw, this.height);
            ctx.moveTo(cx + 2 * lw, 0); ctx.lineTo(cx + 2 * lw, cy - rw);
            ctx.moveTo(cx + 2 * lw, cy + rw); ctx.lineTo(cx + 2 * lw, this.height);
            
            ctx.stroke();
        }
        
        // Reset line dash
        ctx.setLineDash([]);
        
        // Crosswalk stripes (Zebra crossings)
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        const drawCrosswalk = (startX, startY, isVertical) => {
            const stripes = 6;
            const stripeLen = 14;
            const stripeW = 8;
            const spacing = 6;
            
            if (isVertical) {
                for (let i = 0; i < stripes; i++) {
                    ctx.fillRect(startX + i * (stripeW + spacing) - 38, startY, stripeW, stripeLen);
                }
            } else {
                for (let i = 0; i < stripes; i++) {
                    ctx.fillRect(startX, startY + i * (stripeW + spacing) - 38, stripeLen, stripeW);
                }
            }
        };
        
        // Top crosswalk
        drawCrosswalk(cx, cy - rw - 18, true);
        // Bottom crosswalk
        drawCrosswalk(cx, cy + rw + 4, true);
        // Left crosswalk
        drawCrosswalk(cx - rw - 18, cy, false);
        // Right crosswalk
        drawCrosswalk(cx + rw + 4, cy, false);
    },
    
    // Loop clock timing
    lastTime: 0,
    loop(time) {
        if (!this.lastTime) this.lastTime = time;
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;
        
        // Clamp frame drops to prevent massive delta slips
        const clampedDt = Math.min(dt, 0.1);
        
        this.update(clampedDt);
        this.render();
        
        requestAnimationFrame((t) => this.loop(t));
    }
};

// ── VEHICLE ENTITY CLASS ─────────────────────────────
class Vehicle {
    constructor(type, axis, trackCoord, dir, laneName) {
        this.type = type; // normal, truck, vip, ambulance
        this.axis = axis; // h, v
        this.trackCoord = trackCoord; // the constant Y (for h) or X (for v)
        this.dir = dir; // 1 = East/South, -1 = West/North
        this.laneName = laneName;
        
        // Base sizes
        this.w = 34; // along road perpendicular
        this.h = 20; // default length
        if (type === 'truck') this.h = 44;
        if (type === 'vip') this.h = 26;
        if (type === 'ambulance') this.h = 24;
        
        // Spawn coordinates just off-screen
        const buffer = 50;
        if (axis === 'h') {
            this.pos = dir === 1 ? -buffer : Game.width + buffer;
        } else {
            this.pos = dir === 1 ? -buffer : Game.height + buffer;
        }
        
        // Speeds (pixels per second)
        this.baseSpeed = 75;
        if (type === 'truck') this.baseSpeed = 50;
        if (type === 'ambulance') this.baseSpeed = 130;
        if (type === 'vip') this.baseSpeed = 80;
        
        this.speed = this.baseSpeed;
        this.state = 'MOVE'; // MOVE, HOLD, BOOST
        
        // Vehicle visual state properties
        this.color = '#38b000'; // normal go
        this.glowTrailTimer = 0;
        this.isCleared = false;
        
        // Unique random neon colors for civilian vehicles
        if (type === 'normal') {
            const colors = ['#00f5d4', '#7b2cbf', '#f15bb5', '#fee440', '#00bbf9'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        } else if (type === 'truck') {
            this.color = '#ff9f1c';
        } else if (type === 'vip') {
            this.color = '#111111'; // Sleek executive black
        } else if (type === 'ambulance') {
            this.color = '#ffffff';
        }
    }
    
    getBounds() {
        // Bounds mapping back to screen space coordinates
        const halfW = this.w / 2;
        const len = this.h;
        
        if (this.axis === 'h') {
            // horizontal vehicle is drawn horizontal: length is X, width is Y
            const x1 = this.dir === 1 ? this.pos - len : this.pos;
            const x2 = this.dir === 1 ? this.pos : this.pos + len;
            const y1 = this.trackCoord - halfW;
            const y2 = this.trackCoord + halfW;
            return { x1, y1, x2, y2 };
        } else {
            // vertical vehicle is drawn vertical: length is Y, width is X
            const x1 = this.trackCoord - halfW;
            const x2 = this.trackCoord + halfW;
            const y1 = this.dir === 1 ? this.pos - len : this.pos;
            const y2 = this.dir === 1 ? this.pos : this.pos + len;
            return { x1, y1, x2, y2 };
        }
    }
    
    hold() {
        if (this.type === 'ambulance') return;
        this.state = 'HOLD';
        this.speed = 0;
    }
    
    release() {
        this.state = 'MOVE';
        this.speed = this.baseSpeed;
    }
    
    boost() {
        if (this.type === 'ambulance') return;
        this.state = 'BOOST';
        this.speed = this.baseSpeed * 2.2;
    }
    
    update(dt, allVehicles) {
        // Queueing behavior: Check if there is a car directly ahead in the same lane
        let stopDueToQueue = false;
        
        if (this.state !== 'BOOST') {
            for (let i = 0; i < allVehicles.length; i++) {
                const other = allVehicles[i];
                if (other === this) continue;
                
                // Same axis and laneName
                if (other.axis === this.axis && other.laneName === this.laneName) {
                    // Check if other is ahead of us along direction
                    const diff = (other.pos - this.pos) * this.dir;
                    if (diff > 0 && diff < (this.h + other.h + 16)) {
                        // If other is stopped or slower, match/stop
                        if (other.speed < this.speed || other.state === 'HOLD') {
                            stopDueToQueue = true;
                            break;
                        }
                    }
                }
            }
        }
        
        // Adjust speed based on state
        if (stopDueToQueue) {
            this.speed = 0;
        } else if (this.state === 'MOVE') {
            // Accelerate back to normal speed smoothly
            this.speed = Math.min(this.baseSpeed, this.speed + dt * 150);
        } else if (this.state === 'BOOST') {
            this.speed = this.baseSpeed * 2.2;
            
            // Add blue/cyan trail sparks
            this.glowTrailTimer -= dt;
            if (this.glowTrailTimer <= 0) {
                const bounds = this.getBounds();
                const tx = this.axis === 'h' ? (this.dir === 1 ? bounds.x1 : bounds.x2) : (bounds.x1 + bounds.x2) / 2;
                const ty = this.axis === 'v' ? (this.dir === 1 ? bounds.y1 : bounds.y2) : (bounds.y1 + bounds.y2) / 2;
                
                Game.particles.push(new Particle(
                    tx, ty, 
                    -this.dir * (this.axis === 'h' ? 2 : 0) + (Math.random() - 0.5) * 2,
                    -this.dir * (this.axis === 'v' ? 2 : 0) + (Math.random() - 0.5) * 2,
                    3, 'rgba(0, 210, 255, 0.6)', 0.4
                ));
                this.glowTrailTimer = 0.04;
            }
        }
        
        // Update positions
        this.pos += this.speed * this.dir * dt;
        
        // Out of bounds screen check
        const bounds = this.getBounds();
        if (this.axis === 'h') {
            if (this.dir === 1 && bounds.x1 > Game.width) this.isCleared = true;
            if (this.dir === -1 && bounds.x2 < 0) this.isCleared = true;
        } else {
            if (this.dir === 1 && bounds.y1 > Game.height) this.isCleared = true;
            if (this.dir === -1 && bounds.y2 < 0) this.isCleared = true;
        }
    }
    
    draw(ctx) {
        const bounds = this.getBounds();
        const width = bounds.x2 - bounds.x1;
        const height = bounds.y2 - bounds.y1;
        
        ctx.save();
        
        // Add neon shadows to cars
        ctx.shadowBlur = 10;
        if (this.state === 'HOLD') {
            ctx.shadowColor = 'var(--neon-pink)';
        } else if (this.state === 'BOOST') {
            ctx.shadowColor = 'var(--neon-blue)';
        } else if (this.type === 'ambulance') {
            ctx.shadowColor = 'rgba(255, 51, 51, 0.8)';
        } else {
            ctx.shadowColor = this.color;
        }
        
        // VIP Motorcade special styling
        if (this.type === 'vip') {
            // Draw golden warning lines
            ctx.strokeStyle = 'var(--neon-yellow)';
            ctx.lineWidth = 2;
            ctx.strokeRect(bounds.x1 - 2, bounds.y1 - 2, width + 4, height + 4);
        }
        
        // Draw main body box
        ctx.fillStyle = this.color;
        // Rounded rectangle body
        ctx.beginPath();
        ctx.roundRect(bounds.x1, bounds.y1, width, height, 5);
        ctx.fill();
        
        // Reset shadows for details
        ctx.shadowBlur = 0;
        
        // Windshield and Windows
        ctx.fillStyle = 'rgba(13, 14, 18, 0.7)';
        if (this.axis === 'h') {
            // Windows drawn horizontally
            const wShieldX = this.dir === 1 ? bounds.x2 - 8 : bounds.x1 + 3;
            ctx.fillRect(wShieldX, bounds.y1 + 3, 5, height - 6);
        } else {
            // Windows drawn vertically
            const wShieldY = this.dir === 1 ? bounds.y2 - 8 : bounds.y1 + 3;
            ctx.fillRect(bounds.x1 + 3, wShieldY, width - 6, 5);
        }
        
        // Headlights (neon yellow in front) and Brake Lights (red in back)
        const hlSize = 3;
        ctx.fillStyle = 'var(--neon-yellow)';
        
        if (this.axis === 'h') {
            if (this.dir === 1) {
                // Front right headlights
                ctx.fillRect(bounds.x2 - 1, bounds.y1 + 2, 2, hlSize);
                ctx.fillRect(bounds.x2 - 1, bounds.y2 - 2 - hlSize, 2, hlSize);
                // Back tail brake lights
                ctx.fillStyle = this.state === 'HOLD' ? 'var(--neon-pink)' : '#7f0000';
                ctx.fillRect(bounds.x1 - 1, bounds.y1 + 2, 2, hlSize);
                ctx.fillRect(bounds.x1 - 1, bounds.y2 - 2 - hlSize, 2, hlSize);
            } else {
                // Front left headlights
                ctx.fillRect(bounds.x1 - 1, bounds.y1 + 2, 2, hlSize);
                ctx.fillRect(bounds.x1 - 1, bounds.y2 - 2 - hlSize, 2, hlSize);
                // Back tail brake lights
                ctx.fillStyle = this.state === 'HOLD' ? 'var(--neon-pink)' : '#7f0000';
                ctx.fillRect(bounds.x2 - 1, bounds.y1 + 2, 2, hlSize);
                ctx.fillRect(bounds.x2 - 1, bounds.y2 - 2 - hlSize, 2, hlSize);
            }
        } else {
            if (this.dir === 1) {
                // Front bottom headlights
                ctx.fillRect(bounds.x1 + 2, bounds.y2 - 1, hlSize, 2);
                ctx.fillRect(bounds.x2 - 2 - hlSize, bounds.y2 - 1, hlSize, 2);
                // Back top brake lights
                ctx.fillStyle = this.state === 'HOLD' ? 'var(--neon-pink)' : '#7f0000';
                ctx.fillRect(bounds.x1 + 2, bounds.y1 - 1, hlSize, 2);
                ctx.fillRect(bounds.x2 - 2 - hlSize, bounds.y1 - 1, hlSize, 2);
            } else {
                // Front top headlights
                ctx.fillRect(bounds.x1 + 2, bounds.y1 - 1, hlSize, 2);
                ctx.fillRect(bounds.x2 - 2 - hlSize, bounds.y1 - 1, hlSize, 2);
                // Back bottom brake lights
                ctx.fillStyle = this.state === 'HOLD' ? 'var(--neon-pink)' : '#7f0000';
                ctx.fillRect(bounds.x1 + 2, bounds.y2 - 1, hlSize, 2);
                ctx.fillRect(bounds.x2 - 2 - hlSize, bounds.y2 - 1, hlSize, 2);
            }
        }
        
        // Ambulance flashing siren detail
        if (this.type === 'ambulance') {
            const isRed = Math.floor(Date.now() / 150) % 2 === 0;
            ctx.fillStyle = isRed ? 'var(--neon-red)' : 'var(--neon-blue)';
            ctx.beginPath();
            ctx.arc((bounds.x1 + bounds.x2) / 2, (bounds.y1 + bounds.y2) / 2, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// ── PARTICLE ENGINE ENTITY ────────────────────────────
class Particle {
    constructor(x, y, vx, vy, size, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.maxLife = life;
        this.life = life;
    }
    
    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= dt;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
