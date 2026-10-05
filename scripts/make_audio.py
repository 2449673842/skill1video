#!/usr/bin/env python3
import math, os, random, struct, sys, wave

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/score.wav"
SR = 48000
DUR = 120.0
N = int(SR * DUR)
os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)

# Minimal generative soundtrack: warm pad + pulse + filtered noise swells.
# No external Python dependencies, deterministic output.
random.seed(7)
scene_marks = [0,7,15,23,31,39,47,55,63,72,81,90,99,107,114,120]
chords = [
    (110.0, 164.81, 220.0),      # A
    (98.0, 146.83, 196.0),       # G
    (82.41, 123.47, 164.81),     # E
    (73.42, 110.0, 146.83),      # D
]

def smoothstep(x):
    x = max(0.0, min(1.0, x))
    return x*x*(3-2*x)

def scene_index(t):
    for i in range(len(scene_marks)-1):
        if scene_marks[i] <= t < scene_marks[i+1]:
            return i
    return len(scene_marks)-2

def env(t, a, b, feather=0.7):
    if t < a or t > b:
        return 0.0
    return smoothstep((t-a)/feather) * smoothstep((b-t)/feather)

def tone(freq, t, phase=0.0):
    return math.sin(2*math.pi*freq*t + phase)

with wave.open(OUT, "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    block = bytearray()
    for i in range(N):
        t = i / SR
        si = scene_index(t)
        chord = chords[(si // 2) % len(chords)]

        # Slowly breathing three-note pad.
        pad_env = 0.34 + 0.18*math.sin(2*math.pi*t/17.0)
        pad = (
            0.46*tone(chord[0], t, 0.2) +
            0.30*tone(chord[1], t, 1.1) +
            0.20*tone(chord[2], t, 2.2)
        )
        pad += 0.14*tone(chord[0]/2, t, 0.8)
        pad *= 0.22*pad_env

        # Subtle heartbeat/pulse every 2 seconds.
        beat_phase = t % 2.0
        pulse = 0.0
        if beat_phase < 0.18:
            e = math.exp(-beat_phase*18)
            pulse = 0.16*e*(tone(55, t) + 0.45*tone(82.5, t))

        # Soft whoosh around scene transitions.
        whoosh = 0.0
        for m in scene_marks[1:-1]:
            d = abs(t-m)
            if d < 0.55:
                e = 1.0 - d/0.55
                # Deterministic pseudo-noise from sin products.
                n = math.sin((t*731.0 + m)*12.9898) * math.sin((t*193.0 + m)*78.233)
                whoosh += 0.12*(e*e)*n

        # Dramatic quiet pocket around 96-99s.
        duck = 1.0
        if 96 <= t < 99:
            duck = max(0.06, 1.0 - smoothstep((t-96)/1.0)*0.94)
        if 99 <= t < 101:
            duck = 0.06 + smoothstep((t-99)/2.0)*0.94

        # Small high tick every 4 seconds; disappears in quiet pocket.
        tick_phase = t % 4.0
        tick = 0.0
        if tick_phase < 0.04 and not (96 <= t < 101):
            e = math.exp(-tick_phase*80)
            tick = 0.08*e*tone(1760, t)

        sample = (pad + pulse + whoosh + tick) * duck

        # Gentle stereo drift.
        pan = 0.15*math.sin(2*math.pi*t/13.0)
        l = max(-1.0, min(1.0, sample*(1-pan)))
        r = max(-1.0, min(1.0, sample*(1+pan)))
        block += struct.pack("<hh", int(l*32767), int(r*32767))

        if len(block) >= 65536:
            wf.writeframesraw(block)
            block.clear()
    if block:
        wf.writeframesraw(block)

print(OUT)
