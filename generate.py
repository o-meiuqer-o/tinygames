import numpy as np
import scipy.io.wavfile as wav

def generate_chiptune():
    sample_rate = 44100
    duration = 16.0
    t = np.linspace(0, duration, int(sample_rate * duration), False)

    def square(freq, time_arr):
        return np.sign(np.sin(freq * 2 * np.pi * time_arr))
    
    def sine(freq, time_arr):
        return np.sin(freq * 2 * np.pi * time_arr)

    # Cosmic arpeggio melody (C major pentatonic / sci-fi feel)
    notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25, 392.00]
    melody = np.zeros_like(t)
    note_duration = 0.25
    
    # Arpeggios looping
    for i in range(len(t)):
        idx = int((t[i] % 2.0) / note_duration)
        freq = notes[idx]
        # envelope
        env = np.exp(-4.0 * (t[i] % note_duration))
        melody[i] = square(freq, t[i]) * env * 0.3
        
    # Space drone / bass
    bass_notes = [130.81, 130.81, 104.65, 104.65] # C3, G2
    bass = np.zeros_like(t)
    bass_duration = 4.0
    for i in range(len(t)):
        idx = int((t[i] % 16.0) / bass_duration)
        freq = bass_notes[idx]
        bass[i] = sine(freq, t[i]) * 0.4
        
    # High twinkles (randomized space dust)
    twinkles = np.zeros_like(t)
    for _ in range(30):
        start = np.random.uniform(0, duration)
        end = min(start + 0.1, duration)
        idx_start = int(start * sample_rate)
        idx_end = int(end * sample_rate)
        freq = np.random.uniform(2000, 4000)
        twinkles[idx_start:idx_end] = sine(freq, t[idx_start:idx_end]) * 0.1 * np.exp(-10.0 * (t[idx_start:idx_end] - start))

    audio = melody + bass + twinkles
    audio = np.int16(audio / np.max(np.abs(audio)) * 32767)
    wav.write('d:/tinygames/public/assets/audio/cosmic_music.wav', sample_rate, audio)

generate_chiptune()
