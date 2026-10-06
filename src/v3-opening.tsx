import React from "react";
import {Easing,interpolate,useCurrentFrame} from "remotion";
import {
  Stage,Kicker,Caption,Source,GridFloor,RingMachine,GlowLine,Word,
  GOLD,GOLD2,CREAM,TEAL,RED,frames,hash,clamp,lerp,smooth,smoother,intro,W,H
} from "./v2-common";

type MediaKind="city"|"plane"|"mountain"|"chart"|"map"|"galaxy"|"doc"|"video"|"message"|"classroom"|"weather"|"book";
type TileSpec={label:string;kind:MediaKind;accent:string};

const ORANGE="#FF7A49";
const CYAN="#5BC4D4";
const specs:TileSpec[]=[
  {label:"新闻",kind:"city",accent:GOLD2},
  {label:"社交动态",kind:"message",accent:ORANGE},
  {label:"航班",kind:"plane",accent:CYAN},
  {label:"市场",kind:"chart",accent:ORANGE},
  {label:"地图",kind:"map",accent:CYAN},
  {label:"宇宙",kind:"galaxy",accent:GOLD2},
  {label:"文档",kind:"doc",accent:CREAM},
  {label:"视频",kind:"video",accent:ORANGE},
  {label:"课堂",kind:"classroom",accent:GOLD2},
  {label:"天气",kind:"weather",accent:CYAN},
  {label:"阅读",kind:"book",accent:CREAM},
  {label:"远方",kind:"mountain",accent:CYAN},
];

const fmt=(n:number)=>{
  if(n>=1000000000)return "1,000,000,000";
  if(n>=1000000)return (n/1000000).toFixed(n<10000000?1:0)+"M";
  if(n>=1000)return Math.round(n).toLocaleString("en-US");
  return String(Math.round(n));
};
const phase=(f:number,a:number,b:number)=>smooth(clamp((f-a)/(b-a)));
const logLerp=(a:number,b:number,t:number)=>Math.pow(10,lerp(Math.log10(a),Math.log10(b),smoother(clamp(t))));
const selectionValue=(f:number)=>{
  if(f<18)return 1;
  if(f<68)return logLerp(1,10000,(f-18)/50);
  if(f<88)return 10000;
  if(f<142)return logLerp(10000,100,(f-88)/54);
  if(f<176)return logLerp(100,1,(f-142)/34);
  return 1;
};
const surgeValue=(f:number)=>{
  const marks=[1,12,537,82000,3200000,1000000000];
  const points=[10,30,51,73,96,121];
  if(f<=points[0])return marks[0];
  for(let i=0;i<marks.length-1;i++){
    if(f<points[i+1])return logLerp(marks[i],marks[i+1],(f-points[i])/(points[i+1]-points[i]));
  }
  return marks[marks.length-1];
};

const Skyline:React.FC<{accent:string}>=({accent})=><div style={{position:"absolute",inset:0,overflow:"hidden",background:"linear-gradient(180deg,#20323E 0%,#A15A40 55%,#181517 100%)"}}>
  <div style={{position:"absolute",left:0,right:0,bottom:0,height:"58%",background:"linear-gradient(180deg,transparent,rgba(3,6,10,.45))"}}/>
  {Array.from({length:12}).map((_,i)=>{
    const w=8+(i%4)*7,h=24+(i*13)%54;
    return <div key={i} style={{position:"absolute",left:8+i*10,bottom:8,width:w,height:h,background:"rgba(8,12,16,.88)",boxShadow:i%3===0?"0 0 4px "+accent:"none"}}/>;
  })}
  <div style={{position:"absolute",left:77,top:15,width:18,height:18,borderRadius:"50%",background:accent,boxShadow:"0 0 18px "+accent}}/>
</div>;

const Plane:React.FC=()=> <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#6A98B1,#D9C3A6 60%,#2B3440)",overflow:"hidden"}}>
  <div style={{position:"absolute",left:22,top:18,fontSize:38,transform:"rotate(-8deg)",color:"#F4EFE5",textShadow:"0 5px 18px rgba(0,0,0,.4)"}}>✈</div>
  <div style={{position:"absolute",left:0,right:0,bottom:14,height:18,background:"rgba(12,18,25,.52)"}}/>
</div>;

const Mountain:React.FC=()=> <svg width="100%" height="100%" viewBox="0 0 160 90" preserveAspectRatio="none" style={{position:"absolute",inset:0,background:"linear-gradient(#426072,#B9B0A2)"}}>
  <polygon points="0,90 38,38 69,90" fill="#17252D"/>
  <polygon points="45,90 93,22 139,90" fill="#243842"/>
  <polygon points="101,90 136,45 160,90" fill="#15232A"/>
  <polygon points="82,36 93,22 105,38 97,35 93,31 89,35" fill="#E8E2D5"/>
</svg>;

const SparkChart:React.FC<{accent:string;i:number}>=({accent,i})=>{
  const pts=Array.from({length:10},(_,j)=>[8+j*15,65-hash(i*17+j,9)*48]);
  const d=pts.map((p,j)=>(j?"L":"M")+p[0]+" "+p[1]).join(" ");
  return <svg width="100%" height="100%" viewBox="0 0 150 85" preserveAspectRatio="none" style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#111B22,#071014)"}}>
    {[20,40,60].map(y=><line key={y} x1="4" y1={y} x2="146" y2={y} stroke="rgba(255,255,255,.08)"/>)}
    <path d={d} fill="none" stroke={accent} strokeWidth="3" style={{filter:"drop-shadow(0 0 6px "+accent+")"}}/>
  </svg>;
};

const MapArt:React.FC<{accent:string}>=({accent})=><svg width="100%" height="100%" viewBox="0 0 160 90" preserveAspectRatio="none" style={{position:"absolute",inset:0,background:"#0D171B"}}>
  <path d="M5 68 C30 54 28 28 57 35 S89 65 112 35 S142 22 158 8" fill="none" stroke={accent} strokeOpacity=".72" strokeWidth="2.5"/>
  <path d="M8 21 C34 32 47 15 68 25 S105 60 151 58" fill="none" stroke="rgba(239,229,204,.18)" strokeWidth="1.4"/>
  {[ [22,57],[58,35],[92,55],[130,25] ].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i===2?5:3} fill={i===2?GOLD2:accent}/>)}
</svg>;

const Galaxy:React.FC=()=> <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 52% 48%,#F2B85E 0 3%,#744B96 8%,#143B55 20%,#071017 52%,#020406 100%)",overflow:"hidden"}}>
  {Array.from({length:16}).map((_,i)=><div key={i} style={{position:"absolute",left:(hash(i,1)*100)+"%",top:(hash(i,2)*100)+"%",width:1+hash(i,3)*2,height:1+hash(i,3)*2,borderRadius:"50%",background:i%5===0?GOLD2:"#D9E6ED",opacity:.5+hash(i,5)*.5}}/>)}
</div>;

const Doc:React.FC=()=> <div style={{position:"absolute",inset:0,background:"linear-gradient(145deg,#E8E0CC,#B5AA94)",color:"#262627",padding:"9px 10px"}}>
  <div style={{fontSize:11,fontWeight:900,marginBottom:7}}>INSIGHT / NOTE</div>
  {Array.from({length:6}).map((_,i)=><div key={i} style={{height:3,marginBottom:5,width:(88-i*6)+"%",background:"rgba(38,38,39,"+(.5-i*.05)+")"}}/>)}
</div>;

const VideoArt:React.FC=()=> <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#111A22,#492A25 62%,#121418)",display:"grid",placeItems:"center"}}>
  <div style={{width:44,height:44,borderRadius:"50%",border:"2px solid rgba(255,255,255,.75)",display:"grid",placeItems:"center",boxShadow:"0 0 24px rgba(255,122,73,.25)"}}>
    <div style={{width:0,height:0,borderTop:"9px solid transparent",borderBottom:"9px solid transparent",borderLeft:"15px solid #F3EAD7",marginLeft:4}}/>
  </div>
</div>;

const MessageArt:React.FC=()=> <div style={{position:"absolute",inset:0,background:"linear-gradient(145deg,#142128,#080E12)",padding:10}}>
  {[0,1,2].map((i)=><div key={i} style={{marginBottom:7,marginLeft:i===1?27:0,width:i===1?90:105,height:15,borderRadius:8,background:i===2?"rgba(255,122,73,.55)":"rgba(91,196,212,.24)"}}/>)}
  <div style={{position:"absolute",right:8,top:7,width:18,height:18,borderRadius:"50%",background:RED,color:"white",fontSize:10,fontWeight:900,display:"grid",placeItems:"center"}}>12</div>
</div>;

const Classroom:React.FC=()=> <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#6C6559,#1A1B1D)",overflow:"hidden"}}>
  {Array.from({length:8}).map((_,i)=><div key={i} style={{position:"absolute",left:8+i*18,bottom:8+(i%2)*4,width:13,height:28,borderRadius:"7px 7px 3px 3px",background:"rgba(8,10,11,.8)"}}>
    <div style={{position:"absolute",left:2,top:-8,width:9,height:9,borderRadius:"50%",background:"rgba(8,10,11,.85)"}}/>
  </div>)}
  <div style={{position:"absolute",left:14,top:12,width:58,height:28,border:"1px solid rgba(242,232,211,.46)"}}/>
</div>;

const Weather:React.FC=()=> <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#537A91,#AEB9BD)",color:"white",padding:12}}>
  <div style={{fontSize:26,fontWeight:900}}>24°</div>
  <div style={{position:"absolute",right:18,top:27,fontSize:30}}>☁</div>
</div>;

const Book:React.FC=()=> <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,#D8C9AA 0 48%,#7D6E58 49% 51%,#E8DAC0 52% 100%)"}}>
  <div style={{position:"absolute",left:12,right:86,top:17,height:3,background:"rgba(51,42,34,.38)",boxShadow:"0 10px 0 rgba(51,42,34,.24),0 20px 0 rgba(51,42,34,.2),82px 2px 0 rgba(51,42,34,.32),82px 12px 0 rgba(51,42,34,.22),82px 22px 0 rgba(51,42,34,.18)"}}/>
</div>;

const ThumbArt:React.FC<{kind:MediaKind;accent:string;i:number}>=({kind,accent,i})=>{
  if(kind==="city")return <Skyline accent={accent}/>;
  if(kind==="plane")return <Plane/>;
  if(kind==="mountain")return <Mountain/>;
  if(kind==="chart")return <SparkChart accent={accent} i={i}/>;
  if(kind==="map")return <MapArt accent={accent}/>;
  if(kind==="galaxy")return <Galaxy/>;
  if(kind==="doc")return <Doc/>;
  if(kind==="video")return <VideoArt/>;
  if(kind==="message")return <MessageArt/>;
  if(kind==="classroom")return <Classroom/>;
  if(kind==="weather")return <Weather/>;
  return <Book/>;
};

const InfoTile:React.FC<{i:number;stream:number;filter:number;portal:number}>=({i,stream,filter,portal})=>{
  const spec=specs[i%specs.length];
  const depth=hash(i,2);
  const rank=hash(i,13);
  const band=i%2===0?-1:1;
  const lane=(i%9)-4;
  const near=depth>.80;
  const startX=-360-hash(i,3)*760;
  const endX=1230+lane*54+depth*175;
  const y0=125+hash(i,4)*825;
  const y1=565+band*(205+hash(i,5)*155);
  const q=smoother(clamp((stream-hash(i,6)*.28)/.72));
  const elite=i===9||i===28||i===43||i%19===0;
  const cutoff=interpolate(filter,[0,.48,1],[-.05,.56,.94],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const survive=elite?1:smooth(clamp((rank-cutoff+.10)/.18));
  const cull=1-survive;
  const c=smoother(clamp((filter-hash(i,7)*.12)/.88));
  const orbitA=i*.91+portal*.72;
  const orbitR=elite?205+hash(i,8)*115:0;
  const baseX=lerp(startX,endX,q);
  const baseY=lerp(y0,y1,q);
  const targetX=elite?1490+Math.cos(orbitA)*orbitR:1490;
  const targetY=elite?565+Math.sin(orbitA)*orbitR*.58:565;
  const pull=c*(elite?1:.22*cull);
  const x=lerp(baseX,targetX,pull);
  const y=lerp(baseY,targetY,pull);
  const z=-1180+depth*1040+q*420;
  const sc=(.40+depth*.60)*(elite?1:1-cull*.20);
  const alpha=(.10+.72*q)*(elite?1:(.16+.84*survive));
  const blur=near&&q<.48?5+(1-q)*9:elite?0:1.5+cull*5.5;
  const rotY=-18+depth*22+(i%2?5:-5);
  const rotZ=(hash(i,9)-.5)*6;
  const w=158+depth*52,h=90+depth*30;
  return <div style={{
    position:"absolute",left:x,top:y,width:w,height:h,opacity:alpha,
    transform:"translate(-50%,-50%) translateZ("+z+"px) rotateY("+rotY+"deg) rotateZ("+rotZ+"deg) scale("+sc+")",
    transformStyle:"preserve-3d",filter:"blur("+blur+"px)",
    border:"1px solid "+spec.accent+(elite?"A8":"38"),borderRadius:10,
    background:"#081015",overflow:"hidden",
    boxShadow:elite?"0 0 24px "+spec.accent+"38,0 24px 60px rgba(0,0,0,.38)":"0 18px 45px rgba(0,0,0,.26)"
  }}>
    <div style={{position:"absolute",left:0,right:0,top:0,height:"72%"}}><ThumbArt kind={spec.kind} accent={spec.accent} i={i}/></div>
    <div style={{position:"absolute",left:0,right:0,bottom:0,height:"31%",background:"linear-gradient(180deg,rgba(5,8,10,.82),rgba(5,8,10,.98))",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 10px"}}>
      <span style={{fontSize:13,fontWeight:900,color:elite?spec.accent:"rgba(239,229,204,.68)"}}>{spec.label}</span>
      <span style={{fontSize:9,color:"rgba(239,229,204,.28)"}}>{String(Math.floor(hash(i,10)*999)).padStart(3,"0")}</span>
    </div>
  </div>;
};

const FlowTrails:React.FC<{filter:number;portal:number}>=({filter,portal})=>{
  const f=useCurrentFrame();
  return <svg width={W} height={H} style={{position:"absolute",inset:0,overflow:"visible",pointerEvents:"none"}}>
    {Array.from({length:16}).map((_,i)=>{
      const sy=70+hash(i,2)*940;
      const midY=280+hash(i,3)*520;
      const endX=1480+portal*230;
      const d="M -100 "+sy+" C "+(360+hash(i,4)*260)+" "+midY+", "+(980+hash(i,5)*280)+" "+(400+hash(i,6)*300)+", "+endX+" 565";
      const color=i%6===0?CYAN:i%4===0?ORANGE:GOLD2;
      const dash=26+hash(i,7)*90;
      return <path key={i} d={d} fill="none" stroke={color} strokeOpacity={.045+hash(i,8)*.09+filter*.055} strokeWidth={.8+hash(i,9)*1.6}
        strokeDasharray={dash+" "+dash*.72} strokeDashoffset={-f*(5+hash(i,10)*9)} style={{filter:"drop-shadow(0 0 5px "+color+")"}}/>;
    })}
  </svg>;
};

const HeadCore:React.FC<{x:number;y:number;scale:number;opacity:number;portal:number}>=({x,y,scale,opacity,portal})=>{
  const f=useCurrentFrame();
  const s=scale*(1+portal*2.9);
  return <div style={{position:"absolute",left:x,top:y,width:520,height:520,transform:"translate(-50%,-50%) scale("+s+")",opacity}}>
    {Array.from({length:7}).map((_,i)=>{
      const size=235+i*45;
      const rot=f*(i%2?-.22:.18)+i*33;
      return <div key={i} style={{position:"absolute",left:"50%",top:"50%",width:size,height:size,marginLeft:-size/2,marginTop:-size/2,borderRadius:"50%",
        border:(i===0?3:1.5)+"px "+(i%2?"dashed":"solid")+" rgba(242,184,94,"+(.54-i*.05)+")",
        transform:"rotate("+rot+"deg) scaleY("+(.48+i*.035)+")",boxShadow:"0 0 13px rgba(242,184,94,.10)"}}/>;
    })}
    <div style={{position:"absolute",left:"50%",top:"50%",width:178,height:178,transform:"translate(-50%,-50%)",borderRadius:"50%",
      background:"radial-gradient(circle at 42% 36%,rgba(255,244,224,.85) 0 2%,rgba(255,122,73,.40) 8%,rgba(33,19,15,.95) 33%,#040608 66%)",
      border:"3px solid rgba(242,184,94,.72)",boxShadow:"0 0 80px 22px rgba(255,122,73,.30), inset 0 0 42px rgba(242,184,94,.24)"}}>
      <svg width="178" height="178" viewBox="0 0 178 178">
        <path d="M96 34 C68 34 54 57 58 81 C61 101 74 106 75 121 L75 143 M96 34 C119 38 130 56 127 76 C125 88 135 92 132 101 C129 110 116 108 113 119 C111 128 116 139 104 145" fill="none" stroke="rgba(242,232,211,.64)" strokeWidth="2.4"/>
        {[ [88,58],[110,66],[82,86],[105,96],[88,118] ].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={4} fill={i===2?CYAN:GOLD2}/>)}
        <path d="M88 58 L110 66 L105 96 L82 86 L88 118 L105 96" fill="none" stroke="rgba(91,196,212,.45)" strokeWidth="1.4"/>
      </svg>
    </div>
    <div style={{position:"absolute",left:"50%",top:"50%",width:20+portal*18,height:20+portal*18,transform:"translate(-50%,-50%)",borderRadius:"50%",background:"#FFF4DF",boxShadow:"0 0 38px 14px "+ORANGE}}/>
  </div>;
};

const ImpactRipple:React.FC<{f:number;events:number[];x:number;y:number;color?:string;maxR?:number}>=({f,events,x,y,color=GOLD2,maxR=280})=>{
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:118}}>
    {events.flatMap((event,ei)=>Array.from({length:4}).map((_,i)=>{
      const local=(f-event-i*5)/28;
      const p=clamp(local);
      const alive=local>=0&&local<=1;
      const r=30+p*(maxR+i*42);
      const a=(1-p)*(.48-i*.07);
      const squash=1+.06*Math.sin(p*Math.PI);
      return alive?<div key={ei+"-"+i} style={{
        position:"absolute",left:x,top:y,width:r*2,height:r*2,
        transform:"translate(-50%,-50%) scaleY("+squash+")",
        borderRadius:"50%",border:(i===0?3:2)+"px solid "+color,
        opacity:a,boxShadow:"0 0 "+(10+18*(1-p))+"px "+color+"55"
      }}/>:null;
    }))}
  </div>;
};

const ScreenPulse:React.FC<{f:number;events:number[]}>=({f,events})=>{
  const hit=events.reduce((m,e)=>{
    const d=f-e;
    if(d<0||d>16)return m;
    return Math.max(m,(1-d/16)*Math.exp(-d*.05));
  },0);
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:116,
    boxShadow:"inset 0 0 "+(70+hit*95)+"px "+(18+hit*30)+"px rgba(255,122,73,"+(.05+hit*.14)+")",
    opacity:hit}}/>;
};

const SelectionCounter:React.FC<{f:number}>=({f})=>{
  const value=selectionValue(f);
  const display=(f>=65&&f<91)?"10,000+":fmt(value);
  const prior1=selectionValue(Math.max(0,f-4));
  const prior2=selectionValue(Math.max(0,f-8));
  const filter=phase(f,88,176);
  const p=intro(f,12,22);
  const milestone=[68,88,142,176].reduce((m,t)=>Math.max(m,1-clamp(Math.abs(f-t)/8)),0);
  const kick=1+milestone*.075;
  const stage=f<68?"输入涌入":f<88?"锁定输入":f<142?"第一次筛选":f<176?"最终筛选":"只剩一个";
  return <div style={{position:"absolute",left:590,top:600,width:680,zIndex:88,opacity:p,transform:"translate(-50%,-50%)"}}>
    <div style={{fontSize:18,letterSpacing:5,color:"rgba(91,196,212,.55)",marginBottom:12}}>LIVE SELECTION / {stage}</div>
    <div style={{position:"relative",height:154}}>
      <div style={{position:"absolute",left:0,top:26,fontSize:122,fontWeight:900,letterSpacing:-6,fontVariantNumeric:"tabular-nums",
        color:GOLD2,transform:"scale("+kick+")",transformOrigin:"left center",textShadow:"0 0 28px rgba(255,122,73,.42),0 18px 54px rgba(0,0,0,.55)"}}>{display}</div>
      {f<176&&<div style={{position:"absolute",left:4,top:8,fontSize:24,fontWeight:800,color:"rgba(239,229,204,.14)",transform:"translateY(-18px)"}}>{fmt(prior2)}</div>}
      {f<176&&<div style={{position:"absolute",left:4,top:18,fontSize:28,fontWeight:800,color:"rgba(239,229,204,.22)",transform:"translateY(-8px)"}}>{fmt(prior1)}</div>}
    </div>
    <div style={{position:"relative",width:520,height:4,background:"rgba(239,229,204,.10)",borderRadius:3,overflow:"visible"}}>
      <div style={{position:"absolute",left:0,top:0,height:4,width:(100-filter*94)+"%",background:"linear-gradient(90deg,"+CYAN+","+GOLD2+","+ORANGE+")",borderRadius:3,boxShadow:"0 0 12px rgba(242,184,94,.28)"}}/>
      {[0,.62,.94].map((x,i)=><div key={i} style={{position:"absolute",left:(x*100)+"%",top:-5,width:2,height:14,background:"rgba(239,229,204,.28)"}}/>)}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",width:520,marginTop:11,fontSize:15,color:"rgba(239,229,204,.38)"}}>
      <span>10,000+</span><span>100</span><span>1</span>
    </div>
    <div style={{marginTop:16,fontSize:22,color:"rgba(239,229,204,.55)"}}>
      {f<88?"信息仍在涌入":f<142?"大量内容开始失焦、退出":f<176?"注意通道继续收窄":"最终只有极少数真正进入意识"}
    </div>
  </div>;
};

const HeroTypography:React.FC<{f:number;fade:number}>=({f,fade})=>{
  const p=intro(f,24,28)*(1-fade);
  return <div style={{position:"absolute",left:96,top:76,width:650,zIndex:100,opacity:p,transform:"translateY("+((1-p)*20)+"px)"}}>
    <div style={{fontSize:19,letterSpacing:5,color:"rgba(91,196,212,.58)",marginBottom:9}}>ATTENTION / SIGNAL SELECTION</div>
    <div style={{fontSize:88,fontWeight:900,letterSpacing:-6,lineHeight:1,color:GOLD2,textShadow:"0 0 24px rgba(255,122,73,.28),0 16px 50px rgba(0,0,0,.42)"}}>注意力</div>
    <div style={{fontSize:27,lineHeight:1.48,marginTop:18,color:"rgba(239,229,204,.76)",letterSpacing:.2}}>
      每天有<span style={{color:ORANGE,fontWeight:900}}>海量信息</span>从你身边掠过，<br/>
      只有<span style={{color:GOLD2,fontWeight:900}}>极少数</span>被层层筛选，真正进入你的意识。
    </div>
  </div>;
};

export const V3Scene0:React.FC=()=>{
  const f=useCurrentFrame();
  const stream=phase(f,0,78);
  const filter=phase(f,88,180);
  const portal=phase(f,190,239);
  const fade=phase(f,198,239);
  const camScale=interpolate(f,[0,70,150,239],[1.08,1.02,1.0,1.34],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const camX=interpolate(f,[0,145,239],[28,0,-185],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const impactEvents=[
    {at:68,amp:1.00},
    {at:88,amp:.52},
    {at:142,amp:.88},
    {at:176,amp:1.12},
  ];
  const kickX=impactEvents.reduce((sum,e)=>{
    const d=f-e.at;
    if(d<0||d>18)return sum;
    const env=Math.exp(-d/5.2);
    return sum+(Math.sin((d+.35)*2.08)+Math.sin((d+.7)*.82)*.28)*env*e.amp;
  },0);
  const kickY=impactEvents.reduce((sum,e)=>{
    const d=f-e.at;
    if(d<0||d>18)return sum;
    const env=Math.exp(-d/5.8);
    return sum+(Math.cos((d+.25)*1.77)-.36*Math.sin(d*.94))*env*e.amp;
  },0);
  const impactPeak=impactEvents.reduce((m,e)=>{
    const d=f-e.at;
    if(d<0||d>14)return m;
    return Math.max(m,Math.exp(-d/4.4)*e.amp);
  },0);
  const midX=kickX*13.5;
  const midY=kickY*6.2;
  const farX=kickX*3.2;
  const farY=kickY*1.7;
  const nearX=kickX*5.4;
  const nearY=kickY*2.7;
  const impactZoom=1+impactPeak*.0065;
  const tilt=kickX*.16;

  return <Stage warm bokeh={false}>
    <div style={{position:"absolute",inset:-18,background:"radial-gradient(circle at 77% 52%,rgba(55,28,17,.54),transparent 30%),radial-gradient(circle at 40% 40%,#0E1A20 0%,#070B0F 42%,#020304 100%)",
      transform:"translate("+farX+"px,"+farY+"px) scale("+(1+impactPeak*.0025)+")"}}/>
    <div style={{position:"absolute",inset:0,transform:"translate("+(camX+midX)+"px,"+midY+"px) scale("+(camScale*impactZoom)+") rotateZ("+tilt+"deg)",transformOrigin:"72% 52%",perspective:1250,transformStyle:"preserve-3d"}}>
      <div style={{position:"absolute",inset:0,transform:"translate("+(-kickX*2.4)+"px,"+(-kickY*1.2)+"px) translateZ(-34px)"}}>
        <FlowTrails filter={filter} portal={portal}/>
      </div>
      <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d",transform:"translate("+nearX+"px,"+nearY+"px) translateZ(30px)"}}>
        {Array.from({length:44}).map((_,i)=><InfoTile key={i} i={i} stream={stream} filter={filter} portal={portal}/>)}
      </div>
      <div style={{position:"absolute",left:190,top:350,width:810,height:470,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(3,5,7,.72),rgba(3,5,7,.15) 58%,transparent 78%)",pointerEvents:"none",
        transform:"translate("+(-kickX*1.8)+"px,"+(-kickY*.8)+"px) translateZ(-18px)"}}/>
      <div style={{position:"absolute",inset:0,transform:"translate("+(kickX*2.1)+"px,"+(kickY*1.1)+"px) translateZ(18px)"}}>
        <HeadCore x={1490+portal*125} y={565} scale={.86} opacity={.30+.70*stream} portal={portal}/>
      </div>
      <div style={{position:"absolute",inset:0,transform:"translate("+(-midX*.66)+"px,"+(-midY*.62)+"px) scale("+(1+impactPeak*.0035)+")",transformOrigin:"31% 56%"}}>
        <SelectionCounter f={f}/>
      </div>
      <ImpactRipple f={f} events={[68,88,142,176]} x={590} y={600} color={GOLD2} maxR={300}/>
      <ScreenPulse f={f} events={[68,142,176]}/>
    </div>
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:117,opacity:impactPeak*.92,mixBlendMode:"screen",
      background:"radial-gradient(circle at 31% 56%,rgba(255,246,222,.20) 0 2%,rgba(255,122,73,.12) 10%,transparent 25%)"}}/>
    <HeroTypography f={f} fade={fade}/>
    <div style={{position:"absolute",left:96,bottom:78,zIndex:120,opacity:1-fade}}>
      <div style={{width:56,height:2,background:"linear-gradient(90deg,"+ORANGE+","+GOLD2+")",marginBottom:18}}/>
      <div style={{fontSize:27,color:"rgba(239,229,204,.62)"}}>绝大多数信息，只是路过。</div>
    </div>
    <div style={{position:"absolute",inset:0,boxShadow:"inset 0 0 "+(220+impactPeak*75)+"px "+(80+impactPeak*16)+"px rgba(0,0,0,"+(.84-impactPeak*.09)+")",pointerEvents:"none"}}/>
  </Stage>;
};

const CounterSurge:React.FC<{f:number;collapse:number}>=({f,collapse})=>{
  const value=surgeValue(f);
  const prior1=surgeValue(Math.max(0,f-3));
  const prior2=surgeValue(Math.max(0,f-6));
  const milestone=[30,51,73,96,121].reduce((m,t)=>Math.max(m,1-clamp(Math.abs(f-t)/7)),0);
  const p=intro(f,6,18);
  const kick=1+milestone*.065;
  return <div style={{position:"absolute",left:680,top:575,zIndex:90,opacity:p*(1-collapse),transform:"translate(-50%,-50%) scale("+(1-collapse*.66)+")"}}>
    <div style={{fontSize:18,letterSpacing:5,color:"rgba(91,196,212,.58)",marginBottom:12}}>LIVE INPUT / COUNTING</div>
    <div style={{position:"relative",height:178,minWidth:720}}>
      <div style={{position:"absolute",left:0,top:40,fontSize:142,fontWeight:900,letterSpacing:-8,fontVariantNumeric:"tabular-nums",color:CREAM,
        transform:"scale("+kick+")",transformOrigin:"left center",textShadow:"0 0 32px rgba(255,122,73,.40),0 22px 70px rgba(0,0,0,.55)"}}>{fmt(value)}</div>
      <div style={{position:"absolute",left:4,top:7,fontSize:26,fontWeight:800,color:"rgba(239,229,204,.12)"}}>{fmt(prior2)}</div>
      <div style={{position:"absolute",left:4,top:22,fontSize:31,fontWeight:800,color:"rgba(239,229,204,.20)"}}>{fmt(prior1)}</div>
    </div>
    <div style={{fontSize:26,fontWeight:900,color:ORANGE,letterSpacing:3}}>INPUT SURGE · ACCELERATING</div>
  </div>;
};

const FunnelParticles:React.FC<{p:number;collapse:number}>=({p,collapse})=>{
  return <>{Array.from({length:150}).map((_,i)=>{
    const x0=-110+hash(i,1)*1050;
    const y0=140+hash(i,2)*820;
    const keep=i%39===0||i%61===0;
    const delay=hash(i,4)*.28;
    const q=smoother(clamp((p-delay)/(.72)));
    const gateX=1050+(i%11-5)*6;
    const gateY=545+(i%13-6)*5;
    const x1=lerp(x0,gateX,q),y1=lerp(y0,gateY,q);
    const c=smoother(clamp((collapse-hash(i,5)*.18)/.82));
    const x=lerp(x1,1150,c);
    const y=lerp(y1,545,c);
    const s=2+hash(i,3)*7;
    return <div key={i} style={{position:"absolute",left:x,top:y,width:s,height:s,borderRadius:"50%",
      background:keep?GOLD2:(i%7===0?CYAN:"rgba(239,229,204,.46)"),
      opacity:keep?.95:.15+.68*(1-c),boxShadow:keep?"0 0 16px "+GOLD2:"none"}}/>;
  })}</>;
};

const LockTen:React.FC<{show:number;portal:number}>=({show,portal})=>{
  const f=useCurrentFrame();
  const p=smoother(show);
  const kick=interpolate(show,[0,.22,.48,1],[.65,1.22,.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const ringScale=1+portal*3.7;
  return <div style={{position:"absolute",inset:0,zIndex:120,pointerEvents:"none"}}>
    <div style={{position:"absolute",left:865,top:552,transform:"translate(-50%,-50%) scale("+(p*kick)+")",fontSize:330,fontWeight:900,color:GOLD2,textShadow:"0 0 34px "+ORANGE+",0 0 88px rgba(255,122,73,.48)",opacity:p*(1-portal*.55)}}>1</div>
    <div style={{position:"absolute",left:1075+portal*135,top:552,width:300*ringScale,height:300*ringScale,transform:"translate(-50%,-50%)",borderRadius:"50%",
      border:"17px solid "+GOLD2,opacity:p,background:"radial-gradient(circle,rgba(255,246,225,.95) 0 2%,rgba(255,122,73,.28) 8%,rgba(5,8,10,.96) 35%,#020304 70%)",
      boxShadow:"0 0 "+(58+portal*90)+"px "+ORANGE+"99,inset 0 0 "+(42+portal*88)+"px rgba(255,122,73,.4)"}}>
      {Array.from({length:7}).map((_,i)=>{
        const size=(340+i*66)*ringScale;
        return <div key={i} style={{position:"absolute",left:"50%",top:"50%",width:size,height:size,marginLeft:-size/2,marginTop:-size/2,borderRadius:"50%",
          border:(i===0?4:2)+"px "+(i%2?"dashed":"solid")+" rgba(242,184,94,"+(.46-i*.04)+")",transform:"rotate("+(f*(i%2?-.48:.38)+i*24)+"deg) scaleY("+(.44+i*.042)+")"}}/>;
      })}
    </div>
  </div>;
};

export const V3Scene1:React.FC=()=>{
  const f=useCurrentFrame();
  const input=phase(f,4,120);
  const collapse=phase(f,106,168);
  const lock=phase(f,150,193);
  const portal=phase(f,188,239);
  const aperture=interpolate(f,[0,95,165],[260,142,54],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const milestoneShake=[30,51,73,96,121,160].reduce((m,e)=>{const d=f-e;return d>=0&&d<10?Math.max(m,(1-d/10)):m;},0);
  const shakeAmp=(f>156&&f<167?interpolate(f,[156,167],[9,0]):0)+milestoneShake*5;
  const sx=Math.sin(f*2.7)*shakeAmp,sy=Math.cos(f*2.2)*shakeAmp*.55;
  return <Stage bokeh={false}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 58% 50%,#172225 0%,#070A0C 40%,#020304 100%)"}}/>
    <Kicker>INPUT / COMPRESSION</Kicker>
    <div style={{position:"absolute",inset:0,transform:"translate("+sx+"px,"+sy+"px) scale("+(1+portal*.32)+")",transformOrigin:"57% 51%"}}>
      <FunnelParticles p={input} collapse={collapse}/>
      <svg width={W} height={H} style={{position:"absolute",inset:0}}>
        {Array.from({length:16}).map((_,i)=>{
          const sy0=90+hash(i,2)*900;
          const d="M -40 "+sy0+" C 350 "+(180+hash(i,4)*690)+", 690 "+(360+hash(i,5)*390)+", 1050 545";
          const col=i%5===0?CYAN:i%3===0?ORANGE:GOLD2;
          return <path key={i} d={d} fill="none" stroke={col} strokeOpacity={.05+hash(i,7)*.15} strokeWidth={.8+hash(i,8)*1.4}
            strokeDasharray={(24+hash(i,6)*78)+" "+(18+hash(i,9)*70)} strokeDashoffset={-f*(5+hash(i,10)*8)}/>;
        })}
      </svg>
      <div style={{position:"absolute",left:1050-aperture,top:545-aperture,width:aperture*2,height:aperture*2,borderRadius:"50%",
        border:"5px solid rgba(242,184,94,.75)",boxShadow:"0 0 65px rgba(242,184,94,.18),inset 0 0 48px rgba(242,184,94,.12)"}}>
        {Array.from({length:9}).map((_,i)=><div key={i} style={{position:"absolute",left:"50%",top:"50%",width:aperture*2.25,height:2,marginLeft:-aperture*1.125,transformOrigin:"center",transform:"rotate("+(f*.42+i*40)+"deg)",background:"linear-gradient(90deg,transparent,rgba(242,184,94,.28),transparent)"}}/>)}
      </div>
      <CounterSurge f={f} collapse={collapse}/>
      <LockTen show={lock} portal={portal}/>
      <ImpactRipple f={f} events={[30,51,73,96,121,160]} x={f<145?680:1075} y={f<145?575:552} color={f<145?ORANGE:GOLD2} maxR={f<145?240:360}/>
      <ScreenPulse f={f} events={[121,160]}/>
    </div>
    <div style={{position:"absolute",right:98,top:118,width:650,opacity:intro(f,20,28)*(1-portal)}}>
      <div style={{fontSize:52,fontWeight:900,lineHeight:1.1}}>海量输入，<br/><span style={{color:GOLD2}}>不会变成海量意识。</span></div>
      <div style={{fontSize:27,lineHeight:1.55,color:"rgba(239,229,204,.55)",marginTop:20}}>数量一路暴涨，但真正能进入“此刻”的信号，会被不断压缩。</div>
    </div>
    <div style={{position:"absolute",left:100,bottom:74,fontSize:25,color:"rgba(239,229,204,.56)",opacity:1-portal}}>量级示意：≈ 10⁹ → ≈ 10 bit/s</div>
    <Source>Zheng & Meister, Neuron 113(2), 2025 · 高层行为吞吐量与感官输入的量级讨论</Source>
  </Stage>;
};
