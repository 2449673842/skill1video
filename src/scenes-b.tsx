import React from "react";
import {useCurrentFrame} from "remotion";
import {ACCENT,INK,PAPER,Stage,Kicker,frames,hash,clamp,lerp,smooth} from "./common";

export const Scene5:React.FC=()=>{
  const f=useCurrentFrame();
  const cards=[["新奇","刚刚发生",1.0],["愤怒","必须点开",.92],["社交","有人@你",.86],["奖励","再刷一个",.96]] as const;
  return <Stage duration={frames[5]} dark>
    <Kicker>AUCTION / 05</Kicker>
    <div style={{position:"absolute",left:110,top:155,fontSize:62,fontWeight:900}}>你的注意力，正在被<span style={{color:ACCENT}}>竞价。</span></div>
    <div style={{position:"absolute",left:110,top:245,fontSize:28,color:"rgba(244,240,233,.5)"}}>越能触发新奇、情绪和即时反馈，越容易抢到下一秒。</div>
    {cards.map((c,i)=>{
      const ang=-1.25+i*.82,r=330,x=960+Math.cos(ang)*r,y=585+Math.sin(ang)*r*.68,wob=Math.sin(f*.05+i)*8;
      return <div key={c[0]} style={{position:"absolute",left:x,top:y+wob,width:300,height:170,transform:"translate(-50%,-50%)",border:"1px solid rgba(244,240,233,.18)",borderRadius:24,background:"rgba(255,255,255,.035)",boxShadow:"0 20px 70px rgba(0,0,0,.25)",padding:26}}>
        <div style={{fontSize:34,fontWeight:900}}>{c[0]}</div>
        <div style={{fontSize:24,color:"rgba(244,240,233,.52)",marginTop:8}}>{c[1]}</div>
        <div style={{height:6,background:"rgba(244,240,233,.1)",borderRadius:9,marginTop:26,overflow:"hidden"}}>
          <div style={{height:"100%",width:(Number(c[2])*100)+"%",background:ACCENT}}/>
        </div>
      </div>;
    })}
    <div style={{position:"absolute",left:660,top:485,width:600,height:250,border:"1px dashed rgba(255,107,74,.5)",borderRadius:"50%"}}/>
    <div style={{position:"absolute",left:110,bottom:98,fontSize:48,fontWeight:900}}>你不管理注意力，<span style={{color:ACCENT}}>就会有人替你管理。</span></div>
  </Stage>;
};

export const Scene6:React.FC=()=>{
  const f=useCurrentFrame(),tasks=["文档","邮件","群聊","短视频"],jump=Math.floor(f/34)%4;
  return <Stage duration={frames[6]} dark={false}>
    <Kicker dark={false}>CONTEXT SWITCH / 06</Kicker>
    <div style={{position:"absolute",left:110,top:150,fontSize:62,fontWeight:900}}>多任务不是并行。<br/><span style={{color:ACCENT}}>更像不断重装上下文。</span></div>
    {tasks.map((t,i)=>{
      const x=270+i*445,active=i===jump;
      return <div key={t} style={{position:"absolute",left:x,top:520,width:350,height:260,borderRadius:28,border:(active?4:1)+"px solid "+(active?ACCENT:"rgba(9,10,12,.18)"),background:active?"#fff":"rgba(255,255,255,.48)",boxShadow:active?"0 24px 60px rgba(255,107,74,.15)":"none",transform:"translateY("+(active?-18:0)+"px)"}}>
        <div style={{padding:28,fontSize:34,fontWeight:900}}>{t}</div>
        {Array.from({length:5}).map((_,j)=><div key={j} style={{margin:"13px 28px",height:10,borderRadius:9,width:(55+hash(j+i*6,2)*35)+"%",background:active&&j===2?ACCENT:"rgba(9,10,12,.13)"}}/>)}
      </div>;
    })}
    <div style={{position:"absolute",left:110,bottom:96,fontSize:30,color:"rgba(9,10,12,.55)"}}>每次跳转都很短，但重新定位目标、规则和进度，本身就要成本。</div>
  </Stage>;
};

export const Scene7:React.FC=()=>{
  const f=useCurrentFrame(),p=smooth(clamp((f-25)/150));
  const tokens=["图像","声音","想法","消息","记忆","计划","担忧","身体","语言","目标","关系","数字","路径","风险","欲望","任务"];
  return <Stage duration={frames[7]} dark>
    <Kicker>BOTTLENECK / 07</Kicker>
    <div style={{position:"absolute",left:110,top:155,fontSize:62,fontWeight:900}}>意识像一条<span style={{color:ACCENT}}>窄桥。</span></div>
    <div style={{position:"absolute",left:110,top:235,fontSize:29,color:"rgba(244,240,233,.55)"}}>很多东西在后台发生，但“此刻”只能容纳极少数主角。</div>
    {tokens.map((t,i)=>{
      const x0=130+(i%8)*205,y0=400+Math.floor(i/8)*250+hash(i,1)*80,x1=925+(i%2)*70,y1=565+(i%2)*34,q=smooth(clamp((p-hash(i,2)*.35)/.65));
      return <div key={t} style={{position:"absolute",left:lerp(x0,x1,q),top:lerp(y0,y1,q),fontSize:26+hash(i,3)*15,fontWeight:800,opacity:1-q*.78,transform:"translate(-50%,-50%)"}}>{t}</div>;
    })}
    <div style={{position:"absolute",left:890,top:330,width:140,height:470,border:"4px solid "+ACCENT,borderRadius:70,boxShadow:"0 0 80px rgba(255,107,74,.18)"}}/>
    <div style={{position:"absolute",left:1120,top:510,fontSize:92,fontWeight:900,color:ACCENT}}>此刻</div>
  </Stage>;
};

export const Scene8:React.FC=()=>{
  const f=useCurrentFrame(),nodes=Array.from({length:48}),active=Math.floor(f/8);
  return <Stage duration={frames[8]} dark>
    <Kicker>MEMORY / 08</Kicker>
    <div style={{position:"absolute",left:110,top:150,fontSize:60,fontWeight:900}}>被注意过的东西，更有机会<span style={{color:ACCENT}}>留下痕迹。</span></div>
    <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
      {nodes.map((_,i)=>{
        if(i===0)return null;
        const x=180+hash(i,1)*1560,y=330+hash(i,2)*610,j=Math.floor(hash(i,4)*i),x2=180+hash(j,1)*1560,y2=330+hash(j,2)*610,on=i<active&&i%3===0;
        return <line key={"l"+i} x1={x} y1={y} x2={x2} y2={y2} stroke={on?ACCENT:"rgba(244,240,233,.06)"} strokeWidth={on?3:1}/>;
      })}
      {nodes.map((_,i)=>{
        const x=180+hash(i,1)*1560,y=330+hash(i,2)*610,on=i<active&&i%3===0;
        return <circle key={"n"+i} cx={x} cy={y} r={on?8:4} fill={on?ACCENT:"rgba(244,240,233,.18)"}/>;
      })}
    </svg>
    <div style={{position:"absolute",left:110,bottom:100,fontSize:34,color:"rgba(244,240,233,.58)",maxWidth:730,lineHeight:1.5}}>注意力不是记忆本身，但它决定了哪些信号更可能被编码、反复访问、进入你的故事。</div>
  </Stage>;
};

export const Scene9:React.FC=()=>{
  const f=useCurrentFrame(),d=frames[9],cycles=5,p=(f%(d/cycles))/(d/cycles),groove=Math.min(cycles,Math.floor(f/(d/cycles))+1);
  return <Stage duration={d} dark={false}>
    <Kicker dark={false}>REPETITION / 09</Kicker>
    <div style={{position:"absolute",left:110,top:145,fontSize:58,fontWeight:900,lineHeight:1.15}}>注意一次，是选择。<br/>反复注意，开始变成<span style={{color:ACCENT}}>轨道。</span></div>
    <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
      {Array.from({length:6}).map((_,i)=><path key={i} d="M 220 770 C 520 430, 960 880, 1700 470" fill="none" stroke={i<groove?"rgba(255,107,74,"+(.10+i*.08)+")":"rgba(9,10,12,.06)"} strokeWidth={4+i*4} strokeLinecap="round"/>)}
    </svg>
    <div style={{position:"absolute",left:lerp(230,1690,smooth(p)),top:640-155*Math.sin(p*Math.PI*1.25),width:24,height:24,borderRadius:"50%",background:ACCENT,boxShadow:"0 0 30px "+ACCENT}}/>
    <div style={{position:"absolute",right:110,bottom:94,textAlign:"right",fontSize:42,fontWeight:900}}>你反复把目光放在哪里，<br/><span style={{color:ACCENT}}>哪里就更容易成为下一次的你。</span></div>
  </Stage>;
};
