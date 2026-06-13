# Skill: Git + HuggingFace Deployment Workflow

## Overview
TinyGames has TWO remotes:
- `origin` → GitHub: `https://github.com/o-meiuqer-o/tinygames.git`
- `hf` → HuggingFace Spaces: `https://huggingface.co/spaces/o-meiuqer-o/tinygames`

HuggingFace Spaces runs the Docker container (see `Dockerfile`). Pushing to `hf` deploys the app live.

---

## Commit Convention (Semantic)

Always write commit messages in this format:
```
<type>: <short description>
```

### Types Used in This Project
| Type | When to use |
|------|-------------|
| `feat` | New game or feature added |
| `fix` | Bug fix |
| `style` | CSS/visual changes only |
| `chore` | Build scripts, bumping versions |
| `docs` | README, documentation |
| `refactor` | Code restructure, no behavior change |

### Examples from project history
```
feat: add lounge, translations, online/offline, and pause menu to aadu puli aattam
fix: game-wrapper uses position:fixed+100vh so game shows on Play Now click
style: standardize button classes and language selector typography in lounge across all games
chore: bump service worker cache version to v24 to invalidate cached assets
```

---

## Standard Commit + Push Workflow

```powershell
# Step 1: Stage all changes
git add -A

# Step 2: Commit with semantic message
git commit -m "feat: add new-game-name game"

# Step 3: Push to GitHub
git push origin main

# Step 4: Push to HuggingFace (deploys live)
git push hf main
```

> ⚠️ **IMPORTANT**: On Windows PowerShell, use `;` not `&&` to chain commands.
> Correct: `git add -A ; git commit -m "msg"`
> Wrong: `git add -A && git commit -m "msg"` (PowerShell parser error)

---

## Service Worker Cache Bumping (Required After JS/CSS Changes)

Every time JS or CSS files change, bump the cache version in `public/sw.js`:
```javascript
const CACHE_NAME = 'tinygames-v28'; // Increment the number
```

Also add any new JS/CSS assets to the `ASSETS` array in sw.js.

---

## Dockerfile for HuggingFace Spaces

HuggingFace Spaces requires port **7860**. The Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 7860
ENV PORT=7860
CMD ["npm", "start"]
```

The `server.js` uses `process.env.PORT || 3000` so it auto-adapts.

---

## .gitignore (keep node_modules out of HF)

```
node_modules/
```

> The `.dockerignore` also excludes `node_modules` so `npm ci` runs fresh in the container.

---

## Git LFS (Large Binary Assets)

Sheep/tiger images were pushed with Git LFS:
```powershell
git lfs install
git lfs track "*.png" "*.jpg" "*.mp3" "*.wav"
git add .gitattributes
git add public/images/
git commit -m "feat: add image assets via git lfs"
git push origin main
git push hf main
```

Check `.gitattributes` for tracked extensions.

---

## Checking Status Before Push

```powershell
git status
git diff --stat
git log --oneline -5
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| HF deploy not updating | Bump sw.js cache version number |
| `&&` syntax error in PowerShell | Use `;` instead |
| LFS pointer files instead of real files | Run `git lfs pull` |
| Node modules in push | Check `.gitignore` and `.dockerignore` |
