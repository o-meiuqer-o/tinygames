import json
import urllib.request
import urllib.parse
import uuid
import websocket
import time
import os

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

def wait_for_comfyui():
    print("Waiting for ComfyUI to start on port 8188...")
    while True:
        try:
            urllib.request.urlopen(f"http://{SERVER}/system_stats", timeout=2)
            print("ComfyUI is ready!")
            break
        except Exception:
            time.sleep(2)

def generate_icon(game_name, subject):
    workflow = {
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"}
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": f"vector illustration of {subject}, flat design, 2d game asset, UI icon, solid white background, vibrant colors, thick outlines, cute, simple, clean shapes",
                "clip": ["4", 1]
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": "3d, realistic, photo, shading, complex background, text, watermark, messy, sketch, gradient, ugly, deformed, blurry, low quality, duplicate",
                "clip": ["4", 1]
            }
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
                "seed": 12345,
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
            "inputs": {"images": ["8", 0], "filename_prefix": f"{game_name}_icon"}
        }
    }
    
    print(f"Generating icon for {game_name}...")
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
        os.makedirs("d:/tinygames/public/icons", exist_ok=True)
        out_path = f"d:/tinygames/public/icons/{game_name}.png"
        with open(out_path, "wb") as f:
            f.write(output_images[0])
        
        # Resize to 192x192 if PIL is available
        try:
            from PIL import Image
            import io
            img = Image.open(io.BytesIO(output_images[0]))
            
            # Make white background transparent
            img = img.convert("RGBA")
            datas = img.getdata()
            newData = []
            for item in datas:
                # White or very close to white
                if item[0] > 240 and item[1] > 240 and item[2] > 240:
                    newData.append((255, 255, 255, 0))
                else:
                    newData.append(item)
            img.putdata(newData)
            
            # Save 192x192
            img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
            img_192.save(out_path)
            
            print(f"Successfully saved transparent 192x192 icon to {out_path}!")
        except Exception as e:
            print(f"PIL processing failed, saved original: {e}")

if __name__ == "__main__":
    wait_for_comfyui()
    
    games = {
        "aadu-puli-aattam": "a tiger and goats board game pieces",
        "dotsandboxes": "a grid of dots and colored boxes",
        "hermit-crab": "a cute hermit crab with a colorful shell",
        "kakka-parannal": "a cute flying crow",
        "mapping-express": "a colorful map with a path and a pin",
        "pallanguzhi": "a wooden mancala board with seeds",
        "signal-green": "a glowing green traffic light",
        "syn-ant": "a dictionary book with opposite symbols",
        "tetris": "colorful falling tetris blocks",
        "tictactoe": "a tic tac toe board with X and O"
    }
    
    for name, subject in games.items():
        generate_icon(name, subject)
