import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, GridFloor, Ripple, W, H,
  C, hash, clamp, lerp, settle, outCubic, pulseAt,
} from "./v45-common";

/* ============================================================
   V45_Choice —— CHOICE / FORK（动态版）
   五阶段：
     0–24   Preparation  上镜轨道自左画入（携带主体滑入）
     24–34  Trigger      抵达分叉点：余烬迸发 + 涟漪
     34–80  Main Event   两条出路同时生长：上行金路增亮，
                          下行青蓝暗路逐渐失活（一条亮、一条熄）
     80–86  Settle       A/B 标注定格，巨字 CHOICE 升起完毕
     86+    New State    完全静止（海报状态）
   相机：锁定。
   ============================================================ */

const FORK_X = 872, FORK_Y = 552;

/* 余烬火花：爆发的飞火星（Trigger 时迸发并烧尽消失） */
const BurstSparks: React.FC<{f: number; p: number}> = ({ f, p }) => {
  const burst = outCubic(f, 0, 1, 24, 22);
  const fade = 1 - clamp((f - 40) / 30);
  if (fade <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 57 }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = hash(i, 61) * Math.PI * 2;
        const r = (26 + hash(i, 62) * 120) * burst;
        const x = FORK_X + Math.cos(a) * r * 1.35;
        const y = FORK_Y + Math.sin(a) * r * 0.85;
        const s = (1.4 + hash(i, 63) * 2.4) * (1 - burst * 0.5);
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y, width: s, height: s,
            borderRadius: "50%", transform: "translate(-50%,-50%)",
            background: hash(i, 64) > 0.45 ? C.ember : C.gold,
            opacity: (0.5 + hash(i, 65) * 0.5) * fade * p,
            boxShadow: `0 0 ${s * 4}px ${hash(i, 64) > 0.45 ? C.ember : C.gold}`,
            filter: "blur(.5px)",
          }} />
        );
      })}
    </div>
  );
};

/* 常驻余烬（爆发后留下的稳定火花 = 静帧状态） */
const EmberSparks: React.FC<{q: number; p: number}> = ({ q, p }) => (
  <div style={{ position: "absolute", inset: 0, zIndex: 56 }}>
    {Array.from({ length: 22 }).map((_, i) => {
      const a = hash(i, 41) * Math.PI * 2;
      const r = 34 + hash(i, 42) * 150;
      const x = FORK_X + Math.cos(a) * r * 1.25;
      const y = FORK_Y + Math.sin(a) * r * 0.8;
      const s = 1.2 + hash(i, 43) * 2.6;
      return (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: s, height: s * (1 + hash(i, 44)),
          borderRadius: "50%", transform: "translate(-50%,-50%)",
          background: hash(i, 45) > 0.4 ? C.ember : C.gold,
          opacity: (0.3 + hash(i, 46) * 0.55) * p * q,
          boxShadow: `0 0 ${s * 4}px ${hash(i, 45) > 0.4 ? C.ember : C.gold}`,
          filter: `blur(${hash(i, 47) * 1.2}px)`,
        }} />
      );
    })}
  </div>
);

/* SVG path 生长工具：pathLength=1 + dashoffset 揭示 */
const growPath = (d: string, q: number) => ({
  d, pathLength: 1 as const, strokeDasharray: 1, strokeDashoffset: 1 - q,
});

export const V45Choice: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 0, 12);
  /* --- 主事件时间轴 --- */
  const arrive = outCubic(f, 0, 1, 0, 24);            // Preparation：轨道携主体入画
  const heroX = lerp(280, FORK_X, arrive);
  const heroTilt = lerp(-6, 0, arrive);
  const upQ = outCubic(f, 0, 1, 34, 42);              // 上行金路生长
  const dnQ = outCubic(f, 0, 1, 38, 42);              // 下行暗路生长
  const dnDie = outCubic(f, 0, 1, 52, 30);            // 暗路失活（降不透明度）
  const emberQ = outCubic(f, 0, 1, 44, 26);           // 常驻余烬浮现
  const titleQ = outCubic(f, 0, 1, 30, 44);           // 巨字升起
  const aLbl = outCubic(f, 0, 1, 66, 14);
  const bLbl = outCubic(f, 0, 1, 74, 14);
  const acquire = outCubic(f, 0, 1, 72, 12);
  const lateIn = outCubic(f, 0, 1, 70, 16);
  const hitPulse = pulseAt(f, 24, 8);
  /* 轨道沿路节点（随金路生长浮现） */
  const nodeIn = (i: number) => clamp((upQ - [0.18, 0.55, 0.9][i]) / 0.22);
  return (
    <CinemaFrame variant="warm" glow={[47, 52]} glowColor="rgba(58,26,16,.5)">
      {/* 06 微弱地面（暖金） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 22, opacity: p }}>
        <GridFloor color={C.gold} opacity={0.06} horizon={566} />
      </div>

      {/* 03 星尘（暗，克制） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={44} seed={23} opacity={0.3 * p} maxSize={1.6} />
      </div>

      {/* 08 轨道 → 分叉 → 两条出路 */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 46, overflow: "visible"}}>
        {/* 来路（虚线随主体抵达流入后停住；主体停下线也完成） */}
        <path d={`M -60 466 C 300 500, 560 610, ${FORK_X - 54} ${FORK_Y - 4}`}
          fill="none" stroke={C.gold} strokeOpacity={0.8} strokeWidth={2.6} strokeDasharray="24 15"
          strokeDashoffset={-(1 - arrive) * 320}
          style={{ filter: "drop-shadow(0 0 7px rgba(240,215,154,.6))" }} opacity={p * clamp(arrive * 1.3)} />
        {/* 被选：上行金路（实线 · pathLength 生长揭示） */}
        <path {...growPath(`M ${FORK_X + 40} ${FORK_Y - 40} C 1120 400, 1440 288, 1980 262`, upQ)}
          fill="none" stroke={C.gold} strokeOpacity={0.95} strokeWidth={3.2}
          style={{ filter: "drop-shadow(0 0 10px rgba(240,215,154,.75))" }} opacity={p} />
        {/* 未选：下行暗路（虚线流入 + 生长后失活） */}
        <path d={`M ${FORK_X + 40} ${FORK_Y + 40} C 1140 720, 1500 812, 1980 856`}
          fill="none" stroke={C.teal} strokeOpacity={lerp(0.5, 0.46, dnDie)} strokeWidth={2.1}
          strokeDasharray="12 18" strokeDashoffset={-(1 - dnQ) * 280}
          style={{ filter: "drop-shadow(0 0 5px rgba(102,185,170,.4))" }} opacity={p * clamp(dnQ * 1.3)} />
        {/* 上行路沿路微节点 */}
        {[[1120, 404], [1402, 322], [1668, 282]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.4} fill={C.gold} opacity={0.9 * nodeIn(i) * p}
            style={{ filter: "drop-shadow(0 0 6px rgba(240,215,154,.9))" }} />
        ))}
      </svg>

      {/* 05 巨字 CHOICE —— ember 渐变，右缘出血（自下方升起定住） */}
      <GiantType word="CHOICE" x={962} y={lerp(678, 606, titleQ)} size={300} tracking={-9}
        variant="ember" zIndex={30} opacity={0.96 * p * clamp(titleQ * 1.3)} />

      {/* 13 bloom：分叉点余烬光（Trigger 时脉冲增强） */}
      <Bloom x={FORK_X} y={FORK_Y} r={330} color="rgba(242,138,82,.17)"
        strength={p * (0.5 + 0.5 * emberQ + hitPulse * 0.8)} />
      <Bloom x={1310} y={330} r={240} color="rgba(240,215,154,.08)"
        strength={p * upQ} />

      {/* Trigger：迸发飞火 + 涟漪；之后常驻余烬浮现 */}
      <BurstSparks f={f} p={p} />
      <Ripple f={f} events={[24]} x={FORK_X} y={FORK_Y} color={C.ember} maxR={330} layers={4} life={34} />
      <EmberSparks q={emberQ} p={p} />

      {/* 07 HERO —— 直立的 Signal Shard = 分叉点（随轨道滑入后立定） */}
      <div style={{ opacity: p }}>
        <SignalShard x={heroX} y={FORK_Y} scale={0.8} tilt={heroTilt}
          coreBoost={lerp(0.55, 1, outCubic(f, 0, 1, 20, 26))} orbitNode={64}
          orbitSpin={outCubic(f, 0, 1, 16, 50) * 44} orbitAlpha={outCubic(f, 0, 1, 20, 24)} />
      </div>

      {/* 09 HUD */}
      <HUDReticle x={FORK_X} y={FORK_Y} r={lerp(180, 148, acquire)} accent={C.ember}
        opacity={0.82 * acquire} label="FORK · DECIDE 0.62 / 0.38" />
      {/* 出路微标 */}
      <div style={{
        position: "absolute", left: 1690, top: 196, zIndex: 74, opacity: 0.7 * aLbl,
        fontFamily: "'Segoe UI',sans-serif", fontSize: 13.5, letterSpacing: 3,
        color: "rgba(240,215,154,.8)",
      }}>A · SELECTED</div>
      <div style={{
        position: "absolute", left: 1596, top: 798, zIndex: 74, opacity: 0.52 * bLbl,
        fontFamily: "'Segoe UI',sans-serif", fontSize: 13.5, letterSpacing: 3,
        color: "rgba(102,185,170,.66)",
      }}>B · UNSELECTED</div>
      {/* 上行金路沿路余烬（静态） */}
      {[[1470, 346], [1618, 302], [1786, 272]].map(([x, y], i) => (
        <div key={"et" + i} style={{
          position: "absolute", left: x, top: y, width: 2.6, height: 2.6, borderRadius: "50%",
          background: C.ember, zIndex: 58, opacity: (0.5 + i * 0.12) * nodeIn(i + 1 > 2 ? 2 : i + 1) * p,
          boxShadow: "0 0 10px " + C.ember, filter: "blur(.4px)",
        }} />
      ))}

      {/* 10 辅助排版 */}
      <KickerLine text="CHOICE / FORK" />
      <SubText x={86} y={H - 150} width={560} opacity={lateIn}
        lines={<>轨道尽头是一个分叉。<br />
        走上<span style={{ color: C.ember, fontWeight: 700 }}>一条</span>的同时，另一条正在熄灭。</>} />

      {/* 11/12 前景失焦 */}
      <FGShard x={-70} y={220} w={560} h={440} rotate={21} opacity={0.16 * lateIn} blur={19}
        tint="rgba(242,138,82,.06)" />
      <FGShard x={W - 140} y={H + 60} w={640} h={480} rotate={-19} opacity={0.18 * lateIn} blur={16} />
    </CinemaFrame>
  );
};
