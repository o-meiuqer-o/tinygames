from gradio_client import Client
import shutil

def generate_online():
    print("Connecting to public HuggingFace Space for MusicGen...")
    try:
        # Connecting to a known public space for MusicGen
        client = Client("facebook/MusicGen")
        print("Connected! Generating cosmic music...")
        
        # Need a dummy file or None
        from gradio_client import handle_file
        dummy_melody = handle_file("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav")
        
        result = client.predict(
            texts="ambient cosmic space music, ethereal synth pads, slow tempo, sci-fi soundtrack, deep bass, 80s synthesizer, relaxing, infinite loop",
            melodies=dummy_melody,
            api_name="/predict_batched"
        )
        
        print("Generated! Saved to:", result)
        # result is usually a tuple where the second element is the file path, or just a string path
        file_path = result[1] if isinstance(result, tuple) else result
        shutil.copy(file_path, "d:/tinygames/public/sounds/cosmic_music.wav")
        print("Copied to d:/tinygames/public/sounds/cosmic_music.wav")
        
    except Exception as e:
        print(f"Failed to generate online: {e}")

if __name__ == "__main__":
    generate_online()
