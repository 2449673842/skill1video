import React from "react";
import {interpolate,useCurrentFrame} from "remotion";
import {ACCENT,Stage,Kicker,frames,clamp,smooth} from "./common";

export const Scene10:React.FC=()=>{
  const f=useCurrentFrame(),p=smooth(clamp((f-35)/150));
  return <Stage duration={frames[10]} dark>
    <Kicker>LIFE FORK / 10</Kicker>
    <div style={{position:"absolute",left:110,top:150,fontSize:60,fontWeight:900}}>同样的一天，可以长成<span style={{color:ACCENT}}>两个世界。</span></div>
    <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
      <path d="M 220 720 C 620 720, 720 610, 930 610" stroke="rgba(244,240,233,.35)" strokeWidth="7" fill="none"/>
      <path d="M 930 610 C 1180 610, 1260 390, 1710 350" stroke={ACCENT} strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M 930 610 C 1180 610, 1260 830, 1710 850" stroke="rgba(244,240,233,.32)" strokeWidth="9" fill="none" strokeLinecap="round"/>
    </svg>
    <div style={{position:"absolute",left:1210,top:275,fontSize:30,fontWeight:800,color:ACCENT}}>深度 / 创作 / 关系</div>
    <div style={{position:"absolute",left:1210,top:885,fontSize:30,fontWeight:800,color:"rgba(244,240,233,.55)"}}>碎片 / 反应 / 刷新</div>
    {Array.from({length:7}).map((_,i)=><div key={i} style={{position:"absolute",left:1120+i*85*p,top:430-i*15*p,width:62,height:62,borderRadius:16,background:i%2?ACCENT:"rgba(244,240,233,.13)",opacity:p}}/>)}
    {Array.from({length:10}).map((_,i)=><div key={"b"+i} style={{position:"absolute",left:1110+(i%5)*120*p,top:730+Math.floor(i/5)*90,width:94,height:54,borderRadius:12,border:"1px solid rgba(244,240,233,.16)",opacity:p*.8}}/>)}
    <div style={{position:"absolute",left:110,bottom:94,fontSize:38,fontWeight:800}}>差别往往不是“时间更多”，而是<span style={{color:ACCENT}}>注意投向了哪里。</span></div>
  </Stage>;
};

export const Scene11:React.FC=()=>{
  const f=useCurrentFrame(),d=frames[11],quiet=f>180;
  if(quiet)return <Stage duration={d} dark noFade>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{fontSize:32,color:"rgba(244,240,233,.4)",letterSpacing:3}}>96 秒</div>
      <div style={{fontSize:68,fontWeight:900,marginTop:22}}>当噪声突然停下，</div>
      <div style={{fontSize:68,fontWeight:900,color:ACCENT}}>你才听见自己的目标。</div>
    </div>
  </Stage>;
  return <Stage duration={d} dark noFade>
    <Kicker>HIJACK / 11</Kicker>
    <div style={{position:"absolute",left:110,top:145,fontSize:60,fontWeight:900}}>最危险的不是信息多，<br/>而是每条都在喊：<span style={{color:ACCENT}}>“现在就看我。”</span></div>
    {Array.from({length:24}).map((_,i)=>{
      const q=smooth(clamp((f-i*3)/145)),x0=((i*173)%1800)+60,y0=300+((i*83)%620),ang=i*.72,r=420*(1-q),x=960+Math.cos(ang)*r+(x0-960)*(1-q)*.45,y=570+Math.sin(ang)*r*.7+(y0-570)*(1-q)*.35;
      return <div key={i} style={{position:"absolute",left:x,top:y,width:160+(i%5)*24,height:82+(i%4)*18,transform:"translate(-50%,-50%) rotate("+((i%7-3)*3)+"deg)",borderRadius:18,background:i%5===0?ACCENT:"rgba(244,240,233,.10)",border:"1px solid rgba(244,240,233,.16)",boxShadow:"0 12px 50px rgba(0,0,0,.22)"}}/>;
    })}
  </Stage>;
};

export const Scene12:React.FC=()=>{
  const f=useCurrentFrame(),rules=[["01","打开之前","先说清楚目的"],["02","一个屏幕","只保留一个主任务"],["03","每天留白","让注意力有地方回来"]] as const;
  return <Stage duration={frames[12]} dark={false}>
    <Kicker dark={false}>DESIGN THE ENVIRONMENT / 12</Kicker>
    <div style={{position:"absolute",left:110,top:145,fontSize:56,fontWeight:900}}>保护注意力，先别和意志力硬碰硬。<br/><span style={{color:ACCENT}}>先改环境。</span></div>
    {rules.map((r,i)=>{
      const enter=smooth(clamp((f-25-i*38)/55));
      return <div key={r[0]} style={{position:"absolute",left:140+i*590,top:470+20*i,width:500,height:360,borderRadius:34,border:"2px solid "+(i===1?ACCENT:"rgba(9,10,12,.14)"),background:"#fff",boxShadow:"0 28px 80px rgba(9,10,12,.08)",transform:"translateY("+((1-enter)*70)+"px)",opacity:enter,padding:34}}>
        <div style={{fontSize:26,fontWeight:900,color:ACCENT}}>{r[0]}</div>
        <div style={{fontSize:46,fontWeight:900,marginTop:32}}>{r[1]}</div>
        <div style={{fontSize:30,lineHeight:1.45,color:"rgba(9,10,12,.55)",marginTop:24}}>{r[2]}</div>
        <div style={{position:"absolute",left:34,right:34,bottom:34,height:6,borderRadius:8,background:"rgba(9,10,12,.08)"}}>
          <div style={{height:"100%",width:(enter*100)+"%",background:ACCENT,borderRadius:8}}/>
        </div>
      </div>;
    })}
  </Stage>;
};

export const Scene13:React.FC=()=>{
  const f=useCurrentFrame(),p=smooth(clamp((f-45)/110));
  return <Stage duration={frames[13]} dark>
    <Kicker>DAY / 13</Kicker>
    <div style={{position:"absolute",left:110,top:150,fontSize:60,fontWeight:900}}>一天不是只被时间切碎。<br/><span style={{color:ACCENT}}>更常被注意切碎。</span></div>
    <div style={{position:"absolute",left:112,top:360,width:1696,height:94,display:"flex",gap:8}}>
      {Array.from({length:24}).map((_,i)=><div key={i} style={{flex:1,borderRadius:8,background:i%7===0||i%11===0?ACCENT:"rgba(244,240,233,.13)",transform:"translateY("+(p*((i%6)*75))+"px) translateX("+(p*((i%4-1.5)*10))+"px)",height:94+p*((i*37)%170)}}/>)}
    </div>
    <div style={{position:"absolute",left:110,bottom:110,fontSize:34,color:"rgba(244,240,233,.58)",maxWidth:920,lineHeight:1.5}}>你无法把每一分钟都变长，但可以决定：哪些分钟真正进入记忆、关系和作品。</div>
  </Stage>;
};

export const Scene14:React.FC=()=>{
  const f=useCurrentFrame(),p=smooth(clamp((f-35)/110));
  return <Stage duration={frames[14]} dark noFade>
    <div style={{position:"absolute",left:960,top:540,width:30+1570*p,height:30+1570*p,borderRadius:"50%",transform:"translate(-50%,-50%)",background:"rgba(255,107,74,"+(.08+.1*p)+")",boxShadow:"0 0 "+(80+220*p)+"px "+ACCENT}}/>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center"}}>
      <div style={{fontSize:34,letterSpacing:4,color:"rgba(244,240,233,.48)",opacity:interpolate(f,[0,35],[0,1],{extrapolateRight:"clamp"})}}>WHAT ENTERS YOUR WORLD?</div>
      <div style={{fontSize:104,fontWeight:900,letterSpacing:-5,lineHeight:1.02,marginTop:24}}>注意力<br/><span style={{color:ACCENT}}>就是你全部需要的</span></div>
      <div style={{fontSize:30,marginTop:34,color:"rgba(244,240,233,.58)",maxWidth:950,lineHeight:1.5}}>你最终拥有的，不是经过你眼前的一切，<br/>而是那些被你持续选择、记住并投入行动的东西。</div>
    </div>
  </Stage>;
};
