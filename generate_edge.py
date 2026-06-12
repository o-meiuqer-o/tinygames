import os
import asyncio
import edge_tts
import subprocess

items = [
    {"en": "Crow", "ml": "കാക്കാ"},
    {"en": "Eagle", "ml": "കഴുകനൂ"},
    {"en": "Airplane", "ml": "വിമാനമൂ"},
    {"en": "Helicopter", "ml": "ഹെലികോപ്റ്ററൂ"},
    {"en": "Mosquito", "ml": "കൊതുകൂ"},
    {"en": "Butterfly", "ml": "ചിത്രശലഭമൂ"},
    {"en": "Parrot", "ml": "തത്താ"},
    {"en": "Rocket", "ml": "റോക്കറ്റൂ"},
    {"en": "Owl", "ml": "മൂങ്ങാ"},
    {"en": "Bat", "ml": "വവ്വാലൂ"},
    {"en": "Dragon", "ml": "വ്യാളീ"},
    {"en": "Bee", "ml": "തേനീച്ചാ"},
    {"en": "Dove", "ml": "പ്രാവൂ"},
    {"en": "Kite", "ml": "പട്ടമൂ"},
    {"en": "Drone", "ml": "ഡ്രോണൂ"},
    {"en": "Beetle", "ml": "വണ്ടൂ"},
    {"en": "Duck", "ml": "താറാവൂ"},
    {"en": "Swan", "ml": "അരയന്നമൂ"},
    {"en": "Crane", "ml": "കൊക്കൂ"},
    {"en": "Balloon", "ml": "ബലൂണൂ"},
    {"en": "Firefly", "ml": "മിന്നാമിനുങ്ങൂ"},
    {"en": "Sparrow", "ml": "കുരുവീ"},
    {"en": "Peacock", "ml": "മയിലൂ"},
    {"en": "Superman", "ml": "സൂപ്പർമാനൂ"},
    {"en": "Cloud", "ml": "മേഘമൂ"},
    {"en": "Arrow", "ml": "അമ്പൂ"},
    {"en": "Fly", "ml": "ഈച്ചാ"},
    {"en": "Spaceship", "ml": "പേടകമൂ"},
    {"en": "Missile", "ml": "മിസൈലൂ"},
    {"en": "Fairy", "ml": "മാലാഖാ"},
    {"en": "Chair", "ml": "കസേരാ"},
    {"en": "Tree Stump", "ml": "മരക്കുറ്റീ"},
    {"en": "Dog", "ml": "നായാ"},
    {"en": "Cat", "ml": "പൂച്ചാ"},
    {"en": "House", "ml": "വീടൂ"},
    {"en": "Car", "ml": "കാറൂ"},
    {"en": "Elephant", "ml": "ആനാ"},
    {"en": "Tree", "ml": "മരമൂ"},
    {"en": "Computer", "ml": "കമ്പ്യൂട്ടറൂ"},
    {"en": "Apple", "ml": "ആപ്പിളൂ"},
    {"en": "Guitar", "ml": "ഗിറ്റാറൂ"},
    {"en": "Bicycle", "ml": "സൈക്കിളൂ"},
    {"en": "Penguin", "ml": "പെൻഗ്വിനൂ"},
    {"en": "Lion", "ml": "സിംഹമൂ"},
    {"en": "Tiger", "ml": "കടുവാ"},
    {"en": "Snake", "ml": "പാമ്പൂ"},
    {"en": "Monkey", "ml": "കുരങ്ങൂ"},
    {"en": "Train", "ml": "ട്രെയിനൂ"},
    {"en": "Bus", "ml": "ബസ്സൂ"},
    {"en": "Ship", "ml": "കപ്പലൂ"}
]

os.makedirs('public/sounds/en', exist_ok=True)
os.makedirs('public/sounds/ml', exist_ok=True)

def apply_chorus(input_path, output_path):
    cmd = [
        "ffmpeg", "-y", "-i", input_path, 
        "-filter_complex", 
        "chorus=0.7:0.9:55|47:0.4|0.3:0.25|0.3:2|1.3", 
        output_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return result.returncode == 0

async def generate_all():
    for item in items:
        en_word = item['en']
        ml_word = item['ml']
        
        en_gen = f"{en_word} flies."
        ml_gen = f"{ml_word}, പറ പറ."
        
        en_clean = en_word.replace("-uh", "").lower()
        ml_clean = item['en'].replace("-uh", "").lower() # use the english clean word for the file name
        
        en_out = f"public/sounds/en/{en_clean}.mp3"
        ml_out = f"public/sounds/ml/{ml_clean}.mp3"
        
        # We overwrite every time to apply the new energetic settings!
        print(f"Generating EN energetic: {en_word}", flush=True)
        # +35% speed makes it frantic, +20Hz pitch makes it sound higher/more excited, +50% volume for shout
        communicate_en = edge_tts.Communicate(en_gen, "en-IN-PrabhatNeural", rate="+35%", pitch="+20Hz", volume="+50%")
        await communicate_en.save(en_out)
            
        print(f"Generating ML energetic: {ml_word}", flush=True)
        communicate_ml = edge_tts.Communicate(ml_gen, "ml-IN-MidhunNeural", rate="+35%", pitch="+20Hz", volume="+50%")
        await communicate_ml.save(ml_out)

    print("Done generating sounds!", flush=True)

if __name__ == "__main__":
    asyncio.run(generate_all())
