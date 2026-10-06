import React from "react";
import {Composition, registerRoot} from "remotion";
import {DURATION, FPS, H, V43Film, W} from "./v43-film";

const Root:React.FC=()=>(
  <Composition
    id="AttentionV43"
    component={V43Film}
    durationInFrames={DURATION*FPS}
    fps={FPS}
    width={W}
    height={H}
  />
);

registerRoot(Root);
