import React from "react";
import {interpolate,useCurrentFrame} from "remotion";
import {ACCENT as _unused} from "./common";
import {Stage,Kicker,Caption,Source,GridFloor,RingMachine,FocusReticle,Paper,GlowLine,Word,SplitTitle,GOLD,GOLD2,CREAM,TEAL,RED,INK,frames,hash,clamp,lerp,smooth,smoother,intro} from "./v2-common";

export const V2Scene0:React.FC=()=>{
  const f=useCurrentFrame();
  const p=intro(f,0,50);
  const zoom=interpolate(f,[0,100,210],[1.65,1.0,.88],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const tx=interpolate(f,[0,210],[160,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <Stage warm>
    <Kicker>ATTENTION / PROLOGUE</Kicker>
    <div style={{position:"absolute",inset:0,transform:"translateX("+tx+"px) scale("+zoom+")"}}>
      <RingMachine x={710} y={485} scale={1.02} speed={1.4}/>
    </div>
    <div style={{position:"absolute",right:150,top:240,width:690,opacity:p,transform:"translateY("+((1-p)*35)+"px)"}}>
      <div style={{fontSize:28,letterSpacing:5,color:"rgba(217,178,111,.62)",marginBottom:20}}>WHAT YOU KEEP BECOMES YOUR WORLD</div>
      <div style={{fontSize:82,fontWeight:900,lineHeight:1.03,letterSpacing:-3}}>
        你以为你看见的是世界。<br/><span style={{color:GOLD2}}>其实你只活在被注意的部分。</span>
      </div>
      <div style={{marginTop:26,fontSize:28,lineHeight:1.55,color:"rgba(239,229,204,.56)",maxWidth:590}}>
        每秒都有海量信号经过你，但只有极少数会被你选中、记住，并继续影响下一次选择。
      </div>
    </div>
    <div style={{position:"absolute",left:710,top:485,width:16,height:16,borderRadius:"50%",background:GOLD2,boxShadow:"0 0 40px "+GOLD2}}/>
    <Caption>注意力，不只是资源。它决定了什么能进入你的世界。</Caption>
  </Stage>;
};

export const V2Scene1:React.FC=()=>{
  const f=useCurrentFrame();
  const p=smooth(clamp((f-15)/170));
  const particles=Array.from({length:220});
  const aperture=interpolate(f,[0,80,210],[210,125,56],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <Stage>
    <Kicker>INPUT / BOTTLENECK</Kicker>
    <div style={{position:"absolute",left:100,top:130}}>
      <div style={{fontSize:26,color:"rgba(239,229,204,.5)"}}>感官输入量级</div>
      <div style={{fontSize:88,fontWeight:900,letterSpacing:-4,marginTop:4}}>≈ 10⁹ <span style={{fontSize:34,color:GOLD2}}>bit/s</span></div>
    </div>
    <div style={{position:"absolute",right:100,top:130,textAlign:"right"}}>
      <div style={{fontSize:26,color:"rgba(239,229,204,.5)"}}>高层行为吞吐量估计</div>
      <div style={{fontSize:88,fontWeight:900,letterSpacing:-4,marginTop:4,color:GOLD2}}>≈ 10 <span style={{fontSize:34}}>bit/s</span></div>
    </div>
    {particles.map((_,i)=>{
      const x0=-120+hash(i,1)*1040;
      const y0=320+hash(i,2)*640;
      const rank=hash(i,4);
      const pass=i%27===0||i%41===0;
      const q=smoother(clamp((p-rank*.18)/.82));
      const x=lerp(x0,1010+(i%9-4)*4,q);
      const y=lerp(y0,545+(i%9-4)*3,q);
      const s=3+hash(i,3)*8;
      return <div key={i} style={{position:"absolute",left:x,top:y,width:s,height:s,borderRadius:"50%",
        background:pass?GOLD2:"rgba(239,229,204,.42)",opacity:pass?.95:.18+.65*(1-q),
        boxShadow:pass?"0 0 16px "+GOLD2:"none"}}/>;
    })}
    <div style={{position:"absolute",left:1010-aperture,top:545-aperture,width:aperture*2,height:aperture*2,borderRadius:"50%",
      border:"5px solid rgba(217,178,111,.72)",boxShadow:"0 0 55px rgba(217,178,111,.2), inset 0 0 40px rgba(217,178,111,.12)"}}/>
    {Array.from({length:9}).map((_,i)=>{
      const a=f*.35+i*40;
      return <div key={i} style={{position:"absolute",left:1010-aperture-10,top:545-2,width:(aperture+10)*2,height:4,
        transformOrigin:"center",transform:"rotate("+a+"deg)",background:"linear-gradient(90deg,transparent,rgba(217,178,111,.15),transparent)"}}/>
    })}
    <div style={{position:"absolute",left:1180,top:455,width:620,fontSize:36,fontWeight:800,lineHeight:1.45}}>
      海量输入，不会变成海量意识。<br/><span style={{color:GOLD2}}>绝大多数在进入“此刻”之前就被过滤掉了。</span>
    </div>
    <Source dark={undefined}>Zheng & Meister, Neuron 113(2), 2025 · 量级估算</Source>
  </Stage>;
};

export const V2Scene2:React.FC=()=>{
  const f=useCurrentFrame();
  const words=["消息","人脸","声音","价格","红灯","工作","危险","机会","广告","记忆","疼痛","音乐","陌生人","点赞","气味","路牌"];
  const q=smooth(clamp((f-20)/170));
  return <Stage>
    <Kicker>FILTERS / DEPTH</Kicker>
    <SplitTitle a="信息不是被动进入。" b="它要穿过一层层优先级。" y={112}/>
    <GridFloor opacity={.12} horizon={465}/>
    {[0,1,2,3].map((g)=>{
      const depth=g/3;
      const scale=1-depth*.13;
      const x=980+g*180;
      const y=505-g*44;
      const w=290*scale,h=430*scale;
      const tilt=-6+g*4+Math.sin(f*.018+g)*2;
      const labels=["感官","目标","显著性","经验"][g];
      return <div key={g} style={{position:"absolute",left:x-w/2,top:y-h/2,width:w,height:h,
        border:"1px solid rgba(217,178,111,"+(.52-depth*.18)+")",borderRadius:18,
        background:"linear-gradient(135deg,rgba(217,178,111,.035),rgba(80,100,95,.02))",
        boxShadow:"inset 0 0 50px rgba(217,178,111,.025),0 30px 80px rgba(0,0,0,.18)",
        transform:"perspective(900px) rotateY("+tilt+"deg)"}}>
        <div style={{position:"absolute",top:-42,left:0,fontSize:20,fontWeight:800,letterSpacing:3,color:"rgba(217,178,111,.72)"}}>{labels}</div>
      </div>;
    })}
    {words.map((w,i)=>{
      const start=i*5;
      const p=smoother(clamp((f-start)/145));
      const x0=100+hash(i,1)*580,y0=360+hash(i,2)*510;
      const hit=i%4===0||i%7===0;
      const x1=1120+(i%3)*160,y1=510+(i%5)*54;
      return <Word key={w} x={lerp(x0,x1,p)} y={lerp(y0,y1,p)} size={24+hash(i,3)*15}
        color={hit?GOLD2:CREAM} opacity={hit?1:1-p*.88}>{w}</Word>;
    })}
    <div style={{position:"absolute",right:94,bottom:100,width:610,fontSize:28,lineHeight:1.6,color:"rgba(239,229,204,.56)"}}>
      目标、显著性、过去经验、奖励历史……都会决定哪条信号被放大，哪条被丢弃。
    </div>
  </Stage>;
};

export const V2Scene3:React.FC=()=>{
  const f=useCurrentFrame();
  const rows=9,cols=14;
  const t=f/frames[3];
  const reveal=f>138;
  const targetX=interpolate(f,[0,120,220],[620,1080,1320],{extrapolateRight:"clamp"});
  const targetY=interpolate(f,[0,120,220],[470,620,470],{extrapolateRight:"clamp"});
  return <Stage>
    <Kicker>INATTENTIONAL BLINDNESS / CROWD</Kicker>
    <GridFloor opacity={.2} horizon={390}/>
    <div style={{position:"absolute",left:100,top:110,fontSize:50,fontWeight:900}}>盯住<span style={{color:GOLD2}}>发光的人</span>，数他移动了几次。</div>
    {Array.from({length:rows*cols}).map((_,i)=>{
      const r=Math.floor(i/cols),c=i%cols;
      const yy=420+r*62;
      const persp=1+(yy-420)/900;
      const xx=250+(c-cols/2)*92*persp;
      const selected=(r===4&&c===7);
      return <div key={i} style={{position:"absolute",left:selected?targetX:xx,top:selected?targetY:yy,transform:"translate(-50%,-50%) scale("+(.55+r*.055)+")"}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:selected?GOLD2:"rgba(239,229,204,.45)",boxShadow:selected?"0 0 25px "+GOLD2:"none"}}/>
        <div style={{width:18,height:30,margin:"-1px auto 0",borderRadius:"8px 8px 4px 4px",background:selected?GOLD2:"rgba(239,229,204,.34)"}}/>
      </div>;
    })}
    <div style={{position:"absolute",left:interpolate(f,[35,150],[1950,-180],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),top:545,transform:"translate(-50%,-50%)"}}>
      <div style={{width:58,height:58,borderRadius:"50%",background:RED,opacity:reveal?1:.52,boxShadow:reveal?"0 0 45px rgba(216,88,73,.75)":"none"}}/>
      <div style={{width:46,height:105,borderRadius:"22px 22px 14px 14px",background:RED,marginTop:-5,opacity:reveal?1:.52}}/>
    </div>
    <FocusReticle x={targetX} y={targetY} r={70}/>
    {reveal&&<div style={{position:"absolute",left:1070,top:280,fontSize:46,fontWeight:900,color:RED,
      opacity:intro(f,140,22),transform:"rotate(-3deg)"}}>刚才那个人，你看见了吗？</div>}
    <Caption>注意被任务占住时，显眼的东西也可能“没有进入你的世界”。</Caption>
    <Source>Simons & Chabris, Perception 28, 1999</Source>
  </Stage>;
};

export const V2Scene4:React.FC=()=>{
  const f=useCurrentFrame();
  const labels=[["工作",360,360],["朋友",650,310],["危险",1020,400],["机会",1420,330],["通知",530,690],["新闻",900,640],["价格",1300,700],["音乐",1580,600]];
  const idx=Math.floor(f/45)%labels.length;
  const current=labels[idx];
  const x=Number(current[1]),y=Number(current[2]);
  return <Stage warm>
    <Kicker>PRIORITY MAP / SEARCHLIGHT</Kicker>
    <SplitTitle a="你在寻找什么，" b="什么就更容易跳出来。" y={112}/>
    {Array.from({length:46}).map((_,i)=>{
      const xx=90+hash(i,1)*1740,yy=280+hash(i,2)*650,s=2+hash(i,3)*4;
      return <div key={i} style={{position:"absolute",left:xx,top:yy,width:s,height:s,borderRadius:"50%",background:"rgba(217,178,111,.28)"}}/>;
    })}
    {labels.map((item,i)=><Word key={String(item[0])} x={Number(item[1])} y={Number(item[2])}
      size={i===idx?52:31} color={i===idx?GOLD2:"rgba(239,229,204,.35)"} opacity={i===idx?1:.7} weight={i===idx?900:650}>{item[0]}</Word>)}
    <FocusReticle x={x} y={y} r={105}/>
    <GlowLine x1={960} y1={545} x2={x} y2={y} width={1.5} opacity={.32}/>
    <div style={{position:"absolute",left:960,top:545,width:30,height:30,borderRadius:"50%",background:GOLD2,boxShadow:"0 0 60px 18px rgba(217,178,111,.28)",transform:"translate(-50%,-50%)"}}/>
    <Caption>注意力像一盏探照灯。它照亮什么，也同时制造了黑暗。</Caption>
  </Stage>;
};
