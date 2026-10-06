import React from "react";
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile,useCurrentFrame} from "remotion";
import {FPS,W,H,frames,starts,BG,WorldProgress,GOLD2,GOLD,CREAM,TEAL,RED} from "./v2-common";
import {V3Scene0,V3Scene1} from "./v3-opening";
import {V3Scene2,V3Scene3,V3Scene4} from "./v3-scenes-a";
import {V2Scene5,V2Scene6,V2Scene7,V2Scene8,V2Scene9} from "./v2-scenes-b";
import {V2Scene10,V2Scene11,V2Scene12,V2Scene13,V2Scene14} from "./v2-scenes-c";

const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const smooth=(v:number)=>{const x=clamp(v,0,1);return x*x*(3-2*x);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;

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

const Veil:React.FC<{arc:number;x?:number;y?:number;warm?:boolean}>=({arc,x=960,y=540,warm=false})=>
  <div style={{position:"absolute",inset:0,pointerEvents:"none",
    background:"radial-gradient(circle at "+x+"px "+y+"px,"+(warm?"rgba(242,184,94,":"rgba(91,196,212,")+(arc*.13)+") 0 12%, rgba(3,5,7,"+(arc*.30)+") 44%, transparent 78%)"}}/>;

const CardToAperture:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.12)/.76,0,1));
  const x=mix(1420,1050,t),y=mix(650,545,t);
  const w=mix(220,300,t),h=mix(128,300,t),r=mix(16,150,t);
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y} warm/>
    {[0,1,2].map(i=>{
      const lag=smooth(clamp((q-i*.07)/.7,0,1));
      const xx=mix(1310-i*120,x,lag), yy=mix(390+i*115,y,lag);
      return <div key={i} style={{position:"absolute",left:xx,top:yy,width:130,height:78,borderRadius:10,
        transform:"translate(-50%,-50%) scale("+(1-lag*.55)+") rotate("+((-7+i*6)*(1-lag))+"deg)",
        border:"1px solid rgba(242,184,94,"+(.24*(1-lag))+")",opacity:(1-lag)*.72,
        background:"rgba(10,15,18,.82)"}}/>;
    })}
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:r,transform:"translate(-50%,-50%) rotate("+(mix(-5,0,t))+"deg)",
      border:(2+arc*5)+"px solid rgba(242,184,94,"+(.58+arc*.30)+")",
      background:"radial-gradient(circle,rgba(255,122,73,"+(t*.16)+"),rgba(6,9,11,.94) 58%)",
      boxShadow:"0 0 "+(25+arc*70)+"px rgba(242,184,94,"+(.12+arc*.22)+")"}}>
      <div style={{position:"absolute",left:22,top:22,right:22,height:5,borderRadius:3,background:"rgba(239,229,204,"+((1-t)*.42)+")",
        boxShadow:"0 18px 0 rgba(239,229,204,"+((1-t)*.24)+"),0 36px 0 rgba(239,229,204,"+((1-t)*.16)+")"}}/>
      {Array.from({length:6}).map((_,i)=><div key={i} style={{position:"absolute",left:"50%",top:"50%",width:w*(.55+i*.09),height:1,
        transform:"translate(-50%,-50%) rotate("+(i*30+q*80)+"deg)",background:"rgba(242,184,94,"+(t*.24)+")"}}/>)}
    </div>
  </div>;
};

const ApertureToGate:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const x=mix(1050,620,t),y=mix(545,535,t),w=mix(290,235,t),h=mix(290,510,t),r=mix(145,22,t);
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y}/>
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:r,transform:"translate(-50%,-50%) perspective(900px) rotateY("+(-10*t)+"deg)",
      border:(4+arc*4)+"px solid rgba(242,184,94,"+(.62+arc*.22)+")",
      background:"linear-gradient(160deg,rgba(242,184,94,.08),rgba(91,196,212,.025))",
      boxShadow:"0 0 "+(30+arc*65)+"px rgba(242,184,94,.20),inset 0 0 45px rgba(242,184,94,.08)"}}>
      {Array.from({length:7}).map((_,i)=><div key={i} style={{position:"absolute",left:18+i*((w-36)/6),top:32,bottom:32,width:1,
        background:"linear-gradient(180deg,transparent,rgba(242,184,94,"+(t*.28)+"),transparent)",opacity:t}}/>)}
      <div style={{position:"absolute",left:18,right:18,top:28,fontSize:16,fontWeight:900,letterSpacing:3,color:"rgba(91,196,212,"+(t*.7)+")",opacity:t}}>01 / 感官</div>
    </div>
  </div>;
};

const GateToReticle:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.1)/.82,0,1));
  const x=mix(1450,1510,t),y=mix(535,500,t),w=mix(235,142,t),h=mix(510,142,t),r=mix(22,71,t);
  const person=smooth(clamp((q-.48)/.38,0,1));
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y}/>
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:r,transform:"translate(-50%,-50%)",
      border:"2px solid rgba(242,184,94,"+(.66+arc*.24)+")",boxShadow:"0 0 "+(24+arc*48)+"px rgba(242,184,94,.22)"}}>
      {[0,90,180,270].map(a=><div key={a} style={{position:"absolute",left:"50%",top:"50%",width:70+person*34,height:2,transformOrigin:"0 50%",
        transform:"rotate("+a+"deg)",background:"linear-gradient(90deg,rgba(242,184,94,"+(person*.8)+"),transparent)"}}/>)}
    </div>
    <div style={{position:"absolute",left:x,top:y-8,opacity:person,transform:"translate(-50%,-50%) scale("+(mix(.4,1,person))+")"}}>
      <div style={{width:27,height:27,borderRadius:"50%",background:GOLD2,boxShadow:"0 0 22px rgba(242,184,94,.6)"}}/>
      <div style={{width:19,height:38,margin:"-1px auto 0",borderRadius:"8px 8px 5px 5px",background:GOLD2}}/>
    </div>
  </div>;
};

const ReticleToBeam:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.12)/.76,0,1));
  const sx=1510,sy=500,tx=390,ty=405;
  const ang=Math.atan2(ty-sy,tx-sx)*180/Math.PI;
  const len=Math.sqrt((tx-sx)*(tx-sx)+(ty-sy)*(ty-sy))*t;
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={sx} y={sy} warm/>
    <div style={{position:"absolute",left:sx,top:sy,width:150*(1-t*.35),height:150*(1-t*.35),borderRadius:"50%",
      transform:"translate(-50%,-50%)",border:"2px solid rgba(242,184,94,"+(.78*(1-t*.35))+")",
      boxShadow:"0 0 32px rgba(242,184,94,.25)"}}/>
    <div style={{position:"absolute",left:sx,top:sy,width:len,height:160,transformOrigin:"0 50%",
      transform:"rotate("+ang+"deg) translateY(-80px)",clipPath:"polygon(0 46%,100% 0,100% 100%,0 54%)",
      background:"linear-gradient(90deg,rgba(242,184,94,"+(.30*t)+"),rgba(242,184,94,.03))"}}/>
    <div style={{position:"absolute",left:mix(sx,tx,t),top:mix(sy,ty,t),width:mix(56,220,t),height:mix(56,116,t),borderRadius:mix(28,16,t),
      transform:"translate(-50%,-50%)",border:"1px solid rgba(242,184,94,"+(.36+.44*t)+")",
      background:"rgba(12,18,20,"+(.25+.62*t)+")",boxShadow:"0 0 32px rgba(242,184,94,.18)"}}>
      <div style={{position:"absolute",left:16,top:14,fontSize:mix(10,25,t),fontWeight:900,color:GOLD2,opacity:t}}>工作</div>
    </div>
  </div>;
};

const NodeToAuctionCard:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const x=mix(1450,1035,t),y=mix(730,390,t),w=mix(220,290,t),h=mix(116,168,t);
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y} warm/>
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:mix(16,18,t),
      transform:"translate(-50%,-50%) rotate("+mix(0,-4,t)+"deg)",
      border:"1px solid rgba(242,184,94,"+(.54+arc*.28)+")",
      background:"linear-gradient(150deg,rgba(18,24,24,.97),rgba(7,9,11,.95))",
      boxShadow:"0 0 "+(24+arc*46)+"px rgba(242,184,94,.16),0 25px 60px rgba(0,0,0,.35)"}}>
      <div style={{padding:"20px 22px 0",fontSize:mix(27,34,t),fontWeight:900,color:GOLD2}}>{t<.52?"价格":"新奇"}</div>
      <div style={{padding:"7px 22px",fontSize:mix(16,21,t),color:"rgba(239,229,204,.50)"}}>{t<.52?"正在比较":"刚刚发生"}</div>
      <div style={{position:"absolute",left:22,right:22,bottom:21,height:4,background:"rgba(239,229,204,.08)"}}>
        <div style={{height:"100%",width:(55+t*37)+"%",background:GOLD2}}/>
      </div>
    </div>
  </div>;
};

const AuctionToWindow:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const x=mix(1035,600,t),y=mix(790,560,t),w=mix(290,460,t),h=mix(168,290,t);
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y}/>
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:mix(18,18,t),
      transform:"translate(-50%,-50%) perspective(900px) rotateY("+mix(-4,-18,t)+"deg) rotateX("+(t*4)+"deg)",
      border:"1px solid rgba(242,184,94,"+(.62+arc*.24)+")",
      background:"linear-gradient(145deg,rgba(22,27,27,.98),rgba(7,9,11,.96))",
      boxShadow:"0 0 "+(22+arc*55)+"px rgba(217,178,111,.16),0 34px 80px rgba(0,0,0,.38)"}}>
      <div style={{padding:mix(20,26,t),fontSize:mix(34,36,t),fontWeight:900,color:GOLD2}}>{t<.48?"奖励":"文档"}</div>
      {Array.from({length:5}).map((_,i)=><div key={i} style={{margin:"13px 28px",height:8,borderRadius:4,
        width:(52+i*7)+"%",background:i===2?"rgba(242,184,94,"+(.30+.55*t)+")":"rgba(239,229,204,"+(.05+.09*t)+")",opacity:t*.9+.1}}/>)}
    </div>
  </div>;
};

const WindowToBridge:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const x=mix(860,960,t),y=mix(586,650,t);
  const w=mix(460,310,t),h=mix(290,710,t);
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y}/>
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,transform:"translate(-50%,-50%) perspective(900px) rotateX("+(t*58)+"deg)",
      clipPath:"polygon("+(mix(0,40,t))+"% 0,"+(mix(100,60,t))+"% 0,72% 100%,28% 100%)",
      background:"linear-gradient(180deg,rgba(242,184,94,"+(.10+arc*.08)+"),rgba(242,184,94,.025))",
      borderLeft:"1px solid rgba(242,184,94,.44)",borderRight:"1px solid rgba(242,184,94,.44)",
      boxShadow:"0 0 35px rgba(242,184,94,.09)"}}>
      {Array.from({length:5}).map((_,i)=><div key={i} style={{position:"absolute",left:"18%",right:"18%",top:(18+i*16)+"%",height:2,
        background:"rgba(239,229,204,"+((1-t)*.18+t*.07)+")"}}/>)}
    </div>
  </div>;
};

const BridgeToNetwork:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const pts=[[760,470],[880,410],[1015,430],[1160,485],[820,600],[980,590],[1120,650],[905,745],[1080,760]];
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={960} y={590}/>
    <div style={{position:"absolute",left:805,top:370,width:310,height:710,opacity:1-t,
      clipPath:"polygon(45% 0,55% 0,72% 100%,28% 100%)",
      background:"linear-gradient(180deg,rgba(217,178,111,.18),rgba(217,178,111,.04))",
      borderLeft:"1px solid rgba(217,178,111,.4)",borderRight:"1px solid rgba(217,178,111,.4)"}}/>
    <svg width={W} height={H} style={{position:"absolute",inset:0,opacity:t}}>
      {pts.slice(1).map((p,i)=><line key={"l"+i} x1={pts[Math.floor(i/2)][0]} y1={pts[Math.floor(i/2)][1]} x2={p[0]} y2={p[1]}
        stroke={i%3===0?GOLD2:"rgba(91,196,212,.55)"} strokeWidth={1.5+arc*1.5}/>)}
      {pts.map((p,i)=><circle key={"p"+i} cx={p[0]} cy={p[1]} r={4+(i%3)*2+arc*2} fill={i%3===0?GOLD2:TEAL}/>)}
    </svg>
  </div>;
};

const NetworkToTrack:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const pts=[[760,470],[880,410],[1015,430],[1160,485],[820,600],[980,590],[1120,650],[905,745],[1080,760]];
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={960} y={590} warm/>
    <svg width={W} height={H} style={{position:"absolute",inset:0}}>
      {pts.slice(1).map((p,i)=><line key={"l"+i} x1={pts[Math.floor(i/2)][0]} y1={pts[Math.floor(i/2)][1]} x2={p[0]} y2={p[1]}
        stroke={"rgba(91,196,212,"+((1-t)*.42)+")"} strokeWidth="1.5"/>)}
      {pts.map((p,i)=>{
        const tt=smooth(clamp((t-i*.035)/.72,0,1));
        const tx=mix(p[0],320+i*145,tt),ty=mix(p[1],760-180*Math.sin((i/8)*Math.PI),tt);
        return <circle key={i} cx={tx} cy={ty} r={mix(5,3,tt)} fill={i%3===0?GOLD2:TEAL} fillOpacity={.8}/>;
      })}
      <path d="M 300 760 C 620 470, 980 860, 1650 500" fill="none" stroke={"rgba(242,184,94,"+(.12+.68*t)+")"} strokeWidth={3+5*t} strokeLinecap="round"/>
    </svg>
  </div>;
};

const TrackToFork:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={930} y={610} warm/>
    <svg width={W} height={H} style={{position:"absolute",inset:0}}>
      <path d="M 250 790 C 600 720, 800 650, 930 610" fill="none" stroke="rgba(239,229,204,.28)" strokeWidth={6}/>
      <path d="M 930 610 C 1170 540, 1370 380, 1730 300" fill="none" stroke={GOLD2} strokeOpacity={t} strokeWidth={7+2*t} strokeLinecap="round"/>
      <path d="M 930 610 C 1180 700, 1380 830, 1740 860" fill="none" stroke={"rgba(239,229,204,"+(.24*t)+")"} strokeWidth={7+2*t} strokeLinecap="round"/>
      <path d="M 300 760 C 620 470, 980 860, 1650 500" fill="none" stroke={"rgba(242,184,94,"+(.72*(1-t))+")"} strokeWidth={8-2*t} strokeLinecap="round"/>
    </svg>
  </div>;
};

const ForkToMatrix:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const gx=mix(930,960,t),gy=mix(610,590,t),gw=mix(320,1120,t),gh=mix(180,430,t);
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={gx} y={gy}/>
    <svg width={W} height={H} style={{position:"absolute",inset:0,opacity:1-t}}>
      <path d="M 930 610 C 1170 540, 1370 380, 1730 300" fill="none" stroke={GOLD2} strokeWidth="9"/>
      <path d="M 930 610 C 1180 700, 1380 830, 1740 860" fill="none" stroke="rgba(239,229,204,.24)" strokeWidth="9"/>
    </svg>
    <div style={{position:"absolute",left:gx,top:gy,width:gw,height:gh,transform:"translate(-50%,-50%)",display:"grid",
      gridTemplateColumns:"repeat(10,1fr)",gap:mix(18,7,t),opacity:t}}>
      {Array.from({length:60}).map((_,i)=><div key={i} style={{borderRadius:4,
        border:"1px solid rgba(239,229,204,.08)",background:i===48?"rgba(216,88,73,.72)":"rgba(239,229,204,.10)",
        boxShadow:i===48?"0 0 22px rgba(216,88,73,.65)":"none"}}/>)}
    </div>
  </div>;
};

const MatrixToPaper:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const x=mix(1265,960,t),y=mix(750,535,t),w=mix(56,1120,t),h=mix(38,720,t),r=mix(4,3,t);
  const paper=smooth(clamp((q-.42)/.48,0,1));
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y} warm/>
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:r,transform:"translate(-50%,-50%) perspective(1200px) rotateX("+mix(0,3,t)+"deg)",
      background:"linear-gradient(90deg,rgba(216,88,73,"+(1-paper)+"),rgba(242,235,216,"+paper+"))",
      border:"1px solid rgba(120,90,48,"+(.08+.16*paper)+")",boxShadow:"0 28px 70px rgba(40,25,10,"+(.08+.16*paper)+")"}}>
      <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:2,background:"rgba(94,62,26,"+(.22*paper)+")"}}/>
    </div>
  </div>;
};

const PaperToDayBlocks:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.08)/.84,0,1));
  const x=mix(1480,960,t),y=mix(611,540,t),w=mix(420,1250,t),h=mix(235,710,t);
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={x} y={y} warm/>
    <div style={{position:"absolute",left:x,top:y,width:w,height:h,transform:"translate(-50%,-50%) rotate("+mix(0,-1.2,t)+"deg)",
      background:"rgba(246,237,216,"+(.72+.20*t)+")",border:"1px solid rgba(88,59,24,.16)",boxShadow:"0 22px 55px rgba(73,48,20,.13)"}}>
      <div style={{position:"absolute",left:"7%",top:"9%",fontSize:mix(18,38,t),fontWeight:900,color:"#1B1B1B",opacity:.8}}>一天 / 注意力</div>
      <div style={{position:"absolute",left:"7%",right:"7%",top:"32%",height:"44%",display:"grid",gridTemplateColumns:"repeat(15,1fr)",gap:mix(3,7,t),opacity:t}}>
        {Array.from({length:30}).map((_,i)=><div key={i} style={{height:mix(20,74,t),borderRadius:4,
          background:(i%7===0||i%11===0||i===23)?"#B77745":"rgba(11,13,16,.10)"}}/>)}
      </div>
    </div>
  </div>;
};

const BlocksToBranches:React.FC<{q:number;arc:number}>=({q,arc})=>{
  const t=smooth(clamp((q-.06)/.88,0,1));
  return <div style={{position:"absolute",inset:0}}>
    <Veil arc={arc} x={960} y={680} warm/>
    {Array.from({length:18}).map((_,i)=>{
      const col=i%9,row=Math.floor(i/9);
      const sx=540+col*105,sy=520+row*95;
      const tx=960+(i%2===0?-1:1)*(40+Math.floor(i/2)*18)*t;
      const ty=770-Math.floor(i/2)*24*t;
      return <div key={i} style={{position:"absolute",left:mix(sx,tx,t),top:mix(sy,ty,t),width:mix(64,8,t),height:mix(48,8,t),
        borderRadius:mix(4,8,t),transform:"translate(-50%,-50%) rotate("+mix((i%4-1.5)*3,0,t)+"deg)",
        background:i%5===0?TEAL:GOLD2,opacity:.35+.55*t,boxShadow:t>.6?"0 0 12px rgba(242,184,94,.28)":"none"}}/>;
    })}
    <svg width={W} height={H} style={{position:"absolute",inset:0,opacity:t}}>
      <path d={"M 960 860 C 960 "+mix(850,760,t)+", 960 "+mix(830,650,t)+", 960 "+mix(810,575,t)} fill="none" stroke={GOLD2} strokeWidth="7" strokeLinecap="round"/>
      {Array.from({length:10}).map((_,i)=>{
        const side=i%2===0?-1:1,level=Math.floor(i/2);
        const y=760-level*32*t,x=960+side*(30+level*18)*t,x2=960+side*(130+level*42)*t,y2=y-(48+level*7)*t;
        return <path key={i} d={"M "+x+" "+y+" Q "+(x+side*34)+" "+(y-22*t)+", "+x2+" "+y2} fill="none" stroke={i%3===0?TEAL:GOLD} strokeWidth={3+(i%3)} strokeOpacity={.35+.5*t}/>;
      })}
    </svg>
  </div>;
};

const CarrierTransition:React.FC<{index:number;q:number;arc:number}>=({index,q,arc})=>{
  if(index===0)return <CardToAperture q={q} arc={arc}/>;
  if(index===1)return <ApertureToGate q={q} arc={arc}/>;
  if(index===2)return <GateToReticle q={q} arc={arc}/>;
  if(index===3)return <ReticleToBeam q={q} arc={arc}/>;
  if(index===4)return <NodeToAuctionCard q={q} arc={arc}/>;
  if(index===5)return <AuctionToWindow q={q} arc={arc}/>;
  if(index===6)return <WindowToBridge q={q} arc={arc}/>;
  if(index===7)return <BridgeToNetwork q={q} arc={arc}/>;
  if(index===8)return <NetworkToTrack q={q} arc={arc}/>;
  if(index===9)return <TrackToFork q={q} arc={arc}/>;
  if(index===10)return <ForkToMatrix q={q} arc={arc}/>;
  if(index===11)return <MatrixToPaper q={q} arc={arc}/>;
  if(index===12)return <PaperToDayBlocks q={q} arc={arc}/>;
  return <BlocksToBranches q={q} arc={arc}/>;
};

const CarrierContinuity:React.FC=()=>{
  const f=useCurrentFrame();
  let index=-1;
  let q=0;
  for(let i=0;i<14;i++){
    const boundary=(i+1)*240;
    const start=boundary-22;
    const end=boundary+26;
    if(f>=start&&f<=end){
      index=i;
      q=(f-start)/(end-start);
      break;
    }
  }
  if(index<0)return null;
  const arc=Math.sin(Math.PI*clamp(q,0,1));
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:900}}>
    <CarrierTransition index={index} q={q} arc={arc}/>
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
    <CarrierContinuity/>
    <WorldProgress/>
  </AbsoluteFill>;
};

const Root:React.FC=()=>(
  <Composition id="AttentionV3" component={Film} durationInFrames={120*FPS} fps={FPS} width={W} height={H}/>
);

registerRoot(Root);
