import React from "react";
import {AbsoluteFill,Easing,interpolate,useCurrentFrame} from "remotion";

export const FPS=30;
export const W=1920;
export const H=1080;
export const BG="#07090B";
export const INK="#0B0D10";
export const GOLD="#D9B26F";
export const GOLD2="#F0D79A";
export const CREAM="#EFE5CC";
export const TEAL="#66B9AA";
export const RED="#D85849";
export const SMOKE="#8D918D";
export const FONT="'Noto Serif CJK SC','Noto Sans CJK SC','Noto Sans SC','Microsoft YaHei',sans-serif";

export const seconds=[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8];
export const frames=seconds.map((s)=>s*FPS);
export const starts=seconds.map((_,i)=>i*8);

export const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const smooth=(t:number)=>{t=clamp(t);return t*t*(3-2*t);};
export const smoother=(t:number)=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10);};
export const fract=(v:number)=>v-Math.floor(v);
export const hash=(i:number,s=0)=>fract(Math.sin((i+1)*12.9898+s*78.233)*43758.5453);

export const intro=(f:number,delay=0,d=26)=>interpolate(f,[delay,delay+d],[0,1],{
  extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)
});
export const outro=(f:number,dur:number,d=22)=>interpolate(f,[dur-d,dur],[1,0],{
  extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.in(Easing.cubic)
});

export const CinematicBg:React.FC<{paper?:boolean;warm?:boolean}>=({paper=false,warm=false})=>{
  const f=useCurrentFrame();
  if(paper){
    return <AbsoluteFill style={{
      background:"radial-gradient(circle at 48% 42%, #FBF4DF 0%, "+CREAM+" 58%, #D8C8A6 115%)"
    }}>
      <AbsoluteFill style={{opacity:.11,backgroundImage:"repeating-linear-gradient(0deg,rgba(90,63,34,.15) 0 1px,transparent 1px 5px)"}}/>
    </AbsoluteFill>;
  }
  const x=48+Math.sin(f*.006)*4;
  return <AbsoluteFill style={{
    background:"radial-gradient(circle at "+x+"% 42%, "+(warm?"#17100B":"#10181A")+" 0%, #090B0D 44%, #030405 100%)"
  }}/>;
};

export const Bokeh:React.FC<{count?:number;gold?:boolean}>=({count=28,gold=true})=>{
  const f=useCurrentFrame();
  return <AbsoluteFill style={{overflow:"hidden",pointerEvents:"none"}}>
    {Array.from({length:count}).map((_,i)=>{
      const baseX=hash(i,1)*W,baseY=hash(i,2)*H;
      const x=baseX+Math.sin(f*.006+i)*22;
      const y=baseY+Math.cos(f*.004+i*.7)*14;
      const s=10+hash(i,3)*60;
      const a=.025+hash(i,4)*.075;
      return <div key={i} style={{position:"absolute",left:x,top:y,width:s,height:s,borderRadius:"50%",
        background:gold?"rgba(217,178,111,"+a+")":"rgba(102,185,170,"+a+")",
        filter:"blur("+(6+s*.08)+"px)",transform:"translate(-50%,-50%)"}}/>;
    })}
  </AbsoluteFill>;
};

export const Grain:React.FC=()=> <AbsoluteFill style={{
  pointerEvents:"none",opacity:.12,mixBlendMode:"screen",
  backgroundImage:"radial-gradient(circle,rgba(255,255,255,.16) 0 .7px,transparent 1px)",
  backgroundSize:"13px 13px"
}}/>;

export const Vignette:React.FC=()=> <AbsoluteFill style={{
  pointerEvents:"none",
  boxShadow:"inset 0 0 220px 70px rgba(0,0,0,.9), inset 0 0 40px 10px rgba(0,0,0,.72)"
}}/>;

export const Stage:React.FC<{children:React.ReactNode;paper?:boolean;warm?:boolean;bokeh?:boolean}>=({children,paper=false,warm=false,bokeh=true})=>
  <AbsoluteFill style={{fontFamily:FONT,color:paper?INK:CREAM,overflow:"hidden"}}>
    <CinematicBg paper={paper} warm={warm}/>
    {!paper&&bokeh&&<Bokeh/>}
    {children}
    <Grain/>
    {!paper&&<Vignette/>}
  </AbsoluteFill>;

export const Kicker:React.FC<{children:React.ReactNode;paper?:boolean}>=({children,paper=false})=>
  <div style={{position:"absolute",left:74,top:54,fontSize:18,fontWeight:700,letterSpacing:3.2,
    color:paper?"rgba(11,13,16,.42)":"rgba(217,178,111,.66)"}}>{children}</div>;

export const Caption:React.FC<{children:React.ReactNode;paper?:boolean;accent?:string}>=({children,paper=false,accent})=>{
  const f=useCurrentFrame();
  const p=intro(f,12,20);
  return <div style={{position:"absolute",left:120,right:120,bottom:72,textAlign:"center",
    fontSize:31,fontWeight:600,letterSpacing:.4,lineHeight:1.45,
    color:accent|| (paper?"rgba(11,13,16,.72)":"rgba(239,229,204,.78)"),
    opacity:p,transform:"translateY("+((1-p)*14)+"px)"}}>{children}</div>;
};

export const Source:React.FC<{children:React.ReactNode;paper?:boolean}>=({children,paper=false})=>
  <div style={{position:"absolute",left:70,bottom:34,fontSize:17,letterSpacing:.3,
    color:paper?"rgba(11,13,16,.38)":"rgba(239,229,204,.34)"}}>{children}</div>;

export const GridFloor:React.FC<{color?:string;opacity?:number;horizon?:number}>=({color=GOLD,opacity=.18,horizon=430})=>{
  const f=useCurrentFrame();
  const offset=(f*.7)%58;
  const lines=[];
  for(let i=0;i<=16;i++){
    const x=i/16;
    const xb=lerp(-260,2180,x);
    const xt=lerp(760,1160,x);
    lines.push(<line key={"v"+i} x1={xb} y1={1120} x2={xt} y2={horizon} stroke={color} strokeOpacity={opacity} strokeWidth="1.3"/>);
  }
  for(let j=0;j<13;j++){
    const t=(j/12);
    const y=horizon+(H-horizon)*Math.pow(t,1.85)+offset*(t>.2?1:0);
    lines.push(<line key={"h"+j} x1={0} y1={y} x2={W} y2={y} stroke={color} strokeOpacity={opacity*(.7+t*.5)} strokeWidth="1"/>);
  }
  return <svg width={W} height={H} style={{position:"absolute",inset:0}}>{lines}</svg>;
};

export const RingMachine:React.FC<{x?:number;y?:number;scale?:number;opacity?:number;speed?:number}>=({x=960,y=500,scale=1,opacity=1,speed=1})=>{
  const f=useCurrentFrame();
  const rings=[0,1,2,3,4,5];
  return <div style={{position:"absolute",left:x,top:y,width:560*scale,height:560*scale,transform:"translate(-50%,-50%)",opacity}}>
    <div style={{position:"absolute",left:"50%",top:"50%",width:180*scale,height:180*scale,transform:"translate(-50%,-50%)",borderRadius:"50%",
      background:"radial-gradient(circle at 38% 32%,rgba(112,190,170,.55),rgba(7,22,22,.95) 55%,#020405 76%)",
      boxShadow:"inset 0 0 35px rgba(217,178,111,.3),0 0 65px rgba(102,185,170,.14)"}}/>
    {rings.map((r,i)=>{
      const a=(f*speed*(i%2?-.16:.12)+i*28);
      const sy=.35+((i%3)*.16);
      const size=(280+i*38)*scale;
      return <div key={i} style={{position:"absolute",left:"50%",top:"50%",width:size,height:size,
        marginLeft:-size/2,marginTop:-size/2,borderRadius:"50%",border:(i===0?7:3)+"px solid rgba(217,178,111,"+(.74-i*.07)+")",
        boxShadow:"0 0 10px rgba(217,178,111,.12), inset 0 0 8px rgba(217,178,111,.18)",
        transform:"rotate("+a+"deg) scaleY("+sy+")"}}/>;
    })}
    {Array.from({length:7}).map((_,i)=>{
      const a=f*.01+i*.91;
      const rr=(180+i*13)*scale;
      const px=280*scale+Math.cos(a)*rr;
      const py=280*scale+Math.sin(a)*rr*.44;
      const s=(8+(i%3)*5)*scale;
      return <div key={"o"+i} style={{position:"absolute",left:px-s/2,top:py-s/2,width:s,height:s,borderRadius:"50%",
        background:i===2?TEAL:GOLD2,boxShadow:"0 0 14px "+(i===2?TEAL:GOLD2)}}/>;
    })}
  </div>;
};

export const FocusReticle:React.FC<{x:number;y:number;r?:number;opacity?:number}>=({x,y,r=72,opacity=1})=>{
  const f=useCurrentFrame();
  const spin=f*.45;
  return <div style={{position:"absolute",left:x-r,top:y-r,width:r*2,height:r*2,borderRadius:"50%",opacity,
    border:"1px solid rgba(217,178,111,.48)",boxShadow:"0 0 32px rgba(217,178,111,.13)"}}>
    <div style={{position:"absolute",inset:10,borderRadius:"50%",border:"2px dashed rgba(217,178,111,.7)",transform:"rotate("+spin+"deg)"}}/>
    <div style={{position:"absolute",left:"50%",top:-14,width:1,height:28,background:GOLD}}/>
    <div style={{position:"absolute",left:"50%",bottom:-14,width:1,height:28,background:GOLD}}/>
    <div style={{position:"absolute",top:"50%",left:-14,width:28,height:1,background:GOLD}}/>
    <div style={{position:"absolute",top:"50%",right:-14,width:28,height:1,background:GOLD}}/>
  </div>;
};

export const Paper:React.FC<{x:number;y:number;w?:number;h?:number;rotate?:number;children?:React.ReactNode;scale?:number}>=({x,y,w=420,h=560,rotate=0,children,scale=1})=>
  <div style={{position:"absolute",left:x,top:y,width:w,height:h,transform:"translate(-50%,-50%) rotate("+rotate+"deg) scale("+scale+")",
    background:"linear-gradient(145deg,#F7EED4,#E5D5B2)",boxShadow:"0 36px 70px rgba(0,0,0,.42), inset 0 0 0 1px rgba(85,61,29,.18)",
    color:INK,borderRadius:3,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,opacity:.13,backgroundImage:"repeating-linear-gradient(0deg,rgba(80,50,20,.12) 0 1px,transparent 1px 6px)"}}/>
    {children}
  </div>;

export const GlowLine:React.FC<{x1:number;y1:number;x2:number;y2:number;color?:string;width?:number;opacity?:number}>=({x1,y1,x2,y2,color=GOLD,width=3,opacity=1})=>
  <svg width={W} height={H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeOpacity={opacity} style={{filter:"drop-shadow(0 0 8px "+color+")"}}/>
  </svg>;

export const Word:React.FC<{children:React.ReactNode;x:number;y:number;size?:number;color?:string;opacity?:number;weight?:number;tracking?:number}>=({children,x,y,size=34,color=CREAM,opacity=1,weight=700,tracking=0})=>
  <div style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%)",fontSize:size,fontWeight:weight,letterSpacing:tracking,color,opacity,textShadow:"0 3px 22px rgba(0,0,0,.45)"}}>{children}</div>;

export const SplitTitle:React.FC<{a:string;b:string;y?:number;paper?:boolean}>=({a,b,y=150,paper=false})=>{
  const f=useCurrentFrame();
  const p=intro(f,5,24);
  return <div style={{position:"absolute",left:110,top:y,fontSize:60,fontWeight:900,lineHeight:1.12,
    color:paper?INK:CREAM,opacity:p,transform:"translateY("+((1-p)*28)+"px)",letterSpacing:-1.5}}>
    {a}<br/><span style={{color:paper?"#7F5D24":GOLD2}}>{b}</span>
  </div>;
};

export const WorldProgress:React.FC=()=>{
  const f=useCurrentFrame();
  const p=clamp(f/(120*FPS));
  return <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"rgba(217,178,111,.08)",zIndex:400}}>
    <div style={{height:"100%",width:(p*100)+"%",background:"linear-gradient(90deg,"+GOLD+","+GOLD2+")",boxShadow:"0 0 12px rgba(217,178,111,.6)"}}/>
  </div>;
};
