import React from "react";
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile,useCurrentFrame} from "remotion";
import {FPS,W,H,frames,starts,BG,WorldProgress,GOLD2} from "./v2-common";
import {V3Scene0,V3Scene1} from "./v3-opening";
import {V3Scene2,V3Scene3,V3Scene4} from "./v3-scenes-a";
import {V2Scene5,V2Scene6,V2Scene7,V2Scene8,V2Scene9} from "./v2-scenes-b";
import {V2Scene10,V2Scene11,V2Scene12,V2Scene13,V2Scene14} from "./v2-scenes-c";

const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const smooth=(v:number)=>{const x=clamp(v,0,1);return x*x*(3-2*x);};

type Cam={x:number;y:number;z:number;ox:number;oy:number};

const legacyCamera=(scene:number,f:number):Cam=>{
  const p=smooth(f/239);
  if(scene===5){
    const i=Math.floor(f/60)%4;
    const a=-1.35+i*.9+Math.sin(f*.012)*.08;
    const x=960+Math.cos(a)*365;
    const y=590+Math.sin(a)*365*.56;
    return {x:clamp((960-x)*.13,-72,72),y:clamp((540-y)*.11,-45,45),z:1.022+.012*Math.sin(Math.PI*((f%60)/60)),ox:x,oy:y};
  }
  if(scene===6){
    const i=Math.floor(f/44)%4;
    const x=600+i*260, y=560+i*26;
    return {x:clamp((960-x)*.15,-70,70),y:clamp((540-y)*.10,-34,34),z:1.025+.012*smooth((f%44)/30),ox:x,oy:y};
  }
  if(scene===7){
    const q=smooth(clamp((f-18)/190,0,1));
    const y=720-145*q;
    return {x:0,y:clamp((540-y)*.11,-28,28),z:1.018+.045*q,ox:960,oy:y};
  }
  if(scene===8){
    const a=-.55+p*1.15;
    const x=960+Math.cos(a)*145, y=590+Math.sin(a)*86;
    return {x:(960-x)*.09,y:(540-y)*.08,z:1.018+.028*p,ox:x,oy:y};
  }
  if(scene===9){
    const q=(f%52)/52;
    const x=320+(1640-320)*q;
    const y=760-210*Math.sin(q*Math.PI);
    return {x:clamp((960-x)*.10,-74,74),y:clamp((540-y)*.09,-38,38),z:1.025+.018*Math.sin(Math.PI*q),ox:x,oy:y};
  }
  if(scene===10){
    const q=smooth(clamp((f-28)/175,0,1));
    const x=930+(1450-930)*q, y=610+(350-610)*q;
    return {x:clamp((960-x)*.12,-68,68),y:clamp((540-y)*.10,-34,34),z:1.02+.035*q,ox:x,oy:y};
  }
  if(scene===11){
    const q=smooth(clamp((f-118)/105,0,1));
    const x=1040+220*q, y=610+105*q;
    return {x:clamp((960-x)*.08,-42,42),y:clamp((540-y)*.07,-28,28),z:1.012+.018*q,ox:x,oy:y};
  }
  if(scene===12){
    const i=f<92?0:f<142?1:2;
    const tx=[420,950,1480][i], ty=[575,593,611][i];
    const q=smooth(clamp(((f%50)-4)/30,0,1));
    const prev=[420,420,950][i];
    const x=prev+(tx-prev)*q;
    return {x:clamp((960-x)*.10,-58,58),y:clamp((540-ty)*.07,-18,18),z:1.015+.025*q,ox:x,oy:ty};
  }
  if(scene===13){
    const x=960+Math.sin(f*.018)*90;
    const y=500+150*p;
    return {x:(960-x)*.07,y:clamp((540-y)*.08,-26,26),z:1.018+.022*p,ox:x,oy:y};
  }
  const grow=smooth(clamp((f-25)/155,0,1));
  const release=smooth(clamp((f-190)/46,0,1));
  const z=1.018+.045*grow-.038*release;
  return {x:0,y:16*grow-12*release,z,ox:960,oy:585};
};

const DirectedLegacyScene:React.FC<{scene:number;children:React.ReactNode}>=({scene,children})=>{
  const f=useCurrentFrame();
  const c=legacyCamera(scene,f);
  return <div style={{
    position:"absolute",left:0,top:0,width:W,height:H,
    transform:"translate("+c.x+"px,"+c.y+"px) scale("+c.z+")",
    transformOrigin:c.ox+"px "+c.oy+"px",
    willChange:"transform"
  }}>{children}</div>;
};

const bridgePoints:[number,number,number,number][]=[
  [1450,730,1035,390],
  [1035,790,600,560],
  [860,586,960,650],
  [960,610,960,590],
  [960,590,320,760],
  [1640,760,930,610],
  [1450,350,1120,690],
  [1220,705,960,535],
  [1480,611,960,540],
  [960,620,960,700],
];

const ContinuityBridge:React.FC=()=>{
  const f=useCurrentFrame();
  let hit=-1,local=0;
  for(let i=0;i<bridgePoints.length;i++){
    const boundary=(5+i)*240;
    const d=f-boundary;
    if(d>=-18&&d<=22){hit=i;local=(d+18)/40;break;}
  }
  if(hit<0)return null;
  const [x0,y0,x1,y1]=bridgePoints[hit];
  const q=smooth(local);
  const arc=Math.sin(Math.PI*q);
  const x=x0+(x1-x0)*q;
  const y=y0+(y1-y0)*q-72*arc;
  const veil=.24*arc;
  const r=16+10*arc;
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:900}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at "+x+"px "+y+"px, rgba(242,184,94,"+(veil*.7)+") 0 8%, rgba(4,6,8,"+veil+") 34%, transparent 68%)"}}/>
    <svg width={W} height={H} style={{position:"absolute",inset:0,overflow:"visible"}}>
      <path d={"M "+x0+" "+y0+" Q "+((x0+x1)/2)+" "+(Math.min(y0,y1)-150)+" "+x1+" "+y1} fill="none" stroke="rgba(242,184,94,.22)" strokeWidth="2" strokeDasharray="9 15"/>
    </svg>
    <div style={{position:"absolute",left:x,top:y,width:r,height:r,borderRadius:"50%",transform:"translate(-50%,-50%)",
      background:"#FFF0C8",boxShadow:"0 0 24px 8px rgba(242,184,94,.58),0 0 70px rgba(242,184,94,.26)"}}/>
    <div style={{position:"absolute",left:x,top:y,width:72+arc*38,height:72+arc*38,borderRadius:"50%",transform:"translate(-50%,-50%)",
      border:"1px solid rgba(242,184,94,"+(.44*(1-local)) +")"}}/>
  </div>;
};

const scenes=[
  V3Scene0,V3Scene1,V3Scene2,V3Scene3,V3Scene4,
  V2Scene5,V2Scene6,V2Scene7,V2Scene8,V2Scene9,
  V2Scene10,V2Scene11,V2Scene12,V2Scene13,V2Scene14
];

const Film:React.FC=()=>{
  return <AbsoluteFill style={{background:BG,overflow:"hidden"}}>
    <Audio src={staticFile("score.wav")} volume={0.58}/>
    {scenes.map((Scene,i)=><Sequence key={i} from={starts[i]*FPS} durationInFrames={frames[i]}>
      {i<5?<Scene/>:<DirectedLegacyScene scene={i}><Scene/></DirectedLegacyScene>}
    </Sequence>)}
    <ContinuityBridge/>
    <WorldProgress/>
  </AbsoluteFill>;
};

const Root:React.FC=()=>(
  <Composition id="AttentionV3" component={Film} durationInFrames={120*FPS} fps={FPS} width={W} height={H}/>
);

registerRoot(Root);
