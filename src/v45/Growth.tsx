import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, W, H,
  C, hash, settle,
} from "./v45-common";

/* ============================================================
   V45_Growth —— PAGE / TIME / GROWTH（终幕）
   构图：被选中的路长成主干，主干上排布时间刻度；枝头结出
   玻璃小页与一枚金色 apex 花序。SignalShard 沉在主干心脏。
   巨字 GROWTH 从下缘生长式出血。黎明暖金大气。
   ============================================================ */

const TRUNK_X = 960, SEED_Y = 640;

/* 枝头玻璃小页（PAGE 的具象） */
const PageNode: React.FC<{ x: number; y: number; r: number; s: number; p: number }> = ({ x, y, r, s, p }) => (
  <div style={{
    position: "absolute", left: x, top: y, zIndex: 52,
    transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s})`, opacity: p,
  }}>
    <div style={{
      width: 46, height: 60, position: "relative",
      background: "linear-gradient(150deg, rgba(247,238,212,.92), rgba(216,201,166,.78))",
      boxShadow: "0 14px 30px rgba(0,0,0,.44), 0 0 16px rgba(240,215,154,.28)",
      borderRadius: 2, overflow: "hidden",
    }}>
      {/* 折角 */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: 12, height: 12,
        background: "linear-gradient(225deg, transparent 46%, rgba(125,110,88,.6) 50%, rgba(232,220,192,.95) 54%)",
      }} />
      {/* 微行 */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "absolute", left: 7, top: 9 + i * 7.5, height: 2,
          width: `${74 - i * 12}%`, background: "rgba(85,61,29,.34)",
        }} />
      ))}
      <div style={{
        position: "absolute", left: 7, bottom: 7, width: 14, height: 2.6,
        background: "rgba(217,178,111,.85)",
      }} />
    </div>
  </div>
);

/* 主干 + 分枝 + 时间刻度（SVG） */
const GrowthTree: React.FC<{p: number}> = ({ p }) => {
  const branches: [number, number, number, number][] = [
    [946, 596, 700, 300], [952, 540, 830, 210], [960, 492, 1010, 178],
    [968, 528, 1150, 240], [974, 580, 1290, 344], [962, 620, 1218, 436],
  ];
  /* 主干时间刻度：y 与对应 x */
  const rungs: [number, number][] = [
    [1066, 958], [992, 946], [918, 968], [846, 952], [776, 982],
    [706, 958], [640, 946], [574, 964], [514, 968],
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 46, overflow: "visible" }}>
      {/* 主干 */}
      <path d={`M ${TRUNK_X} 1150 C 934 960, 996 820, ${TRUNK_X} ${SEED_Y} C 928 500, 996 420, 960 296`}
        fill="none" stroke={C.gold} strokeOpacity={0.96} strokeWidth={4.4} opacity={p}
        style={{ filter: "drop-shadow(0 0 9px rgba(240,215,154,.55))" }} />
      {/* 分枝 */}
      {branches.map(([x1, y1, x2, y2], i) => (
        <path key={i}
          d={`M ${x1} ${y1} C ${(x1 + x2) / 2 - 30} ${y1 - 60}, ${(x1 + x2) / 2 + 20} ${y2 + 46}, ${x2} ${y2}`}
          fill="none" stroke={i === 2 ? C.goldHi : C.goldMid}
          strokeOpacity={i === 2 ? 0.92 : 0.52} strokeWidth={i === 2 ? 2.6 : 1.7} opacity={p}
          style={{ filter: `drop-shadow(0 0 ${i === 2 ? 7 : 4}px rgba(240,215,154,.5))` }} />
      ))}
      {/* 时间刻度（主干上的段落） */}
      {rungs.map(([y, x], i) => (
        <g key={i} opacity={p}>
          <line x1={x - 17} y1={y} x2={x + 17} y2={y}
            stroke={C.gold} strokeOpacity={0.92} strokeWidth={2.8} />
          <line x1={x - 8} y1={y - 5} x2={x - 8} y2={y + 5}
            stroke={C.gold} strokeOpacity={0.4} strokeWidth={1.2} />
          <line x1={x + 8} y1={y - 5} x2={x + 8} y2={y + 5}
            stroke={C.gold} strokeOpacity={0.4} strokeWidth={1.2} />
        </g>
      ))}
    </svg>
  );
};

export const V45Growth: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 4, 52);
  return (
    <CinemaFrame variant="dawn" glow={[50, 64]} glowColor="rgba(242,166,90,.22)">
      {/* 03 上升光尘（静位散布） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={64} seed={29} area={[420, 60, W - 840, 900]} opacity={0.55 * p} maxSize={2.1} />
      </div>
      {/* 底部黎明地平光 */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 340, zIndex: 14,
        background: "linear-gradient(0deg, rgba(242,166,90,.16), transparent 76%)", opacity: p,
      }} />

      {/* 05 巨字 GROWTH —— 从下缘生长式出血 */}
      <GiantType word="GROWTH" x={186} y={812} size={372} tracking={-3}
        variant="cream" zIndex={30} opacity={0.96 * p} />

      {/* 06 树结构 */}
      <GrowthTree p={p} />

      {/* 枝头节点：五页 + apex 花序 */}
      <PageNode x={700} y={300} r={-9} s={1.06} p={p} />
      <PageNode x={830} y={210} r={6} s={0.88} p={p} />
      <PageNode x={1150} y={240} r={-6} s={0.94} p={p} />
      <PageNode x={1290} y={344} r={10} s={0.8} p={p} />
      <PageNode x={1218} y={436} r={-4} s={0.72} p={p} />
      {/* apex 花序 */}
      <Bloom x={1010} y={178} r={190} color="rgba(240,215,154,.22)" strength={p} />
      <div style={{
        position: "absolute", left: 1010, top: 178, width: 22, height: 22, zIndex: 54,
        transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: `radial-gradient(circle at 40% 36%, ${C.goldHi}, ${C.amber} 55%, rgba(122,74,27,.6))`,
        boxShadow: `0 0 34px 10px rgba(240,215,154,.5), 0 0 90px 30px rgba(242,166,90,.22)`,
        opacity: p,
      }} />
      {/* 花序细环 */}
      {[1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", left: 1010, top: 178, width: 52 + i * 26, height: 52 + i * 26,
          zIndex: 53, transform: "translate(-50%,-50%)", borderRadius: "50%",
          border: `1px ${i === 1 ? "solid" : "dashed"} rgba(240,215,154,${0.5 - i * 0.16})`,
          opacity: p,
        }} />
      ))}

      {/* 13 主干心脏 bloom */}
      <Bloom x={TRUNK_X} y={SEED_Y} r={330} color="rgba(242,166,90,.16)" strength={p} />

      {/* 07 HERO —— 沉在主干心脏的 Signal Shard（种子） */}
      <div style={{ opacity: p }}>
        <SignalShard x={TRUNK_X} y={SEED_Y} scale={0.78} tilt={-5} coreBoost={1} orbitNode={330} />
      </div>

      {/* 09 HUD：左缘时间刻度尺 + apex 锁定 */}
      <div style={{ position: "absolute", left: 52, top: 210, zIndex: 74, opacity: 0.55 * p }}>
        {["t₀", "t₁", "t₂", "t₃", "t₄", "t₅"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 44 }}>
            <div style={{ width: 15, height: 1, background: "rgba(159,216,232,.6)" }} />
            <div style={{
              fontSize: 12.5, letterSpacing: 2, color: "rgba(159,216,232,.62)",
              fontFamily: "'Segoe UI',sans-serif",
            }}>{t}</div>
          </div>
        ))}
      </div>
      <HUDReticle x={1010} y={178} r={64} accent={C.gold} opacity={0.8 * p} label="APEX · GROWTH 3.2×" />

      {/* 10 辅助排版 */}
      <KickerLine text="PAGE / TIME / GROWTH" />
      <SubText x={84} y={126} width={470} opacity={p}
        lines={<>被选中的那条路，长成结构：<br />
        一页页<span style={{ color: C.gold, fontWeight: 700 }}>时间</span>，长成一棵<span style={{ color: C.gold, fontWeight: 700 }}>树</span>。</>} />

      {/* 11/12 前景失焦 */}
      <FGShard x={W - 130} y={H - 40} w={680} h={500} rotate={-17} opacity={0.2 * p} blur={15}
        tint="rgba(242,166,90,.07)" />
      <div style={{
        position: "absolute", left: 236, top: 964, width: 80, height: 80, borderRadius: "50%",
        background: "rgba(240,215,154,.2)", filter: "blur(24px)", zIndex: 90, opacity: p,
      }} />
      <FGShard x={40} y={-60} w={520} h={420} rotate={14} opacity={0.12 * p} blur={20} />
    </CinemaFrame>
  );
};
