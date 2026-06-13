import os
import json
import time
import subprocess
import shutil
from gradio_client import Client, handle_file

client = Client("mrfakename/E2-F5-TTS")

items = [
    {"en": "Crow", "ml": "കാക്ക"},
    {"en": "Eagle", "ml": "കഴുകൻ"},
    {"en": "Airplane", "ml": "വിമാനം"},
    {"en": "Helicopter", "ml": "ഹെലികോപ്റ്റർ"},
    {"en": "Mosquito", "ml": "കൊതുക്"},
    {"en": "Butterfly", "ml": "ചിത്രശലഭം"},
    {"en": "Parrot", "ml": "തത്ത"},
    {"en": "Rocket", "ml": "റോക്കറ്റ്"},
    {"en": "Owl", "ml": "മൂങ്ങ"},
    {"en": "Bat", "ml": "വവ്വാൽ"},
    {"en": "Dragon", "ml": "വ്യാളി"},
    {"en": "Bee", "ml": "തേനീച്ച"},
    {"en": "Table", "ml": "മേശ"},
    {"en": "Dog", "ml": "നായ"},
    {"en": "Cat", "ml": "പൂച്ച"},
    {"en": "House", "ml": "വീട്"},
    {"en": "Car", "ml": "കാർ"},
    {"en": "Elephant", "ml": "ആന"},
    {"en": "Tree", "ml": "മരം"},
    {"en": "Computer", "ml": "കമ്പ്യൂട്ടർ"},
    {"en": "Apple", "ml": "ആപ്പിൾ"},
    {"en": "Guitar", "ml": "ഗിറ്റാർ"},
    {"en": "Bicycle", "ml": "സൈക്കിൾ"},
    {"en": "Penguin", "ml": "പെൻഗ്വിൻ"}
]

os.makedirs('public/sounds/en', exist_ok=True)
os.makedirs('public/sounds/ml', exist_ok=True)

# ASR might be ignored if ref_text is close enough, or we use a dummy that F5-TTS will re-transcribe if empty (some forks do this).
# We'll just provide a dummy text, F5-TTS is somewhat robust or will just hallucinate a bit on the reference part.
# Actually E2-F5-TTS space requires ref_text. Let's provide an empty string or a placeholder.
REF_TEXT_EN = "" 
REF_TEXT_ML = "" 

def apply_chorus(input_path, output_path):
    cmd = [
        "ffmpeg", "-y", "-i", input_path, 
        "-filter_complex", 
        "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3", 
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for item in items:
    en_word = item['en']
    ml_word = item['ml']
    
    en_gen = f"{en_word} flies."
    ml_gen = f"{ml_word} പറ പറ."
    
    en_out = f"public/sounds/en/{en_word.lower()}.mp3"
    ml_out = f"public/sounds/ml/{en_word.lower()}.mp3"
    
    if not os.path.exists(en_out):
        try:
            res_en = client.predict(
                ref_audio=handle_file('examples/english.wav'),
                ref_text="Crow flies. Eagle flies. Mosquito flies.", # Guessing
                gen_text=en_gen,
                remove_silence=True,
                api_name="/predict"
            )
            apply_chorus(res_en, en_out)
            print(f"Generated EN: {en_word}")
        except Exception as e:
            print(f"Failed EN {en_word}: {e}")
            
    if not os.path.exists(ml_out):
        try:
            res_ml = client.predict(
                ref_audio=handle_file('examples/malayalam.wav'),
                ref_text="കാക്ക പറ പറ. കഴുകൻ പറ പറ.", # Guessing
                gen_text=ml_gen,
                remove_silence=True,
                api_name="/predict"
            )
            apply_chorus(res_ml, ml_out)
            print(f"Generated ML: {ml_word}")
        except Exception as e:
            print(f"Failed ML {ml_word}: {e}")
    time.sleep(1)

print("Done generating sounds!")
