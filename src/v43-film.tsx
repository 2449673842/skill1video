import React from "react";
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 120;

const BG = "#050709";
const CREAM = "#EFE5CC";
const GOLD = "#D9B26F";
const GOLD2 = "#F0D79A";
const TEAL = "#66B9AA";
const CYAN = "#5BC4D4";
const RED = "#D85849";
const ORANGE = "#F28A52";
const INK = "#151411";
const PAPER = "#F3E9D1";
const FONT = "'Noto Sans CJK SC','Noto Serif CJK SC','Microsoft YaHei',sans-serif";

const clamp = (v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix = (a:number,b:number,t:number)=>a+(b-a)*t;
const smooth = (v:number)=>{const x=clamp(v);return x*x*(3-2*x);};
const smoother = (v:number)=>{const x=clamp(v);return x*x*x*(x*(x*6-15)+10);};
const phase = (t:number,a:number,b:number)=>smoother((t-a)/(b-a));
const fade = (t:number,a:number,b:number,fi=.55,fo=.55)=>Math.min(phase(t,a,a+fi),1-phase(t,b-fo,b));
const piece = (t:number, times:number[], values:number[])=>{
  if(t<=times[0]) return values[0];
  if(t>=times[times.length-1]) return values[values.length-1];
  for(let i=0;i<times.length-1;i++){
    if(t>=times[i]&&t<=times[i+1]){
      return mix(values[i],values[i+1],smoother((t-times[i])/(times[i+1]-times[i])));
    }
  }
  return values[values.length-1];
};
const cubic=(p0:number,p1:number,p2:number,p3:number,u:number)=>{
  const a=1-u;
  return a*a*a*p0+3*a*a*u*p1+3*a*u*u*p2+u*u*u*p3;
};

const StaticTexture:React.FC<{paper?:boolean}>=({paper=false})=>(
  <AbsoluteFill style={{
    pointerEvents:"none",
    opacity:paper?.12:.08,
    backgroundImage:paper
      ?"repeating-linear-gradient(0deg,rgba(80,54,25,.12) 0 1px,transparent 1px 7px)"
      :"radial-gradient(circle,rgba(255,255,255,.17) 0 .65px,transparent .8px)",
    backgroundSize:paper?"100% 7px":"14px 14px"
  }}/>
);

const Base:React.FC<{paper?:boolean;warm?:boolean;children:React.ReactNode}>=({paper=false,warm=false,children})=>(
  <AbsoluteFill style={{
    fontFamily:FONT,
    color:paper?INK:CREAM,
    overflow:"hidden",
    background:paper
      ?"radial-gradient(circle at 46% 38%,#FBF5E4 0%,#F0E2C6 58%,#D6C4A1 120%)"
      :warm
        ?"radial-gradient(circle at 52% 43%,#1A130D 0%,#0B0B0B 46%,#030405 100%)"
        :"radial-gradient(circle at 52% 43%,#0F171A 0%,#080A0C 44%,#020304 100%)"
  }}>
    <StaticTexture paper={paper}/>
    {children}
    {!paper&&<AbsoluteFill style={{pointerEvents:"none",boxShadow:"inset 0 0 210px 70px rgba(0,0,0,.92)"}}/>}
  </AbsoluteFill>
);

const Kicker:React.FC<{children:React.ReactNode;paper?:boolean}>=({children,paper=false})=>(
  <div style={{position:"absolute",left:74,top:52,fontSize:17,fontWeight:800,letterSpacing:3.4,
    color:paper?"rgba(20,18,14,.42)":"rgba(217,178,111,.64)"}}>{children}</div>
);

const Caption:React.FC<{children:React.ReactNode;paper?:boolean;opacity?:number}>=({children,paper=false,opacity=1})=>(
  <div style={{position:"absolute",left:160,right:160,bottom:70,textAlign:"center",fontSize:31,fontWeight:650,
    lineHeight:1.45,letterSpacing:.2,color:paper?"rgba(20,18,14,.74)":"rgba(239,229,204,.80)",opacity}}>{children}</div>
);

const TitleBlock:React.FC<{t:number;start:number;title:string;accent:string;body?:string;paper?:boolean;x?:number;y?:number;width?:number}>=(
  {t,start,title,accent,body,paper=false,x=94,y=118,width=760}
)=>{
  const p=phase(t,start,start+.65);
  return <div style={{position:"absolute",left:x,top:y,width,opacity:p,transform:`translateY(${(1-p)*16}px)`}}>
    <div style={{fontSize:54,lineHeight:1.1,fontWeight:950,letterSpacing:-1.5,color:paper?INK:CREAM}}>{title}</div>
    <div style={{width:88,height:4,borderRadius:3,background:accent,marginTop:18,opacity:.82}}/>
    {body&&<div style={{fontSize:24,lineHeight:1.55,marginTop:18,color:paper?"rgba(20,18,14,.56)":"rgba(239,229,204,.48)"}}>{body}</div>}
  </div>;
};

const QuietBadge:React.FC<{t:number;start:number;end:number}>=({t,start,end})=>{
  const a=(t>=start&&t<=end)?1:0;
  return <div style={{position:"absolute",right:72,top:52,fontSize:14,letterSpacing:2.4,color:"rgba(239,229,204,.23)",opacity:a}}>HOLD / READ</div>;
};

const DistractorCards:React.FC<{t:number}>=({t})=>{
  const cards=[
    [250,330,"通知"],[520,280,"价格"],[820,350,"人脸"],[1220,300,"音乐"],[1540,390,"风险"],
    [320,700,"消息"],[650,760,"广告"],[1110,720,"气味"],[1480,690,"机会"],[1650,570,"疼痛"]
  ] as const;
  const enter=phase(t,.4,3.2);
  const dim=phase(t,6.7,8.5);
  return <>
    {cards.map((c,i)=>{
      const dx=(i%2===0?-1:1)*(1-enter)*(180+(i%3)*60);
      const dy=(1-enter)*(i%3===0?-130:90);
      return <div key={c[2]} style={{
        position:"absolute",left:c[0]+dx,top:c[1]+dy,width:170+(i%3)*22,height:86,
        transform:`translate(-50%,-50%) rotate(${(i%2?-5:4)}deg)`,
        border:"1px solid rgba(239,229,204,.12)",borderRadius:14,background:"rgba(12,16,18,.78)",
        boxShadow:"0 18px 48px rgba(0,0,0,.28)",opacity:enter*(.62-dim*.46)
      }}>
        <div style={{padding:"18px 18px 0",fontSize:24,fontWeight:850,color:"rgba(239,229,204,.62)"}}>{c[2]}</div>
        <div style={{margin:"11px 18px",height:4,width:"58%",background:"rgba(239,229,204,.10)",borderRadius:3}}/>
      </div>;
    })}
  </>;
};

const SignalCarrier:React.FC<{t:number}>=({t})=>{
  if(t<4||t>31.5)return null;
  if(t<20){
    const gateTimes=[8.5,10.5,12.7,14.9,17.2,18.5];
    const xs=[540,640,880,1140,1400,1540];
    const ys=[590,548,560,535,555,545];
    let x=piece(t,gateTimes,xs),y=piece(t,gateTimes,ys);
    const m=phase(t,18.5,20);
    x=mix(x,1000,m); y=mix(y,560,m);
    const w=mix(310,70,m),h=mix(170,70,m),r=mix(18,35,m);
    const selected=phase(t,4,5);
    return <div style={{
      position:"absolute",left:x,top:y,width:w,height:h,transform:"translate(-50%,-50%)",
      borderRadius:r,border:`2px solid rgba(240,215,154,${.52+.34*selected})`,
      background:`linear-gradient(145deg,rgba(20,26,27,${.96-.10*m}),rgba(7,9,10,.96))`,
      boxShadow:`0 0 ${24+selected*42}px rgba(217,178,111,${.14+.16*selected})`,
      overflow:"hidden",zIndex:20
    }}>
      <div style={{position:"absolute",inset:0,opacity:1-m}}>
        <div style={{padding:"28px 30px 0",fontSize:34,fontWeight:950,color:GOLD2}}>真正进入你此刻的那一个</div>
        <div style={{padding:"12px 30px",fontSize:20,color:"rgba(239,229,204,.42)"}}>被选中，不等于最重要，只是优先级更高。</div>
        <div style={{position:"absolute",left:30,right:30,bottom:25,height:5,borderRadius:3,background:"rgba(239,229,204,.08)"}}>
          <div style={{height:"100%",width:`${58+selected*34}%`,borderRadius:3,background:GOLD2}}/>
        </div>
      </div>
    </div>;
  }
  const times=[20,22.4,24.1,25.9,27.5,28.4,31.5];
  const xs=[1000,820,1120,910,1040,1040,1040];
  const ys=[560,470,650,480,570,570,570];
  const x=piece(t,times,xs),y=piece(t,times,ys);
  return <div style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%)",zIndex:25}}>
    <div style={{width:28,height:28,borderRadius:"50%",background:GOLD2,boxShadow:"0 0 24px rgba(240,215,154,.58)"}}/>
    <div style={{width:19,height:38,margin:"-2px auto 0",borderRadius:"9px 9px 5px 5px",background:GOLD2}}/>
    <div style={{position:"absolute",left:"50%",top:12,width:132,height:132,transform:"translate(-50%,-50%)",borderRadius:"50%",
      border:"2px solid rgba(240,215,154,.74)",boxShadow:"0 0 24px rgba(217,178,111,.14)"}}/>
  </div>;
};

const Beat0:React.FC<{t:number}>=({t})=>{
  const a=fade(t,0,8.8,.55,.7);
  return <AbsoluteFill style={{opacity:a}}>
    <Base>
      <Kicker>ATTENTION / INPUT</Kicker>
      <DistractorCards t={t}/>
      <TitleBlock t={t} start={.3} title="世界一直在说话。" accent={GOLD2}
        body="通知、价格、人脸、声音、风险、机会……它们同时抵达，但不会同时进入你的意识。"/>
      <Caption opacity={phase(t,3.8,4.8)}>注意力的第一步，不是理解，而是选择。</Caption>
    </Base>
  </AbsoluteFill>;
};

const Beat1:React.FC<{t:number}>=({t})=>{
  const a=fade(t,8.3,20.3,.65,.65);
  const gates=[
    {x:640,label:"感官",sub:"先被感知"},
    {x:880,label:"目标",sub:"与当前任务有关"},
    {x:1140,label:"显著性",sub:"足够突出"},
    {x:1400,label:"经验",sub:"与你过去相连"}
  ];
  const cx=t<8.5?540:piece(t,[8.5,10.5,12.7,14.9,17.2,18.5],[540,640,880,1140,1400,1540]);
  return <AbsoluteFill style={{opacity:a}}>
    <Base>
      <Kicker>FILTERS / PRIORITY</Kicker>
      <TitleBlock t={t} start={8.7} title="信息要穿过一层层优先级。" accent={CYAN}
        body="不是最响、最大、最新的东西一定被看见；目标、经验和情境会改变它的通行权。"/>
      {gates.map((g,i)=>{
        const active=clamp(1-Math.abs(cx-g.x)/125);
        return <div key={g.label} style={{position:"absolute",left:g.x,top:570,width:190,height:430,transform:"translate(-50%,-50%)",
          borderRadius:18,border:`1px solid rgba(91,196,212,${.18+active*.58})`,
          background:"linear-gradient(180deg,rgba(91,196,212,.025),rgba(217,178,111,.018))",
          boxShadow:active>.25?`0 0 ${18+active*36}px rgba(91,196,212,.13)`:"none"}}>
          <div style={{position:"absolute",left:18,top:18,fontSize:16,letterSpacing:2.4,color:CYAN}}>{String(i+1).padStart(2,"0")}</div>
          <div style={{position:"absolute",left:18,bottom:58,fontSize:29,fontWeight:900,color:active>.35?CREAM:"rgba(239,229,204,.54)"}}>{g.label}</div>
          <div style={{position:"absolute",left:18,bottom:27,fontSize:15,color:"rgba(239,229,204,.34)"}}>{g.sub}</div>
        </div>;
      })}
      <Caption opacity={phase(t,12.2,13.2)}>很多信号不是“被你忽略”，而是根本没有赢得继续处理的机会。</Caption>
    </Base>
  </AbsoluteFill>;
};

const CrowdPerson:React.FC<{x:number;y:number;red?:boolean;opacity?:number}>=({x,y,red=false,opacity=1})=>(
  <div style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%)",opacity}}>
    <div style={{width:25,height:25,borderRadius:"50%",background:red?RED:"rgba(239,229,204,.28)",boxShadow:red?"0 0 18px rgba(216,88,73,.36)":"none"}}/>
    <div style={{width:17,height:32,margin:"-1px auto 0",borderRadius:"8px 8px 4px 4px",background:red?RED:"rgba(239,229,204,.28)"}}/>
  </div>
);

const Beat2:React.FC<{t:number}>=({t})=>{
  const a=fade(t,19.7,31.5,.55,.12);
  const redMove=phase(t,22.5,26.7);
  const rx=mix(1760,360,redMove);
  const reveal=phase(t,26.9,27.6);
  const crowd=Array.from({length:72});
  return <AbsoluteFill style={{opacity:a}}>
    <Base>
      <Kicker>INATTENTIONAL BLINDNESS</Kicker>
      <TitleBlock t={t} start={20.2} title="专注，也会制造盲区。" accent={RED}
        body="当任务把注意资源占满，显眼的变化也可能没有进入你的“此刻”。"/>
      {crowd.map((_,i)=>{
        const r=Math.floor(i/12),c=i%12;
        const x=250+c*125+(r%2)*32,y=390+r*88;
        if(Math.abs(x-1040)<70&&Math.abs(y-570)<70)return null;
        return <CrowdPerson key={i} x={x} y={y} opacity={.95-reveal*.45}/>;
      })}
      <CrowdPerson x={rx} y={585} red opacity={.34+.66*phase(t,23,27.0)}/>
      {reveal>.02&&<div style={{position:"absolute",left:520,top:560,width:500,opacity:reveal}}>
        <div style={{fontSize:52,fontWeight:950,color:RED}}>刚才的红色人影，你看见了吗？</div>
        <div style={{fontSize:22,lineHeight:1.5,marginTop:14,color:"rgba(239,229,204,.52)"}}>他一直穿过画面。任务没有让他消失，只是让他没有成为你的主角。</div>
      </div>}
      <QuietBadge t={t} start={28.4} end={31.5}/>
      <Caption opacity={phase(t,27.3,28.0)}>真正的“看见”，是被注意系统允许进入工作区。</Caption>
      <div style={{position:"absolute",left:70,bottom:32,fontSize:16,color:"rgba(239,229,204,.28)"}}>Simons & Chabris, Perception 28, 1999</div>
    </Base>
  </AbsoluteFill>;
};

const SearchNode:React.FC<{x:number;y:number;label:string;active:number;color:string}>=({x,y,label,active,color})=>(
  <div style={{position:"absolute",left:x,top:y,width:220,height:108,transform:"translate(-50%,-50%)",borderRadius:16,
    border:`1px solid ${active>.4?color:"rgba(239,229,204,.10)"}`,
    background:"rgba(11,15,16,.88)",boxShadow:active>.4?`0 0 28px ${color}33`:"none",opacity:.44+active*.56}}>
    <div style={{padding:"19px 20px 0",fontSize:28,fontWeight:900,color:active>.4?color:CREAM}}>{label}</div>
    <div style={{margin:"12px 20px",height:4,borderRadius:2,width:`${44+active*38}%`,background:active>.4?color:"rgba(239,229,204,.10)"}}/>
  </div>
);

const SearchScene:React.FC<{t:number}>=({t})=>{
  const a=fade(t,31.5,42.25,.28,.45);
  const nodes=[
    {x:500,y:420,label:"朋友",color:CYAN},
    {x:760,y:690,label:"通知",color:ORANGE},
    {x:1040,y:360,label:"危险",color:RED},
    {x:1320,y:430,label:"工作",color:GOLD2},
    {x:1470,y:720,label:"价格",color:TEAL}
  ];
  const switchTimes=[31.8,34.0,36.6,39.1,42.0];
  const idx=t<34?0:t<36.6?1:t<39.1?2:3;
  const prev=Math.max(0,idx-1);
  const moveStart=switchTimes[idx],moveEnd=moveStart+.7;
  const q=phase(t,moveStart,moveEnd);
  const tx=mix(nodes[prev].x,nodes[idx].x,idx===0?1:q);
  const ty=mix(nodes[prev].y,nodes[idx].y,idx===0?1:q);
  const ex=960,ey=570;
  const dx=tx-ex,dy=ty-ey,len=Math.sqrt(dx*dx+dy*dy),ang=Math.atan2(dy,dx)*180/Math.PI;
  return <AbsoluteFill style={{opacity:a}}>
    <Base warm>
      <Kicker>SEARCHLIGHT / CURRENT GOAL</Kicker>
      <TitleBlock t={t} start={31.8} title="你在寻找什么，什么就更容易跳出来。" accent={GOLD2}
        body="注意不是让世界改变，而是让某些对象获得更高的可见性。"/>
      {nodes.map((n,i)=><SearchNode key={n.label} {...n} active={i===idx?1:.08}/>)}
      <div style={{position:"absolute",left:ex,top:ey,width:30,height:30,borderRadius:"50%",transform:"translate(-50%,-50%)",background:GOLD2,boxShadow:"0 0 45px rgba(240,215,154,.30)"}}/>
      <div style={{position:"absolute",left:ex,top:ey,width:len,height:120,transformOrigin:"0 50%",transform:`rotate(${ang}deg) translateY(-60px)`,
        clipPath:"polygon(0 45%,100% 0,100% 100%,0 55%)",background:"linear-gradient(90deg,rgba(240,215,154,.18),rgba(240,215,154,.025))"}}/>
      <div style={{position:"absolute",left:tx,top:ty,width:260,height:148,transform:"translate(-50%,-50%)",borderRadius:20,border:`2px solid ${nodes[idx].color}`,boxShadow:`0 0 26px ${nodes[idx].color}33`}}/>
      <QuietBadge t={t} start={40.0} end={42.0}/>
      <Caption opacity={phase(t,35.2,36.0)}>焦点改变以后，同一个环境会呈现出完全不同的“重要性地图”。</Caption>
    </Base>
  </AbsoluteFill>;
};

const AuctionWorkCarrier:React.FC<{t:number}>=({t})=>{
  if(t<38.7||t>66)return null;
  const toAuction=phase(t,41.8,44.2);
  const toWindow=phase(t,53.5,56.6);
  const x=mix(1320,960,toAuction);
  const y=mix(430,560,toAuction);
  const w=mix(mix(220,430,toAuction),820,toWindow);
  const h=mix(mix(108,235,toAuction),440,toWindow);
  const r=mix(16,20,toAuction);
  const win=toWindow;
  const settle=t>=63.5;
  return <div style={{position:"absolute",left:x,top:y,width:w,height:h,transform:"translate(-50%,-50%)",zIndex:30,
    borderRadius:r,border:`2px solid rgba(240,215,154,${.58+.20*(1-win)})`,
    background:win>.5?"rgba(12,16,17,.96)":"linear-gradient(145deg,rgba(22,27,27,.98),rgba(8,10,11,.96))",
    boxShadow:"0 28px 70px rgba(0,0,0,.34),0 0 30px rgba(217,178,111,.11)",overflow:"hidden"}}>
    {win<.8&&<div style={{position:"absolute",inset:0,opacity:1-win}}>
      <div style={{padding:"28px 30px 0",fontSize:38,fontWeight:950,color:GOLD2}}>{t<42.2?"工作":"当前目标"}</div>
      <div style={{padding:"12px 30px",fontSize:20,color:"rgba(239,229,204,.44)"}}>{t<48?"被探照灯选中":"资源正在向它倾斜"}</div>
      <div style={{position:"absolute",left:30,right:30,bottom:28,height:7,borderRadius:4,background:"rgba(239,229,204,.08)"}}>
        <div style={{height:"100%",width:`${mix(58,93,phase(t,44.5,50.5))}%`,borderRadius:4,background:GOLD2}}/>
      </div>
    </div>}
    {win>.05&&<div style={{position:"absolute",inset:0,opacity:win}}>
      <div style={{position:"absolute",left:28,top:24,fontSize:30,fontWeight:950,color:GOLD2}}>工作记忆 / 当前工作区</div>
      <div style={{position:"absolute",left:28,top:68,fontSize:18,color:"rgba(239,229,204,.38)"}}>容量有限，所以任务必须争夺同一块空间。</div>
      {[
        [170,170,"任务A"],[395,165,"提醒"],[625,175,"新消息"],
        [240,320,"记忆"],[520,315,"判断"]
      ].map((it,i)=>{
        const appear=phase(t,56.7+i*.35,57.5+i*.35);
        const bottleneck=phase(t,59.5+i*.12,62.2+i*.12);
        const tx=mix(it[0] as number,410+(i-2)*58,bottleneck);
        const ty=mix(it[1] as number,270+(i%2)*38,bottleneck);
        return <div key={i} style={{position:"absolute",left:tx,top:ty,width:150,height:72,transform:"translate(-50%,-50%)",
          borderRadius:12,border:"1px solid rgba(91,196,212,.22)",background:"rgba(91,196,212,.045)",
          opacity:appear*(settle?1:.94)}}>
          <div style={{padding:"20px 18px",fontSize:20,fontWeight:800,color:i===0?GOLD2:"rgba(239,229,204,.62)"}}>{it[2]}</div>
        </div>;
      })}
      <div style={{position:"absolute",left:410,top:110,bottom:34,width:2,background:"linear-gradient(180deg,transparent,rgba(240,215,154,.30),transparent)",opacity:phase(t,60,62)}}/>
    </div>}
  </div>;
};

const Beat4:React.FC<{t:number}>=({t})=>{
  const a=fade(t,41.8,53.6,.45,.35);
  const cards=[[560,410,"新奇"],[600,720,"奖励"],[1320,720,"风险"],[1450,480,"价格"]];
  return <AbsoluteFill style={{opacity:a}}>
    <Base warm>
      <Kicker>SELECTION / COMPETITION</Kicker>
      <TitleBlock t={t} start={42.2} title="被注意，也像一场竞价。" accent={ORANGE}
        body="越贴近当前目标、越新奇、越有奖励或威胁，越容易获得下一秒的处理资源。"/>
      {cards.map((c,i)=>{
        const lose=phase(t,48.6+i*.18,51.0+i*.18);
        return <div key={c[2]} style={{position:"absolute",left:c[0],top:c[1],width:250,height:140,transform:`translate(-50%,-50%) rotate(${i%2?-4:4}deg)`,
          border:"1px solid rgba(239,229,204,.10)",borderRadius:16,background:"rgba(13,17,18,.78)",opacity:.62*(1-lose*.72)}}>
          <div style={{padding:"22px 22px 0",fontSize:30,fontWeight:900,color:"rgba(239,229,204,.58)"}}>{c[2]}</div>
          <div style={{margin:"18px 22px",height:5,width:`${46+i*9}%`,borderRadius:3,background:"rgba(239,229,204,.10)"}}/>
        </div>;
      })}
      <QuietBadge t={t} start={51.0} end={53.5}/>
      <Caption opacity={phase(t,46.2,47.0)}>赢家不是永远最重要，而是此刻最容易占据你的工作区。</Caption>
    </Base>
  </AbsoluteFill>;
};

const Beat5:React.FC<{t:number}>=({t})=>{
  const a=fade(t,53.2,66.3,.45,.45);
  return <AbsoluteFill style={{opacity:a}}>
    <Base>
      <Kicker>WORKSPACE / BOTTLENECK</Kicker>
      <TitleBlock t={t} start={54.0} title="问题不是没有信息，而是工作区太窄。" accent={CYAN}
        body="多个任务可以同时存在，但真正被操作、比较、更新的内容只能排队进入有限的工作空间。"/>
      <div style={{position:"absolute",left:240,top:815,width:1440,height:1,background:"linear-gradient(90deg,transparent,rgba(91,196,212,.20),transparent)"}}/>
      <QuietBadge t={t} start={63.5} end={66.0}/>
      <Caption opacity={phase(t,58.8,59.6)}>注意力决定谁先进入；工作记忆决定你一次能处理多少。</Caption>
    </Base>
  </AbsoluteFill>;
};

const NetworkTrackFork:React.FC<{t:number}>=({t})=>{
  if(t<64.8||t>100.6)return null;
  const nodes=[[650,460],[850,400],[1050,430],[1280,500],[780,650],[1030,640],[1230,720]] as const;
  const appear=phase(t,64.8,67.0);
  const simplify=phase(t,75.2,78.6);
  const trackOpacity=phase(t,75.8,78.6);
  const networkOpacity=appear*(1-simplify*.88);
  const trackPath="M 260 720 C 520 430 760 720 1010 560";
  const fork=phase(t,91.0,93.4);
  const select=phase(t,95.0,97.3);
  return <svg width={W} height={H} style={{position:"absolute",inset:0,zIndex:24,overflow:"visible"}}>
    <g opacity={networkOpacity}>
      {[[0,1],[1,2],[2,3],[0,4],[1,4],[2,5],[3,6],[4,5],[5,6]].map((e,i)=>
        <line key={i} x1={nodes[e[0]][0]} y1={nodes[e[0]][1]} x2={nodes[e[1]][0]} y2={nodes[e[1]][1]}
          stroke={i===1||i===5?GOLD2:CYAN} strokeOpacity={i===1||i===5?.64:.26} strokeWidth={i===1||i===5?4:1.5}/>
      )}
      {nodes.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i===2||i===5?9:6} fill={i===2||i===5?GOLD2:TEAL} fillOpacity={.82}/>)}
    </g>
    <path d={trackPath} fill="none" stroke={GOLD2} strokeOpacity={trackOpacity*(1-.10*fork)} strokeWidth={5+4*trackOpacity} strokeLinecap="round"/>
    <path d="M 1010 560 C 1190 520 1370 410 1600 300" fill="none" stroke={GOLD2} strokeOpacity={fork*(.45+.55*select)} strokeWidth={7} strokeLinecap="round"/>
    <path d="M 1010 560 C 1210 620 1390 740 1650 830" fill="none" stroke={CREAM} strokeOpacity={fork*.20*(1-select*.6)} strokeWidth={7} strokeLinecap="round"/>
    <path d="M 1010 560 C 1180 585 1390 570 1640 560" fill="none" stroke={CYAN} strokeOpacity={fork*.18*(1-select*.4)} strokeWidth={7} strokeLinecap="round"/>
    {t>=78.8&&t<90&&[79.0,81.8,84.6].map((s,i)=>{
      const u=phase(t,s,s+2.0);
      const done=t>s+2.0;
      if(t<s)return null;
      const x=cubic(260,520,760,1010,u),y=cubic(720,430,720,560,u);
      return <circle key={i} cx={x} cy={y} r={11+(i===2?2:0)} fill={GOLD2} fillOpacity={done?(i===2?.78:.14):.92}/>;
    })}
    {t>=90&&(()=>{
      const move=phase(t,97.3,99.2);
      const x=cubic(1010,1190,1370,1600,move),y=cubic(560,520,410,300,move);
      return <circle cx={x} cy={y} r={14} fill={GOLD2} stroke="rgba(255,255,255,.45)" strokeWidth={2}/>;
    })()}
  </svg>;
};

const Beat6:React.FC<{t:number}>=({t})=>{
  const a=fade(t,65.6,78.8,.50,.45);
  const push=phase(t,70.4,71.5);
  return <AbsoluteFill style={{opacity:a}}>
    <Base>
      <Kicker>WORKING MEMORY / LINKING</Kicker>
      <div style={{position:"absolute",inset:0,transform:`translate(${-20*push}px,${8*push}px) scale(${1+.025*push})`,transformOrigin:"1040px 560px"}}>
        <TitleBlock t={t} start={66.2} title="理解，是把被选中的信息连起来。" accent={TEAL}
          body="单个片段不会自动成为思路；当它和已有记忆、目标、关系发生连接，才形成可以操作的结构。"/>
      </div>
      <QuietBadge t={t} start={76.6} end={78.5}/>
      <Caption opacity={phase(t,69.4,70.2)}>注意力负责选，工作记忆负责连；连接稳定以后，它才更像“你的想法”。</Caption>
    </Base>
  </AbsoluteFill>;
};

const Beat7:React.FC<{t:number}>=({t})=>{
  const a=fade(t,78.3,90.2,.40,.35);
  return <AbsoluteFill style={{opacity:a}}>
    <Base warm>
      <Kicker>REPETITION / GROOVE</Kicker>
      <TitleBlock t={t} start={78.8} title="重复的注意，会在大脑里压出一条轨道。" accent={GOLD2}
        body="同一个路径被反复激活后，下一次更容易沿着旧路走。习惯，就是很多次“又选了这里”。"/>
      <QuietBadge t={t} start={87.8} end={90.0}/>
      <Caption opacity={phase(t,83.0,83.8)}>一次选择很轻；重复选择以后，路径会变得越来越省力。</Caption>
    </Base>
  </AbsoluteFill>;
};

const Beat8:React.FC<{t:number}>=({t})=>{
  const a=fade(t,89.8,100.7,.28,.30);
  return <AbsoluteFill style={{opacity:a}}>
    <Base>
      <Kicker>CHOICE / LIFE FORK</Kicker>
      <TitleBlock t={t} start={90.2} title="先停在分叉口，再决定往哪走。" accent={GOLD2}
        body="不是每次选择都需要更快。真正重要的节点，反而需要一点安静，让其他可能性先被看见。"/>
      <QuietBadge t={t} start={90.0} end={91.0}/>
      <QuietBadge t={t} start={99.2} end={100.5}/>
      <Caption opacity={phase(t,93.8,94.6)}>注意力不仅决定你看什么，也在慢慢决定你更常走向哪一种生活。</Caption>
    </Base>
  </AbsoluteFill>;
};

const ChoicePaperCarrier:React.FC<{t:number}>=({t})=>{
  if(t<99.0||t>116.2)return null;
  const toCell=phase(t,100.4,102.4);
  const toPaper=phase(t,108.7,110.7);
  const x=mix(mix(1600,1270,toCell),960,toPaper);
  const y=mix(mix(300,690,toCell),560,toPaper);
  const w=mix(mix(30,56,toCell),1120,toPaper);
  const h=mix(mix(30,44,toCell),650,toPaper);
  const r=mix(15,4,Math.max(toCell,toPaper));
  const paper=toPaper;
  return <div style={{position:"absolute",left:x,top:y,width:w,height:h,transform:"translate(-50%,-50%)",zIndex:28,
    borderRadius:r,background:paper>.5?PAPER:RED,border:paper>.5?"1px solid rgba(78,54,28,.18)":"1px solid rgba(255,255,255,.18)",
    boxShadow:paper>.5?"0 32px 78px rgba(42,28,12,.25)":"0 0 24px rgba(216,88,73,.48)",overflow:"hidden",color:INK}}>
    {paper>.04&&<div style={{position:"absolute",inset:0,opacity:paper}}>
      <div style={{position:"absolute",left:58,top:48,fontSize:38,fontWeight:950}}>把注意力写进一天</div>
      <div style={{position:"absolute",left:58,top:105,fontSize:19,color:"rgba(20,18,14,.48)"}}>规则不是口号，最后会变成你真正分配出去的时间。</div>
      {[
        [170,230,250,88,"深度工作"],[530,230,210,88,"恢复"],[815,230,230,88,"关系"],
        [240,390,310,88,"学习"],[650,390,310,88,"娱乐"]
      ].map((b,i)=>{
        const ap=phase(t,110.4+i*.34,111.2+i*.34);
        const align=phase(t,112.0+i*.16,113.5+i*.16);
        const bx=mix(b[0] as number,115+i*180,align),by=mix(b[1] as number,500+(i%2)*72,align);
        return <div key={i} style={{position:"absolute",left:bx,top:by,width:mix(b[2] as number,150,align),height:mix(b[3] as number,62,align),
          borderRadius:8,background:i===0||i===3?"rgba(183,119,69,.82)":"rgba(20,18,14,.11)",opacity:ap}}>
          <div style={{padding:"18px 16px",fontSize:18,fontWeight:850,color:i===0||i===3?"#FFF6E5":"rgba(20,18,14,.68)"}}>{b[4]}</div>
        </div>;
      })}
    </div>}
  </div>;
};

const MatrixScene:React.FC<{t:number}>=({t})=>{
  const a=fade(t,100.3,109.1,.35,.35);
  const appear=phase(t,100.8,102.7);
  const settle=phase(t,106.8,107.4);
  return <AbsoluteFill style={{opacity:a}}>
    <Base>
      <Kicker>HIJACK / COMPETING SYSTEMS</Kicker>
      <TitleBlock t={t} start={100.7} title="你的注意，也会被外部系统重新排序。" accent={RED}
        body="平台、任务、奖励和焦虑，都可能把某些格子不断推到前面。看见这个机制，才有机会重新设定规则。"/>
      <div style={{position:"absolute",left:1010,top:590,width:1120,height:430,transform:"translate(-50%,-50%)",display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:8,opacity:appear*(1-phase(t,108.4,109.0))}}>
        {Array.from({length:60}).map((_,i)=>{
          const hot=(i===48)||(i>=45&&i<=49&&t>103.5);
          const wave=hot?phase(t,103.4+(i%10)*.12,104.2+(i%10)*.12):0;
          return <div key={i} style={{borderRadius:4,border:"1px solid rgba(239,229,204,.07)",
            background:hot?`rgba(216,88,73,${.28+.48*wave})`:"rgba(239,229,204,.07)",
            boxShadow:hot&&wave>.4?"0 0 18px rgba(216,88,73,.26)":"none",opacity:settle>.9?.94:1}}/>;
        })}
      </div>
      <QuietBadge t={t} start={107.4} end={109.0}/>
      <Caption opacity={phase(t,103.8,104.7)}>当外部系统不断强化同一个格子，你会误以为“这是我自己一直想看的”。</Caption>
    </Base>
  </AbsoluteFill>;
};

const Beat10:React.FC<{t:number}>=({t})=>{
  const a=fade(t,108.8,116.1,.35,.20);
  return <AbsoluteFill style={{opacity:a}}>
    <Base paper>
      <Kicker paper>RULES / DAY BLOCKS</Kicker>
      <TitleBlock t={t} start={109.2} title="真正的反制，是改写分配规则。" accent="#9A6737" paper
        body="把重要的事情提前占位，让低价值刺激失去默认入口。注意力管理，最终是一种时间结构设计。"/>
      <QuietBadge t={t} start={113.6} end={116.0}/>
      <Caption paper opacity={phase(t,112.1,112.9)}>如果一天的时间块没有被你主动安排，它就很容易被别人安排。</Caption>
    </Base>
  </AbsoluteFill>;
};

const FinalGrowth:React.FC<{t:number}>=({t})=>{
  if(t<114.5)return null;
  const grow=phase(t,116.0,118.25);
  const fadePaper=phase(t,116.0,116.8);
  const blocks=[[810,610],[930,560],[1050,610],[1160,550]] as const;
  const top=[960,360] as const;
  return <AbsoluteFill style={{zIndex:31,pointerEvents:"none"}}>
    {blocks.map((b,i)=>{
      const bx=mix(b[0],960+(i-1.5)*56,grow),by=mix(b[1],585+(i%2)*22,grow);
      return <div key={i} style={{position:"absolute",left:bx,top:by,width:120,height:48,transform:"translate(-50%,-50%)",
        borderRadius:7,background:i%2===0?"#B77745":"rgba(20,18,14,.15)",opacity:(1-fadePaper*.15)}}>
      </div>;
    })}
    <svg width={W} height={H} style={{position:"absolute",inset:0,opacity:grow}}>
      {blocks.map((b,i)=>{
        const sx=960+(i-1.5)*56,sy=585+(i%2)*22;
        const ex=mix(sx,top[0]+(i-1.5)*78,grow),ey=mix(sy,top[1]+Math.abs(i-1.5)*38,grow);
        return <path key={i} d={`M ${sx} ${sy} Q ${960+(i-1.5)*24} 470 ${ex} ${ey}`} fill="none" stroke={i===1||i===2?GOLD2:TEAL} strokeWidth={5} strokeLinecap="round"/>;
      })}
      <circle cx={960} cy={360} r={18+grow*10} fill={GOLD2} fillOpacity={.94}/>
    </svg>
  </AbsoluteFill>;
};

const Beat11:React.FC<{t:number}>=({t})=>{
  const a=fade(t,115.8,120,.20,.02);
  const title=phase(t,118.25,118.8);
  return <AbsoluteFill style={{opacity:a}}>
    <Base warm>
      <Kicker>ENDING / WHAT YOU REPEAT</Kicker>
      <div style={{position:"absolute",left:250,right:250,top:170,textAlign:"center",opacity:title}}>
        <div style={{fontSize:68,fontWeight:950,lineHeight:1.15,letterSpacing:-2}}>你反复注意什么，</div>
        <div style={{fontSize:68,fontWeight:950,lineHeight:1.15,letterSpacing:-2,color:GOLD2,marginTop:8}}>你就更容易成为什么。</div>
        <div style={{fontSize:23,color:"rgba(239,229,204,.46)",marginTop:26}}>注意力不是一个开关，而是一条被一次次选择出来的路。</div>
      </div>
      <QuietBadge t={t} start={118.25} end={120}/>
    </Base>
  </AbsoluteFill>;
};

export const V43Film:React.FC=()=>{
  const f=useCurrentFrame();
  const t=f/FPS;
  return <AbsoluteFill style={{background:BG}}>
    <Beat0 t={t}/>
    <Beat1 t={t}/>
    <Beat2 t={t}/>
    <SearchScene t={t}/>
    <Beat4 t={t}/>
    <Beat5 t={t}/>
    <Beat6 t={t}/>
    <Beat7 t={t}/>
    <Beat8 t={t}/>
    <MatrixScene t={t}/>
    <Beat10 t={t}/>
    <Beat11 t={t}/>
    <SignalCarrier t={t}/>
    <AuctionWorkCarrier t={t}/>
    <NetworkTrackFork t={t}/>
    <ChoicePaperCarrier t={t}/>
    <FinalGrowth t={t}/>
    <Audio src={staticFile("v43-score.wav")}/>
  </AbsoluteFill>;
};
