import React from "react";
import {Composition, registerRoot} from "remotion";
import {V43Film, FPS, W, H, DURATION} from "./v43-film";

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
