# Skill: Language i18n — English + Malayalam Bilingual Support

## Overview

TinyGames supports **English** and **Malayalam** (മലയാളം) in all games.
- Language toggle appears in the start/lounge screen
- Also available in the pause menu
- Uses `data-i18n` attribute on DOM elements
- `setLanguage(lang)` function updates all elements at once

---

## Standard i18n Implementation

### 1. Translations Object (in game JS)

```javascript
const translations = {
  en: {
    title: "Game Name",
    subtitle: "Game tagline in English",
    play: "Play Now",
    pause: "PAUSED",
    resume: "Resume",
    quit: "Quit Game",
    backHub: "Back to Hub",
    rulesTitle: "Rules:",
    premise: "Game description in English...",
    rule1: "First rule.",
    rule2: "Second rule.",
    // win/lose conditions
    win: "You Win!",
    lose: "Game Over",
    playAgain: "Play Again",
    // Game-specific
    score: "Score",
    timeLeft: "Time Left",
  },
  ml: {
    title: "ഗെയിം പേര്",
    subtitle: "ഗെയിം ടാഗ്‌ലൈൻ",
    play: "കളിക്കാം",
    pause: "പോസ്",
    resume: "തുടരാം",
    quit: "ഗെയിം വിടുക",
    backHub: "ഹബ്ബിലേക്ക്",
    rulesTitle: "നിയമങ്ങൾ:",
    premise: "മലയാളത്തിൽ ഗെയിം വിവരണം...",
    rule1: "ഒന്നാമത്തെ നിയമം.",
    rule2: "രണ്ടാമത്തെ നിയമം.",
    win: "ജയിച്ചു!",
    lose: "ഗെയിം ഓവർ",
    playAgain: "വീണ്ടും കളിക്കാം",
    score: "സ്കോർ",
    timeLeft: "ബാക്കി സമയം",
  }
};
```

### 2. setLanguage Function

```javascript
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  
  // Update active state on language buttons (lounge)
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-ml').classList.toggle('active', lang === 'ml');
  
  // If pause menu also has language buttons
  const pauseEn = document.getElementById('lang-en-pause');
  const pauseMl = document.getElementById('lang-ml-pause');
  if (pauseEn) pauseEn.classList.toggle('active', lang === 'en');
  if (pauseMl) pauseMl.classList.toggle('active', lang === 'ml');
}
```

### 3. Language Button Wiring

```javascript
// Lounge screen buttons
document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-ml').addEventListener('click', () => setLanguage('ml'));

// Pause menu buttons (mirror the lounge)
const pauseEn = document.getElementById('lang-en-pause');
const pauseMl = document.getElementById('lang-ml-pause');
if (pauseEn) pauseEn.addEventListener('click', () => setLanguage('en'));
if (pauseMl) pauseMl.addEventListener('click', () => setLanguage('ml'));

// Initialize with English
setLanguage('en');
```

---

## HTML Pattern: data-i18n Attribute

```html
<!-- Lounge -->
<h1 data-i18n="title">Game Name</h1>
<p data-i18n="subtitle">Tagline</p>

<!-- Language Toggle (lounge) -->
<div style="text-align: center; margin: 10px 0;">
  <button id="lang-en" class="btn outline-btn active" 
          style="padding: 5px 10px; width: auto; margin-right: 5px; text-transform: none;">
    English
  </button>
  <button id="lang-ml" class="btn outline-btn" 
          style="padding: 5px 10px; width: auto; text-transform: none;">
    മലയാളം
  </button>
</div>

<!-- Instructions -->
<div class="instructions">
  <h3 data-i18n="rulesTitle">Rules:</h3>
  <ul>
    <li data-i18n="rule1">Rule 1</li>
    <li data-i18n="rule2">Rule 2</li>
  </ul>
</div>

<!-- Play button -->
<button id="play-btn" class="btn primary-btn" data-i18n="play">Play Now</button>

<!-- Back link -->
<a href="index.html" class="back-link" data-i18n="backHub">Back to Hub</a>
```

---

## Language Toggle in Pause Menu

```html
<!-- Pause overlay language toggle -->
<div style="display: flex; gap: 10px; margin-bottom: 15px; justify-content: center;">
  <button id="lang-en-pause" class="btn outline-btn active" 
          style="padding: 5px 10px; flex: 1; text-transform: none;">English</button>
  <button id="lang-ml-pause" class="btn outline-btn" 
          style="padding: 5px 10px; flex: 1; text-transform: none;">മലയാളം</button>
</div>
```

---

## Dynamic Text (Scores, Status)

For text that changes dynamically during gameplay, use the translation object directly:

```javascript
function updateStatus(key, ...args) {
  const t = translations[currentLang];
  let text = t[key] || key;
  // Simple string interpolation
  args.forEach((arg, i) => { text = text.replace(`{${i}}`, arg); });
  document.getElementById('status').textContent = text;
}

// Example: "Score: 42" / "സ്കോർ: 42"
// In translations: { en: { scoreLabel: "Score: {0}" }, ml: { scoreLabel: "സ്കോർ: {0}" } }
updateStatus('scoreLabel', score);
```

---

## Malayalam Common Game Terms Reference

| English | Malayalam | Notes |
|---------|-----------|-------|
| Play Now | കളിക്കാം | |
| Back to Hub | ഹബ്ബിലേക്ക് | |
| Rules | നിയമങ്ങൾ | |
| Score | സ്കോർ | |
| Time | സമയം | |
| Level | ലെവൽ | |
| Pause | പോസ് | |
| Resume | തുടരാം | |
| Quit | വിടുക | |
| Win | ജയം / ജയിച്ചു | |
| Lose | തോൽക്കുക | |
| Play Again | വീണ്ടും കളിക്കാം | |
| Tiger | കടുവ | |
| Goat | ആട് | |
| Crow | കാക്ക | |
| Flies | പറക്കുന്നു | |
| Place a piece | കരു വക്കുക | |
| Your turn | നിങ്ങളുടെ ഊഴം | |
| Waiting... | കാത്തിരിക്കുന്നു... | |
| Room Code | റൂം കോഡ് | |
| Join Room | റൂമിൽ ചേരുക | |
| Create Room | റൂം ഉണ്ടാക്കുക | |
| Local 2-Player | ലോക്കൽ 2 പ്ലേയർ | |

---

## Voice Language Handling

```javascript
// Play the current language voice for a word
function playWordVoice(word) {
  const lang = currentLang; // 'en' or 'ml'
  const filename = word.toLowerCase().replace(/ /g, '-');
  const audio = new Audio(`/sounds/${lang}/${filename}.mp3`);
  audio.play().catch(() => {});
}
```

> Both `en/` and `ml/` folders use the same English-based filenames.
> Only the folder changes: `sounds/en/crow.mp3` vs `sounds/ml/crow.mp3`

---

## i18n Initialization (Best Practice)

Always call `setLanguage('en')` at the very end of the script (after all DOM is ready):

```javascript
// At the bottom of your JS file, after all event listeners are wired:
setLanguage('en');
```

This ensures all `data-i18n` elements get populated on first load.
