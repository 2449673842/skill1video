import React from "react";
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile} from "remotion";
import {FPS,W,H,frames,starts,BG,WorldProgress} from "./v2-common";
import {V2Scene0,V2Scene1,V2Scene2,V2Scene3,V2Scene4} from "./v2-scenes-a";
import {V2Scene5,V2Scene6,V2Scene7,V2Scene8,V2Scene9} from "./v2-scenes-b";
import {V2Scene10,V2Scene11,V2Scene12,V2Scene13,V2Scene14} from "./v2-scenes-c";

const scenes=[
  V2Scene0,V2Scene1,V2Scene2,V2Scene3,V2Scene4,
  V2Scene5,V2Scene6,V2Scene7,V2Scene8,V2Scene9,
  V2Scene10,V2Scene11,V2Scene12,V2Scene13,V2Scene14
];

const Film:React.FC=()=>(
  <AbsoluteFill style={{background:BG}}>
    <Audio src={staticFile("score.wav")} volume={0.58}/>
    {scenes.map((Scene,i)=><Sequence key={i} from={starts[i]*FPS} durationInFrames={frames[i]}><Scene/></Sequence>)}
    <WorldProgress/>
  </AbsoluteFill>
);

const Root:React.FC=()=>(
  <Composition id="AttentionV2" component={Film} durationInFrames={120*FPS} fps={FPS} width={W} height={H}/>
);

registerRoot(Root);
