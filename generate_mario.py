import json
import urllib.request
import urllib.parse
import uuid
import websocket
import time

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

def generate_image():
    # Wait for ComfyUI to be responsive
    print("Waiting for ComfyUI to start on port 8188...")
    while True:
        try:
            urllib.request.urlopen(f"http://{SERVER}/system_stats", timeout=2)
            print("ComfyUI is ready!")
            break
        except Exception:
            time.sleep(2)

    # SDXL Workflow for Mario
    workflow = {
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"} # Using 1.5 since it's fast
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": "isometric 3d render of Super Mario climbing a tall tropical coconut tree, classic Nintendo Super Mario game style, vibrant colors, blue sky background, highly detailed, smooth materials, bright studio lighting, masterpiece, game asset, isolated on solid background",
                "clip": ["4", 1]
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": "ugly, deformed, blurry, watermark, text, signature, low quality, extra limbs, duplicate, bad anatomy, realistic, photography",
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
            "inputs": {"images": ["8", 0], "filename_prefix": "mario_comfy_test"}
        }
    }
    
    print("Sending prompt to ComfyUI...")
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
    
    print("Generation complete! Downloading image...")
    history = get_history(prompt_id)
    output_images = []
    for node_id, node_output in history[prompt_id]['outputs'].items():
        if 'images' in node_output:
            for img in node_output['images']:
                img_data = get_image(img['filename'], img['subfolder'], img['type'])
                output_images.append(img_data)
    
    if output_images:
        with open("public/images/mario_comfy_test.png", "wb") as f:
            f.write(output_images[0])
        print("Successfully saved to d:/tinygames/public/images/mario_comfy_test.png!")

if __name__ == "__main__":
    generate_image()
