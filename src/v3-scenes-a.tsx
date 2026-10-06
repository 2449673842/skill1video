import React from "react";
import {Easing,interpolate,useCurrentFrame} from "remotion";
import {
  Stage,Kicker,Caption,Source,GridFloor,
  GOLD,GOLD2,CREAM,TEAL,RED,
  hash,clamp,lerp,smooth,smoother,intro,W,H
} from "./v2-common";

const ORANGE="#FF7A49";
const CYAN="#5BC4D4";
const phase=(f:number,a:number,b:number)=>smooth(clamp((f-a)/(b-a)));

const Ripple:React.FC<{
  f:number;events:number[];x:number|((event:number)=>number);y:number|((event:number)=>number);
  color?:string;maxR?:number;layers?:number;duration?:number;
}>=({f,events,x,y,color=GOLD2,maxR=240,layers=4,duration=34})=>(
  <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:88}}>
    {events.flatMap((event,ei)=>Array.from({length:layers}).map((_,i)=>{
      const local=(f-event-i*4)/duration;
      if(local<0||local>1)return null;
      const p=smoother(clamp(local));
      const r=24+p*(maxR+i*34);
      const a=(1-p)*(.44-i*.065);
      const xx=typeof x==="function"?x(event):x;
      const yy=typeof y==="function"?y(event):y;
      return <div key={ei+"-"+i} style={{
        position:"absolute",left:xx,top:yy,width:r*2,height:r*2,
        transform:"translate(-50%,-50%) scaleY("+(1+.055*Math.sin(p*Math.PI)) +")",
        borderRadius:"50%",border:(i===0?3:2)+"px solid "+color,
        opacity:a,boxShadow:"0 0 "+(10+18*(1-p))+"px "+color+"44"
      }}/>;
    }))}
  </div>
);

const MicroShake:React.FC<{f:number;events:number[];children:React.ReactNode;strength?:number}>=({f,events,children,strength=7})=>{
  const peak=events.reduce((m,e)=>{
    const d=f-e;
    if(d<0||d>15)return m;
    return Math.max(m,Math.exp(-d/4.8));
  },0);
  const ox=events.reduce((sum,e)=>{
    const d=f-e;
    if(d<0||d>17)return sum;
    return sum+Math.sin((d+.25)*2.15)*Math.exp(-d/5.4);
  },0);
  const oy=events.reduce((sum,e)=>{
    const d=f-e;
    if(d<0||d>17)return sum;
    return sum+Math.cos((d+.55)*1.78)*Math.exp(-d/5.9);
  },0);
  const dx=ox*strength;
  const dy=oy*strength*.48;
  const rot=ox*strength*.018;
  return <div style={{position:"absolute",inset:-10,transform:"translate("+dx+"px,"+dy+"px) rotateZ("+rot+"deg) scale("+(1+peak*.0035)+")",
    transformOrigin:"50% 54%"}}>{children}</div>;
};

const FilterPlane:React.FC<{x:number;label:string;sub:string;accent:string;active:number;index:number}>=({x,label,sub,accent,active,index})=>{
  const glow=.18+.82*active;
  return <div style={{
    position:"absolute",left:x,top:535,width:235,height:510,
    transform:"translate(-50%,-50%) perspective(900px) rotateY("+(-12+index*7)+"deg) translateZ("+(active*34)+"px) scale("+(1+active*.032)+")",
    border:"1px solid rgba(242,184,94,"+(.22+active*.55)+")",borderRadius:22,
    background:"linear-gradient(160deg,rgba(242,184,94,"+(.02+active*.055)+"),rgba(91,196,212,.015))",
    boxShadow:"inset 0 0 45px rgba(242,184,94,"+(.02+active*.07)+"),0 0 "+(18+active*32)+"px rgba(242,184,94,"+(.02+active*.10)+")"
  }}>
    <div style={{position:"absolute",left:18,top:18,fontSize:17,fontWeight:900,letterSpacing:3,color:accent}}>{String(index+1).padStart(2,"0")}</div>
    <div style={{position:"absolute",left:18,bottom:62,fontSize:31,fontWeight:900,color:active>.5?CREAM:"rgba(239,229,204,.66)"}}>{label}</div>
    <div style={{position:"absolute",left:18,bottom:28,fontSize:17,color:"rgba(239,229,204,.38)"}}>{sub}</div>
    {Array.from({length:6}).map((_,i)=><div key={i} style={{
      position:"absolute",left:30+i*29,top:85+(i%2)*54,width:6+active*2,height:6+active*2,borderRadius:"50%",
      background:i%2?CYAN:GOLD2,opacity:.10+active*(.18+i*.04),boxShadow:active>.65?"0 0 12px "+accent:"none"
    }}/>)}
    <div style={{position:"absolute",left:0,right:0,top:"50%",height:1,background:"linear-gradient(90deg,transparent,rgba(242,184,94,"+(.10+active*.38)+"),transparent)"}}/>
  </div>;
};

const SignalTrail:React.FC<{x:number;y:number;strength:number}>=({x,y,strength})=>(
  <svg width={W} height={H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>
    <path d={"M 140 620 C 400 720, "+(x-190)+" "+(y+90)+", "+x+" "+y} fill="none"
      stroke={GOLD2} strokeWidth={3+strength*4} strokeOpacity={.16+strength*.62}
      strokeDasharray="20 16" style={{filter:"drop-shadow(0 0 9px rgba(242,184,94,.42))"}}/>
  </svg>
);

export const V3Scene2:React.FC=()=>{
  const f=useCurrentFrame();
  const gates=[
    {x:620,label:"感官",sub:"先被感知",accent:CYAN,cross:58},
    {x:900,label:"目标",sub:"与当前任务有关",accent:GOLD2,cross:104},
    {x:1180,label:"显著性",sub:"足够突出",accent:ORANGE,cross:150},
    {x:1450,label:"经验",sub:"与你的过去相连",accent:TEAL,cross:196},
  ];
  const x=interpolate(f,[0,38,210,239],[1210,410,1540,1660],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const y=545+Math.sin(f*.035)*58-interpolate(f,[0,239],[0,34],{extrapolateRight:"clamp"});
  const strength=.75+.25*Math.sin(f*.11);
  const inherited=1-phase(f,0,34);
  const title=intro(f,14,28);
  const distractors=["消息","广告","疼痛","音乐","价格","气味","人脸","声音","风险","机会","通知","回忆"];
  const gateEvents=gates.map(g=>g.cross);

  return <Stage bokeh={false}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 62% 49%,rgba(40,31,18,.34),transparent 34%),radial-gradient(circle at 34% 42%,#102027 0%,#070B0E 42%,#020304 100%)"}}/>
    <Kicker>FILTERS / LAYERED PRIORITY</Kicker>
    <MicroShake f={f} events={gateEvents} strength={8}>
      <div style={{position:"absolute",left:1210,top:552,width:290,height:290,transform:"translate(-50%,-50%) scale("+(1+inherited*.24)+")",borderRadius:"50%",
        border:"12px solid rgba(242,184,94,"+(.72*inherited)+")",opacity:inherited,
        boxShadow:"0 0 70px rgba(255,122,73,.40),inset 0 0 48px rgba(255,122,73,.22)"}}/>
      <GridFloor opacity={.12} horizon={420}/>
      {gates.map((g,i)=>{
        const a=1-clamp(Math.abs(f-g.cross)/26);
        return <FilterPlane key={g.label} x={g.x} label={g.label} sub={g.sub} accent={g.accent} active={a} index={i}/>;
      })}
      <SignalTrail x={x} y={y} strength={strength}/>
      {distractors.map((w,i)=>{
        const q=smoother(clamp((f-i*5)/160));
        const bx=140+hash(i,1)*520;
        const by=330+hash(i,2)*510;
        const failGate=i%4;
        const stopX=gates[failGate].x-95-hash(i,4)*80;
        const xx=lerp(bx,stopX,q);
        const yy=lerp(by,500+(hash(i,5)-.5)*420,q);
        const vanish=smoother(clamp((f-(56+failGate*44+i%3*5))/28));
        return <div key={w} style={{position:"absolute",left:xx,top:yy,fontSize:20+hash(i,6)*11,fontWeight:750,
          color:i%5===0?CYAN:"rgba(239,229,204,.52)",opacity:(.22+.68*q)*(1-vanish*.88),
          transform:"translate(-50%,-50%) scale("+(1-vanish*.18)+")",filter:"blur("+(vanish*4)+"px)"}}>{w}</div>;
      })}
      <div style={{position:"absolute",left:x,top:y,width:36,height:36,transform:"translate(-50%,-50%)",borderRadius:"50%",
        background:"radial-gradient(circle at 35% 30%,#FFF2D2,"+GOLD2+" 38%,#76501E 100%)",
        boxShadow:"0 0 26px "+GOLD2+",0 0 72px rgba(242,184,94,.30)"}}>
        <div style={{position:"absolute",left:"50%",top:"50%",width:66+8*Math.sin(f*.14),height:66+8*Math.sin(f*.14),transform:"translate(-50%,-50%)",borderRadius:"50%",border:"1px solid rgba(242,184,94,.28)"}}/>
      </div>
      <Ripple f={f} events={gateEvents} x={e=>gates.find(g=>g.cross===e)?.x||0} y={545} color={GOLD2} maxR={175} layers={3} duration={30}/>
    </MicroShake>
    <div style={{position:"absolute",left:92,top:106,width:710,opacity:title,transform:"translateY("+((1-title)*22)+"px)"}}>
      <div style={{fontSize:53,fontWeight:900,lineHeight:1.12}}>信息不是被动进入。</div>
      <div style={{fontSize:53,fontWeight:900,lineHeight:1.12,color:GOLD2,marginTop:6}}>它要穿过一层层优先级。</div>
      <div style={{fontSize:25,lineHeight:1.55,color:"rgba(239,229,204,.48)",marginTop:22,width:600}}>每经过一道门，很多信号会变暗、偏离或消失；留下来的那一个，才继续向前。</div>
    </div>
    <Caption>同一个信号，在不同目标、环境和经验里，会得到完全不同的优先级。</Caption>
  </Stage>;
};

const Person:React.FC<{x:number;y:number;selected?:boolean;red?:boolean;scale?:number;opacity?:number}>=({x,y,selected=false,red=false,scale=1,opacity=1})=>{
  const color=red?RED:selected?GOLD2:"rgba(239,229,204,.32)";
  return <div style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%) scale("+scale+")",opacity}}>
    <div style={{width:26,height:26,borderRadius:"50%",background:color,boxShadow:selected?"0 0 25px "+GOLD2:red?"0 0 20px rgba(216,88,73,.34)":"none"}}/>
    <div style={{width:18,height:34,margin:"-1px auto 0",borderRadius:"8px 8px 5px 5px",background:color}}/>
  </div>;
};

const Reticle:React.FC<{x:number;y:number;r:number;opacity?:number;accent?:string}>=({x,y,r,opacity=1,accent=GOLD2})=>{
  const f=useCurrentFrame();
  const breathe=1+.045*Math.sin(f*.15);
  return <div style={{position:"absolute",left:x,top:y,width:r*2,height:r*2,transform:"translate(-50%,-50%) scale("+breathe+")",borderRadius:"50%",
    border:"2px solid "+accent,opacity,boxShadow:"0 0 24px "+accent+"33"}}>
    {[0,90,180,270].map(a=><div key={a} style={{position:"absolute",left:"50%",top:"50%",width:r+26,height:2,transformOrigin:"0 50%",transform:"rotate("+a+"deg)",background:"linear-gradient(90deg,"+accent+",transparent 65%)"}}/>)}
  </div>;
};

export const V3Scene3:React.FC=()=>{
  const f=useCurrentFrame();
  const reveal=phase(f,154,184);
  const tx=interpolate(f,[0,58,115,170,239],[520,820,1080,1350,1510],{extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const ty=interpolate(f,[0,58,115,170,239],[470,650,455,620,500],{extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const unexpectedX=interpolate(f,[38,150],[1840,360],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const count=f<55?0:f<105?1:f<155?2:3;
  const crowd=Array.from({length:7*12});
  const rippleEvent=[168];
  const rd=f-168;
  const revealPeak=rd>=0&&rd<=16?Math.exp(-rd/5.2):0;
  const revealOsc=rd>=0&&rd<=18?Math.sin((rd+.35)*2.05)*Math.exp(-rd/5.8):0;
  const crowdX=revealOsc*10.5;
  const crowdY=(rd>=0&&rd<=18?Math.cos((rd+.5)*1.72)*Math.exp(-rd/6.2):0)*4.4;

  return <Stage warm bokeh={false}>
    <div style={{position:"absolute",inset:-12,background:"radial-gradient(circle at 55% 52%,rgba(30,39,37,.42),transparent 36%),linear-gradient(180deg,#090D0F,#030405)",
      transform:"translate("+(-crowdX*.16)+"px,"+(-crowdY*.12)+"px) scale("+(1+revealPeak*.002)+")"}}/>
    <Kicker>INATTENTIONAL BLINDNESS / PARTICIPATE</Kicker>
    <GridFloor opacity={.18} horizon={400}/>
    <div style={{position:"absolute",inset:0,transform:"translate("+crowdX+"px,"+crowdY+"px) scale("+(1+revealPeak*.0045)+")",transformOrigin:"40% 52%"}}>
      {crowd.map((_,i)=>{
        const r=Math.floor(i/12),cc=i%12;
        const yy=410+r*77;
        const persp=.62+r*.072;
        const xx=250+(cc-5.5)*123*(.82+r*.035);
        const selected=(r===3&&cc===5);
        if(selected)return null;
        const dim=1-reveal*.58;
        return <Person key={i} x={xx} y={yy} scale={persp} opacity={dim}/>;
      })}
      <Person x={tx} y={ty} selected scale={.96}/>
      <Reticle x={tx} y={ty} r={66} opacity={1-reveal*.72}/>
    </div>
    <div style={{position:"absolute",inset:0,transform:"translate("+(-crowdX*.48)+"px,"+(-crowdY*.38)+"px)"}}>
      <Person x={unexpectedX} y={555} red scale={1.28+revealPeak*.18} opacity={.36+.64*reveal}/>
      <Ripple f={f} events={rippleEvent} x={360} y={555} color={RED} maxR={310} layers={4} duration={38}/>
    </div>
    <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:revealPeak*.86,mixBlendMode:"screen",
      background:"radial-gradient(circle at 19% 51%,rgba(255,231,219,.22) 0 2%,rgba(216,88,73,.14) 9%,transparent 24%)"}}/>
    <div style={{position:"absolute",left:92,top:100,width:760}}>
      <div style={{fontSize:50,fontWeight:900}}>只盯住<span style={{color:GOLD2}}>金色的人</span>。</div>
      <div style={{fontSize:28,color:"rgba(239,229,204,.48)",marginTop:12}}>数一数，他一共完成了几次明显移动。</div>
    </div>
    <div style={{position:"absolute",right:105,top:116,width:290,textAlign:"right"}}>
      <div style={{fontSize:17,letterSpacing:4,color:"rgba(239,229,204,.36)"}}>MOVE COUNT</div>
      <div style={{fontSize:112,fontWeight:900,color:GOLD2,lineHeight:1,marginTop:4,fontVariantNumeric:"tabular-nums"}}>{count}</div>
    </div>
    {reveal>.12&&<div style={{position:"absolute",left:965,top:285,width:760,opacity:reveal,transform:"translate(-50%,-50%) scale("+(1+revealPeak*.055+.02*Math.sin(f*.18)) +")",textAlign:"center"}}>
      <div style={{fontSize:54,fontWeight:900,color:RED,textShadow:"0 0 25px rgba(216,88,73,.30)"}}>刚才那个红色的人，你看见了吗？</div>
      <div style={{fontSize:25,color:"rgba(239,229,204,.54)",marginTop:14}}>他一直从画面里经过，但你的任务把焦点锁在了别处。</div>
    </div>}
    <Caption>当注意被任务占满时，显眼的东西也可能没有真正进入你的“此刻”。</Caption>
    <Source>Simons & Chabris, Perception 28, 1999 · 注意盲视经典范式</Source>
  </Stage>;
};

const PriorityNode:React.FC<{x:number;y:number;label:string;sub:string;active:number;accent:string}>=({x,y,label,sub,active,accent})=>{
  const s=1+active*.16;
  return <div style={{position:"absolute",left:x,top:y,width:220,height:116,transform:"translate(-50%,-50%) scale("+s+")",borderRadius:16,
    border:"1px solid "+accent+(active>.5?"B8":"38"),background:"linear-gradient(145deg,rgba(14,21,24,.94),rgba(6,9,11,.90))",
    opacity:.38+active*.62,boxShadow:active>.5?"0 0 36px "+accent+"3D,0 22px 60px rgba(0,0,0,.34)":"0 18px 48px rgba(0,0,0,.24)"}}>
    <div style={{position:"absolute",left:18,top:17,fontSize:27,fontWeight:900,color:active>.45?accent:CREAM}}>{label}</div>
    <div style={{position:"absolute",left:18,bottom:18,fontSize:16,color:"rgba(239,229,204,.40)"}}>{sub}</div>
    <div style={{position:"absolute",right:18,top:20,width:26,height:26,borderRadius:"50%",background:accent,opacity:.22+active*.65,boxShadow:active>.5?"0 0 18px "+accent:"none"}}/>
  </div>;
};

export const V3Scene4:React.FC=()=>{
  const f=useCurrentFrame();
  const nodes=[
    {label:"工作",sub:"未完成目标",x:390,y:405,accent:GOLD2},
    {label:"朋友",sub:"熟悉的人脸",x:690,y:320,accent:CYAN},
    {label:"危险",sub:"高优先级警报",x:1080,y:390,accent:RED},
    {label:"机会",sub:"与目标匹配",x:1455,y:335,accent:GOLD2},
    {label:"通知",sub:"即时打断",x:560,y:735,accent:ORANGE},
    {label:"新闻",sub:"新奇变化",x:1010,y:700,accent:CYAN},
    {label:"价格",sub:"正在比较",x:1450,y:730,accent:GOLD2},
  ];
  const cycle=34;
  const seg=Math.floor(f/cycle);
  const idx=Math.min(nodes.length-1,seg);
  const prev=Math.max(0,idx-1);
  const move=smoother(clamp(((f%cycle)-3)/22));
  const x=lerp(nodes[prev].x,nodes[idx].x,idx===0?1:move);
  const y=lerp(nodes[prev].y,nodes[idx].y,idx===0?1:move);
  const lockFrame=nodes.map((_,i)=>i*cycle+25).filter(v=>v<240);
  const lockPulse=lockFrame.reduce((m,e)=>{const d=f-e;return d>=0&&d<22?Math.max(m,1-d/22):m;},0);
  const coneAngle=Math.atan2(y-555,x-960)*180/Math.PI;
  const dist=Math.sqrt((x-960)*(x-960)+(y-555)*(y-555));

  return <Stage bokeh={false}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 52%,rgba(40,32,18,.38),transparent 30%),#040608"}}/>
    <Kicker>PRIORITY MAP / SEARCHLIGHT</Kicker>
    {nodes.map((n,i)=>{
      const a=i===idx?1:Math.max(0,.25-Math.abs(i-idx)*.05);
      return <PriorityNode key={n.label} {...n} active={a}/>;
    })}
    <div style={{position:"absolute",left:960,top:555,width:34,height:34,borderRadius:"50%",transform:"translate(-50%,-50%)",
      background:GOLD2,boxShadow:"0 0 55px 18px rgba(242,184,94,.24)"}}/>
    <div style={{position:"absolute",left:960,top:554,width:dist,height:120,transformOrigin:"0 50%",transform:"rotate("+coneAngle+"deg) translateY(-60px)",
      clipPath:"polygon(0 44%,100% 0,100% 100%,0 56%)",background:"linear-gradient(90deg,rgba(242,184,94,.20),rgba(242,184,94,.035))",opacity:.52}}/>
    <Reticle x={x} y={y} r={88+lockPulse*18} accent={nodes[idx].accent}/>
    <Ripple f={f} events={lockFrame} x={e=>nodes[Math.min(nodes.length-1,Math.floor(e/cycle))].x} y={e=>nodes[Math.min(nodes.length-1,Math.floor(e/cycle))].y} color={nodes[idx].accent} maxR={170} layers={3} duration={26}/>
    <div style={{position:"absolute",left:95,top:105,width:760}}>
      <div style={{fontSize:54,fontWeight:900,lineHeight:1.1}}>你在寻找什么，</div>
      <div style={{fontSize:54,fontWeight:900,lineHeight:1.1,color:GOLD2,marginTop:6}}>什么就更容易跳出来。</div>
      <div style={{fontSize:25,color:"rgba(239,229,204,.46)",lineHeight:1.55,marginTop:20,width:600}}>搜索灯没有让世界改变，它只是不断重新分配“谁更值得被看见”。</div>
    </div>
    <Caption>注意力像探照灯：照亮一个目标，也会让周围其他信息退到暗处。</Caption>
  </Stage>;
};
