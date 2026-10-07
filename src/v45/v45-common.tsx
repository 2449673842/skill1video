import React from "react";
import {AbsoluteFill, Easing, Img, getInputProps, useCurrentFrame, staticFile, delayRender, continueRender, interpolate} from "remotion";

/* ============================================================
   V4.5 CINEMATIC SYSTEM
   美术母版 = V3 impact-depth 电影语言（深蓝黑 / 暖金主光 / 青蓝辅光）
   动态预算：所有事件在 MOTION_END(=86) 前收敛，之后为真静止保持段。
   每个动作走 5 阶段：Preparation → Trigger → Main Event → Settle → New State。
   ============================================================ */

export const MOTION_END = 86;             // 此帧后所有运动必须停止

/* 巨字显示字体：仓库自带 Archivo Black（本地与 CI 完全一致，不依赖系统字体） */
if (typeof document !== "undefined") {
  const unlock = delayRender("v45: load Archivo Black");
  const face = new FontFace("Archivo Black", `url(${staticFile("fonts/ArchivoBlack.woff2")})`);
  face.load()
    .then(() => { (document.fonts as unknown as { add: (f: FontFace) => void }).add(face); continueRender(unlock); })
    .catch(() => { continueRender(unlock); });
}

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const STILL_FRAME = 120;         // 所有审片静帧统一取此帧（文字全部到位的深度静止帧）
export const SETTLE_AT = 60;            // 此帧之后画面必须真正静止

/* ---- 调色板：同一个视觉宇宙 ---- */
export const C = {
  bg0: "#020305", bg1: "#04070A", bg2: "#071018",
  goldHi: "#FFF7E0", gold: "#F0D79A", goldMid: "#D9B26F", goldDeep: "#8A6428",
  amber: "#F2A65A", ember: "#F28A52",
  cyan: "#5BC4D4", ice: "#9FD8E8", teal: "#66B9AA",
  red: "#D85849",
  cream: "#EFE5CC",
};

export const DISPLAY =
  "'Archivo Black','Segoe UI Black','Arial Black','Noto Sans CJK SC','Noto Sans SC',sans-serif";
export const CJK =
  "'Noto Sans CJK SC','Noto Sans SC','Microsoft YaHei',sans-serif";

/* ---- 数学（全部确定性） ---- */
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp = mix;
export const smooth = (t: number) => { const x = clamp(t); return x * x * (3 - 2 * x); };
export const smoother = (t: number) => { const x = clamp(t); return x * x * x * (x * (x * 6 - 15) + 10); };
export const fract = (v: number) => v - Math.floor(v);
export const hash = (i: number, s = 0) => fract(Math.sin((i + 1) * 12.9898 + s * 78.233) * 43758.5453);
export const phase = (f: number, a: number, b: number) => smoother((f - a) / (b - a));
/* 入场 settle：settle() 在 SETTLE_AT 后恒等于 1 —— 之后无任何时间项 */
export const settle = (f: number, from = 0, d = 48) => smoother(clamp((f - from) / Math.min(d, SETTLE_AT - from)));

/* ---- 动态工具（全部确定性，曲线在终点后恒定） ---- */
const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const outCubic = (f: number, a: number, b: number, from: number, d: number) =>
  interpolate(f, [from, from + d], [a, b], { ...CLAMP, easing: Easing.out(Easing.cubic) });
export const inOutCubic = (f: number, a: number, b: number, from: number, d: number) =>
  interpolate(f, [from, from + d], [a, b], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
/* 事件包络：t 时刻触发，指数衰减，仅用于瞬时反馈（bloom/微光），不产生持续运动 */
export const pulseAt = (f: number, at: number, decay = 7) =>
  f < at ? 0 : Math.exp(-(f - at) / decay);

/* 冲击涟漪：事件驱动的扩散环，衰减后消失（不留持续动画） */
export const Ripple: React.FC<{
  f: number; events: number[]; x: number; y: number;
  color?: string; maxR?: number; layers?: number; life?: number; zIndex?: number;
}> = ({ f, events, x, y, color = C.gold, maxR = 300, layers = 3, life = 30, zIndex = 66 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex }}>
    {events.flatMap((at, ei) => Array.from({ length: layers }).map((_, i) => {
      const local = (f - at - i * 4) / life;
      if (local < 0 || local > 1) return null;
      const r = 26 + smoother(clamp(local)) * (maxR + i * 40);
      const a = (1 - clamp(local)) * (0.44 - i * 0.07);
      return (
        <div key={ei + "-" + i} style={{
          position: "absolute", left: x, top: y, width: r * 2, height: r * 2,
          transform: "translate(-50%,-50%)", borderRadius: "50%",
          border: (i === 0 ? 3 : 2) + "px solid " + color, opacity: a,
          boxShadow: "0 0 " + (10 + 18 * (1 - local)) + "px " + color + "44",
        }} />
      );
    }))}
  </div>
);

/* ============================================================
   01 BACKGROUND ATMOSPHERE —— 三种大气氛
   ============================================================ */
export const Atmosphere: React.FC<{
  variant?: "cold" | "warm" | "dawn";
  glow?: [number, number];   // 主光位置 %
  glowColor?: string;
}> = ({ variant = "cold", glow = [62, 46], glowColor }) => {
  const gc = glowColor ?? (variant === "dawn" ? "rgba(242,166,90,.20)" : variant === "warm" ? "rgba(55,30,17,.42)" : "rgba(16,32,42,.5)");
  const base = {
    cold: `radial-gradient(circle at ${glow[0]}% ${glow[1]}%, #0B161E 0%, #05090D 44%, ${C.bg0} 100%)`,
    warm: `radial-gradient(circle at ${glow[0]}% ${glow[1]}%, #171009 0%, #080809 46%, ${C.bg0} 100%)`,
    dawn: `radial-gradient(circle at ${glow[0]}% ${glow[1]}%, #14100B 0%, #070708 42%, ${C.bg0} 100%)`,
  }[variant];
  return (
    <AbsoluteFill style={{ background: base }}>
      {/* 主光晕 */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle at ${glow[0]}% ${glow[1]}%, ${gc} 0%, transparent 30%)`,
      }} />
      {/* 底部地平呼吸光 */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 420,
        background: `linear-gradient(0deg, ${
          variant === "cold" ? "rgba(91,196,212,.05)" : "rgba(242,166,90,.07)"
        }, transparent 72%)`,
      }} />
      {/* 顶部冷压暗 */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: 300,
        background: "linear-gradient(180deg, rgba(0,0,0,.5), transparent)",
      }} />
    </AbsoluteFill>
  );
};

/* ============================================================
   03 BACKGROUND PARTICLES —— 星尘 / 信号尘埃
   ============================================================ */
export const StarDust: React.FC<{
  count?: number; seed?: number; area?: [number, number, number, number];
  tint?: string; maxSize?: number; opacity?: number; blur?: number;
}> = ({ count = 90, seed = 0, area = [0, 0, W, H], tint = C.gold, maxSize = 2.4, opacity = 0.5, blur = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: count }).map((_, i) => {
      const x = area[0] + hash(i, 1 + seed) * area[2];
      const y = area[1] + hash(i, 2 + seed) * area[3];
      const s = 0.6 + hash(i, 3 + seed) * maxSize;
      const a = (0.12 + hash(i, 4 + seed) * 0.88) * opacity;
      const isCyan = hash(i, 5 + seed) > 0.72;
      return (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%",
          background: isCyan ? C.cyan : tint, opacity: a,
          boxShadow: s > 1.7 ? `0 0 ${s * 3}px ${isCyan ? C.cyan : tint}` : "none",
          filter: blur ? `blur(${blur}px)` : undefined,
        }} />
      );
    })}
  </AbsoluteFill>
);

/* ============================================================
   体积光 shaft
   ============================================================ */
export const VolumeShaft: React.FC<{
  x: number; y: number; len?: number; wid?: number; angle?: number;
  color?: string; opacity?: number;
}> = ({ x, y, len = 1500, wid = 320, angle = 24, color = "rgba(240,215,154,.05)", opacity = 1 }) => (
  <div style={{
    position: "absolute", left: x, top: y, width: len, height: wid,
    transformOrigin: "0 50%", transform: `rotate(${angle}deg)`,
    background: `linear-gradient(90deg, ${color}, transparent 82%)`,
    clipPath: "polygon(0 38%, 100% 0, 100% 100%, 0 62%)",
    filter: "blur(22px)", opacity, pointerEvents: "none", mixBlendMode: "screen",
  }} />
);

/* ============================================================
   06 MIDGROUND 地面网格（电影纵深感）
   ============================================================ */
export const GridFloor: React.FC<{
  color?: string; opacity?: number; horizon?: number;
}> = ({ color = C.cyan, opacity = 0.13, horizon = 470 }) => {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= 18; i++) {
    const x = i / 18;
    lines.push(<line key={"v" + i} x1={mix(-380, 2300, x)} y1={1160} x2={mix(740, 1180, x)} y2={horizon}
      stroke={color} strokeOpacity={opacity} strokeWidth={1.2} />);
  }
  for (let j = 0; j < 12; j++) {
    const t = j / 11;
    const y = horizon + (H - horizon) * Math.pow(t, 1.8);
    lines.push(<line key={"h" + j} x1={0} y1={y} x2={W} y2={y} stroke={color}
      strokeOpacity={opacity * (0.55 + t * 0.55)} strokeWidth={1} />);
  }
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{lines}</svg>;
};

/* ============================================================
   05 GIANT TYPOGRAPHY —— 金属巨字，构图的一部分
   可出血、可裁切、可被遮挡（zIndex 由场景决定）
   ============================================================ */
export const GiantType: React.FC<{
  word: string;
  x?: number; y?: number;             // 左上角
  size?: number;
  tracking?: number;
  variant?: "gold" | "cream" | "ember" | "ghost";
  opacity?: number;
  zIndex?: number;
  align?: "left" | "right" | "center";
  width?: number;
  rotate?: number;
  lineHeight?: number;
}> = ({
  word, x = 0, y = 0, size = 300, tracking = -8, variant = "gold",
  opacity = 1, zIndex = 30, align = "left", width, rotate = 0, lineHeight = 0.92,
}) => {
  const grad = {
    gold: `linear-gradient(178deg, ${C.goldHi} 0%, ${C.gold} 30%, ${C.goldMid} 48%, ${C.goldDeep} 56%, #E8C87F 74%, #6E4C1E 100%)`,
    cream: `linear-gradient(178deg, #FFFDF4 0%, ${C.cream} 45%, #B8AC8C 58%, #F4ECD6 82%)`,
    ember: `linear-gradient(178deg, #FFE9D8 0%, ${C.ember} 38%, #A03822 58%, #E8764F 80%, #5E1F12 100%)`,
    ghost: `linear-gradient(178deg, rgba(239,229,204,.30), rgba(239,229,204,.06))`,
  }[variant];
  const glow = variant === "ember"
    ? "drop-shadow(0 0 34px rgba(242,138,82,.28)) drop-shadow(0 26px 70px rgba(0,0,0,.6))"
    : variant === "ghost"
      ? "drop-shadow(0 20px 60px rgba(0,0,0,.5))"
      : "drop-shadow(0 0 26px rgba(242,166,90,.20)) drop-shadow(0 24px 66px rgba(0,0,0,.58))";
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: width ?? W, zIndex,
      fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight,
      letterSpacing: tracking, textAlign: align, opacity, transform: `rotate(${rotate}deg)`,
      backgroundImage: grad, WebkitBackgroundClip: "text", backgroundClip: "text",
      color: "transparent", filter: glow, WebkitTextFillColor: "transparent",
      userSelect: "none",
    }}>{word}</div>
  );
};

/* ============================================================
   07 HERO OBJECT —— ATTENTION SIGNAL SHARD
   全片主体身份：暗玻璃信号碎片 + 金色内核 + 青色边缘 + 精细轨道
   ============================================================ */
export const SignalShard: React.FC<{
  x: number; y: number;
  scale?: number;      // 基准高约 380
  tilt?: number;       // 旋转 deg
  coreBoost?: number;  // 0..1 内核强度
  zIndex?: number;
  orbit?: boolean;     // 精细轨道结构
  orbitNode?: number;  // 轨道节点角度 deg（静态）
  orbitSpin?: number;  // 轨道整体旋转偏移（deg，用于减速停住的入场）
  orbitAlpha?: number; // 轨道透明度
}> = ({ x, y, scale = 1, tilt = -14, coreBoost = 1, zIndex = 50, orbit = true, orbitNode = 38, orbitSpin = 0, orbitAlpha = 1 }) => {
  const sh = 380 * scale, sw = 236 * scale;
  const clip = "polygon(26% 0%, 100% 24%, 74% 100%, 0% 76%)";
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: sw, height: sh,
      transform: `translate(-50%,-50%) rotate(${tilt}deg)`, zIndex,
    }}>
      {/* 玻璃体（下半保持可读，避免沉入背景） */}
      <div style={{
        position: "absolute", inset: 0, clipPath: clip,
        background: `linear-gradient(152deg, rgba(126,158,170,.20) 0%, rgba(24,36,42,.60) 38%, rgba(13,20,24,.78) 100%)`,
      }} />
      {/* 内部折射亮带 */}
      <div style={{
        position: "absolute", left: "12%", top: "6%", width: "76%", height: "88%",
        clipPath: clip,
        background: `linear-gradient(118deg, transparent 30%, rgba(214,236,244,.10) 44%, transparent 52%, rgba(240,215,154,.07) 66%, transparent 74%)`,
      }} />
      {/* 金色内核（熔芯） */}
      <div style={{
        position: "absolute", left: "50%", top: "46%", width: "58%", height: "40%",
        transform: "translate(-50%,-50%)",
        background: `radial-gradient(ellipse at 42% 40%, ${C.goldHi} 0%, ${C.amber} 26%, rgba(122,74,27,${0.55 * coreBoost}) 52%, transparent 74%)`,
        filter: `blur(${3 * scale}px)`, opacity: 0.55 + 0.45 * coreBoost,
      }} />
      {/* 内核 bloom（越出玻璃体） */}
      <div style={{
        position: "absolute", left: "50%", top: "46%", width: "170%", height: "120%",
        transform: "translate(-50%,-50%)",
        background: `radial-gradient(ellipse at center, rgba(242,166,90,${0.30 * coreBoost}) 0%, rgba(242,166,90,.08) 42%, transparent 68%)`,
        filter: "blur(8px)", mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* 边缘光：青色描边 + 局部金色高光 */}
      <svg width={sw} height={sh} viewBox={`0 0 ${sw} ${sh}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <polygon points={`${sw * 0.26},0 ${sw}, ${sh * 0.24} ${sw * 0.74},${sh} 0,${sh * 0.76}`}
          fill="none" stroke={C.cyan} strokeOpacity={0.74} strokeWidth={1.6 * scale}
          style={{ filter: `drop-shadow(0 0 ${6 * scale}px rgba(91,196,212,.6))` }} />
        <path d={`M ${sw * 0.26} 2 L ${sw * 0.985} ${sh * 0.252}`}
          fill="none" stroke={C.goldHi} strokeOpacity={0.85} strokeWidth={2.2 * scale}
          style={{ filter: `drop-shadow(0 0 ${5 * scale}px rgba(240,215,154,.8))` }} />
        {/* 底缘余光：避免下半沉入背景 */}
        <path d={`M ${sw * 0.05} ${sh * 0.72} L ${sw * 0.71} ${sh * 0.985}`}
          fill="none" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={1.2 * scale}
          style={{ filter: `drop-shadow(0 0 ${4 * scale}px rgba(91,196,212,.5))` }} />
      </svg>
      {/* 微电路：内部金点与发丝线 */}
      {[[38, 30], [56, 44], [44, 62], [63, 72], [30, 52]].map(([px, py], i) => (
        <div key={i} style={{
          position: "absolute", left: `${px}%`, top: `${py}%`,
          width: 2.6 * scale, height: 2.6 * scale, borderRadius: "50%",
          background: i % 2 ? C.cyan : C.gold, opacity: 0.8,
          boxShadow: `0 0 ${7 * scale}px ${i % 2 ? C.cyan : C.gold}`,
        }} />
      ))}
      {/* 精细轨道结构 */}
      {orbit && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: orbitAlpha }}>
          {[0, 1].map((i) => {
            const ew = sw * (1.62 + i * 0.34), eh = sh * (0.44 + i * 0.16);
            return (
              <div key={i} style={{
                position: "absolute", left: "50%", top: "50%", width: ew, height: eh,
                marginLeft: -ew / 2, marginTop: -eh / 2, borderRadius: "50%",
                border: `${(i ? 1 : 1.6) * scale}px ${i ? "solid" : "dashed"} rgba(91,196,212,${i ? 0.30 : 0.46})`,
                transform: `rotate(${(i ? -9 : 13) + orbitSpin}deg)`,
                boxShadow: `0 0 ${10 * scale}px rgba(91,196,212,.14)`,
              }} />
            );
          })}
          {/* 轨道节点（静态） */}
          {[orbitNode, orbitNode + 205].map((a, i) => {
            const ew = sw * 1.62, eh = sh * 0.44, rot = 13 + orbitSpin;
            const rad = (a * Math.PI) / 180;
            const ox = (Math.cos(rad) * ew) / 2, oy = (Math.sin(rad) * eh) / 2;
            const rx = ox * Math.cos((rot * Math.PI) / 180) - oy * Math.sin((rot * Math.PI) / 180);
            const ry = ox * Math.sin((rot * Math.PI) / 180) + oy * Math.cos((rot * Math.PI) / 180);
            const s = (i ? 5 : 7) * scale;
            return (
              <div key={a} style={{
                position: "absolute", left: `calc(50% + ${rx}px)`, top: `calc(50% + ${ry}px)`,
                width: s, height: s, transform: "translate(-50%,-50%)", borderRadius: "50%",
                background: i ? C.cyan : C.gold,
                boxShadow: `0 0 ${12 * scale}px ${i ? C.cyan : C.gold}`,
              }} />
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   08 ORBIT / LIGHT PATHS —— 曲线光路（虚线流）
   ============================================================ */
export const LightPath: React.FC<{
  d: string; color?: string; width?: number; opacity?: number; dash?: [number, number];
  glow?: boolean; zIndex?: number; offset?: number;
}> = ({ d, color = C.gold, width = 2.4, opacity = 0.5, dash = [18, 14], glow = true, zIndex = 60, offset = 0 }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex, overflow: "visible" }}>
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeOpacity={opacity}
      strokeDasharray={`${dash[0]} ${dash[1]}`} strokeDashoffset={offset}
      style={glow ? { filter: `drop-shadow(0 0 7px ${color})` } : undefined} />
  </svg>
);

/* ============================================================
   09 HUD / RETICLE —— 精细微 UI
   ============================================================ */
export const HUDReticle: React.FC<{
  x: number; y: number; r?: number; accent?: string; opacity?: number; zIndex?: number;
  label?: string;
}> = ({ x, y, r = 92, accent = C.gold, opacity = 0.9, zIndex = 70, label }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex, opacity, pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: -r, top: -r, width: r * 2, height: r * 2,
      transform: `translate(${0}px,${0}px)`,
    }}>
      {/* 四角括号 */}
      {[0, 90, 180, 270].map((a) => (
        <div key={a} style={{
          position: "absolute", left: "50%", top: "50%", width: r + 20, height: 2,
          transformOrigin: "0 50%", transform: `rotate(${a}deg)`,
          background: `linear-gradient(90deg, transparent 8%, ${accent} 26%, ${accent} 64%, transparent)`,
          opacity: 0.9,
        }} />
      ))}
      {/* 细环 */}
      <div style={{
        position: "absolute", inset: 10, borderRadius: "50%",
        border: `1px dashed rgba(239,229,204,.30)`,
      }} />
      {/* 中心点 */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 3, height: 3,
        transform: "translate(-50%,-50%)", borderRadius: "50%", background: accent,
        boxShadow: `0 0 8px ${accent}`,
      }} />
      {label && (
        <div style={{
          position: "absolute", left: r + 16, top: -30, fontFamily: CJK,
          fontSize: 13, letterSpacing: 2.4, color: "rgba(159,216,232,.78)", whiteSpace: "nowrap",
        }}>{label}</div>
      )}
    </div>
  </div>
);

export const KickerLine: React.FC<{
  x?: number; y?: number; text: string; accent?: string; align?: "left" | "right"; opacity?: number;
}> = ({ x = 84, y = 64, text, accent = "rgba(91,196,212,.66)", align = "left", opacity = 1 }) => (
  <div style={{
    position: "absolute", left: x, top: y, zIndex: 80, textAlign: align === "right" ? "right" : "left",
    fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, letterSpacing: 5.5, color: accent, opacity,
  }}>
    {text}
  </div>
);

/* ============================================================
   10 SUPPORTING TYPOGRAPHY —— 中文辅助文案
   ============================================================ */
export const SubText: React.FC<{
  x: number; y: number; width?: number; lines: React.ReactNode;
  size?: number; align?: "left" | "right"; opacity?: number; zIndex?: number;
}> = ({ x, y, width = 620, lines, size = 27, align = "left", opacity = 1, zIndex = 80 }) => (
  <div style={{
    position: "absolute", left: x, top: y, width, zIndex, opacity, textAlign: align,
    fontFamily: CJK, fontSize: size, lineHeight: 1.62, letterSpacing: 1.2,
    color: "rgba(239,229,204,.80)", textShadow: "0 3px 26px rgba(0,0,0,.65)",
  }}>{lines}</div>
);

/* ============================================================
   11/12 FOREGROUND —— 失焦玻璃碎片（前景遮挡）
   ============================================================ */
export const FGShard: React.FC<{
  x: number; y: number; w?: number; h?: number; rotate?: number; scale?: number;
  opacity?: number; blur?: number; tint?: string; edge?: string;
}> = ({ x, y, w = 700, h = 460, rotate = -18, scale = 1, opacity = 0.16, blur = 16, tint, edge }) => {
  const fw = w * scale, fh = h * scale;
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: fw, height: fh,
      transform: `translate(-50%,-50%) rotate(${rotate}deg)`,
      opacity, filter: `blur(${blur}px)`, pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        clipPath: "polygon(22% 0%, 100% 20%, 78% 100%, 0% 82%)",
        background: `linear-gradient(148deg, rgba(120,152,164,.16), rgba(10,16,20,.52) 46%, rgba(4,8,10,.74))`,
        boxShadow: tint ? `0 0 90px ${tint}` : undefined,
      }} />
      {edge && (
        <svg width={fw} height={fh} viewBox={`0 0 ${fw} ${fh}`} style={{ position: "absolute", inset: 0 }}>
          <polygon points={`${fw * 0.22},0 ${fw},${fh * 0.2} ${fw * 0.78},${fh} 0,${fh * 0.82}`}
            fill="none" stroke={edge} strokeWidth={2}
            style={{ filter: `drop-shadow(0 0 9px ${edge})` }} />
        </svg>
      )}
    </div>
  );
};

/* ============================================================
   13 LIGHT BLOOM
   ============================================================ */
export const Bloom: React.FC<{
  x: number; y: number; r?: number; color?: string; strength?: number; zIndex?: number;
}> = ({ x, y, r = 520, color = "rgba(242,166,90,.16)", strength = 1, zIndex = 120 }) => (
  <div style={{
    position: "absolute", left: x, top: y, width: r * 2, height: r * 2,
    transform: "translate(-50%,-50%)", borderRadius: "50%", zIndex, pointerEvents: "none",
    background: `radial-gradient(circle, ${color} 0%, transparent 62%)`,
    opacity: strength, mixBlendMode: "screen", filter: "blur(6px)",
  }} />
);

/* ============================================================
   14 GRAIN / 15 VIGNETTE
   ============================================================ */
export const Grain: React.FC = () => (
  <AbsoluteFill style={{
    pointerEvents: "none", zIndex: 130, opacity: 0.10, mixBlendMode: "screen",
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,.16) 0 .6px, transparent 1px)",
    backgroundSize: "12px 12px",
  }} />
);

export const Vignette: React.FC<{strength?: number}> = ({ strength = 1 }) => (
  <AbsoluteFill style={{
    pointerEvents: "none", zIndex: 140,
    boxShadow: `inset 0 0 ${210 * strength}px ${64 * strength}px rgba(0,0,0,.92), inset 0 0 44px 12px rgba(0,0,0,.7)`,
  }} />
);

/* ============================================================
   FRAME —— 场景外壳：大气 + 内容 + bloom/grain/vignette + 参考叠层
   ============================================================ */
export const CinemaFrame: React.FC<{
  variant?: "cold" | "warm" | "dawn";
  glow?: [number, number];
  glowColor?: string;
  vignette?: number;
  children: React.ReactNode;
}> = ({ variant = "cold", glow, glowColor, vignette = 1, children }) => {
  const props = getInputProps<{ reference?: boolean; overlay?: number }>() ?? {};
  const showRef = props.reference === true && (props.overlay ?? 0) > 0;
  return (
    <AbsoluteFill style={{ background: C.bg0, overflow: "hidden", fontFamily: CJK }}>
      <Atmosphere variant={variant} glow={glow} glowColor={glowColor} />
      {children}
      <Grain />
      <Vignette strength={vignette} />
      {showRef && <ReferenceOverlay opacity={clamp((props.overlay ?? 0) / 100)} />}
    </AbsoluteFill>
  );
};

/* 参考叠层：public/references/v45/<file>.png，inputProps 控制
   npx remotion still ... --props='{"reference":true,"overlay":50}' */
export const ReferenceOverlay: React.FC<{ file?: string; opacity: number }> = ({ file, opacity }) => {
  const f = useCurrentFrame();
  const name = file ?? `ref-${String(Math.floor(f / 1000000)).padStart(2, "0")}.png`;
  return (
    <AbsoluteFill style={{ zIndex: 200, opacity, pointerEvents: "none" }}>
      <Img src={`references/v45/${name}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </AbsoluteFill>
  );
};
