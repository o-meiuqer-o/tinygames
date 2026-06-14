from gradio_client import Client
import time
import shutil
import os

def wait_for_server():
    print("Waiting for Gradio server...")
    while True:
        try:
            import urllib.request
            response = urllib.request.urlopen("http://127.0.0.1:7860/")
            if response.getcode() == 200:
                print("Server is up!")
                break
        except Exception:
            pass
        time.sleep(5)

def main():
    wait_for_server()
    try:
        client = Client("http://127.0.0.1:7860/")
        print("Connected to client.")
        
        # Create output directory
        out_dir = "d:/tinygames/public/audio"
        if not os.path.exists(out_dir):
            os.makedirs(out_dir)

        # Print all endpoints for debugging
        endpoints = []
        for ep in client.endpoints:
            endpoints.append(ep.api_name)
        print("Endpoints:", endpoints)
        
        # AudioWebUI usually uses /musicgen_predict for MusicGen
        api_name = "/musicgen_predict"
        if api_name not in endpoints:
            # Maybe just /predict or something else
            api_name = "/predict" if "/predict" in endpoints else endpoints[0]
            
        print("Generating music using endpoint:", api_name)
        result = client.predict(
            text="cosmic space synthesizer loop, upbeat and magical for kids, starry night",
            duration=20,
            api_name=api_name
        )
        print("Result:", result)
        
        if isinstance(result, str) and os.path.exists(result):
            shutil.copy(result, os.path.join(out_dir, "constellation-bg.wav"))
            print("Music saved successfully.")
        elif isinstance(result, tuple) or isinstance(result, list):
            for item in result:
                if isinstance(item, str) and os.path.exists(item):
                    shutil.copy(item, os.path.join(out_dir, "constellation-bg.wav"))
                    print("Music saved successfully from tuple.")
                    break
        else:
            print("Could not find generated file path in result.")
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
