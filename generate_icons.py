import json
import urllib.request
import urllib.parse
import uuid
import websocket
import time
import os
from PIL import Image
import io

SERVER = "127.0.0.1:8188"
CLIENT_ID = str(uuid.uuid4())

def queue_prompt(prompt_workflow):
    p = {"prompt": prompt_workflow, "client_id": CLIENT_ID}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"http://{SERVER}/prompt", data=data)
    return json.loads(urllib.request.urlopen(req).read())

def get_image(filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen(f"http://{SERVER}/view?{url_values}") as response:
        return response.read()

def get_history(prompt_id):
    with urllib.request.urlopen(f"http://{SERVER}/history/{prompt_id}") as response:
        return json.loads(response.read())

def remove_white_bg_and_resize(img_data, size=(128, 128)):
    img = Image.open(io.BytesIO(img_data)).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img = img.resize(size, Image.Resampling.LANCZOS)
    
    out = io.BytesIO()
    img.save(out, format="PNG")
    return out.getvalue()

def generate(positive, negative, output_path, seed):
    workflow = {
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"}
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": positive, "clip": ["4", 1]}
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": negative, "clip": ["4", 1]}
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": 512, "height": 512, "batch_size": 1}
        },
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0],
                "seed": seed,
                "steps": 25,
                "cfg": 8.0,
                "sampler_name": "euler_ancestral",
                "scheduler": "karras",
                "denoise": 1.0
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["3", 0], "vae": ["4", 2]}
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {"images": ["8", 0], "filename_prefix": "icon_gen"}
        }
    }
    
    print(f"Generating {output_path}...")
    result = queue_prompt(workflow)
    prompt_id = result['prompt_id']
    
    ws = websocket.WebSocket()
    ws.connect(f"ws://{SERVER}/ws?clientId={CLIENT_ID}")
    
    while True:
        out = ws.recv()
        if isinstance(out, str):
            msg = json.loads(out)
            if msg.get('type') == 'executing' and msg['data'].get('node') is None:
                break
    ws.close()
    
    history = get_history(prompt_id)
    output_images = []
    for node_id, node_output in history[prompt_id]['outputs'].items():
        if 'images' in node_output:
            for img in node_output['images']:
                img_data = get_image(img['filename'], img['subfolder'], img['type'])
                output_images.append(img_data)
    
    if output_images:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        processed = remove_white_bg_and_resize(output_images[0], (128, 128))
        with open(output_path, "wb") as f:
            f.write(processed)
        print(f"Successfully saved to {output_path}!")

def main():
    print("Waiting for ComfyUI...")
    while True:
        try:
            urllib.request.urlopen(f"http://{SERVER}/system_stats", timeout=2)
            break
        except Exception:
            time.sleep(2)
            
    # Constellation Connect
    pos1 = "vector illustration of a glowing star constellation forming a cute shape, flat design, 2d game asset, UI icon, solid white background, vibrant colors, thick outlines, cute, simple, clean shapes"
    neg1 = "3d, realistic, photo, shading, complex background, text, watermark, messy, sketch, gradient, ugly, deformed, blurry, extra limbs, duplicate, bad anatomy"
    generate(pos1, neg1, "d:/tinygames/public/icons/constellation-connect.png", 101)
    
    # Kitchen Chaos
    pos2 = "vector illustration of a chef's frying pan with chaotic food flying out, flat design, 2d game asset, UI icon, solid white background, vibrant colors, thick outlines, cute, simple, clean shapes"
    neg2 = "3d, realistic, photo, shading, complex background, text, watermark, messy, sketch, gradient, ugly, deformed, blurry, extra limbs, duplicate, bad anatomy"
    generate(pos2, neg2, "d:/tinygames/public/icons/kitchen-chaos.png", 102)

if __name__ == "__main__":
    main()
