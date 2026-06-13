from gradio_client import Client
import time
import shutil
import sys

def main():
    try:
        client = Client("http://127.0.0.1:7860/")
        print("Connected to Gradio client.")
        
        # We will try to guess the API name. Often it's /musicgen_predict or similar
        endpoints = client.endpoints
        print("Available endpoints:")
        for ep in endpoints:
            print(ep)
        
        # Let's see if we can find a music endpoint
        api_name = None
        for ep in ["/musicgen_predict", "/predict_1", "/predict_2"]:
            # just print it out, or we can use view_api() output
            pass
            
    except Exception as e:
        print("Failed to connect:", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
