import React from "react";
import {AbsoluteFill,Composition,Easing,interpolate,registerRoot,useCurrentFrame} from "remotion";

const W=1920,H=1080,FPS=30,D=8*FPS;
const BG="#040608",CREAM="#F2E8D3",ORANGE="#FF744C",GOLD="#F2B85E",CYAN="#53C9D6";
const FONT="'Noto Sans CJK SC','Noto Serif CJK SC','Noto Sans SC','Microsoft YaHei',sans-serif";
const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=(t:number)=>{t=clamp(t);return t*t*(3-2*t)};
const smoother=(t:number)=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)};
const fract=(v:number)=>v-Math.floor(v);
const hash=(i:number,s=0)=>fract(Math.sin((i+1)*12.9898+s*78.233)*43758.5453);
const seg=(f:number,a:number,b:number)=>smooth((f-a)/(b-a));

type Kind="chart"|"text"|"icon"|"wave"|"thumb";
type CardSpec={label:string;kind:Kind;accent:string};
const cardSpecs:CardSpec[]=[
  {label:"新闻",kind:"text",accent:CREAM},{label:"热点",kind:"icon",accent:ORANGE},
  {label:"AI",kind:"text",accent:CYAN},{label:"社交动态",kind:"text",accent:CREAM},
  {label:"股市",kind:"chart",accent:ORANGE},{label:"工作",kind:"text",accent:CREAM},
  {label:"视频",kind:"icon",accent:CREAM},{label:"搜索",kind:"icon",accent:CREAM},
  {label:"购物",kind:"icon",accent:CREAM},{label:"知识",kind:"text",accent:CYAN},
  {label:"音乐",kind:"wave",accent:CYAN},{label:"情绪",kind:"wave",accent:ORANGE},
  {label:"价格",kind:"chart",accent:GOLD},{label:"地图",kind:"icon",accent:CREAM},
  {label:"消息",kind:"text",accent:ORANGE},{label:"机会",kind:"chart",accent:CYAN},
  {label:"关系",kind:"text",accent:CREAM},{label:"风险",kind:"chart",accent:ORANGE},
];

const MiniVisual:React.FC<{kind:Kind;accent:string;i:number}>=({kind,accent,i})=>{
  if(kind==="chart"){
    const pts=Array.from({length:7},(_,j)=>[10+j*18,45-hash(i*9+j,4)*34]);
    const d=pts.map((p,j)=>(j?"L":"M")+p[0]+" "+p[1]).join(" ");
    return <svg width="140" height="58" viewBox="0 0 140 58">
      <path d={d} fill="none" stroke={accent} strokeWidth="2.5" style={{filter:"drop-shadow(0 0 6px "+accent+")"}}/>
      <path d="M8 50 H132" stroke="rgba(255,255,255,.12)"/>
    </svg>;
  }
  if(kind==="wave"){
    return <svg width="140" height="58" viewBox="0 0 140 58">
      {Array.from({length:22},(_,j)=>{
        const hh=8+hash(i*7+j,5)*35;
        return <line key={j} x1={8+j*6} x2={8+j*6} y1={29-hh/2} y2={29+hh/2} stroke={accent} strokeWidth="2" strokeOpacity={.82}/>
      })}
    </svg>;
  }
  if(kind==="thumb"){
    return <div style={{width:140,height:58,borderRadius:8,background:"linear-gradient(145deg,rgba(83,201,214,.18),rgba(255,116,76,.32)),radial-gradient(circle at 70% 20%,"+accent+",transparent 35%)"}}/>;
  }
  if(kind==="icon"){
    return <div style={{width:54,height:54,border:"2px solid "+accent,borderRadius:12,display:"grid",placeItems:"center",fontSize:28,color:accent,boxShadow:"0 0 18px "+accent+"22"}}>◉</div>;
  }
  return <div style={{fontSize:30,fontWeight:800,color:accent,letterSpacing:1}}>{i%3===0?"I=-log₂p":i%3===1?"38.26":"∞"}</div>;
};

const DataCard:React.FC<{i:number;progress:number;collapse:number}>=({i,progress,collapse})=>{
  const spec=cardSpecs[i%cardSpecs.length];
  const side=i%2===0?-1:1;
  const lane=(i%9)-4;
  const baseY=250+hash(i,1)*610;
  const depth=hash(i,2);
  const startX=side<0?-260-hash(i,3)*420:W+260+hash(i,3)*420;
  const endX=1480+lane*28;
  const fly=smoother(clamp((progress-hash(i,4)*.32)/.68));
  const x=startX+(endX-startX)*fly;
  const y=baseY+(540-baseY)*fly*.72;
  const z=-950+depth*900+fly*460;
  const c=smoother(clamp((collapse-hash(i,5)*.20)/.80));
  const cx=x+(1095-x)*c;
  const cy=y+(540-y)*c;
  const sc=(.50+depth*.74)*(1-c*.60);
  const rot=(side*10+(hash(i,6)-.5)*15)*(1-c);
  const alpha=.18+.78*fly;
  return <div style={{
    position:"absolute",left:cx,top:cy,width:182,height:92,
    transform:"translate(-50%,-50%) translateZ("+z+"px) rotateY("+rot+"deg) scale("+sc+")",
    opacity:alpha*(1-c*.78),
    border:"1px solid "+spec.accent+"55",borderRadius:12,
    background:"linear-gradient(145deg,rgba(8,12,16,.97),rgba(10,16,21,.76))",
    boxShadow:"0 18px 50px rgba(0,0,0,.38),0 0 22px "+spec.accent+"12",
    overflow:"hidden",padding:12
  }}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
      <div style={{fontSize:18,fontWeight:800,color:spec.accent}}>{spec.label}</div>
      <div style={{fontSize:11,color:"rgba(242,232,211,.35)"}}>{String(Math.floor(hash(i,8)*999)).padStart(3,"0")}</div>
    </div>
    <div style={{height:53,display:"flex",alignItems:"center"}}><MiniVisual kind={spec.kind} accent={spec.accent} i={i}/></div>
  </div>;
};

const StreamLines:React.FC<{collapse:number;portal:number}>=({collapse,portal})=>{
  const f=useCurrentFrame();
  return <svg width={W} height={H} style={{position:"absolute",inset:0,overflow:"visible"}}>
    {Array.from({length:34},(_,i)=>{
      const sy=100+hash(i,1)*880;
      const sx=i%2===0?-100:W+100;
      const midX=820+hash(i,2)*420;
      const midY=300+hash(i,3)*470;
      const endX=1100+portal*360;
      const endY=540;
      const alpha=.07+hash(i,4)*.18+collapse*.06;
      const color=i%5===0?CYAN:i%3===0?ORANGE:GOLD;
      const dash=26+hash(i,5)*95;
      const off=-(f*(4+hash(i,6)*9));
      const d="M "+sx+" "+sy+" Q "+midX+" "+midY+", "+endX+" "+endY;
      return <path key={i} d={d} fill="none" stroke={color} strokeWidth={.7+hash(i,7)*1.7} strokeOpacity={alpha}
        strokeDasharray={dash+" "+dash*.7} strokeDashoffset={off} style={{filter:"drop-shadow(0 0 5px "+color+")"}}/>;
    })}
  </svg>
};

const Starfield:React.FC=()=>{
  const f=useCurrentFrame();
  return <>{Array.from({length:130},(_,i)=>{
    const x=hash(i,2)*W,y=hash(i,3)*H;
    const s=1+hash(i,4)*3;
    const a=.08+hash(i,5)*.30;
    const dy=(f*(.13+hash(i,6)*.22))%H;
    return <div key={i} style={{position:"absolute",left:x,top:(y+dy)%H,width:s,height:s,borderRadius:"50%",background:i%9===0?CYAN:CREAM,opacity:a,boxShadow:i%13===0?"0 0 9px "+ORANGE:"none"}}/>
  })}</>;
};

const Headline:React.FC<{phase:number}>=({phase})=>{
  const f=useCurrentFrame();
  const p=interpolate(f,[4,24],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
  const title=phase<.5
    ? <><span>每天都有</span><span style={{color:ORANGE}}>海量信息</span><span>从你身边掠过</span></>
    : phase<1.5
      ? <><span>你接触的信息，</span><span style={{color:ORANGE}}>远比你意识到的更多</span></>
      : phase<2.5
        ? <><span>真正被你注意到的，往往只有</span><span style={{color:ORANGE}}>极少一部分</span></>
        : <><span>被你注意到的，才有机会</span><span style={{color:ORANGE}}>留下痕迹</span></>;
  return <div style={{position:"absolute",left:92,top:92,right:90,zIndex:80,opacity:p,transform:"translateY("+((1-p)*22)+"px)"}}>
    <div style={{fontSize:18,letterSpacing:5,color:"rgba(242,232,211,.58)",marginBottom:22}}>ATTENTION / 01</div>
    <div style={{fontFamily:FONT,fontSize:63,fontWeight:900,letterSpacing:-2.1,lineHeight:1.12,textShadow:"0 8px 35px rgba(0,0,0,.7)"}}>{title}</div>
  </div>
};

const DynamicCaption:React.FC<{phase:number}>=({phase})=>{
  const text=phase<.5?"绝大多数信息，只是路过。":phase<1.5?"数字在增长，注意力却不会同步扩张。":phase<2.5?"海量输入，会被压缩成少数信号。":"注意力会把少数信号，带进你的故事。";
  return <div style={{position:"absolute",left:96,bottom:70,zIndex:90}}>
    <div style={{width:54,height:1,background:"rgba(242,232,211,.6)",marginBottom:20}}/>
    <div style={{fontSize:28,color:"rgba(242,232,211,.66)",letterSpacing:.3}}>{text}</div>
  </div>
};

const Counter:React.FC<{progress:number;collapse:number}>=({progress,collapse})=>{
  const f=useCurrentFrame();
  const v=Math.max(1,Math.floor(Math.pow(10,interpolate(progress,[0,1],[0,9]))));
  const n=v.toLocaleString("en-US");
  const surge=1+Math.sin(f*.7)*.008*(1-collapse);
  return <div style={{position:"absolute",left:820,top:585,zIndex:70,transform:"translate(-50%,-50%) scale("+(surge*(1-collapse*.62))+")",opacity:1-collapse*.96}}>
    <div style={{fontSize:128,fontWeight:900,fontVariantNumeric:"tabular-nums",letterSpacing:-7,color:CREAM,textShadow:"0 0 26px "+ORANGE+"66,0 18px 60px rgba(0,0,0,.55)"}}>
      {n}
    </div>
    <div style={{fontSize:31,fontWeight:800,color:ORANGE,textAlign:"right",marginTop:4}}>≈ 10⁹ INPUT SCALE</div>
  </div>
};

const TenPortal:React.FC<{show:number;portal:number}>=({show,portal})=>{
  const f=useCurrentFrame();
  const appear=smoother(show);
  const burst=interpolate(show,[0,.15,.45,1],[.60,1.18,.96,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const zeroScale=1+portal*3.6;
  const zeroX=1065+portal*155;
  return <div style={{position:"absolute",inset:0,zIndex:72,pointerEvents:"none"}}>
    <div style={{position:"absolute",left:870,top:565,transform:"translate(-50%,-50%) scale("+(appear*burst)+")",fontSize:332,fontWeight:900,letterSpacing:-30,color:GOLD,
      textShadow:"0 0 35px "+ORANGE+",0 0 90px "+ORANGE+"88",opacity:appear}}>1</div>
    <div style={{position:"absolute",left:zeroX,top:565,width:300*zeroScale,height:300*zeroScale,transform:"translate(-50%,-50%)",borderRadius:"50%",
      border:"18px solid "+GOLD,boxShadow:"0 0 "+(55+portal*80)+"px "+ORANGE+"aa,inset 0 0 "+(45+portal*90)+"px "+ORANGE+"88",opacity:appear,
      background:"radial-gradient(circle at center,rgba(255,255,255,"+(.08+.15*portal)+") 0 4%,rgba(255,116,76,.18) 12%,rgba(4,6,8,.92) 38%,rgba(4,6,8,1) 62%)"}}>
      {Array.from({length:7},(_,i)=>{
        const size=(340+i*72)*zeroScale;
        const rot=f*(i%2?-.55:.38)+i*21;
        return <div key={i} style={{position:"absolute",left:"50%",top:"50%",width:size,height:size,marginLeft:-size/2,marginTop:-size/2,borderRadius:"50%",
          border:(i===0?4:2)+"px "+(i%2?"dashed":"solid")+" rgba(242,184,94,"+(.42-i*.04)+")",transform:"rotate("+rot+"deg) scaleY("+(.42+i*.045)+")",boxShadow:"0 0 12px rgba(255,116,76,.12)"}}/>;
      })}
      <div style={{position:"absolute",left:"50%",top:"50%",width:24+portal*34,height:24+portal*34,transform:"translate(-50%,-50%)",borderRadius:"50%",background:CREAM,boxShadow:"0 0 55px 18px "+ORANGE}}/>
    </div>
  </div>;
};

const ImpactRings:React.FC<{hit:number}>=({hit})=><>{Array.from({length:5},(_,i)=>{
  const p=clamp((hit-i*.09)/(1-i*.09));
  const s=80+p*(260+i*90);
  return <div key={i} style={{position:"absolute",left:1065,top:565,width:s,height:s,transform:"translate(-50%,-50%)",borderRadius:"50%",border:"2px solid rgba(255,116,76,"+((1-p)*.55)+")",opacity:p<1?1:0}}/>
})}</>;

const OpeningLab:React.FC=()=>{
  const f=useCurrentFrame();
  const pStream=seg(f,0,64);
  const pCount=seg(f,35,112);
  const pCollapse=seg(f,104,166);
  const pTen=seg(f,148,191);
  const pPortal=seg(f,185,239);
  const phase=f<55?0:f<112?1:f<180?2:3;
  const camPush=interpolate(f,[0,90,165,239],[1,1.035,1.095,1.42],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const camX=interpolate(f,[0,165,239],[0,-20,-170],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const shakeAmp=(f>154&&f<164)?interpolate(f,[154,164],[8,0]):0;
  const sx=Math.sin(f*2.4)*shakeAmp,sy=Math.cos(f*2.1)*shakeAmp*.6;
  return <AbsoluteFill style={{background:BG,color:CREAM,fontFamily:FONT,overflow:"hidden"}}>
    <AbsoluteFill style={{background:"radial-gradient(circle at 58% 48%,#101A1D 0%,#07090B 38%,#020304 100%)"}}/>
    <Starfield/>
    <div style={{position:"absolute",inset:0,transform:"translate("+(sx+camX)+"px,"+sy+"px) scale("+camPush+")",transformOrigin:"57% 52%",perspective:1200}}>
      <StreamLines collapse={pCollapse} portal={pPortal}/>
      <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d"}}>
        {Array.from({length:72},(_,i)=><DataCard key={i} i={i} progress={pStream} collapse={pCollapse}/>)}
      </div>
      <Counter progress={pCount} collapse={pCollapse}/>
      <TenPortal show={pTen} portal={pPortal}/>
      <ImpactRings hit={pTen}/>
    </div>
    <Headline phase={phase}/>
    <DynamicCaption phase={phase}/>
    <div style={{position:"absolute",inset:0,pointerEvents:"none",boxShadow:"inset 0 0 210px 80px rgba(0,0,0,.88)"}}/>
    <div style={{position:"absolute",inset:0,opacity:.11,pointerEvents:"none",backgroundImage:"radial-gradient(circle,rgba(255,255,255,.22) 0 .6px,transparent .8px)",backgroundSize:"11px 11px",mixBlendMode:"screen"}}/>
    <div style={{position:"absolute",top:0,left:0,height:3,width:(f/D*100)+"%",background:"linear-gradient(90deg,"+ORANGE+","+GOLD+")",boxShadow:"0 0 16px "+ORANGE}}/>
  </AbsoluteFill>;
};

const Root:React.FC=()=> <Composition id="AttentionOpeningLab" component={OpeningLab} durationInFrames={D} fps={FPS} width={W} height={H}/>;
registerRoot(Root);
