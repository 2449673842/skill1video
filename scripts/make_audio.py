#!/usr/bin/env python3
import math, os, random, struct, sys, wave

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/score.wav"
SR = 48000
DUR = 120.0
N = int(SR * DUR)
os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)

# V4.2 generative soundtrack: warm pad plus event-led accents.
# No external dependencies; deterministic output.
random.seed(7)
scene_marks = [0,8,16,24,32,40,48,56,64,72,80,88,96,104,112,120]
chords = [
    (110.0, 164.81, 220.0),
    (98.0, 146.83, 196.0),
    (82.41, 123.47, 164.81),
    (73.42, 110.0, 146.83),
]

def smoothstep(x):
    x = max(0.0, min(1.0, x))
    return x*x*(3-2*x)

def scene_index(t):
    for i in range(len(scene_marks)-1):
        if scene_marks[i] <= t < scene_marks[i+1]:
            return i
    return len(scene_marks)-2

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

        # Slow pad. This is atmosphere, not a beat clock.
        pad_env = 0.34 + 0.12*math.sin(2*math.pi*t/19.0)
        pad = (
            0.46*tone(chord[0], t, 0.2) +
            0.30*tone(chord[1], t, 1.1) +
            0.20*tone(chord[2], t, 2.2) +
            0.14*tone(chord[0]/2, t, 0.8)
        ) * 0.21*pad_env

        # Pulses exist only where the visual action has momentum.
        pulse = 0.0
        pulse_windows = [(17.0,23.5),(40.0,46.0),(56.0,62.8),(72.0,80.5),(104.0,110.5)]
        if any(a <= t <= b for a,b in pulse_windows):
            beat_phase = t % 2.4
            if beat_phase < 0.16:
                e = math.exp(-beat_phase*20)
                pulse = 0.11*e*(tone(52,t) + 0.35*tone(78,t))

        # Story events, not every scene boundary.
        event_marks = [15.8,31.7,50.6,61.9,79.1,100.7,108.7,116.8]
        whoosh = 0.0
        for m in event_marks:
            d = t - m
            if -0.42 < d < 0.18:
                u = (d + 0.42) / 0.60
                e = math.sin(math.pi*max(0.0,min(1.0,u)))
                n = math.sin((t*421.0+m)*18.17)*math.sin((t*97.0+m)*31.73)
                whoosh += 0.060*(e*e)*n

        # Quiet explanatory zones: static frames should feel intentionally quiet.
        duck = 1.0
        quiet_windows = [(24.6,26.7),(52.0,54.2),(63.6,65.0),(96.0,100.25),(111.0,112.5)]
        for qa,qb in quiet_windows:
            if qa <= t <= qb:
                fade_in = smoothstep((t-qa)/0.45)
                fade_out = smoothstep((qb-t)/0.45)
                duck = min(duck, 0.12 + 0.88*(1.0-min(fade_in,fade_out)))

        hit = 0.0
        accents = [(15.8,62),(31.7,54),(50.6,70),(61.9,58),(79.1,66),(100.7,48),(108.7,57),(116.8,61)]
        for m,base in accents:
            dt = t-m
            if -0.20 < dt < 0:
                e = smoothstep((dt+0.20)/0.20)
                hit += 0.018*e*tone(base*3.0,t,0.3)
            if 0 <= dt < 0.34:
                e = math.exp(-dt*9.5)
                hit += 0.082*e*tone(base,t,0.35)
                hit += 0.024*e*tone(base*7.0,t,0.1)

        sample = (pad + pulse + whoosh + hit) * duck

        pan = 0.10*math.sin(2*math.pi*t/15.0)
        l = max(-1.0,min(1.0,sample*(1-pan)))
        r = max(-1.0,min(1.0,sample*(1+pan)))
        block += struct.pack("<hh", int(l*32767), int(r*32767))

        if len(block) >= 65536:
            wf.writeframesraw(block)
            block.clear()
    if block:
        wf.writeframesraw(block)

print(OUT)
