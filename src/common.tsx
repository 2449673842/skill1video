import React from "react";
import {AbsoluteFill,Easing,interpolate,useCurrentFrame} from "remotion";

export const FPS=30;
export const W=1920;
export const H=1080;
export const INK="#090A0C";
export const PAPER="#F4F0E9";
export const ACCENT="#FF6B4A";
export const FONT="'Noto Sans CJK SC','Noto Sans SC','Microsoft YaHei',sans-serif";

export const seconds=[7,8,8,8,8,8,8,8,9,9,9,9,8,7,6];
export const frames=seconds.map((s)=>s*FPS);
export const starts:number[]=[];
let total=0;
for(const s of seconds){starts.push(total);total+=s;}

export const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const smooth=(t:number)=>{t=clamp(t);return t*t*(3-2*t);};
export const fract=(v:number)=>v-Math.floor(v);
export const hash=(i:number,s=0)=>fract(Math.sin((i+1)*12.9898+s*78.233)*43758.5453);

export const fade=(f:number,d:number)=>{
  const a=interpolate(f,[0,14],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
  const b=interpolate(f,[d-14,d],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.in(Easing.cubic)});
  return a*b;
};

export const Stage:React.FC<{duration:number;dark?:boolean;children:React.ReactNode;noFade?:boolean}>=({duration,dark=true,children,noFade=false})=>{
  const f=useCurrentFrame();
  return <AbsoluteFill style={{
    background:dark?INK:PAPER,color:dark?PAPER:INK,fontFamily:FONT,overflow:"hidden",
    opacity:noFade?1:fade(f,duration)
  }}>
    {children}
    <AbsoluteFill style={{
      pointerEvents:"none",opacity:dark?.14:.07,
      backgroundImage:"radial-gradient(circle,rgba(255,255,255,.18) 0 1px,transparent 1.5px)",
      backgroundSize:"21px 21px",mixBlendMode:dark?"screen":"multiply"
    }}/>
  </AbsoluteFill>;
};

export const Kicker:React.FC<{children:React.ReactNode;dark?:boolean}>=({children,dark=true})=>
  <div style={{position:"absolute",left:96,top:72,fontSize:22,fontWeight:800,letterSpacing:4,
    color:dark?"rgba(244,240,233,.45)":"rgba(9,10,12,.42)"}}>{children}</div>;

export const Source:React.FC<{children:React.ReactNode;dark?:boolean}>=({children,dark=false})=>
  <div style={{position:"absolute",left:96,bottom:48,fontSize:20,
    color:dark?"rgba(244,240,233,.5)":"rgba(9,10,12,.46)"}}>{children}</div>;

export const Orb:React.FC=()=>{
  const f=useCurrentFrame();
  const sec=f/FPS;
  const k:number[][]=[
    [0,960,540,8],[7,820,540,9],[15,1500,540,7],[23,1040,540,9],
    [31,960,300,7],[39,620,540,10],[47,1320,520,10],[55,960,600,8],
    [63,970,535,8],[72,1250,530,9],[81,960,650,9],[90,1210,650,8],
    [99,960,540,7],[107,1160,510,9],[114,960,540,12],[120,960,540,260]
  ];
  let a=k[0],b=k[k.length-1];
  for(let i=0;i<k.length-1;i++){if(sec>=k[i][0]&&sec<=k[i+1][0]){a=k[i];b=k[i+1];break;}}
  const t=smooth((sec-a[0])/(b[0]-a[0]));
  const x=lerp(a[1],b[1],t),y=lerp(a[2],b[2],t),r=lerp(a[3],b[3],t);
  const pulse=1+.16*Math.sin(f*.12);
  return <div style={{
    position:"absolute",left:x-r*pulse,top:y-r*pulse,width:r*2*pulse,height:r*2*pulse,
    borderRadius:"50%",background:ACCENT,boxShadow:"0 0 "+(22+r*1.8)+"px "+ACCENT,zIndex:200
  }}/>;
};

export const Progress:React.FC=()=>{
  const f=useCurrentFrame();
  const p=clamp(f/(120*FPS));
  return <div style={{position:"absolute",left:0,top:0,width:"100%",height:4,
    background:"rgba(255,255,255,.08)",zIndex:250}}>
    <div style={{height:"100%",width:(p*100)+"%",background:ACCENT}}/>
  </div>;
};

export const Pill:React.FC<{x:number;y:number;text:string;active?:boolean;size?:number}>=({x,y,text,active=false,size=30})=>
  <div style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%)",
    padding:"13px 20px",borderRadius:999,fontSize:size,fontWeight:800,
    color:active?INK:PAPER,background:active?ACCENT:"rgba(244,240,233,.10)",
    border:active?"none":"1px solid rgba(244,240,233,.16)"}}>{text}</div>;
