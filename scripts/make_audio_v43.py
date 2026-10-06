#!/usr/bin/env python3
import math, os, random, struct, sys, wave

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/v43-score.wav"
SR = 48000
DUR = 120.0
N = int(SR * DUR)
os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)

# V4.3 score contract:
# - no fixed 8-second accents
# - quiet windows are intentional
# - hits belong to story events, not scene boundaries
# - low-density ambience under reading/settle moments
random.seed(43)

EVENTS = [
    (8.45, "filter", 64),
    (19.90, "handoff", 58),
    (27.15, "reveal", 52),
    (42.05, "focus", 61),
    (53.85, "winner", 57),
    (66.05, "link", 49),
    (78.55, "groove", 55),
    (92.05, "fork", 47),
    (100.75, "hijack", 50),
    (109.10, "paper", 60),
    (116.15, "growth", 67),
    (118.40, "ending", 44),
]

QUIET = [
    (5.8, 7.4),
    (17.6, 19.2),
    (28.3, 31.2),
    (39.9, 41.5),
    (50.8, 53.2),
    (63.2, 65.7),
    (76.2, 78.2),
    (88.0, 91.0),
    (98.7, 100.4),
    (107.0, 108.8),
    (113.6, 116.0),
    (118.7, 120.0),
]

# Atmosphere changes only at meaningful sections, not evenly.
HARMONY = [
    (0.0, (82.41, 123.47, 164.81)),
    (20.0, (73.42, 110.00, 146.83)),
    (42.0, (92.50, 138.59, 185.00)),
    (66.0, (98.00, 146.83, 196.00)),
    (90.0, (82.41, 123.47, 164.81)),
    (109.0, (110.00, 164.81, 220.00)),
    (116.0, (123.47, 185.00, 246.94)),
]

def clamp(x,a=0.0,b=1.0):
    return max(a,min(b,x))

def smoother(x):
    x=clamp(x)
    return x*x*x*(x*(x*6-15)+10)

def tone(freq,t,phase=0.0):
    return math.sin(2*math.pi*freq*t+phase)

def chord_at(t):
    current=HARMONY[0][1]
    for ts,ch in HARMONY:
        if t>=ts:
            current=ch
        else:
            break
    return current

def quiet_gain(t):
    g=1.0
    for a,b in QUIET:
        if a<=t<=b:
            edge=0.45
            fi=smoother((t-a)/edge)
            fo=smoother((b-t)/edge)
            # settle windows are quieter, but not dead unless final ending
            floor=0.14 if b<118.7 else 0.06
            g=min(g, floor+(1-floor)*(1-min(fi,fo)))
    return g

def event_sound(t):
    s=0.0
    for mark,kind,base in EVENTS:
        d=t-mark
        # Pre-riser only for transitions that need anticipation.
        if kind in ("handoff","focus","paper","growth") and -0.38<d<0:
            u=(d+0.38)/0.38
            env=math.sin(math.pi*clamp(u))**2
            noise=math.sin((t*313.7+mark)*15.7)*math.sin((t*89.3+mark)*27.2)
            s += 0.040*env*noise
        if 0<=d<0.42:
            env=math.exp(-d*(8.5 if kind!="ending" else 5.8))
            s += 0.070*env*tone(base,t,0.2)
            s += 0.020*env*tone(base*5.0,t,0.7)
        if kind=="reveal" and 0<=d<0.7:
            env=math.exp(-d*5.5)
            s += 0.025*env*math.sin(2*math.pi*(base*1.7)*t)
    return s

with wave.open(OUT,"wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    block=bytearray()
    for i in range(N):
        t=i/SR
        chord=chord_at(t)

        # Long, slow bed. No beat grid.
        slow=0.78+0.12*math.sin(2*math.pi*t/23.0)+0.08*math.sin(2*math.pi*t/37.0+0.8)
        pad=(
            0.45*tone(chord[0],t,0.25)+
            0.30*tone(chord[1],t,1.10)+
            0.19*tone(chord[2],t,2.05)+
            0.11*tone(chord[0]/2,t,0.55)
        )*0.18*slow

        # Sparse motion texture only in actual moving sections.
        texture=0.0
        motion_windows=[
            (8.2,18.9),(22.0,27.1),(31.7,39.7),(42.0,50.4),
            (54.0,63.0),(66.0,75.9),(78.4,87.6),(91.0,98.4),
            (100.6,106.8),(109.0,113.4),(116.0,118.5)
        ]
        if any(a<=t<=b for a,b in motion_windows):
            wob=0.5+0.5*math.sin(2*math.pi*t/3.7)
            texture=0.018*wob*(tone(187.0,t,0.3)+0.45*tone(263.0,t,1.4))

        sample=(pad+texture+event_sound(t))*quiet_gain(t)

        # Gentle stereo drift, not synced to events.
        pan=0.07*math.sin(2*math.pi*t/19.0)
        l=clamp(sample*(1-pan),-1,1)
        r=clamp(sample*(1+pan),-1,1)
        block += struct.pack("<hh",int(l*32767),int(r*32767))
        if len(block)>=65536:
            wf.writeframesraw(block)
            block.clear()
    if block:
        wf.writeframesraw(block)

print(OUT)
