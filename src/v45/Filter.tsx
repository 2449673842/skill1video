import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, GridFloor, Ripple, W, H,
  C, hash, clamp, lerp, settle, outCubic, inOutCubic, pulseAt,
} from "./v45-common";

/* ============================================================
   V45_Filter —— FILTER / PRIORITY（动态版）
   五阶段：
     0–16   Preparation  光门自地面升起立定；巨字 FILTER 沉入
     16     Trigger      信号碎片高速入画
     16–78  Main Event   碎片依次穿过 SENSORY/GOAL/SALIENCE，
                          每过一门：门面发亮 + 涟漪 + 淘汰尘埃溶解坠落
     78–86  Settle       碎片停在 SALIENCE 门后，HUD 捕获
     86+    New State    完全静止（海报状态：正在穿门）
   相机：锁定。
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
      {["left", "right"].map((side) => (
        <div key={side} style={{
          position: "absolute", [side]: 0, top: 0, bottom: 0, width: 2.4,
          background: `linear-gradient(180deg, transparent, ${accent} ${18 + fade * 10}%, ${accent} ${72 - fade * 8}%, transparent)`,
          opacity: glow, boxShadow: `0 0 ${14 * glow}px ${accent}`,
        } as React.CSSProperties} />
      ))}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: 2.4,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: glow * 0.9, boxShadow: `0 0 ${12 * glow}px ${accent}`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, ${accent}00 40%, ${accent}${Math.round(6 + intensity * 10).toString(16).padStart(2, "0")} 100%)`,
        opacity: 0.5,
      }} />
      <div style={{
        position: "absolute", left: -w * 0.3, right: -w * 0.3, bottom: -8, height: 26,
        background: `radial-gradient(ellipse at 50% 0%, ${accent}30, transparent 70%)`,
        filter: "blur(4px)",
      }} />
      <div style={{
        position: "absolute", left: "50%", bottom: -46, transform: "translateX(-50%)",
        fontFamily: "'Segoe UI','Noto Sans CJK SC',sans-serif", fontSize: 12.5,
        letterSpacing: 4, color: `${accent}bb`, whiteSpace: "nowrap", opacity: p,
      }}>{label}</div>
    </div>
  );
};

/* 被淘汰的信号：在门面处溶解的暗碎片（随碎片穿门而激活） */
const CullingDust: React.FC<{f: number; p: number; passQ: number[]}> = ({ f, p, passQ }) => (
  <div style={{ position: "absolute", inset: 0, zIndex: 36 }}>
    {Array.from({ length: 34 }).map((_, i) => {
      const gateX = [560, 880, 1200, 1480][i % 4];
      const near = passQ[i % 4] ?? 0;
      const x = gateX - 90 + hash(i, 21) * 180;
      const y0 = 240 + hash(i, 22) * 520;
      const drop = outCubic(f, 0, 1, 20 + (i % 4) * 18 + hash(i, 29) * 10, 34);   // 溶解下坠
      const y = y0 + drop * (40 + hash(i, 25) * 70);
      const s = 2 + hash(i, 23) * 5;
      const a = (0.06 + hash(i, 24) * 0.16) * p * near * (1 - drop * 0.4);
      return (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: s, height: s * (1 + hash(i, 25) * 2),
          background: hash(i, 26) > 0.7 ? C.cyan : "rgba(239,229,204,.9)",
          opacity: a, filter: `blur(${1 + hash(i, 27) * 3.2 + drop * 2}px)`,
          transform: `rotate(${(hash(i, 28) - 0.5) * 80}deg)`,
        }} />
      );
    })}
  </div>
);

const HERO_END_X = 1040, HERO_Y = 512;

export const V45Filter: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 0, 14);
  /* --- 主事件：碎片穿门（16→78），每过一门一个触发 --- */
  const travel = inOutCubic(f, 0, 1, 16, 62);
  const heroX = lerp(-160, HERO_END_X, travel);
  const heroTilt = lerp(18, 9, travel);
  const heroScale = lerp(0.74, 0.88, outCubic(f, 0, 1, 16, 40));
  const moving = 1 - clamp((f - 74) / 10);          // 运动强度（settle 后为 0）
  /* 各门被穿过的时刻（travel 到达该门 x 的比例） */
  const gates = [
    { x: 505, y: 922, w: 158, h: 692, rotY: -13, accent: C.teal, label: "SENSORY", t: (505 + 160) / (HERO_END_X + 160) },
    { x: 842, y: 908, w: 128, h: 566, rotY: -6, accent: C.gold, label: "GOAL", t: (842 + 160) / (HERO_END_X + 160) },
    { x: 1168, y: 898, w: 118, h: 618, rotY: 4, accent: C.ember, label: "SALIENCE", t: (1168 + 160) / (HERO_END_X + 160) },
    { x: 1562, y: 882, w: 94, h: 468, rotY: 14, accent: C.cyan, label: "EXPERIENCE", t: 1.4 },
  ];
  const crossAt = (t: number) => 16 + t * 62;
  const passPulse = (t: number) => pulseAt(f, crossAt(t), 9);
  const passQ = gates.map((g) => clamp((f - crossAt(g.t)) / 16 + 1)); // 门激活后的余量
  const gateIn = (i: number) => outCubic(f, 0, 1, 4 + i * 6, 22);    // 门升起
  const acquire = outCubic(f, 0, 1, 74, 12);
  const titleQ = outCubic(f, 0, 1, 80, 24);        // 命名节拍：穿门停稳后
  const kickerIn = outCubic(f, 0, 1, 76, 14);
  const lateIn = outCubic(f, 0, 1, 98, 18);
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
      <GiantType word="FILTER" x={96} y={lerp(580, 540, titleQ)} size={330} tracking={-12}
        variant="gold" zIndex={28} opacity={0.92 * p * clamp(titleQ * 1.3)} />

      {/* 被淘汰信号溶解 */}
      <CullingDust f={f} p={p} passQ={passQ} />

      {/* 06 光门列（升起 → 依次被穿过时脉冲发亮） */}
      {gates.map((g, i) => (
        <LightGate key={g.label} x={g.x} y={lerp(g.y + 60, g.y, gateIn(i))} w={g.w}
          h={g.h * lerp(0.86, 1, gateIn(i))} rotY={g.rotY} accent={g.accent}
          intensity={(i === 2 ? 1 : 0.72 - i * 0.1) * gateIn(i) + passPulse(g.t) * 0.9}
          label={g.label} p={gateIn(i)} fade={i * 0.18} />
      ))}
      {/* 穿门涟漪 */}
      <Ripple f={f} events={gates.filter((g) => g.t <= 1).map((g) => crossAt(g.t))}
        x={heroX} y={HERO_Y} color={C.gold} maxR={220} layers={3} />

      {/* Hero 通过 SALIENCE 门：门面局部受热（跟随碎片位置） */}
      <div style={{
        position: "absolute", left: heroX - 58, top: HERO_Y - 210, width: 116, height: 420, zIndex: 44,
        background: `radial-gradient(ellipse at 50% 50%, rgba(242,166,90,${0.2 * moving + 0.08}), transparent 66%)`,
        filter: "blur(10px)", opacity: p,
      }} />

      {/* 08 运动残影（只在运动期间存在，settle 后消失） */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", left: heroX - 480 + i * 26, top: HERO_Y - 14 + i * 22,
          width: 420 - i * 90, height: 2 - i * 0.4, zIndex: 46,
          background: `linear-gradient(90deg, transparent, rgba(240,215,154,${(0.5 - i * 0.14) * moving}))`,
          filter: "blur(1.4px)", opacity: p * moving,
        }} />
      ))}

      {/* 13 主体 bloom */}
      <Bloom x={heroX} y={HERO_Y} r={380} color="rgba(242,166,90,.16)"
        strength={p * (0.7 + 0.3 * moving + passPulse(gates[2].t) * 0.5)} />

      {/* 07 HERO —— 正在穿门的 Signal Shard */}
      <div style={{ opacity: p }}>
        <SignalShard x={heroX} y={HERO_Y} scale={heroScale} tilt={heroTilt}
          coreBoost={lerp(0.6, 1, outCubic(f, 0, 1, 30, 30))} orbitNode={122}
          orbitSpin={outCubic(f, 0, 1, 18, 52) * 46} orbitAlpha={outCubic(f, 0, 1, 22, 26)} />
      </div>

      {/* 09 HUD（停稳后捕获） */}
      <HUDReticle x={heroX} y={HERO_Y} r={lerp(184, 150, acquire)} accent={C.gold}
        opacity={0.8 * acquire} label="PASSING GATE 03 · SALIENCE" />

      {/* 10 辅助排版 */}
      <KickerLine text="FILTER / LAYERED PRIORITY" opacity={kickerIn} />
      <SubText x={W - 726} y={244} width={640} align="right" opacity={lateIn}
        lines={<>信息不是被动进入——<br />
        它要<span style={{ color: C.gold, fontWeight: 700 }}>穿过一层层优先级</span>，才能抵达你。</>} />

      {/* 11/12 前景失焦：近景门轨与玻璃切入画框 */}
      <FGShard x={-120} y={600} w={460} h={1320} rotate={7} opacity={0.3 * lateIn} blur={17}
        tint="rgba(102,185,170,.08)" />
      <FGShard x={W - 60} y={H + 40} w={720} h={520} rotate={-21} opacity={0.22 * lateIn} blur={15}
        tint="rgba(242,166,90,.07)" />
    </CinemaFrame>
  );
};
