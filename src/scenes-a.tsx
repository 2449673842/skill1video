import React from "react";
import {interpolate,useCurrentFrame} from "remotion";
import {ACCENT,INK,PAPER,Stage,Kicker,Source,Pill,frames,hash,clamp,lerp,smooth} from "./common";

export const Scene0:React.FC=()=>{
  const f=useCurrentFrame();
  const words=["NEWS","CHAT","WORK","FEED","FEAR","LIKE","TREND","MAIL","AI","PRICE","ALERT","NOW"];
  return <Stage duration={frames[0]} dark>
    <Kicker>ATTENTION / 00</Kicker>
    {words.map((w,i)=>{
      const t=clamp((f-i*2)/80);
      const x=960+(hash(i,1)-.5)*1500*(1-t);
      const y=540+(hash(i,2)-.5)*760*(1-t);
      return <div key={w} style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%) rotate("+((hash(i,3)-.5)*18*(1-t))+"deg)",fontSize:22+hash(i,4)*22,fontWeight:700,letterSpacing:2,color:"rgba(244,240,233,"+(0.12+0.22*(1-t))+")"}}>{w}</div>;
    })}
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{fontSize:interpolate(f,[15,80],[34,114],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),fontWeight:900,letterSpacing:-5,lineHeight:1.05,textAlign:"center"}}>
        注意力<br/><span style={{color:ACCENT}}>就是你全部需要的</span>
      </div>
      <div style={{marginTop:32,fontSize:28,color:"rgba(244,240,233,.58)",opacity:interpolate(f,[90,135],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>你的世界，不是被你看见的全部组成的。</div>
    </div>
  </Stage>;
};

export const Scene1:React.FC=()=>{
  const f=useCurrentFrame();
  const p=smooth(clamp((f-20)/160));
  const dots=Array.from({length:180});
  return <Stage duration={frames[1]} dark>
    <Kicker>FILTER / 01</Kicker>
    <div style={{position:"absolute",left:110,top:165,fontSize:30,color:"rgba(244,240,233,.6)"}}>感官系统收集</div>
    <div style={{position:"absolute",left:110,top:207,fontSize:92,fontWeight:900,letterSpacing:-4}}>≈ 10⁹ <span style={{fontSize:36,fontWeight:600}}>bit/s</span></div>
    <div style={{position:"absolute",right:110,top:165,textAlign:"right",fontSize:30,color:"rgba(244,240,233,.6)"}}>高层行为吞吐量估计</div>
    <div style={{position:"absolute",right:110,top:207,textAlign:"right",fontSize:92,fontWeight:900,letterSpacing:-4,color:ACCENT}}>≈ 10 <span style={{fontSize:36,fontWeight:600}}>bit/s</span></div>
    {dots.map((_,i)=>{
      const x0=90+hash(i,1)*760,y0=330+hash(i,2)*610,lane=(i%9)-4;
      const x1=1060+lane*10,y1=540+lane*7,q=smooth(clamp((p-hash(i,3)*.25)/.75));
      return <div key={i} style={{position:"absolute",left:lerp(x0,x1,q),top:lerp(y0,y1,q),width:5+hash(i,4)*7,height:5+hash(i,4)*7,borderRadius:"50%",background:i%23===0?ACCENT:"rgba(244,240,233,.48)",opacity:.25+.75*(1-q*.4)}}/>;
    })}
    <div style={{position:"absolute",left:900,top:335,width:320,height:410,border:"2px solid rgba(255,107,74,.55)",clipPath:"polygon(0 0,100% 28%,100% 72%,0 100%)"}}/>
    <div style={{position:"absolute",left:820,top:816,fontSize:38,fontWeight:800}}>海量输入，极窄输出。</div>
    <Source dark>Zheng & Meister, Neuron (2025) · 量级估算</Source>
  </Stage>;
};

export const Scene2:React.FC=()=>{
  const f=useCurrentFrame();
  const items=["消息","人脸","声音","价格","红灯","工作","危险","机会","广告","记忆","疼痛","音乐","陌生人","点赞","气味","路牌"];
  return <Stage duration={frames[2]} dark={false}>
    <Kicker dark={false}>GATES / 02</Kicker>
    <div style={{position:"absolute",left:120,top:175,fontSize:66,fontWeight:900,lineHeight:1.1,letterSpacing:-2}}>
      你不是看见全部世界。<br/><span style={{color:ACCENT}}>你看见的是通过筛选的世界。</span>
    </div>
    {[0,1,2].map((g)=>{
      const wob=Math.sin((f+g*20)*.04)*12;
      return <div key={g} style={{position:"absolute",left:760+g*245+wob,top:420-g*26,width:210,height:390,border:(4-g)+"px solid rgba(9,10,12,"+(.65-g*.12)+")",borderRadius:22,transform:"perspective(800px) rotateY("+(g*7-7)+"deg)"}}>
        <div style={{position:"absolute",top:-48,left:0,fontSize:22,fontWeight:800,letterSpacing:2}}>{["感官","目标","经验"][g]}</div>
      </div>;
    })}
    {items.map((w,i)=>{
      const q=smooth(clamp((f-i*7)/120));
      const x=lerp(40+hash(i,1)*560,1220+(i%3)*170,q),y=lerp(430+hash(i,2)*420,510+(i%5)*70,q),pass=i%5===0||i%7===0;
      return <div key={w} style={{position:"absolute",left:x,top:y,fontSize:30+hash(i,3)*13,fontWeight:800,opacity:pass?1:1-q*.83,color:pass?ACCENT:INK,transform:"translate(-50%,-50%) scale("+(pass?1:1-q*.3)+")"}}>{w}</div>;
    })}
    <div style={{position:"absolute",right:100,bottom:120,fontSize:30,color:"rgba(9,10,12,.52)",maxWidth:560,lineHeight:1.5}}>注意力不是“照相机”。<br/>它更像一道不断改写优先级的闸门。</div>
  </Stage>;
};

const Person:React.FC<{x:number;y:number;dark:boolean;label:string}>=({x,y,dark,label})=><div style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-50%)",textAlign:"center"}}>
  <div style={{width:74,height:74,borderRadius:"50%",background:dark?"#24262A":"#D9D3C8",boxShadow:"0 12px 30px rgba(0,0,0,.12)"}}/>
  <div style={{fontSize:18,marginTop:10,fontWeight:800}}>{label}</div>
</div>;

export const Scene3:React.FC=()=>{
  const f=useCurrentFrame(),reveal=f>150,bt=(f%90)/90,bx=lerp(620,1320,smooth(bt)),by=500+Math.sin(bt*Math.PI)*-160,gx=lerp(-180,2100,smooth(clamp((f-55)/115)));
  return <Stage duration={frames[3]} dark={false}>
    <Kicker dark={false}>INATTENTIONAL BLINDNESS / 03</Kicker>
    <div style={{position:"absolute",left:110,top:145,fontSize:46,fontWeight:900}}>先做个小任务：<span style={{color:ACCENT}}>数橙色球被传了几次。</span></div>
    <div style={{position:"absolute",left:460,top:280,width:1000,height:560,border:"2px solid rgba(9,10,12,.14)",borderRadius:42}}>
      <Person x={150} y={140} dark={false} label="A"/><Person x={150} y={410} dark label="B"/>
      <Person x={500} y={70} dark={false} label="C"/><Person x={500} y={465} dark label="D"/>
      <Person x={850} y={140} dark={false} label="E"/><Person x={850} y={410} dark label="F"/>
      <div style={{position:"absolute",left:bx-460,top:by-280,width:34,height:34,borderRadius:"50%",background:ACCENT,boxShadow:"0 0 22px "+ACCENT}}/>
      <div style={{position:"absolute",left:gx-460,top:240,transform:"translate(-50%,-50%)"}}>
        <div style={{width:74,height:74,borderRadius:"50%",background:INK,margin:"0 auto"}}/>
        <div style={{width:118,height:175,borderRadius:"48% 48% 30% 30%",background:INK,marginTop:-8}}/>
      </div>
      {reveal&&<div style={{position:"absolute",left:380,top:35,width:240,height:410,border:"5px solid "+ACCENT,borderRadius:32,boxShadow:"0 0 0 10px rgba(255,107,74,.12)"}}/>}
    </div>
    <div style={{position:"absolute",left:110,bottom:112,fontSize:36,fontWeight:800}}>{reveal?"注意被任务占住时，显眼的东西也可能“消失”。":"别看文字，继续数球。"}</div>
    <Source>Simons & Chabris, Perception 28 (1999)</Source>
  </Stage>;
};

export const Scene4:React.FC=()=>{
  const f=useCurrentFrame();
  const words=[["工作",350,390],["通知",710,300],["朋友",1110,390],["危险",1480,320],["机会",520,680],["新闻",930,630],["价格",1340,690],["脸",1620,600],["音乐",860,820],["消息",275,800]] as const;
  const idx=Math.floor((f/55)%words.length),w=words[idx],ring=150+20*Math.sin(f*.08);
  return <Stage duration={frames[4]} dark>
    <Kicker>PRIORITY MAP / 04</Kicker>
    <div style={{position:"absolute",left:110,top:160,fontSize:64,fontWeight:900,lineHeight:1.12}}>你在寻找什么，<br/><span style={{color:ACCENT}}>什么就更容易跳出来。</span></div>
    {words.map((item,i)=><div key={item[0]} style={{position:"absolute",left:item[1],top:item[2],fontSize:i===idx?58:38,fontWeight:900,color:i===idx?PAPER:"rgba(244,240,233,.22)",transform:"translate(-50%,-50%) scale("+(i===idx?1.08:1)+")"}}>{item[0]}</div>)}
    <div style={{position:"absolute",left:w[1]-ring/2,top:w[2]-ring/2,width:ring,height:ring,borderRadius:"50%",border:"3px solid "+ACCENT,boxShadow:"0 0 80px 16px rgba(255,107,74,.22)"}}/>
    <div style={{position:"absolute",right:110,bottom:105,maxWidth:620,fontSize:32,lineHeight:1.55,color:"rgba(244,240,233,.62)"}}>目标、显著性、过去经验和奖励历史，都会改写“什么值得被注意”。</div>
  </Stage>;
};
