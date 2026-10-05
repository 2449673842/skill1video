import React from "react";
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile} from "remotion";
import {FPS,W,H,frames,starts,Orb,Progress,INK} from "./common";
import {Scene0,Scene1,Scene2,Scene3,Scene4} from "./scenes-a";
import {Scene5,Scene6,Scene7,Scene8,Scene9} from "./scenes-b";
import {Scene10,Scene11,Scene12,Scene13,Scene14} from "./scenes-c";

const scenes=[
  Scene0,Scene1,Scene2,Scene3,Scene4,
  Scene5,Scene6,Scene7,Scene8,Scene9,
  Scene10,Scene11,Scene12,Scene13,Scene14
];

const Film:React.FC=()=>{
  return <AbsoluteFill style={{background:INK}}>
    <Audio src={staticFile("score.wav")} volume={0.72}/>
    {scenes.map((Scene,i)=><Sequence key={i} from={starts[i]*FPS} durationInFrames={frames[i]}><Scene/></Sequence>)}
    <Orb/>
    <Progress/>
  </AbsoluteFill>;
};

const Root:React.FC=()=>(
  <Composition
    id="Attention"
    component={Film}
    durationInFrames={120*FPS}
    fps={FPS}
    width={W}
    height={H}
  />
);

registerRoot(Root);
