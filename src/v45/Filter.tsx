import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, GridFloor, W, H,
  C, hash, settle,
} from "./v45-common";

/* ============================================================
   V45_Filter —— FILTER / PRIORITY
   构图：一排纪念碑式光门向纵深退去（非卡片、非UI），
   巨字 FILTER 沉在门列之后被门轨切割；Hero 碎片正在穿过第三道门，
   身后拖出金色运动残影；被淘汰的信号在各门面处溶解坠落。
   ============================================================ */

/* 光门（纪念碑尺度：整高门架，不是圆角卡片） */
const LightGate: React.FC<{
  x: number; y: number; w: number; h: number;
  accent: string; intensity: number; label: string; p: number; fade?: number; rotY?: number;
}> = ({ x, y, w, h, accent, intensity, label, p, fade = 0, rotY = 0 }) => {
  const glow = 0.22 + intensity * 0.78;
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, height: h, zIndex: 40,
      transform: `translate(-50%,-100%) perspective(900px) rotateY(${rotY}deg)`,
    }}>
      {/* 门轨左右立柱 */}
      {["left", "right"].map((side) => (
        <div key={side} style={{
          position: "absolute", [side]: 0, top: 0, bottom: 0, width: 2.4,
          background: `linear-gradient(180deg, transparent, ${accent} ${18 + fade * 10}%, ${accent} ${72 - fade * 8}%, transparent)`,
          opacity: glow, boxShadow: `0 0 ${14 * glow}px ${accent}`,
        } as React.CSSProperties} />
      ))}
      {/* 顶部桥拱 */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: 2.4,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: glow * 0.9, boxShadow: `0 0 ${12 * glow}px ${accent}`,
      }} />
      {/* 门面微光 */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, ${accent}00 40%, ${accent}${Math.round(6 + intensity * 10).toString(16).padStart(2, "0")} 100%)`,
        opacity: 0.5,
      }} />
      {/* 地面接光 */}
      <div style={{
        position: "absolute", left: -w * 0.3, right: -w * 0.3, bottom: -8, height: 26,
        background: `radial-gradient(ellipse at 50% 0%, ${accent}30, transparent 70%)`,
        filter: "blur(4px)",
      }} />
      {/* 底部微标签 */}
      <div style={{
        position: "absolute", left: "50%", bottom: -46, transform: "translateX(-50%)",
        fontFamily: "'Segoe UI','Noto Sans CJK SC',sans-serif", fontSize: 12.5,
        letterSpacing: 4, color: `${accent}bb`, whiteSpace: "nowrap", opacity: p,
      }}>{label}</div>
    </div>
  );
};

/* 被淘汰的信号：在门面处溶解的暗碎片 */
const CullingDust: React.FC<{p: number}> = ({ p }) => (
  <div style={{ position: "absolute", inset: 0, zIndex: 36 }}>
    {Array.from({ length: 34 }).map((_, i) => {
      const gateX = [560, 880, 1200, 1480][i % 4];
      const x = gateX - 90 + hash(i, 21) * 180;
      const y = 240 + hash(i, 22) * 520;
      const s = 2 + hash(i, 23) * 5;
      const a = (0.06 + hash(i, 24) * 0.16) * p;
      return (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: s, height: s * (1 + hash(i, 25) * 2),
          background: hash(i, 26) > 0.7 ? C.cyan : "rgba(239,229,204,.9)",
          opacity: a, filter: `blur(${1 + hash(i, 27) * 3.2}px)`,
          transform: `rotate(${(hash(i, 28) - 0.5) * 80}deg)`,
        }} />
      );
    })}
  </div>
);

const HERO_X = 1040, HERO_Y = 512;

export const V45Filter: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 4, 52);
  /* 间距/高度/落点均不等距 + 透视侧转，破坏柱状图节奏 */
  const gates = [
    { x: 505, y: 922, w: 158, h: 692, rotY: -13, accent: C.teal, label: "SENSORY" },
    { x: 842, y: 908, w: 128, h: 566, rotY: -6, accent: C.gold, label: "GOAL" },
    { x: 1168, y: 898, w: 118, h: 618, rotY: 4, accent: C.ember, label: "SALIENCE" },
    { x: 1562, y: 882, w: 94, h: 468, rotY: 14, accent: C.cyan, label: "EXPERIENCE" },
  ];
  return (
    <CinemaFrame variant="cold" glow={[52, 48]} glowColor="rgba(14,30,40,.55)">
      {/* 06 地面网格 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 22, opacity: p }}>
        <GridFloor color={C.teal} opacity={0.11} horizon={500} />
      </div>

      {/* 03 星尘 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={54} seed={7} opacity={0.4 * p} maxSize={1.8} />
      </div>

      {/* 05 巨字 FILTER 沉在门列之后 */}
      <GiantType word="FILTER" x={96} y={540} size={330} tracking={-12}
        variant="gold" zIndex={28} opacity={0.92 * p} />

      {/* 被淘汰信号溶解 */}
      <CullingDust p={p} />

      {/* 06 光门列（由近及远） */}
      {gates.map((g, i) => (
        <LightGate key={g.label} x={g.x} y={g.y} w={g.w} h={g.h} rotY={g.rotY} accent={g.accent}
          intensity={i === 2 ? 1 : 0.72 - i * 0.1} label={g.label} p={p} fade={i * 0.18} />
      ))}

      {/* Hero 通过 SALIENCE 门：门轨局部受热发亮 */}
      <div style={{
        position: "absolute", left: 1200, top: HERO_Y - 210, width: 116, height: 420, zIndex: 44,
        background: `radial-gradient(ellipse at 50% 50%, rgba(242,166,90,.20), transparent 66%)`,
        filter: "blur(10px)", opacity: p,
      }} />

      {/* 08 运动残影（信号穿门轨迹） */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", left: HERO_X - 480 + i * 26, top: HERO_Y - 14 + i * 22,
          width: 420 - i * 90, height: 2 - i * 0.4, zIndex: 46,
          background: `linear-gradient(90deg, transparent, rgba(240,215,154,${0.5 - i * 0.14}))`,
          filter: "blur(1.4px)", opacity: p,
        }} />
      ))}

      {/* 13 主体 bloom */}
      <Bloom x={HERO_X} y={HERO_Y} r={380} color="rgba(242,166,90,.16)" strength={p} />

      {/* 07 HERO —— 正在穿门的 Signal Shard */}
      <div style={{ opacity: p }}>
        <SignalShard x={HERO_X} y={HERO_Y} scale={0.88} tilt={9} coreBoost={1} orbitNode={122} />
      </div>

      {/* 09 HUD */}
      <HUDReticle x={HERO_X} y={HERO_Y} r={150} accent={C.gold} opacity={0.8 * p}
        label="PASSING GATE 03 · SALIENCE" />

      {/* 10 辅助排版（远离 EXPERIENCE 门标） */}
      <KickerLine text="FILTER / LAYERED PRIORITY" />
      <SubText x={W - 726} y={244} width={640} align="right" opacity={p}
        lines={<>信息不是被动进入——<br />
        它要<span style={{ color: C.gold, fontWeight: 700 }}>穿过一层层优先级</span>，才能抵达你。</>} />

      {/* 11/12 前景失焦：近景门轨与玻璃切入画框 */}
      <FGShard x={-120} y={600} w={460} h={1320} rotate={7} opacity={0.3 * p} blur={17}
        tint="rgba(102,185,170,.08)" />
      <FGShard x={W - 60} y={H + 40} w={720} h={520} rotate={-21} opacity={0.22 * p} blur={15}
        tint="rgba(242,166,90,.07)" />
    </CinemaFrame>
  );
};
