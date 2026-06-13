# Skill: UI/UX Design System for TinyGames

## Design Philosophy

- **Dark mode first**: Dark background, vibrant accent colors
- **Glassmorphism accents**: subtle blur/transparency for overlays
- **Micro-animations**: popIn, hover transforms, transitions everywhere
- **Mobile-first**: designed for phone portrait, scales to desktop
- **Premium feel**: Google Fonts, gradient text, gradient buttons

---

## CSS Design Tokens (from style.css)

```css
:root {
  --bg-color: #121212;        /* Near-black background */
  --text-color: #ffffff;      /* White text */
  --card-bg: #1e1e1e;         /* Dark card background */
  --primary: #00d2ff;         /* Cyan accent */
  --secondary: #ff007f;       /* Hot pink accent */
  --border-radius: 16px;      /* Rounded corners */
  --transition: all 0.3s ease; /* Standard transition */
}
```

---

## Typography

- **Font**: [Outfit](https://fonts.google.com/specimen/Outfit) — always loaded from Google Fonts
- **Weights**: 400 (body), 600 (medium), 800 (heavy headings)
- **Load snippet**:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  ```
- **h1 style**: 3rem, weight 800, gradient text (primary → secondary)
  ```css
  h1 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  ```

---

## Button System

### Primary Button (gradient, main CTA)
```css
.primary-btn {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.primary-btn:hover { opacity: 0.9; transform: scale(1.05); }
```

### Secondary Button (muted)
```css
.secondary-btn {
  background: #2a2a2a;
  border: 1px solid #444;
  color: white;
  /* same padding/radius */
}
```

### Outline Button (ghost)
```css
.outline-btn {
  background: transparent;
  border: 2px solid #555;
  color: #ccc;
}
.outline-btn.active {
  border-color: var(--primary);
  color: white;
  background: rgba(0, 210, 255, 0.1);
}
```

### Full Width Utility
```css
.btn { display: inline-block; text-align: center; text-decoration: none; width: 100%; }
```

---

## Game Card (Hub Grid)

```css
.game-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 30px;
  text-decoration: none;
  color: var(--text-color);
  text-align: center;
  border: 2px solid transparent;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(45deg, rgba(0,210,255,0.1), rgba(255,0,127,0.1));
  opacity: 0;
  transition: var(--transition);
}

.game-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255,255,255,0.1);
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
}

.game-card:hover::before { opacity: 1; }
```

**Hub grid**: `grid-template-columns: repeat(3, 1fr)` — 3 columns on desktop, responsive on mobile.

---

## Modal / Overlay Pattern

```css
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.game-over-box {
  background: var(--card-bg);
  border: 2px solid #333;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  color: white;
}
```

---

## Compact Game Header

```css
.compact-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: var(--card-bg);
  border-bottom: 1px solid #333;
}

.compact-header h1 {
  font-size: 1.2rem; /* smaller than hub */
  flex: 1;
  text-align: center;
}

.back-btn {
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  color: white;
  text-decoration: none;
}
```

---

## Key Animations

```css
/* Pop-in for pieces, cards, etc. */
@keyframes popIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Slide up for modals */
@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Pulse for highlights */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,210,255,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(0,210,255,0); }
}
```

---

## Mobile Responsive Breakpoint

At `max-width: 768px`, game cards become compact icon-first layout:
```css
@media (max-width: 768px) {
  .game-selection { gap: 15px; row-gap: 25px; }
  .game-card {
    background-color: transparent !important;
    padding: 0 !important;
    border: none !important;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .card-icon {
    width: 100%;
    aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem;
    margin-bottom: 8px;
    /* background set by ::after pseudo-element */
  }
  .game-card h2 { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .game-card p { display: none !important; } /* hide descriptions on mobile */
}
```

---

## Status/Turn Indicator Pattern

```css
.turn-indicator {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(0,210,255,0.15);
  border: 1px solid var(--primary);
  color: var(--primary);
}
```

---

## Instructions Box Pattern

```css
.instructions {
  text-align: left;
  background: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 0.95rem;
  line-height: 1.5;
}
.instructions p { color: #eee; margin: 0 0 10px; }
.instructions h3 { margin: 0; color: #ffd700; }
.instructions ul { padding-left: 20px; color: #ccc; }
```

---

## UX Heuristics Followed

1. **Always show game rules** — displayed in lounge and repeated in pause menu
2. **One-tap to play** — single Play Now button, no setup screens
3. **Pause is always accessible** — ⏸ button in compact header
4. **Back to Hub** — always available in lounge and pause
5. **Game over is immediate** — modal appears instantly with Play Again
6. **Language toggle** — available in lounge AND in pause menu
7. **No dead ends** — every state has a way back

---

## Category Tab System (Hub)

```javascript
// Tab filtering with data-category attribute
const tabBtns = document.querySelectorAll('.tab-btn');
const gameCards = document.querySelectorAll('.game-card');

function filterGames(category) {
  gameCards.forEach(card => {
    const cats = card.getAttribute('data-category').split(' ');
    card.style.display = cats.includes(category) ? '' : 'none';
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterGames(btn.getAttribute('data-tab'));
  });
});
filterGames('single-player'); // default tab
```
