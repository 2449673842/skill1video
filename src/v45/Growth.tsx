import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, Ripple, W, H,
  C, hash, clamp, lerp, settle, outCubic,
} from "./v45-common";

/* ============================================================
   V45_Growth —— PAGE / TIME / GROWTH（终幕 · 动态版）
   五阶段：
     0–10   Preparation  黎明 + 种子（SignalShard）在场
     10     Trigger      主干自种子向上生长
     10–72  Main Event   主干拔高，时间刻度随高度依次落下；
                          分枝按次序伸展，枝头玻璃页展开
     66–86  Main Event②  apex 花序最后点亮（终局事件）
     86+    New State    完全静止（海报状态）
   相机：锁定。生长即运动。
   ============================================================ */

const TRUNK_X = 960, SEED_Y = 640;

/* 枝头玻璃小页（PAGE 的具象；q: 0=收拢，1=展开） */
const PageNode: React.FC<{ x: number; y: number; r: number; s: number; q: number; p: number }> = ({ x, y, r, s, q, p }) => (
  <div style={{
    position: "absolute", left: x, top: y, zIndex: 52,
    transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s * lerp(0.5, 1, q)})`, opacity: p * q,
  }}>
    <div style={{
      width: 46, height: 60, position: "relative",
      background: "linear-gradient(150deg, rgba(247,238,212,.92), rgba(216,201,166,.78))",
      boxShadow: "0 14px 30px rgba(0,0,0,.44), 0 0 16px rgba(240,215,154,.28)",
      borderRadius: 2, overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", right: 0, top: 0, width: 12, height: 12,
        background: "linear-gradient(225deg, transparent 46%, rgba(125,110,88,.6) 50%, rgba(232,220,192,.95) 54%)",
      }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "absolute", left: 7, top: 9 + i * 7.5, height: 2,
          width: `${(74 - i * 12) * q}%`, background: "rgba(85,61,29,.34)",
        }} />
      ))}
      <div style={{
        position: "absolute", left: 7, bottom: 7, width: 14 * q, height: 2.6,
        background: "rgba(217,178,111,.85)",
      }} />
    </div>
  </div>
);

/* 主干 + 分枝 + 时间刻度（SVG；trunkQ: 主干生长，branchQ[]: 分枝生长） */
const GrowthTree: React.FC<{p: number; trunkQ: number; branchQ: number[]}> = ({ p, trunkQ, branchQ }) => {
  const branches: [number, number, number, number][] = [
    [946, 596, 700, 300], [952, 540, 830, 210], [960, 492, 1010, 178],
    [968, 528, 1150, 240], [974, 580, 1290, 344], [962, 620, 1218, 436],
  ];
  /* 主干时间刻度：自下而上，随主干生长依次落下（落定后静止） */
  const rungs: [number, number, number][] = [
    [1066, 958, 0.94], [992, 946, 0.86], [918, 968, 0.78], [846, 952, 0.69],
    [776, 982, 0.60], [706, 958, 0.51], [640, 946, 0.42], [574, 964, 0.33], [514, 968, 0.25],
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 46, overflow: "visible" }}>
      {/* 主干（pathLength 生长揭示） */}
      <path d={`M ${TRUNK_X} 1150 C 934 960, 996 820, ${TRUNK_X} ${SEED_Y} C 928 500, 996 420, 960 296`}
        fill="none" stroke={C.gold} strokeOpacity={0.96} strokeWidth={4.4} opacity={p}
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trunkQ}
        style={{ filter: "drop-shadow(0 0 9px rgba(240,215,154,.55))" }} />
      {/* 分枝（各自生长） */}
      {branches.map(([x1, y1, x2, y2], i) => (
        <path key={i}
          d={`M ${x1} ${y1} C ${(x1 + x2) / 2 - 30} ${y1 - 60}, ${(x1 + x2) / 2 + 20} ${y2 + 46}, ${x2} ${y2}`}
          fill="none" stroke={i === 2 ? C.goldHi : C.goldMid}
          strokeOpacity={i === 2 ? 0.92 : 0.52} strokeWidth={i === 2 ? 2.6 : 1.7} opacity={p}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - branchQ[i]}
          style={{ filter: `drop-shadow(0 0 ${i === 2 ? 7 : 4}px rgba(240,215,154,.5))` }} />
      ))}
      {/* 时间刻度（主干经过时落下：透明度 + 轻微下落位移后定住） */}
      {rungs.map(([y, x, t], i) => {
        const q = clamp((trunkQ - t) / 0.14);
        if (q <= 0) return null;
        const drop = (1 - outCubic(q, 0, 1, 0, 1)) * 10;
        return (
          <g key={i} opacity={p * q} transform={`translate(0 ${drop})`}>
            <line x1={x - 17} y1={y} x2={x + 17} y2={y}
              stroke={C.gold} strokeOpacity={0.92} strokeWidth={2.8} />
            <line x1={x - 8} y1={y - 5} x2={x - 8} y2={y + 5}
              stroke={C.gold} strokeOpacity={0.4} strokeWidth={1.2} />
            <line x1={x + 8} y1={y - 5} x2={x + 8} y2={y + 5}
              stroke={C.gold} strokeOpacity={0.4} strokeWidth={1.2} />
          </g>
        );
      })}
    </svg>
  );
};

export const V45Growth: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 0, 12);
  /* --- 生长时间轴 --- */
  const trunkQ = outCubic(f, 0, 1, 10, 58);           // Trigger：主干拔高
  const branchAt = [42, 48, 54, 58, 62, 66];
  const branchQ = branchAt.map((at, i) => outCubic(f, 0, 1, at, 26 - i * 1.5));
  const pageAt = { A: 56, B: 62, C: 74, D: 70, E: 66 };
  const pageQ = (at: number) => outCubic(f, 0, 1, at, 20);
  const apexQ = outCubic(f, 0, 1, 66, 20);            // Main Event②：apex 点亮
  const ringsQ = outCubic(f, 0, 1, 70, 16);
  const acquire = outCubic(f, 0, 1, 74, 12);
  const titleQ = outCubic(f, 0, 1, 82, 24);           // 命名节拍：apex 点亮后巨字自下缘生长
  const kickerIn = outCubic(f, 0, 1, 80, 14);
  const lateIn = outCubic(f, 0, 1, 100, 18);
  const dawnQ = outCubic(f, 0, 1, 0, 30);
  return (
    <CinemaFrame variant="dawn" glow={[50, 64]} glowColor="rgba(242,166,90,.22)">
      {/* 03 上升光尘（静位散布，随生长浮现后不再漂移） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={64} seed={29} area={[420, 60, W - 840, 900]}
          opacity={0.55 * p * outCubic(f, 0, 1, 14, 56)} maxSize={2.1} />
      </div>
      {/* 底部黎明地平光（随生长亮起后恒定） */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 340, zIndex: 14,
        background: "linear-gradient(0deg, rgba(242,166,90,.16), transparent 76%)", opacity: p * dawnQ,
      }} />

      {/* 05 巨字 GROWTH —— 从下缘生长式出血（跟随生长节奏） */}
      <GiantType word="GROWTH" x={186} y={lerp(884, 812, titleQ)} size={372} tracking={-3}
        variant="cream" zIndex={30} opacity={0.96 * p * clamp(titleQ * 1.3)} />

      {/* 06 树结构（主干 → 分枝 → 刻度） */}
      <GrowthTree p={p} trunkQ={trunkQ} branchQ={branchQ} />

      {/* 枝头节点：五页（各自展开） + apex 花序（最后点亮） */}
      <PageNode x={700} y={300} r={-9} s={1.06} q={pageQ(pageAt.A)} p={p} />
      <PageNode x={830} y={210} r={6} s={0.88} q={pageQ(pageAt.B)} p={p} />
      <PageNode x={1150} y={240} r={-6} s={0.94} q={pageQ(pageAt.C)} p={p} />
      <PageNode x={1290} y={344} r={10} s={0.8} q={pageQ(pageAt.D)} p={p} />
      <PageNode x={1218} y={436} r={-4} s={0.72} q={pageQ(pageAt.E)} p={p} />
      <Bloom x={1010} y={178} r={190} color="rgba(240,215,154,.22)" strength={p * apexQ} />
      <div style={{
        position: "absolute", left: 1010, top: 178, width: 22, height: 22, zIndex: 54,
        transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: `radial-gradient(circle at 40% 36%, ${C.goldHi}, ${C.amber} 55%, rgba(122,74,27,.6))`,
        boxShadow: `0 0 34px 10px rgba(240,215,154,${0.5 * apexQ}), 0 0 90px 30px rgba(242,166,90,${0.22 * apexQ})`,
        opacity: p * apexQ,
      }} />
      {[1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", left: 1010, top: 178, width: (52 + i * 26) * lerp(0.4, 1, ringsQ), height: (52 + i * 26) * lerp(0.4, 1, ringsQ),
          zIndex: 53, transform: "translate(-50%,-50%)", borderRadius: "50%",
          border: `1px ${i === 1 ? "solid" : "dashed"} rgba(240,215,154,${(0.5 - i * 0.16) * ringsQ})`,
          opacity: p,
        }} />
      ))}
      <Ripple f={f} events={[66]} x={1010} y={178} color={C.gold} maxR={230} layers={3} />

      {/* 13 主干心脏 bloom */}
      <Bloom x={TRUNK_X} y={SEED_Y} r={330} color="rgba(242,166,90,.16)"
        strength={p * lerp(0.5, 1, trunkQ)} />

      {/* 07 HERO —— 沉在主干心脏的 Signal Shard（种子，先于树在场） */}
      <div style={{ opacity: p }}>
        <SignalShard x={TRUNK_X} y={SEED_Y} scale={0.78} tilt={-5}
          coreBoost={lerp(0.5, 1, outCubic(f, 0, 1, 6, 22))} orbitNode={330}
          orbitSpin={outCubic(f, 0, 1, 6, 50) * 50} orbitAlpha={outCubic(f, 0, 1, 8, 22)} />
      </div>

      {/* 09 HUD：左缘时间刻度尺（随主干刻度逐格亮起）+ apex 锁定 */}
      <div style={{ position: "absolute", left: 52, top: 210, zIndex: 74 }}>
        {["t₀", "t₁", "t₂", "t₃", "t₄", "t₅"].map((t, i) => {
          const q = clamp((trunkQ - (0.9 - i * 0.15)) / 0.12);
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 44, opacity: 0.55 * q * p }}>
              <div style={{ width: 15 * q, height: 1, background: "rgba(159,216,232,.6)" }} />
              <div style={{
                fontSize: 12.5, letterSpacing: 2, color: "rgba(159,216,232,.62)",
                fontFamily: "'Segoe UI',sans-serif",
              }}>{t}</div>
            </div>
          );
        })}
      </div>
      <HUDReticle x={1010} y={178} r={lerp(88, 64, acquire)} accent={C.gold}
        opacity={0.8 * acquire} label="APEX · GROWTH 3.2×" />

      {/* 10 辅助排版 */}
      <KickerLine text="PAGE / TIME / GROWTH" opacity={kickerIn} />
      <SubText x={84} y={126} width={470} opacity={outCubic(f, 0, 1, 98, 18)}
        lines={<>被选中的那条路，长成结构：<br />
        一页页<span style={{ color: C.gold, fontWeight: 700 }}>时间</span>，长成一棵<span style={{ color: C.gold, fontWeight: 700 }}>树</span>。</>} />

      {/* 11/12 前景失焦 */}
      <FGShard x={W - 130} y={H - 40} w={680} h={500} rotate={-17} opacity={0.2 * lateIn} blur={15}
        tint="rgba(242,166,90,.07)" />
      <div style={{
        position: "absolute", left: 236, top: 964, width: 80, height: 80, borderRadius: "50%",
        background: "rgba(240,215,154,.2)", filter: "blur(24px)", zIndex: 90, opacity: lateIn,
      }} />
      <FGShard x={40} y={-60} w={520} h={420} rotate={14} opacity={0.12 * lateIn} blur={20} />
    </CinemaFrame>
  );
};
