# Skill: Local Audio & Voice Generation with WebUI

This skill focuses on using the local `TTS-Generation-WebUI` for generating voice acting, sound effects, and background music for TinyGames without a budget.

## Tool Installation Location

- **Current Location**: `D:\audio-webui`
- **Setup Script**: Run `install.bat` inside that folder.
- **Run Server**: Run `start.bat` (or `update_and_start.bat`) inside that folder.
- **Web Interface**: Usually accessible at `http://127.0.0.1:7860`

## 1. Voice Cloning for Characters (Zero-Shot)

Because you cannot hire voice actors, you can use **Voice Cloning** to generate dialogue from a tiny sample.

### Recommended Models: F5-TTS or XTTSv2
Both models are supported in the WebUI and excel at "zero-shot" cloning (meaning you only need a 5-second clip to clone a voice).

### Workflow:
1. **Record a Reference Voice**: Record yourself saying a clear sentence for about 5-10 seconds. Save it as `reference_voice.wav`.
    *   *Tip: Act out the emotion/tone you want the character to have in the reference clip. If you want a grumpy dwarf, do a grumpy dwarf voice for 5 seconds.*
2. **Open the WebUI** and navigate to the **F5-TTS** or **XTTS** tab.
3. **Upload the Reference**: Upload your `reference_voice.wav` in the "Reference Audio" box.
4. **Enter Transcription**: Type the exact text of what was said in the reference audio in the "Reference Text" box (required for F5-TTS).
5. **Enter Generation Text**: Type your character's dialogue (e.g., "Welcome to my shop, adventurer!")
6. **Generate**: The AI will generate the dialogue perfectly mimicking the pitch, accent, and timbre of the reference clip!

## 2. Generating Sound Effects (SFX)

Instead of searching for free sound effect packs, use **AudioGen** (by Meta) to generate exactly what you need.

### Workflow:
1. Go to the **AudioGen** tab.
2. Enter a descriptive prompt. Use terms like:
    *   `"8-bit retro arcade jump sound, short"`
    *   `"heavy wooden door creaking open"`
    *   `"sword clashing against metal shield, sharp"`
    *   `"magic spell casting whoosh, fantasy"`
3. Keep the duration short (e.g., 2 to 3 seconds for UI/SFX).
4. Generate and download the `.wav`.
5. Post-process (crop silence) and convert to `.mp3` using `ffmpeg` or Audacity to keep the file size small for your web games.

## 3. Generating Background Music

Use **MusicGen** (by Meta) for creating infinite, royalty-free background loops for your games.

### Workflow:
1. Go to the **MusicGen** tab.
2. Enter a highly descriptive musical prompt:
    *   `"calm acoustic guitar and flute village theme, fantasy RPG, looping"`
    *   `"fast paced 8-bit chiptune boss battle music, intense synthesizer"`
    *   `"ambient spooky cave drone, low bass, suspenseful"`
3. **Duration**: Set to 15-30 seconds.
4. **Looping**: Check the option to generate seamless loops if your game requires background music that plays infinitely without a harsh cut.

## API Automation (Python)

Like ComfyUI, Gradio apps have an API. If you want to automate generation in Python later:
```python
from gradio_client import Client, handle_file

client = Client("http://127.0.0.1:7860/")

# Example: Generating SFX via AudioGen API
result = client.predict(
		text="retro 8-bit coin pickup sound",
		duration=2,
		api_name="/audiogen_predict"
)
print("Saved to:", result)
```

## Best Practices for Solo Indie Devs
*   **Keep your reference voices organized**: Have a folder called `assets/voice_references` with files like `grumpy_old_man.wav` and `excited_fairy.wav`. You can reuse these forever across all your games.
*   **Consistency**: When generating lines for a single character, always use the exact same reference audio file.
