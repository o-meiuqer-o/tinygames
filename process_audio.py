import os
import subprocess

def process_audio(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.mp3'):
                filepath = os.path.join(root, file)
                temp_filepath = os.path.join(root, "temp_" + file)
                
                # We want to:
                # 1. Remove silence from start and end.
                # 2. Pitch up to sound more excited (asetrate).
                # 3. Speed up so it doesn't lag the game (atempo).
                # 4. Increase volume/dynamics.
                
                # For asetrate: base sample rate is typically 24000 for edge-tts. 
                # Let's just use pitch/tempo via simpler means if possible, or robust rubberband if available.
                # Since we don't know sample rate for sure, let's just use 'atempo' for speed, and 'volume' for loudness.
                # Actually, raising pitch makes it sound more like an excited shout.
                # A safe way to pitch up without knowing sample rate is to use `asetrate=r=48000*1.15` (assuming we resample first)
                
                cmd = [
                    "ffmpeg", "-y", "-i", filepath,
                    "-af", 
                    "silenceremove=start_periods=1:start_duration=0:start_threshold=-50dB:stop_periods=1:stop_duration=0:stop_threshold=-50dB,"
                    "aresample=48000,asetrate=48000*1.15,atempo=1.3/1.15,"
                    "volume=3dB",
                    temp_filepath
                ]
                
                res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                if res.returncode == 0 and os.path.exists(temp_filepath):
                    os.replace(temp_filepath, filepath)
                    print(f"Processed: {file}")
                else:
                    print(f"Failed to process: {file}")
                    if os.path.exists(temp_filepath):
                        os.remove(temp_filepath)

process_audio('public/sounds/en')
process_audio('public/sounds/ml')
print("Done processing all audio!")
