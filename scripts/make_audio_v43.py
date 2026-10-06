#!/usr/bin/env python3
import math, os, random, struct, sys, wave

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/v43-score.wav"
SR = 48000
DUR = 120.0
N = int(SR * DUR)
os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)

# V4.3: event-led soundtrack. No 8-second scene clock.
# Motion density rises only around meaningful visual events and truly ducks
# inside authored reading/settle windows.
random.seed(43)

quiet = [
    (28.4,31.5),
    (40.0,42.0),
    (51.0,53.5),
    (63.5,66.0),
    (76.6,78.5),
    (87.8,91.0),
    (99.2,100.5),
    (107.4,109.0),
    (114.2,116.0),
    (118.25,120.0),
]
events = [
    (8.55, 62),
    (18.55, 70),
    (26.95, 52),
    (31.75, 59),
    (41.85, 65),
    (53.55, 57),
    (64.95, 49),
    (75.85, 61),
    (78.85, 55),
    (91.05, 48),
    (97.35, 67),
    (100.45, 45),
    (108.75, 52),
    (116.05, 58),
    (118.25, 72),
]
active_windows = [
    (0.4,3.2),
    (8.5,18.6),
    (22.5,27.6),
    (31.8,40.0),
    (42.0,51.0),
    (56.6,63.5),
    (66.0,76.4),
    (78.8,87.6),
    (91.0,99.2),
    (100.5,107.3),
    (109.0,114.1),
    (116.0,118.2),
]

def clamp(x,a=0.0,b=1.0):
    return max(a,min(b,x))

def smooth(x):
    x=clamp(x)
    return x*x*(3-2*x)

def tone(freq,t,phase=0.0):
    return math.sin(2*math.pi*freq*t+phase)

def in_any(t, windows):
    return any(a <= t <= b for a,b in windows)

def quiet_gain(t):
    g=1.0
    for a,b in quiet:
        if a <= t <= b:
            edge=min(smooth((t-a)/0.42),smooth((b-t)/0.42))
            g=min(g,1.0-0.92*edge)
    return g

with wave.open(OUT,"wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    block=bytearray()

    for i in range(N):
        t=i/SR

        # Very slow bed: no rhythmic pumping, no scene-boundary reset.
        drift=0.5+0.5*math.sin(2*math.pi*t/37.0)
        root=73.42 + 8.0*math.sin(2*math.pi*t/53.0)
        pad=(
            .48*tone(root,t,.3)+
            .28*tone(root*1.5,t,1.1)+
            .16*tone(root*2.0,t,2.0)+
            .10*tone(root*.5,t,.8)
        )*(.030+.014*drift)

        # Momentum exists only inside authored action windows.
        pulse=0.0
        if in_any(t,active_windows):
            local=(t*0.57)%1.0
            if local<.085:
                env=math.exp(-local*34.0)
                pulse=.030*env*(tone(48,t)+.25*tone(72,t))

        # Pre-sound + impact only at story events.
        fx=0.0
        for mark,base in events:
            d=t-mark
            if -.32<d<0:
                u=(d+.32)/.32
                env=math.sin(math.pi*clamp(u))
                noise=math.sin((t*367.0+mark)*13.7)*math.sin((t*91.0+mark)*27.1)
                fx += .020*(env*env)*noise
            if 0<=d<.30:
                env=math.exp(-d*11.0)
                fx += .050*env*tone(base,t,.2)
                fx += .012*env*tone(base*6.5,t,.6)

        q=quiet_gain(t)
        sample=(pad+pulse+fx)*q

        # Near the final line, remove pulses and let the tonal bed settle.
        if t>=118.25:
            sample=pad*q*.55

        pan=.06*math.sin(2*math.pi*t/23.0)
        l=clamp(sample*(1-pan),-1,1)
        r=clamp(sample*(1+pan),-1,1)
        block += struct.pack("<hh",int(l*32767),int(r*32767))

        if len(block)>=65536:
            wf.writeframesraw(block)
            block.clear()

    if block:
        wf.writeframesraw(block)

print(OUT)
