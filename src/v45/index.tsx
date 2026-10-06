import React from "react";
import {Composition, registerRoot, AbsoluteFill} from "remotion";
import {V45Attention} from "./Attention";
import {V45Filter} from "./Filter";
import {V45Searchlight} from "./Searchlight";
import {V45Linking} from "./Linking";
import {V45Choice} from "./Choice";
import {V45Growth} from "./Growth";
import {W, H, FPS, DISPLAY} from "./v45-common";

/* V4.5 关键帧组合 —— 1920×1080 / 30fps / 5s
   第一轮：静态复刻。STILL_FRAME(=96) 之后画面完全静止。 */

/* ContactSheet：六场景真实渲染拼图（3×2，每格 640×360） */
const CELL_W = 640, CELL_H = 360;
const SHEET: { Comp: React.FC; label: string }[] = [
  { Comp: V45Attention, label: "ATTENTION / SIGNAL FLOOD" },
  { Comp: V45Filter, label: "FILTER / PRIORITY" },
  { Comp: V45Searchlight, label: "SEARCHLIGHT / WORKSPACE" },
  { Comp: V45Linking, label: "LINKING / NETWORK TO TRACK" },
  { Comp: V45Choice, label: "CHOICE / FORK" },
  { Comp: V45Growth, label: "PAGE / TIME / GROWTH" },
];

const V45ContactSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#010203" }}>
    {SHEET.map(({ Comp, label }, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      return (
        <div key={label} style={{
          position: "absolute",
          left: col * CELL_W, top: row * CELL_H, width: CELL_W, height: CELL_H,
          overflow: "hidden", outline: "1px solid rgba(159,216,232,.14)", outlineOffset: -1,
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, width: W, height: H,
            transform: `scale(${CELL_W / W})`, transformOrigin: "0 0",
          }}>
            <Comp />
          </div>
          <div style={{
            position: "absolute", left: 10, bottom: 8,
            fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 2.6,
            color: "rgba(239,229,204,.82)", textShadow: "0 2px 10px rgba(0,0,0,.9)",
          }}>{String(i + 1).padStart(2, "0")} · {label}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <>
    <Composition id="V45Attention" component={V45Attention}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="V45Filter" component={V45Filter}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="V45Searchlight" component={V45Searchlight}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="V45Linking" component={V45Linking}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="V45Choice" component={V45Choice}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="V45Growth" component={V45Growth}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="V45ContactSheet" component={V45ContactSheet}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
  </>
);

registerRoot(Root);
