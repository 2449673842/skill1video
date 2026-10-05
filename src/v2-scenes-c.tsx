import React from "react";
import {interpolate,useCurrentFrame} from "remotion";
import {Stage,Kicker,Caption,GridFloor,RingMachine,FocusReticle,Paper,GlowLine,Word,SplitTitle,GOLD,GOLD2,CREAM,TEAL,RED,INK,frames,hash,clamp,lerp,smooth,smoother,intro} from "./v2-common";

export const V2Scene10:React.FC=()=>{
  const f=useCurrentFrame();
  const p=smooth(clamp((f-15)/180));
  return <Stage>
    <Kicker>LIFE FORK / TWO FUTURES</Kicker>
    <SplitTitle a="同样的一天，" b="可以被注意力长成两个世界。" y={105}/>
    <GridFloor opacity={.14} horizon={400}/>
    <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
      <path d="M 250 790 C 600 720, 800 650, 930 610" fill="none" stroke="rgba(239,229,204,.22)" strokeWidth="8"/>
      <path d="M 930 610 C 1170 540, 1370 380, 1730 300" fill="none" stroke={GOLD2} strokeWidth="9" strokeLinecap="round"/>
      <path d="M 930 610 C 1180 700, 1380 830, 1740 860" fill="none" stroke="rgba(239,229,204,.24)" strokeWidth="9" strokeLinecap="round"/>
    </svg>
    <div style={{position:"absolute",left:1210,top:250,fontSize:30,fontWeight:900,color:GOLD2}}>深度 / 创作 / 关系</div>
    <div style={{position:"absolute",left:1210,top:865,fontSize:30,fontWeight:900,color:"rgba(239,229,204,.45)"}}>碎片 / 反应 / 刷新</div>
    {Array.from({length:7}).map((_,i)=><div key={i} style={{position:"absolute",left:1150+i*82*p,top:445-i*18*p,width:56,height:56,borderRadius:12,
      background:i%2?GOLD2:"rgba(217,178,111,.18)",boxShadow:i%2?"0 0 18px rgba(217,178,111,.24)":"none",opacity:p}}/>)}
    {Array.from({length:14}).map((_,i)=><div key={"b"+i} style={{position:"absolute",left:1130+(i%7)*86*p,top:725+Math.floor(i/7)*78,width:68,height:44,borderRadius:8,
      border:"1px solid rgba(239,229,204,.14)",background:i%5===0?"rgba(216,88,73,.18)":"rgba(239,229,204,.04)",opacity:p}}/>)}
    <div style={{position:"absolute",left:930,top:610,width:22,height:22,borderRadius:"50%",background:GOLD2,boxShadow:"0 0 36px "+GOLD2,transform:"translate(-50%,-50%)"}}/>
    <Caption>你无法决定所有信息是否出现，但可以决定哪条路被反复走深。</Caption>
  </Stage>;
};

export const V2Scene11:React.FC=()=>{
  const f=useCurrentFrame();
  const cells=Array.from({length:12*24});
  const selectIndex=10*24+18;
  const zoom=smooth(clamp((f-130)/85));
  return <Stage>
    <Kicker>HIJACK / THE MATRIX</Kicker>
    <div style={{position:"absolute",left:110,top:110,fontSize:56,fontWeight:900}}>最危险的不是信息多。<br/><span style={{color:RED}}>而是每一格都在争夺“现在”。</span></div>
    <div style={{position:"absolute",left:960,top:590,width:1320,height:520,transform:"translate(-50%,-50%) scale("+(1+zoom*3.1)+") translate("+(-zoom*250)+"px,"+(-zoom*155)+"px)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(24,1fr)",gap:7,width:"100%",height:"100%"}}>
        {cells.map((_,i)=>{
          const sel=i===selectIndex;
          const pulse=sel?.75+.25*Math.sin(f*.14):0;
          return <div key={i} style={{borderRadius:4,background:sel?"rgba(216,88,73,"+pulse+")":"rgba(239,229,204,.12)",
            boxShadow:sel?"0 0 26px rgba(216,88,73,.8)":"none",border:sel?"1px solid rgba(255,190,175,.65)":"1px solid rgba(239,229,204,.035)"}}/>;
        })}
      </div>
    </div>
    <div style={{position:"absolute",left:1265,top:750,fontSize:24,color:RED,opacity:1-zoom}}>下一秒 →</div>
    {zoom>.78&&<div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 58% 62%,rgba(216,88,73,.22),rgba(7,9,11,.9) 42%)",opacity:(zoom-.78)/.22}}/>}
    <Caption>当一个格子被选中，镜头会越靠越近——直到它看起来像整个世界。</Caption>
  </Stage>;
};

export const V2Scene12:React.FC=()=>{
  const f=useCurrentFrame();
  const open=smoother(clamp((f-20)/75));
  const rules=[["打开之前","先说清楚目的"],["一个屏幕","只保留一个主任务"],["每天留白","给注意力回来的地方"]];
  return <Stage paper bokeh={false}>
    <Kicker paper>DESIGN THE ENVIRONMENT / PAPER</Kicker>
    <div style={{position:"absolute",left:0,top:0,width:W,height:H,background:"linear-gradient(90deg,rgba(126,90,42,.05),transparent 38%,rgba(126,90,42,.06))"}}/>
    <div style={{position:"absolute",left:960,top:535,width:1120,height:720,transform:"translate(-50%,-50%) perspective(1400px) rotateX("+(5-open*5)+"deg)"}}>
      <div style={{position:"absolute",left:0,top:0,width:"50%",height:"100%",background:"linear-gradient(90deg,#E2D2AF,#F5ECD5)",transformOrigin:"right center",
        transform:"rotateY("+(-26+26*open)+"deg)",boxShadow:"inset -22px 0 38px rgba(92,63,27,.12),0 34px 70px rgba(81,53,22,.18)"}}/>
      <div style={{position:"absolute",right:0,top:0,width:"50%",height:"100%",background:"linear-gradient(90deg,#F8F0DA,#E3D2AE)",
        transformOrigin:"left center",transform:"rotateY("+(26-26*open)+"deg)",boxShadow:"inset 22px 0 38px rgba(92,63,27,.12),0 34px 70px rgba(81,53,22,.18)"}}/>
      <div style={{position:"absolute",left:"50%",top:0,width:2,height:"100%",background:"rgba(94,62,26,.22)"}}/>
    </div>
    <div style={{position:"absolute",left:210,top:145,fontSize:58,fontWeight:900,lineHeight:1.15,color:INK}}>
      保护注意力，<br/><span style={{color:"#7C5B22"}}>先设计环境，不要先责怪意志力。</span>
    </div>
    {rules.map((r,i)=>{
      const p=intro(f,70+i*34,35);
      const x=420+i*530;
      return <div key={r[0]} style={{position:"absolute",left:x,top:575+i*18,width:420,height:235,transform:"translate(-50%,-50%) translateY("+((1-p)*60)+"px)",
        opacity:p,background:"rgba(255,250,236,.78)",border:"1px solid rgba(88,59,24,.18)",boxShadow:"0 22px 45px rgba(73,48,20,.12)",padding:26}}>
        <div style={{fontSize:19,fontWeight:900,color:"#8A6425",letterSpacing:3}}>0{i+1}</div>
        <div style={{fontSize:38,fontWeight:900,marginTop:16}}>{r[0]}</div>
        <div style={{fontSize:24,lineHeight:1.45,color:"rgba(11,13,16,.58)",marginTop:16}}>{r[1]}</div>
      </div>;
    })}
    <Caption paper>最省力的注意力管理，不是每次都赢过诱惑，而是让诱惑更难靠近。</Caption>
  </Stage>;
};

export const V2Scene13:React.FC=()=>{
  const f=useCurrentFrame();
  const p=smoother(clamp((f-30)/160));
  const blocks=Array.from({length:30});
  return <Stage paper bokeh={false}>
    <Kicker paper>DAY / ONE PAGE</Kicker>
    <Paper x={960} y={540} w={1250} h={710} rotate={-1.2}>
      <div style={{position:"absolute",left:90,top:70,fontSize:44,fontWeight:900,color:INK}}>一天不是只被时间切碎。</div>
      <div style={{position:"absolute",left:90,top:127,fontSize:44,fontWeight:900,color:"#876326"}}>更常被注意力切碎。</div>
      <div style={{position:"absolute",left:90,top:235,right:90,height:250,display:"grid",gridTemplateColumns:"repeat(15,1fr)",gap:7}}>
        {blocks.map((_,i)=>{
          const hot=i%7===0||i%11===0||i===23;
          const dy=p*((i%5)*46);
          const rot=p*((i%4)-1.5)*4;
          return <div key={i} style={{height:74,transform:"translateY("+dy+"px) rotate("+rot+"deg)",
            borderRadius:5,background:hot?"#B77745":"rgba(11,13,16,.10)",
            boxShadow:hot?"0 9px 18px rgba(128,76,32,.12)":"none"}}/>;
        })}
      </div>
      <div style={{position:"absolute",left:90,bottom:90,fontSize:25,lineHeight:1.55,color:"rgba(11,13,16,.54)",maxWidth:890}}>
        时间没有变少，但一旦连续注意被切成许多碎片，真正留下来的作品、理解和关系就会变少。
      </div>
    </Paper>
    <Caption paper>你无法把一天变长，但可以让其中一部分变得更完整。</Caption>
  </Stage>;
};

export const V2Scene14:React.FC=()=>{
  const f=useCurrentFrame();
  const grow=smoother(clamp((f-25)/155));
  const reveal=intro(f,72,35);
  return <Stage warm>
    <Kicker>EPILOGUE / WHAT YOU WATER GROWS</Kicker>
    <div style={{position:"absolute",left:960,top:830,width:600,height:120,transform:"translate(-50%,-50%) perspective(900px) rotateX(68deg)",
      borderRadius:"50%",background:"radial-gradient(ellipse,rgba(217,178,111,.22),transparent 70%)"}}/>
    <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
      <path d={"M 960 840 C 960 "+(790-140*grow)+", 960 "+(720-300*grow)+", 960 "+(640-250*grow)} fill="none" stroke={GOLD2} strokeWidth="7" strokeLinecap="round"/>
      {Array.from({length:18}).map((_,i)=>{
        const side=i%2===0?-1:1;
        const level=Math.floor(i/2);
        const y=700-level*30*grow;
        const x=960+side*(60+level*34)*grow;
        const x2=960+side*(160+level*62)*grow;
        const y2=y-(55+level*8)*grow;
        return <path key={i} d={"M "+x+" "+y+" Q "+(x+side*40)+" "+(y-25*grow)+", "+x2+" "+y2} fill="none" stroke={i%3===0?TEAL:GOLD} strokeWidth={3+(i%4)} strokeOpacity={.45+.45*grow} strokeLinecap="round"/>;
      })}
      {Array.from({length:22}).map((_,i)=>{
        const a=-2.6+i*(5.2/21);
        const rr=(170+hash(i,1)*260)*grow;
        const x=960+Math.cos(a)*rr;
        const y=545+Math.sin(a)*rr*.65;
        const r=5+hash(i,2)*11;
        return <circle key={i} cx={x} cy={y} r={r} fill={i%5===0?TEAL:GOLD2} fillOpacity={.25+.65*grow}/>;
      })}
    </svg>
    <div style={{position:"absolute",left:960,top:575,width:180,height:180,borderRadius:"50%",transform:"translate(-50%,-50%) scale("+(1+grow*.25)+")",
      background:"radial-gradient(circle at 35% 30%,rgba(102,185,170,.55),rgba(7,22,22,.93) 56%,#020405 78%)",
      border:"5px solid rgba(217,178,111,.68)",boxShadow:"0 0 75px rgba(217,178,111,.25)"}}/>
    <div style={{position:"absolute",left:130,top:175,width:760,opacity:reveal,transform:"translateY("+((1-reveal)*35)+"px)"}}>
      <div style={{fontSize:30,letterSpacing:5,color:"rgba(217,178,111,.65)"}}>ATTENTION IS WHAT YOU WATER</div>
      <div style={{fontSize:88,fontWeight:900,lineHeight:1.05,letterSpacing:-3,marginTop:18}}>注意力，<br/><span style={{color:GOLD2}}>就是你全部需要的。</span></div>
      <div style={{fontSize:30,lineHeight:1.6,color:"rgba(239,229,204,.56)",marginTop:30,maxWidth:650}}>
        你最终拥有的，不是经过眼前的一切。<br/>而是那些被你持续选择、记住，并投入行动的东西。
      </div>
    </div>
    <div style={{position:"absolute",right:130,bottom:120,fontSize:30,color:"rgba(239,229,204,.52)",textAlign:"right",lineHeight:1.5}}>
      你持续看向哪里，<br/><span style={{color:GOLD2}}>哪里就更可能长成你的人生。</span>
    </div>
  </Stage>;
};
