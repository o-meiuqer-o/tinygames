import numpy as np
import scipy.io.wavfile as wav
import os

sample_rate = 44100
out_dir = 'd:/tinygames/public/assets/audio'
os.makedirs(out_dir, exist_ok=True)

def square(freq, time_arr): return np.sign(np.sin(freq * 2 * np.pi * time_arr))
def sine(freq, time_arr): return np.sin(freq * 2 * np.pi * time_arr)
def saw(freq, time_arr): return 2.0 * (time_arr * freq - np.floor(0.5 + time_arr * freq))
def save(name, audio):
    audio = np.int16(audio / np.max(np.abs(audio)) * 32767)
    wav.write(f'{out_dir}/{name}.wav', sample_rate, audio)

# 1. Hover (quick tiny blip)
t_h = np.linspace(0, 0.05, int(sample_rate * 0.05), False)
env_h = np.exp(-30 * t_h)
audio_hover = sine(880, t_h) * env_h * 0.5
save('sfx_hover', audio_hover)

# 2. Connect (satisfying ding / rising arpeggio)
t_c = np.linspace(0, 0.3, int(sample_rate * 0.3), False)
audio_connect = np.zeros_like(t_c)
notes = [523.25, 659.25, 1046.50] # C5, E5, C6
for i, f in enumerate(notes):
    start = i * 0.08
    end = start + 0.15
    idx_start = int(start * sample_rate)
    idx_end = int(end * sample_rate)
    t_slice = t_c[idx_start:idx_end]
    env = np.exp(-15 * (t_slice - start))
    audio_connect[idx_start:idx_end] += square(f, t_slice) * env * 0.4
save('sfx_connect', audio_connect)

# 3. Error (low buzz)
t_e = np.linspace(0, 0.4, int(sample_rate * 0.4), False)
# Pitch drop
freq_e = np.linspace(150, 80, len(t_e))
audio_error = saw(freq_e, t_e) * np.exp(-5 * t_e) * 0.6
save('sfx_error', audio_error)

# 4. Complete (sparkling sweep)
t_comp = np.linspace(0, 1.5, int(sample_rate * 1.5), False)
audio_comp = np.zeros_like(t_comp)
c_notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]
for i, f in enumerate(c_notes):
    start = i * 0.1
    end = start + 0.8
    idx_start = int(start * sample_rate)
    idx_end = int(end * sample_rate)
    if idx_end > len(t_comp): idx_end = len(t_comp)
    t_slice = t_comp[idx_start:idx_end]
    env = np.exp(-5 * (t_slice - start))
    audio_comp[idx_start:idx_end] += sine(f, t_slice) * env * 0.3
save('sfx_complete', audio_comp)
