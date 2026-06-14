from gradio_client import Client
import time
import sys
import shutil

SERVER_URL = "http://127.0.0.1:7770/"

def generate_cosmic_music():
    print(f"Connecting to {SERVER_URL}...")
    try:
        client = Client(SERVER_URL)
    except Exception as e:
        print(f"Failed to connect. Is the Audio WebUI running on port 7860? Error: {e}")
        sys.exit(1)
        
    print("Connected! Generating cosmic music...")
    
    # In TTS-Generation-WebUI, the MusicGen endpoint is typically handled by gradio.
    # If the exact endpoint is unknown, we can try the standard ones.
    # Let's just print the available APIs to be safe.
    # with open("api_spec.txt", "w") as f:
    #     f.write(client.view_api(return_format="str"))
        
    try:
        # Assuming a common Gradio endpoint for MusicGen in this WebUI
        # This might need adjustment depending on the exact WebUI version
        result = client.predict(
            "ambient cosmic space music, ethereal synth pads, slow tempo, sci-fi soundtrack, deep bass, 80s synthesizer, relaxing", # str  in 'Input Text' Textbox component
            "https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav", # filepath  in 'Melody (optional)' Audio component (passing empty or dummy if not needed)
            15, # int | float (numeric value between 1 and 30) in 'Duration' Slider component
            250, # int | float  in 'Top-k' Number component
            0, # int | float  in 'Top-p' Number component
            1, # int | float  in 'Temperature' Number component
            3, # int | float  in 'Classifier Free Guidance' Number component
            api_name="/generate_musicgen" 
        )
        print("Generated successfully! File saved to:", result)
        shutil.copy(result[1] if isinstance(result, tuple) else result, "d:/tinygames/public/sounds/cosmic_music.wav")
        print("Copied to d:/tinygames/public/sounds/cosmic_music.wav")
    except Exception as e:
        print(f"Generation failed via /generate_musicgen. The API might have a different name. Error: {e}")
        print("Writing API spec to api_spec.txt for debugging...")
        with open("api_spec.txt", "w") as f:
            f.write(client.view_api(return_format="str"))
            
if __name__ == "__main__":
    generate_cosmic_music()
