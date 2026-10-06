import React from "react";
import {interpolate,useCurrentFrame} from "remotion";
import {Stage,Kicker,Caption,GridFloor,RingMachine,FocusReticle,GlowLine,Word,SplitTitle,GOLD,GOLD2,CREAM,TEAL,RED,INK,frames,hash,clamp,lerp,smooth,smoother,intro} from "./v2-common";

export const V2Scene5:React.FC=()=>{
  const f=useCurrentFrame();
  const cards=[["新奇","刚刚发生",GOLD2],["愤怒","必须点开",RED],["社交","有人@你",TEAL],["奖励","再刷一个",GOLD]];
  const chosen=Math.floor(f/60)%4;
  return <Stage>
    <Kicker>AUCTION / WHO GETS THE NEXT SECOND?</Kicker>
    <SplitTitle a="你的下一秒，" b="正在被很多东西竞价。" y={108}/>
    <RingMachine x={960} y={585} scale={.58} opacity={.45} speed={2.2}/>
    {cards.map((c,i)=>{
      const ang=-1.35+i*.9+Math.sin(f*.012)*.08;
      const r=365;
      const x=960+Math.cos(ang)*r,y=590+Math.sin(ang)*r*.56;
      const active=i===chosen;
      const sc=active?1.13:1;
      return <div key={c[0]} style={{position:"absolute",left:x,top:y,width:290,height:168,
        transform:"translate(-50%,-50%) scale("+sc+") rotate("+((i-1.5)*3)+"deg)",
        border:"1px solid "+(active?String(c[2]):"rgba(217,178,111,.22)"),
        background:"linear-gradient(150deg,rgba(18,24,24,.96),rgba(7,9,11,.94))",
        borderRadius:18,boxShadow:active?"0 0 50px "+String(c[2])+",0 28px 70px rgba(0,0,0,.4)":"0 22px 60px rgba(0,0,0,.3)"}}>
        <div style={{padding:"22px 24px 0",fontSize:34,fontWeight:900,color:active?String(c[2]):CREAM}}>{c[0]}</div>
        <div style={{padding:"8px 24px",fontSize:22,color:"rgba(239,229,204,.52)"}}>{c[1]}</div>
        <div style={{position:"absolute",left:24,right:24,bottom:23,height:4,background:"rgba(239,229,204,.08)"}}>
          <div style={{height:"100%",width:(active?92:44+i*10)+"%",background:String(c[2]),boxShadow:active?"0 0 14px "+String(c[2]):"none"}}/>
        </div>
      </div>;
    })}
    <div style={{position:"absolute",left:960,top:585,transform:"translate(-50%,-50%)",fontSize:24,letterSpacing:3,color:"rgba(239,229,204,.44)"}}>NEXT SECOND</div>
    <Caption>如果你不主动决定优先级，环境就会用新奇、情绪和即时奖励替你决定。</Caption>
  </Stage>;
};

export const V2Scene6:React.FC=()=>{
  const f=useCurrentFrame();
  const names=["文档","邮件","群聊","短视频"];
  const active=Math.floor(f/44)%4;
  return <Stage>
    <Kicker>CONTEXT SWITCH / STACK</Kicker>
    <SplitTitle a="多任务不是并行。" b="更像不断把整个工作台重装一遍。" y={108}/>
    <GridFloor opacity={.1} horizon={460}/>
    {names.map((n,i)=>{
      const act=i===active;
      const x=600+i*260;
      const y=560+i*26;
      const z=(i-active+4)%4;
      const p=intro(f,12+i*10,28);
      return <div key={n} style={{position:"absolute",left:x,top:y,width:460,height:290,
        transform:"translate(-50%,-50%) perspective(900px) rotateY("+(-18+i*9)+"deg) rotateX(4deg) scale("+(act?1.06:.88)+")",
        border:"1px solid "+(act?GOLD2:"rgba(217,178,111,.2)"),borderRadius:18,
        background:"linear-gradient(145deg,rgba(22,27,27,.98),rgba(7,9,11,.96))",
        boxShadow:act?"0 0 70px rgba(217,178,111,.16),0 40px 90px rgba(0,0,0,.5)":"0 26px 70px rgba(0,0,0,.32)",
        opacity:p*(act?1:.58),zIndex:act?50:10+z}}>
        <div style={{padding:26,fontSize:36,fontWeight:900,color:act?GOLD2:CREAM}}>{n}</div>
        {Array.from({length:5}).map((_,j)=><div key={j} style={{margin:"15px 28px",height:10,borderRadius:6,
          width:(54+hash(i*7+j,2)*35)+"%",background:act&&j===2?GOLD2:"rgba(239,229,204,.12)"}}/>)}
      </div>;
    })}
    {Array.from({length:12}).map((_,i)=>{
      const x1=390+hash(i,1)*1050,y1=760+hash(i,2)*130;
      const x2=610+hash(i,3)*900,y2=530+hash(i,4)*150;
      return <GlowLine key={i} x1={x1} y1={y1} x2={x2} y2={y2} color={i%4===0?RED:GOLD} width={1.2} opacity={.16}/>;
    })}
    <Caption>切换本身很快；真正慢的是找回目标、规则、位置和“我刚做到哪”。</Caption>
  </Stage>;
};

export const V2Scene7:React.FC=()=>{
  const f=useCurrentFrame();
  const p=smooth(clamp((f-15)/175));
  const words=["图像","声音","计划","关系","身体","数字","记忆","风险","语言","目标","任务","担忧","欲望","消息"];
  return <Stage>
    <Kicker>BOTTLENECK / NARROW BRIDGE</Kicker>
    <div style={{position:"absolute",left:105,top:112,fontSize:58,fontWeight:900}}>意识像一座<span style={{color:GOLD2}}>窄桥。</span></div>
    <GridFloor opacity={.2} horizon={370}/>
    {Array.from({length:6}).map((_,i)=>{const z=i/5; const w=520-z*270; const h=110-z*45; const x=960+(i%2===0?-1:1)*(350-z*120); const y=420+i*58; return <div key={"arch"+i} style={{position:"absolute",left:x-w/2,top:y-h/2,width:w,height:h,border:"1px solid rgba(217,178,111,"+(.08+z*.08)+")",borderRadius:"50%",transform:"perspective(900px) rotateX(68deg)",boxShadow:"0 0 35px rgba(217,178,111,.04)"}}/>;})}
    <div style={{position:"absolute",left:805,top:370,width:310,height:710,
      clipPath:"polygon(45% 0,55% 0,72% 100%,28% 100%)",
      background:"linear-gradient(180deg,rgba(217,178,111,.18),rgba(217,178,111,.04))",
      borderLeft:"1px solid rgba(217,178,111,.4)",borderRight:"1px solid rgba(217,178,111,.4)"}}/>
    {words.map((w,i)=>{
      const side=i%2===0?-1:1;
      const x0=960+side*(360+hash(i,1)*500),y0=430+hash(i,2)*480;
      const keep=i%4===0;
      const q=smoother(clamp((p-hash(i,3)*.24)/.76));
      const x=keep?lerp(x0,960+side*22,q):x0+side*q*240;
      const y=keep?lerp(y0,610+((i%3)-1)*85,q):y0;
      return <Word key={w} x={x} y={y} size={26+hash(i,4)*12} color={keep?GOLD2:"rgba(239,229,204,.38)"} opacity={keep?1:1-q*.75}>{w}</Word>;
    })}
    <div style={{position:"absolute",left:960,top:650,width:18,height:18,borderRadius:"50%",background:GOLD2,boxShadow:"0 0 34px "+GOLD2,transform:"translate(-50%,-50%)"}}/>
    <div style={{position:"absolute",right:115,top:560,width:500,fontSize:31,lineHeight:1.55,color:"rgba(239,229,204,.58)"}}>
      后台可以同时发生很多事，<br/>但“此刻”的主角总是很少。
    </div>
  </Stage>;
};

export const V2Scene8:React.FC=()=>{
  const f=useCurrentFrame();
  const active=Math.floor(f/7);
  const nodes=Array.from({length:58});
  return <Stage warm>
    <Kicker>MEMORY / CONSTELLATION</Kicker>
    <SplitTitle a="被注意过的东西，" b="更有机会留下可再次访问的痕迹。" y={105}/>
    <div style={{position:"absolute",left:960,top:590,width:790,height:520,transform:"translate(-50%,-50%)"}}>
      <svg width={790} height={520}>
        {nodes.map((_,i)=>{
          if(i===0)return null;
          const x=60+hash(i,1)*670,y=45+hash(i,2)*430,j=Math.floor(hash(i,4)*i),x2=60+hash(j,1)*670,y2=45+hash(j,2)*430,on=i<active&&i%3===0;
          return <line key={"l"+i} x1={x} y1={y} x2={x2} y2={y2} stroke={on?GOLD2:"rgba(239,229,204,.07)"} strokeWidth={on?2.5:1}/>;
        })}
        {nodes.map((_,i)=>{
          const x=60+hash(i,1)*670,y=45+hash(i,2)*430,on=i<active&&i%3===0;
          return <circle key={"n"+i} cx={x} cy={y} r={on?6:3} fill={on?GOLD2:"rgba(239,229,204,.22)"}/>;
        })}
      </svg>
    </div>
    <RingMachine x={960} y={590} scale={.34} opacity={.52} speed={.65}/>
    <Caption>注意力不是记忆本身，但它会改变哪些信号被编码、强化，并更容易被未来的你重新找到。</Caption>
  </Stage>;
};

export const V2Scene9:React.FC=()=>{
  const f=useCurrentFrame();
  const cycle=52;
  const c=Math.floor(f/cycle);
  const p=(f%cycle)/cycle;
  const x=interpolate(p,[0,1],[320,1640]);
  const y=760-210*Math.sin(p*Math.PI);
  return <Stage>
    <Kicker>REPETITION / GROOVE</Kicker>
    <SplitTitle a="注意一次，是选择。" b="反复注意，会把选择压成轨道。" y={105}/>
    <GridFloor opacity={.16} horizon={420}/>
    {Array.from({length:18}).map((_,i)=>{const xx=160+hash(i,5)*1600; const yy=430+hash(i,6)*420; const s=3+hash(i,7)*8; return <div key={"dust"+i} style={{position:"absolute",left:xx,top:yy,width:s,height:s,borderRadius:"50%",background:i%5===0?GOLD2:"rgba(217,178,111,.28)",filter:"blur("+(i%4===0?2:0)+"px)",boxShadow:i%5===0?"0 0 14px "+GOLD2:"none"}}/>;})}
    <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
      {Array.from({length:6}).map((_,i)=><path key={i} d="M 300 760 C 620 470, 980 860, 1650 500" fill="none"
        stroke={"rgba(217,178,111,"+(.08+Math.min(c,i)*.055)+")"} strokeWidth={4+i*5} strokeLinecap="round"/>)}
    </svg>
    <div style={{position:"absolute",left:x,top:y,width:34,height:34,borderRadius:"50%",transform:"translate(-50%,-50%)",
      background:"radial-gradient(circle at 35% 30%,"+GOLD2+","+GOLD+" 48%,#584019 100%)",
      boxShadow:"0 0 45px "+GOLD2+",0 16px 24px rgba(0,0,0,.5)"}}/>
    <div style={{position:"absolute",right:110,bottom:140,width:620,textAlign:"right",fontSize:33,fontWeight:800,lineHeight:1.5}}>
      轨道一旦形成，<span style={{color:GOLD2}}>下一次选择会越来越省力。</span>
    </div>
  </Stage>;
};
