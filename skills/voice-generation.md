# Skill: Voice Generation (TTS) for TinyGames

## Overview

TinyGames uses two methods for generating voice audio:

1. **edge-tts** (Microsoft Edge TTS) — Fast, free, offline-capable, used for production
2. **F5-TTS / E2-TTS** (via Gradio HuggingFace) — Slower, better quality, used for initial generation

Audio files are stored as:
- `public/sounds/en/<word>.mp3` — English voice
- `public/sounds/ml/<word>.mp3` — Malayalam voice

---

## Method 1: edge-tts (RECOMMENDED — Production Method)

### Installation
```powershell
pip install edge-tts
```

### Key Voice IDs
| Language | Voice ID | Quality |
|----------|----------|---------|
| English (Indian) | `en-IN-PrabhatNeural` | Natural Indian accent |
| Malayalam | `ml-IN-MidhunNeural` | Native Malayalam voice |
| English (US) | `en-US-GuyNeural` | Standard US English |

### Generation Script Pattern

```python
import asyncio
import edge_tts
import subprocess
import os

# Vocabulary items: each has English and Malayalam versions
items = [
    {"en": "Crow",   "ml": "കാക്കാ"},
    {"en": "Eagle",  "ml": "കഴുകനൂ"},
    # ... more items
]

os.makedirs('public/sounds/en', exist_ok=True)
os.makedirs('public/sounds/ml', exist_ok=True)

def apply_chorus(input_path, output_path):
    """Apply audio effect to make voice sound more game-like"""
    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-filter_complex",
        "chorus=0.7:0.9:55|47:0.4|0.3:0.25|0.3:2|1.3",
        output_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return result.returncode == 0

async def generate_all():
    for item in items:
        en_word = item['en']
        ml_word = item['ml']

        # Customize the sentence for the game context
        en_sentence = f"{en_word} flies."
        ml_sentence = f"{ml_word}, പറ പറ."
        
        # File names use lowercase English words
        en_out = f"public/sounds/en/{en_word.lower().replace(' ', '-')}.mp3"
        ml_out = f"public/sounds/ml/{en_word.lower().replace(' ', '-')}.mp3"

        # Generate English — +35% speed, +20Hz pitch, +50% volume for excited/energetic feel
        print(f"Generating EN: {en_word}")
        communicate_en = edge_tts.Communicate(
            en_sentence, "en-IN-PrabhatNeural",
            rate="+35%", pitch="+20Hz", volume="+50%"
        )
        await communicate_en.save(en_out)

        # Generate Malayalam
        print(f"Generating ML: {ml_word}")
        communicate_ml = edge_tts.Communicate(
            ml_sentence, "ml-IN-MidhunNeural",
            rate="+35%", pitch="+20Hz", volume="+50%"
        )
        await communicate_ml.save(ml_out)

if __name__ == "__main__":
    asyncio.run(generate_all())
```

### Speed/Pitch/Volume Parameters

| Setting | Value | Effect |
|---------|-------|--------|
| `rate` | `"+35%"` | 35% faster — frantic/energetic game feel |
| `pitch` | `"+20Hz"` | Higher pitch — excited sound |
| `volume` | `"+50%"` | Louder — cuts through game sound effects |
| (default) | `"+0%"` each | Natural, calm narration |

---

## Method 2: F5-TTS via Gradio (High Quality)

### Installation
```powershell
pip install gradio_client
```

### Script Pattern

```python
from gradio_client import Client, handle_file
import time

client = Client("mrfakename/E2-F5-TTS")

for item in items:
    en_word = item['en']
    ml_word = item['ml']
    
    # English generation
    res_en = client.predict(
        ref_audio=handle_file('examples/english.wav'),  # reference voice sample
        ref_text="Crow flies. Eagle flies.",             # reference transcription
        gen_text=f"{en_word} flies.",                   # text to synthesize
        remove_silence=True,
        api_name="/predict"
    )
    apply_chorus(res_en, f"public/sounds/en/{en_word.lower()}.mp3")
    
    # Malayalam generation  
    res_ml = client.predict(
        ref_audio=handle_file('examples/malayalam.wav'),
        ref_text="കാക്ക പറ പറ. കഴുകൻ പറ പറ.",
        gen_text=f"{ml_word} പറ പറ.",
        remove_silence=True,
        api_name="/predict"
    )
    apply_chorus(res_ml, f"public/sounds/ml/{en_word.lower()}.mp3")
    time.sleep(1)  # Rate limiting
```

> **Note**: Reference audio samples (`examples/english.wav`, `examples/malayalam.wav`) should be short, clear recordings (5-10 seconds) of the target voice style.

---

## Audio Playback in the Browser

### Simple one-shot playback
```javascript
function playVoice(word, lang = 'en') {
  const audio = new Audio(`/sounds/${lang}/${word.toLowerCase().replace(/ /g, '-')}.mp3`);
  audio.play().catch(() => {}); // Ignore autoplay policy errors
}
```

### With preloading (for fast games)
```javascript
const voiceCache = {};

function preloadVoice(word, lang) {
  const key = `${lang}/${word}`;
  if (!voiceCache[key]) {
    voiceCache[key] = new Audio(`/sounds/${lang}/${word.toLowerCase()}.mp3`);
    voiceCache[key].load();
  }
}

function playVoiceCached(word, lang = 'en') {
  const key = `${lang}/${word}`;
  if (voiceCache[key]) {
    voiceCache[key].currentTime = 0;
    voiceCache[key].play().catch(() => {});
  }
}
```

---

## Malayalam Pronunciation Tricks

For Malayalam with edge-tts, add a long vowel suffix to make pronunciation clearer:

| Suffix pattern | Example | Effect |
|----------------|---------|--------|
| `ൂ` suffix | `"വിമാനമൂ"` instead of `"വിമാനം"` | Stretches ending, sounds more natural |
| `ാ` suffix | `"കാക്കാ"` instead of `"കാക്ക"` | Adds emphasis |
| `, പറ പറ.` | `"കാക്കാ, പറ പറ."` | Context phrase (it flies) |

---

## FFmpeg Audio Processing

FFmpeg must be installed and on PATH. Common filters used:

```powershell
# Install ffmpeg (if not installed)
winget install ffmpeg

# Verify
ffmpeg -version
```

### Chorus Effect (game-like, echoey feel)
```
chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3
```

### More energetic chorus
```
chorus=0.7:0.9:55|47:0.4|0.3:0.25|0.3:2|1.3
```

---

## File Naming Convention

```
public/sounds/en/crow.mp3        ← single word, lowercase
public/sounds/en/tree-stump.mp3  ← multi-word: hyphen-separated
public/sounds/ml/crow.mp3        ← same English filename, different folder
```

> Both EN and ML files use the **English word** as the filename (just in different folders).

---

## Available Edge TTS Voices (tested)

```powershell
# List all available voices
python -c "import asyncio; import edge_tts; asyncio.run(edge_tts.list_voices())" | Select-String "ml-IN|en-IN"
```

Key voices:
- `en-IN-PrabhatNeural` — Male, Indian English ✅ Used
- `en-IN-NeerjaNeural` — Female, Indian English
- `ml-IN-MidhunNeural` — Male, Malayalam ✅ Used
- `ml-IN-SobhanaNeural` — Female, Malayalam
