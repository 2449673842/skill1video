import React from "react";
import {Composition, registerRoot, AbsoluteFill} from "remotion";
import {V45Attention} from "./Attention";
import {V45Filter} from "./Filter";
import {W, H, FPS, STILL_FRAME} from "./v45-common";

/* V4.5 关键帧组合 —— 1920×1080 / 30fps / 5s
   第一轮：静态复刻。STILL_FRAME(=96) 之后画面完全静止。 */

const Root: React.FC = () => (
  <>
    <Composition id="V45Attention" component={V45Attention}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="V45Filter" component={V45Filter}
      durationInFrames={5 * FPS} fps={FPS} width={W} height={H} />
  </>
);

registerRoot(Root);
