# TinyGames Project Skills Index

This folder contains learned patterns and reusable skills extracted from all successful development sessions for the TinyGames project. Each skill file is a self-contained reference that can be loaded in any future session.

## Skills Available

| File | Domain | Summary |
|------|--------|---------|
| [git-hf-workflow.md](git-hf-workflow.md) | Git + HuggingFace | Commit and push to GitHub & HF Spaces |
| [game-development.md](game-development.md) | Game Dev | HTML/JS game architecture, patterns, lifecycle |
| [ui-ux-design.md](ui-ux-design.md) | UI/UX | Design system, CSS tokens, mobile-first |
| [voice-generation.md](voice-generation.md) | Voice/TTS | edge-tts & F5-TTS for EN + Malayalam audio |
| [comfyui-image-gen.md](comfyui-image-gen.md) | Image Gen | Local ComfyUI API prompting for game assets |
| [pwa-offline.md](pwa-offline.md) | PWA | Service worker, manifest, offline-first |
| [socket-multiplayer.md](socket-multiplayer.md) | Multiplayer | Socket.io room/matchmaking architecture |
| [language-i18n.md](language-i18n.md) | i18n | English + Malayalam bilingual support |

## Project Context

- **Workspace**: `d:\tinygames`
- **GitHub**: `https://github.com/o-meiuqer-o/tinygames.git` (remote: `origin`)
- **HuggingFace**: `https://huggingface.co/spaces/o-meiuqer-o/tinygames` (remote: `hf`)
- **Stack**: Node.js 18 + Express 5 + Socket.io 4 + Vanilla HTML/CSS/JS (PWA)
- **ComfyUI path**: `D:\comfyui\ComfyUI_windows_portable_nvidia\ComfyUI_windows_portable`
- **ComfyUI models**: juggernautXL_v8, realisticStockPhoto_v20, sd_xl_refiner_1.0, v1-5-pruned-emaonly-fp16
- **Font**: Outfit (Google Fonts), weights 400/600/800
- **Color palette**: bg=#121212, card=#1e1e1e, primary=#00d2ff, secondary=#ff007f

## How to use these skills

At the start of any new session, instruct the agent:
> "Read d:\tinygames\skills\SKILL.md and load all relevant skill files before starting work."

The agent should read the index, then read each skill file whose domain is relevant to the current task.
