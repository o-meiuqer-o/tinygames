# Skill: Generating Game Assets with ComfyUI

This skill focuses on prompt engineering and workflow construction for creating cohesive game assets (icons, characters, backgrounds) using ComfyUI. 

## The Core Philosophy

When the user asks for a specific style, your goal is to translate that request into a robust, high-quality ComfyUI prompt that produces consistent assets. Do not just use a Python script—understand the prompt components.

## Anatomy of a Great Game Asset Prompt

A good prompt for game assets should always include:
1.  **Subject**: What exactly is the asset? (e.g., "a golden treasure chest", "a cartoon knight")
2.  **Style & Medium**: How should it look? (e.g., "pixel art", "flat vector illustration", "3d claymation", "watercolor")
3.  **Context/Purpose**: What is it used for? (e.g., "game icon", "UI element", "sprite sheet", "RPG asset")
4.  **Lighting/Color**: What is the mood? (e.g., "vibrant colors", "neon lighting", "pastel palette")
5.  **Background isolation**: (Crucial for assets!) "white background", "solid background", "isolated object"

## Translating User Requests into Prompt Formulas

Here are proven prompt formulas based on common user requests for game assets:

### 1. "Flat Vector / Cartoon Icons" (Best for TinyGames UI)
When the user wants simple, cute, flat-colored icons:
> **Positive Prompt**: `vector illustration of [SUBJECT], flat design, 2d game asset, UI icon, solid white background, vibrant colors, thick outlines, cute, simple, clean shapes`
> **Negative Prompt**: `3d, realistic, photo, shading, complex background, text, watermark, messy, sketch, gradient`
> **Model Recommendation**: `v1-5-pruned-emaonly-fp16` or SDXL

### 2. "Pixel Art"
When the user requests retro or 8-bit style:
> **Positive Prompt**: `pixel art [SUBJECT], 32x32 style, 16-bit retro game sprite, isolated on white background, sharp pixels, vibrant palette, indie game asset`
> **Negative Prompt**: `realistic, high resolution, 3d, vector, smooth, blurry, noisy, painting, text`
> **Model Recommendation**: SD 1.5 with pixel art LoRAs, or SDXL.

### 3. "3D / Isometric Assets"
When the user wants modern mobile game assets (like Clash of Clans):
> **Positive Prompt**: `isometric 3d render of [SUBJECT], mobile game asset, smooth clay material, bright studio lighting, soft shadows, vibrant colors, isolated on white background, octane render, trending on artstation`
> **Negative Prompt**: `2d, flat, cartoon, sketch, messy background, low poly, noisy, text`
> **Model Recommendation**: `juggernautXL_v8Rundiffusion`

### 4. "Realistic / Painted Assets"
For card games or mature RPGs:
> **Positive Prompt**: `digital painting of [SUBJECT], fantasy RPG asset, highly detailed, dramatic lighting, rich colors, concept art, masterpiece, isolated on solid background`
> **Negative Prompt**: `cartoon, anime, 3d render, low resolution, sketch, messy, text, watermark`
> **Model Recommendation**: `juggernautXL_v8Rundiffusion`

## The Universal Negative Prompt

For almost all game assets, you want clean, isolated images. Always include variants of:
> `ugly, deformed, blurry, watermark, text, signature, low quality, extra limbs, duplicate, bad anatomy, complex background, messy, cropped`

## Workflow Adjustments for Consistency

To ensure multiple characters or icons look like they belong in the same game:
1.  **Lock the Seed (Optional)**: Using the same seed across different prompts can sometimes maintain stylistic consistency.
2.  **Keep the Prompt Skeleton Identical**: Only change the `[SUBJECT]` and keep the style, lighting, and medium keywords exactly the same for every asset generated for that specific game.
3.  **CFG Scale**: Use a higher CFG scale (7.5 - 9.0) to force the model to adhere strictly to your style tags.

## Image Post-Processing (Mental Checklist)

Once ComfyUI generates the image, remember that game assets usually need:
1.  **Background Removal**: ComfyUI outputs flat images. You will need to process the white background out using PIL or CSS `mix-blend-mode` / masking in the game.
2.  **Resizing**: Scale the generated 1024x1024 image down to appropriate sizes (e.g., 64x64, 128x128) for performance.
3.  **Optimization**: Save as optimized PNGs or WebPs.

## Fetching and Using LoRAs for Specific Styles

When the user requests a highly specific style (like "Ghibli style", "specific pixel art", or "claymation") that the base model cannot achieve purely through prompting, you should download and use a LoRA (Low-Rank Adaptation) model.

### 1. Downloading LoRAs
You can download LoRAs directly from Civitai or HuggingFace using PowerShell. The correct directory for LoRAs in this setup is:
`D:\comfyui\ComfyUI_windows_portable_nvidia\ComfyUI_windows_portable\ComfyUI\models\loras`

**Example Command (Downloading via URL):**
```powershell
Invoke-WebRequest -Uri "https://civitai.com/api/download/models/XXXXX" -OutFile "D:\comfyui\ComfyUI_windows_portable_nvidia\ComfyUI_windows_portable\ComfyUI\models\loras\MyStyleLoRA.safetensors"
```
*(Ensure you have the correct direct download URL)*

### 2. Using LoRAs in ComfyUI Workflow
To use the downloaded LoRA in your ComfyUI workflow JSON, you must insert a `LoraLoader` node between the `CheckpointLoaderSimple` and the `CLIPTextEncode` / `KSampler` nodes.

**Workflow Node Addition:**
```json
"10": {
    "class_type": "LoraLoader",
    "inputs": {
        "lora_name": "MyStyleLoRA.safetensors",
        "strength_model": 0.8,
        "strength_clip": 0.8,
        "model": ["4", 0],  // From CheckpointLoaderSimple
        "clip": ["4", 1]    // From CheckpointLoaderSimple
    }
}
```
*Note: Update your `KSampler` and `CLIPTextEncode` nodes to take `model` and `clip` inputs from the `LoraLoader` (Node "10") instead of the `CheckpointLoaderSimple` (Node "4").*

### 3. Prompting with LoRAs
Many LoRAs require specific **trigger words** in the positive prompt to activate the style. Always check the model documentation for the trigger word (e.g., `ghibli_style`, `pxlart`) and include it at the very beginning of your positive prompt.

---

## Programmatic Generation (Python API)

If you ever need to automate generation or integrate ComfyUI directly into a script (e.g., generating 100 game sprites overnight), use the Python WebSocket API.

The base workflow JSON format required for basic SD1.5/SDXL generation is:

```python
import json
import urllib.request
import websocket
import uuid

SERVER = "127.0.0.1:8188"
CLIENT_ID = str(uuid.uuid4())

# Send to ComfyUI Queue
def queue_prompt(prompt_workflow):
    p = {"prompt": prompt_workflow, "client_id": CLIENT_ID}
    req = urllib.request.Request(f"http://{SERVER}/prompt", data=json.dumps(p).encode('utf-8'))
    return json.loads(urllib.request.urlopen(req).read())

# Workflow format (Nodes are mapped by string ID keys):
workflow = {
    "4": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"}},
    "6": {"class_type": "CLIPTextEncode", "inputs": {"text": "positive prompt here", "clip": ["4", 1]}},
    "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "ugly, text, blurry", "clip": ["4", 1]}},
    "5": {"class_type": "EmptyLatentImage", "inputs": {"width": 512, "height": 512, "batch_size": 1}},
    "3": {
        "class_type": "KSampler",
        "inputs": {"seed": 12345, "steps": 25, "cfg": 8.0, "sampler_name": "euler_ancestral", "scheduler": "karras", "denoise": 1.0, "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], "latent_image": ["5", 0]}
    },
    "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
    "9": {"class_type": "SaveImage", "inputs": {"images": ["8", 0], "filename_prefix": "tinygames_asset"}}
}

# Example execution wait loop:
queue_prompt(workflow)
# Monitor via WS: ws://127.0.0.1:8188/ws?clientId=...
```
*(A complete working example script is saved in `d:\tinygames\generate_mario.py` for reference).*
