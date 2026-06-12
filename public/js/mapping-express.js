// Translations Object (English + Malayalam support)
const translations = {
  en: {
    title: "Mapping Express",
    subtitle: "High-speed geography & shape recognition",
    difficultyLabel: "Difficulty Mode",
    diffEasy: "Easy (North Up)",
    diffHard: "Hard (Rotating Maps)",
    selectLevel: "Select Level:",
    howToPlay: "How to Play:",
    rule1: "1. A region on the map lights up in light blue.",
    rule2: "2. Decide if the flashing name at the top matches that region.",
    rule3: "3. Tap YES ✓ or NO ✗ within 800 milliseconds!",
    rule4: "4. Score 15 matches to unlock the next level.",
    regionLabel: "Region name:",
    btnYes: "✓ YES",
    btnNo: "✗ NO",
    scoreLabel: "Score",
    keyboardTip: "Keyboard: A / D / Left / Right",
    levelComplete: "LEVEL COMPLETED! 🎉",
    didYouKnow: "Did You Know?",
    nextLevelBtn: "Next Level",
    backLevelSelect: "Back to Level Select",
    gameOver: "GAME OVER 💀",
    tryAgain: "Try Again",
    practiceTip: "Keep practicing to master this region's layout!"
  },
  ml: {
    title: "മാപ്പിംഗ് എക്സ്പ്രസ്സ്",
    subtitle: "ഹൈ-സ്പീഡ് ഭൂമിശാസ്ത്ര രൂപ തിരിച്ചറിയൽ ഗെയിം",
    difficultyLabel: "ഗെയിം മോഡ് തിരഞ്ഞെടുക്കുക",
    diffEasy: "എളുപ്പം (വടക്ക് മുകളിൽ)",
    diffHard: "കഠിനം (കറങ്ങുന്ന ഭൂപടം)",
    selectLevel: "ലെവൽ തിരഞ്ഞെടുക്കുക:",
    howToPlay: "എങ്ങനെ കളിക്കാം:",
    rule1: "1. ഭൂപടത്തിലെ ഒരു പ്രദേശം ഇളം നീല നിറത്തിൽ തിളങ്ങും.",
    rule2: "2. മുകളിൽ കാണിക്കുന്ന പേര് ഈ തിളങ്ങുന്ന പ്രദേശത്തിന്റേതാണോ എന്ന് തീരുമാനിക്കുക.",
    rule3: "3. 800 മില്ലിസെക്കൻഡിനുള്ളിൽ അതെ (YES) അല്ലെങ്കിൽ അല്ല (NO) ടാപ്പ് ചെയ്യുക!",
    rule4: "4. അടുത്ത ലെവൽ അൺലോക്ക് ചെയ്യാൻ 15 പോയിന്റ് നേടുക.",
    regionLabel: "പ്രദേശത്തിന്റെ പേര്:",
    btnYes: "✓ അതെ",
    btnNo: "✗ അല്ല",
    scoreLabel: "സ്കോർ",
    keyboardTip: "കീബോർഡ്: A / D / Left / Right",
    levelComplete: "ലെവൽ പൂർത്തിയായി! 🎉",
    didYouKnow: "നിങ്ങൾക്ക് അറിയാമോ?",
    nextLevelBtn: "അടുത്ത ലെവൽ",
    backLevelSelect: "ലെവൽ സെലക്റ്റിലേക്ക് മടങ്ങുക",
    gameOver: "ഗെയിം ഓവർ 💀",
    tryAgain: "വീണ്ടും ശ്രമിക്കുക",
    practiceTip: "ഈ ഭൂപടം നന്നായി മനസ്സിലാക്കാൻ പരിശീലനം തുടരുക!"
  }
};

// Mapping Express Game State and Controllers
class MappingExpressGame {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.currentLevelIndex = 0;
    this.levelScore = 0;
    this.questionsAnswered = 0;
    this.questionsNeeded = 15;
    
    this.timer = null;
    this.timeLeft = 1100; 
    this.timerDuration = 1100;
    this.lastFrameTime = 0;

    this.currentRegion = null;
    this.shownName = null;
    this.isCorrectMatch = false;

    this.isGameActive = false;
    this.isPaused = false;
    
    // Game options
    this.currentLang = 'en';
    this.disorientMode = false; // default Easy (Classic, North Up)
    this.isDesktop = !('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Load progress from local storage
    this.unlockedLevels = JSON.parse(localStorage.getItem('mapping_express_unlocked')) || [1];

    this.initElements();
    this.initEvents();
    this.setLanguage('en');
    this.renderLevelSelector();
  }

  initElements() {
    this.el = {
      startScreen: document.getElementById('start-screen'),
      gameScreen: document.getElementById('game-container'),
      endScreen: document.getElementById('end-screen'),
      levelGrid: document.getElementById('level-grid'),
      
      scoreVal: document.getElementById('score'),
      livesVal: document.getElementById('lives'),
      levelVal: document.getElementById('level'),
      
      promptName: document.getElementById('prompt-name'),
      mapContainer: document.getElementById('map-container'),
      timerFill: document.getElementById('timer-fill'),
      feedbackOverlay: document.getElementById('feedback-overlay'),
      
      btnYes: document.getElementById('btn-yes'),
      btnNo: document.getElementById('btn-no'),
      btnPause: document.getElementById('pause-btn'),
      
      resultStatus: document.getElementById('result-status'),
      resultScore: document.getElementById('result-score'),
      resultFact: document.getElementById('result-fact'),
      resultActionBtn: document.getElementById('result-action-btn'),

      // Interactive control widgets
      langEn: document.getElementById('lang-en'),
      langMl: document.getElementById('lang-ml'),
      diffClassic: document.getElementById('diff-classic'),
      diffDisorient: document.getElementById('diff-disorient'),
      desktopKbTip: document.getElementById('desktop-kb-tip')
    };

    // Show desktop keyboard shortcuts if on desktop computer
    if (this.isDesktop && this.el.desktopKbTip) {
      this.el.desktopKbTip.style.display = 'block';
    }
  }

  initEvents() {
    this.el.btnYes.addEventListener('click', () => {
      Sounds.play('click');
      this.handleAnswer(true);
    });
    this.el.btnNo.addEventListener('click', () => {
      Sounds.play('click');
      this.handleAnswer(false);
    });
    
    // Language controllers
    this.el.langEn.addEventListener('click', () => {
      Sounds.play('click');
      this.setLanguage('en');
    });
    this.el.langMl.addEventListener('click', () => {
      Sounds.play('click');
      this.setLanguage('ml');
    });

    // Difficulty settings
    this.el.diffClassic.addEventListener('click', () => {
      Sounds.play('click');
      this.setDifficulty(false);
    });
    this.el.diffDisorient.addEventListener('click', () => {
      Sounds.play('click');
      this.setDifficulty(true);
    });

    // Keyboard bindings ONLY operational if isDesktop flag validates true
    document.addEventListener('keydown', (e) => {
      if (!this.isGameActive || this.isPaused || !this.isDesktop) return;
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'y' || e.key.toLowerCase() === 'a') {
        Sounds.play('click');
        this.handleAnswer(true);
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n' || e.key.toLowerCase() === 'd') {
        Sounds.play('click');
        this.handleAnswer(false);
      }
    });

    this.el.btnPause.addEventListener('click', () => {
      Sounds.play('click');
      this.togglePause();
    });
  }

  setLanguage(lang) {
    this.currentLang = lang;
    const t = translations[lang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });

    this.el.langEn.classList.toggle('active', lang === 'en');
    this.el.langMl.classList.toggle('active', lang === 'ml');
  }

  setDifficulty(disorientEnabled) {
    this.disorientMode = disorientEnabled;
    this.el.diffClassic.classList.toggle('active', !disorientEnabled);
    this.el.diffDisorient.classList.toggle('active', disorientEnabled);
  }

  renderLevelSelector() {
    this.el.levelGrid.innerHTML = '';
    MAP_DATA.forEach((map) => {
      const isUnlocked = this.unlockedLevels.includes(map.level);
      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="emoji">${map.emoji}</div>
        <div class="num">Lvl ${map.level}</div>
        ${isUnlocked ? '' : '<div class="lock-icon">🔒</div>'}
      `;
      if (isUnlocked) {
        card.addEventListener('click', () => {
          Sounds.play('click');
          this.startLevel(map.level - 1);
        });
      }
      this.el.levelGrid.appendChild(card);
    });
  }

  startLevel(index) {
    this.currentLevelIndex = index;
    this.score = 0;
    this.levelScore = 0;
    this.lives = 3;
    this.questionsAnswered = 0;
    
    this.el.startScreen.classList.add('hidden');
    this.el.endScreen.classList.add('hidden');
    this.el.gameScreen.classList.remove('hidden');
    
    this.el.levelVal.textContent = MAP_DATA[this.currentLevelIndex].name;
    this.updateStats();
    
    this.isGameActive = true;
    this.isPaused = false;
    
    this.nextQuestion();
  }

  updateStats() {
    this.el.scoreVal.textContent = this.score;
    this.el.livesVal.textContent = '❤️'.repeat(Math.max(0, this.lives));
  }

  nextQuestion() {
    if (!this.isGameActive) return;

    if (this.questionsAnswered >= this.questionsNeeded) {
      this.completeLevel(true);
      return;
    }

    const map = MAP_DATA[this.currentLevelIndex];
    
    // Set timer duration according to difficulty mode
    if (this.disorientMode) {
      // Hard Mode starts at 1300ms, decreases down to 800ms (reaches 800ms at score 100)
      this.timerDuration = Math.max(800, 1300 - (this.score * 5));
    } else {
      // Easy Mode stays fixed at 1100ms
      this.timerDuration = 1100;
    }
    
    // Choose a random region
    const randomIdx = Math.floor(Math.random() * map.regions.length);
    this.currentRegion = map.regions[randomIdx];

    // Determine if we show matching name (70% yes, 30% no)
    this.isCorrectMatch = Math.random() < 0.7;

    if (this.isCorrectMatch) {
      this.shownName = this.currentRegion.name;
    } else {
      // Find a wrong region from same map
      let wrongIdx;
      do {
        wrongIdx = Math.floor(Math.random() * map.regions.length);
      } while (wrongIdx === randomIdx && map.regions.length > 1);
      
      this.shownName = map.regions[wrongIdx].name;
    }

    this.renderMapAndName();
    this.startQuestionTimer();
  }

  renderMapAndName() {
    const map = MAP_DATA[this.currentLevelIndex];
    this.el.promptName.textContent = this.shownName;
    this.el.promptName.classList.remove('flash');
    void this.el.promptName.offsetWidth; // Trigger reflow
    this.el.promptName.classList.add('flash');

    // Build SVG
    let pathsHtml = '';
    map.regions.forEach(region => {
      const isHighlighted = region.id === this.currentRegion.id;
      pathsHtml += `<path id="region-${region.id}" d="${region.path}" class="${isHighlighted ? 'highlighted' : ''}"></path>`;
    });

    this.el.mapContainer.innerHTML = `
      <svg class="geography-map" viewBox="${map.viewBox}">
        ${pathsHtml}
      </svg>
    `;

    // Apply rotation & scale disorientation only if disorientMode (selected from lounge) is active.
    // Otherwise, always keep North up (Classic Mode).
    let rotate = 0;
    let scale = 1;
    if (this.disorientMode) {
      if (this.score >= 50) {
        rotate = (Math.random() * 40) - 20; // Rotate map randomly between -20 to 20 deg
      }
      if (this.score >= 100) {
        scale = 0.85 + (Math.random() * 0.3); // Scale map randomly between 0.85 and 1.15
      }
    }
    
    const svgEl = this.el.mapContainer.querySelector('.geography-map');
    if (svgEl) {
      svgEl.style.transform = `rotate(${rotate}deg) scale(${scale})`;
      svgEl.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
  }

  startQuestionTimer() {
    if (this.timer) cancelAnimationFrame(this.timer);
    
    this.timeLeft = this.timerDuration;
    this.lastFrameTime = performance.now();
    
    const tick = (now) => {
      if (this.isPaused || !this.isGameActive) {
        this.lastFrameTime = now;
        this.timer = requestAnimationFrame(tick);
        return;
      }

      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      this.timeLeft -= delta;

      const percentage = Math.max(0, (this.timeLeft / this.timerDuration) * 100);
      this.el.timerFill.style.width = `${percentage}%`;

      if (this.timeLeft <= 0) {
        this.handleTimeout();
      } else {
        this.timer = requestAnimationFrame(tick);
      }
    };
    
    this.timer = requestAnimationFrame(tick);
  }

  handleAnswer(playerSelectedYes) {
    if (!this.isGameActive || this.isPaused) return;
    
    if (this.timer) cancelAnimationFrame(this.timer);

    const isCorrect = (playerSelectedYes === this.isCorrectMatch);
    
    if (isCorrect) {
      this.triggerFeedback(true);
      Sounds.play('place');
      
      this.score += 10;
      this.questionsAnswered++;
      this.updateStats();
      setTimeout(() => this.nextQuestion(), 250);
    } else {
      this.triggerFeedback(false);
      this.handleLossOfLife();
    }
  }

  handleTimeout() {
    this.triggerFeedback(false);
    this.handleLossOfLife();
  }

  handleLossOfLife() {
    Sounds.play('lose');
    
    this.lives--;
    this.updateStats();
    
    if (this.lives <= 0) {
      this.completeLevel(false);
    } else {
      setTimeout(() => this.nextQuestion(), 400);
    }
  }

  triggerFeedback(isCorrect) {
    this.el.feedbackOverlay.className = `feedback-overlay ${isCorrect ? 'correct' : 'incorrect'}`;
    setTimeout(() => {
      this.el.feedbackOverlay.className = 'feedback-overlay';
    }, 200);
  }

  completeLevel(isVictory) {
    this.isGameActive = false;
    if (this.timer) cancelAnimationFrame(this.timer);
    
    this.el.gameScreen.classList.add('hidden');
    this.el.endScreen.classList.remove('hidden');

    const currentMap = MAP_DATA[this.currentLevelIndex];
    const t = translations[this.currentLang];

    if (isVictory) {
      this.el.resultStatus.textContent = t.levelComplete;
      this.el.resultScore.textContent = `${t.scoreLabel}: ${this.score}`;
      this.el.resultFact.textContent = currentMap.fact;
      
      // Unlock next level
      const nextLevel = currentMap.level + 1;
      if (nextLevel <= MAP_DATA.length && !this.unlockedLevels.includes(nextLevel)) {
        this.unlockedLevels.push(nextLevel);
        localStorage.setItem('mapping_express_unlocked', JSON.stringify(this.unlockedLevels));
      }
      
      this.el.resultActionBtn.textContent = t.nextLevelBtn;
      this.el.resultActionBtn.onclick = () => {
        const nextIdx = this.currentLevelIndex + 1;
        if (nextIdx < MAP_DATA.length) {
          this.startLevel(nextIdx);
        } else {
          this.exitToHub();
        }
      };
      
      Sounds.play('win');
    } else {
      this.el.resultStatus.textContent = t.gameOver;
      this.el.resultScore.textContent = `${t.scoreLabel}: ${this.score}`;
      this.el.resultFact.textContent = t.practiceTip;
      
      this.el.resultActionBtn.textContent = t.tryAgain;
      this.el.resultActionBtn.onclick = () => this.startLevel(this.currentLevelIndex);
      
      Sounds.play('gameOver');
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.el.btnPause.textContent = this.isPaused ? '▶' : '⏸';
  }

  exitToHub() {
    this.isGameActive = false;
    if (this.timer) cancelAnimationFrame(this.timer);
    this.el.gameScreen.classList.add('hidden');
    this.el.endScreen.classList.add('hidden');
    this.el.startScreen.classList.remove('hidden');
    this.renderLevelSelector();
  }
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  window.game = new MappingExpressGame();
});
