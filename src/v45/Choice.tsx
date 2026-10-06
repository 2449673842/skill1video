import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, GridFloor, W, H,
  C, hash, settle,
} from "./v45-common";

/* ============================================================
   V45_Choice —— CHOICE / FORK
   构图：上镜的轨道从左入画，抵达直立的 SignalShard（分叉点），
   裂成两条路径：上行金路（被选），下行青蓝暗路（未选）。
   巨字 CHOICE 以 ember 渐变从右缘出血。分叉处少量余烬火花。
   ============================================================ */

const FORK_X = 872, FORK_Y = 552;

/* 余烬火花（静态散布在分叉点周围） */
const EmberSparks: React.FC<{p: number}> = ({ p }) => (
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
          opacity: (0.3 + hash(i, 46) * 0.55) * p,
          boxShadow: `0 0 ${s * 4}px ${hash(i, 45) > 0.4 ? C.ember : C.gold}`,
          filter: `blur(${hash(i, 47) * 1.2}px)`,
        }} />
      );
    })}
  </div>
);

export const V45Choice: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 4, 52);
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
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 46, overflow: "visible" }}>
        {/* 来路（上镜轨道） */}
        <path d={`M -60 466 C 300 500, 560 610, ${FORK_X - 54} ${FORK_Y - 4}`}
          fill="none" stroke={C.gold} strokeOpacity={0.8} strokeWidth={2.6} strokeDasharray="24 15"
          style={{ filter: "drop-shadow(0 0 7px rgba(240,215,154,.6))" }} opacity={p} />
        {/* 被选：上行金路 */}
        <path d={`M ${FORK_X + 40} ${FORK_Y - 40} C 1120 400, 1440 288, 1980 262`}
          fill="none" stroke={C.gold} strokeOpacity={0.95} strokeWidth={3.2}
          style={{ filter: "drop-shadow(0 0 10px rgba(240,215,154,.75))" }} opacity={p} />
        {/* 未选：下行暗路 */}
        <path d={`M ${FORK_X + 40} ${FORK_Y + 40} C 1140 720, 1500 812, 1980 856`}
          fill="none" stroke={C.teal} strokeOpacity={0.46} strokeWidth={2.1} strokeDasharray="12 18"
          style={{ filter: "drop-shadow(0 0 5px rgba(102,185,170,.4))" }} opacity={p} />
        {/* 上行路沿路微节点 */}
        {[[1120, 404], [1402, 322], [1668, 282]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.4} fill={C.gold} opacity={0.9 * p}
            style={{ filter: "drop-shadow(0 0 6px rgba(240,215,154,.9))" }} />
        ))}
      </svg>

      {/* 上行金路沿路余烬（静态） */}
      {[[1470, 346], [1618, 302], [1786, 272]].map(([x, y], i) => (
        <div key={"et"+i} style={{
          position: "absolute", left: x, top: y, width: 2.6, height: 2.6, borderRadius: "50%",
          background: C.ember, zIndex: 58, opacity: (0.5 + i * 0.12) * p,
          boxShadow: "0 0 10px " + C.ember, filter: "blur(.4px)",
        }} />
      ))}

      {/* 05 巨字 CHOICE —— ember 渐变，右缘出血 */}
      <GiantType word="CHOICE" x={1088} y={598} size={338} tracking={-11}
        variant="ember" zIndex={30} opacity={0.96 * p} />

      {/* 13 bloom：分叉点余烬光 */}
      <Bloom x={FORK_X} y={FORK_Y} r={330} color="rgba(242,138,82,.17)" strength={p} />
      <Bloom x={1310} y={330} r={240} color="rgba(240,215,154,.08)" strength={p} />

      {/* 余烬火花 */}
      <EmberSparks p={p} />

      {/* 07 HERO —— 直立的 Signal Shard = 分叉点 */}
      <div style={{ opacity: p }}>
        <SignalShard x={FORK_X} y={FORK_Y} scale={0.8} tilt={0} coreBoost={1} orbitNode={64} />
      </div>

      {/* 09 HUD */}
      <HUDReticle x={FORK_X} y={FORK_Y} r={148} accent={C.ember} opacity={0.82 * p}
        label="FORK · DECIDE 0.62 / 0.38" />
      {/* 出路微标 */}
      <div style={{
        position: "absolute", left: 1690, top: 196, zIndex: 74, opacity: 0.7 * p,
        fontFamily: "'Segoe UI',sans-serif", fontSize: 13.5, letterSpacing: 3,
        color: "rgba(240,215,154,.8)",
      }}>A · SELECTED</div>
      <div style={{
        position: "absolute", left: 1596, top: 798, zIndex: 74, opacity: 0.52 * p,
        fontFamily: "'Segoe UI',sans-serif", fontSize: 13.5, letterSpacing: 3,
        color: "rgba(102,185,170,.66)",
      }}>B · UNSELECTED</div>

      {/* 10 辅助排版 */}
      <KickerLine text="CHOICE / FORK" />
      <SubText x={86} y={H - 150} width={560} opacity={p}
        lines={<>轨道尽头是一个分叉。<br />
        走上<span style={{ color: C.ember, fontWeight: 700 }}>一条</span>的同时，另一条正在熄灭。</>} />

      {/* 11/12 前景失焦 */}
      <FGShard x={-70} y={220} w={560} h={440} rotate={21} opacity={0.16 * p} blur={19}
        tint="rgba(242,138,82,.06)" />
      <FGShard x={W - 140} y={H + 60} w={640} h={480} rotate={-19} opacity={0.18 * p} blur={16} />
    </CinemaFrame>
  );
};
