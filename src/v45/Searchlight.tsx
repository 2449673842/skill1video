import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, GridFloor, LightPath, W, H,
  C, hash, settle,
} from "./v45-common";

/* ============================================================
   V45_Searchlight —— SEARCHLIGHT / WORKSPACE
   构图：巨字 SEARCHLIGHT 被上边框裁切（标题序列式出血）；
   左侧 SignalShard 张开一束宽探照灯锥，把右侧一小片工作区照亮——
   一组悬浮全息玻璃面板（一主四辅，尺寸/角度各异，非均质卡片）。
   左下保持大面积黑暗（极简负空间）。
   ============================================================ */

/* 全息工作面板（非 UI 卡片：玻璃、边缘光、透视侧转、内容抽象） */
const HoloPanel: React.FC<{
  x: number; y: number; w: number; h: number; rotY: number; rotZ: number;
  accent: string; focus: number; p: number; kind: "brief" | "chart" | "list" | "note" | "media";
}> = ({ x, y, w, h, rotY, rotZ, accent, focus, p, kind }) => {
  const lit = 0.2 + focus * 0.8;
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, height: h, zIndex: 46,
      transform: `translate(-50%,-50%) perspective(1100px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
      opacity: p,
      border: `1px solid ${accent}${Math.round(lit * 200).toString(16).padStart(2, "0")}`,
      background: `linear-gradient(160deg, rgba(126,158,170,${0.05 + focus * 0.10}), rgba(7,12,15,${0.56 + (1 - focus) * 0.3}))`,
      boxShadow: focus > 0.5
        ? `0 0 ${28 * focus}px ${accent}2E, inset 0 0 30px ${accent}14, 0 30px 70px rgba(0,0,0,.4)`
        : `0 24px 60px rgba(0,0,0,.34)`,
      backdropFilter: "blur(2px)",
    }}>
      {/* 顶部微光条 */}
      <div style={{
        position: "absolute", left: 10, right: 10, top: 8, height: 2,
        background: `linear-gradient(90deg, ${accent}, transparent 70%)`, opacity: lit,
      }} />
      {/* 顶角小标 */}
      <div style={{
        position: "absolute", right: 9, top: 12, fontSize: Math.max(8, w * 0.035),
        letterSpacing: 2, color: `${accent}90`, fontFamily: "'Segoe UI',sans-serif",
      }}>{String(Math.round(hash(x, 3) * 900) + 100)}</div>
      {/* 内容抽象化 */}
      {kind === "chart" && (
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <path d={`M ${w * 0.1} ${h * 0.74} L ${w * 0.3} ${h * 0.5} L ${w * 0.46} ${h * 0.62} L ${w * 0.66} ${h * 0.34} L ${w * 0.88} ${h * 0.44}`}
            fill="none" stroke={accent} strokeWidth={2.2} opacity={0.55 + focus * 0.4}
            style={{ filter: `drop-shadow(0 0 5px ${accent})` }} />
          <line x1={w * 0.08} y1={h * 0.85} x2={w * 0.92} y2={h * 0.85} stroke="rgba(239,229,204,.2)" strokeWidth={1} />
        </svg>
      )}
      {kind === "brief" && (
        <>
          <div style={{ position: "absolute", left: 12, top: 16, width: "58%", height: 4, background: `${accent}CC` }} />
          {[0, 1, 2, 3, 4].map((r) => (
            <div key={r} style={{
              position: "absolute", left: 12, top: 30 + r * 9, height: 2.4,
              width: `${86 - r * 11 - hash(x + r, 5) * 10}%`,
              background: `rgba(239,229,204,${0.14 + focus * 0.2})`,
            }} />
          ))}
          <div style={{
            position: "absolute", left: 12, bottom: 12, width: 34, height: 3,
            background: accent, boxShadow: `0 0 8px ${accent}`,
          }} />
        </>
      )}
      {kind === "list" && [0, 1, 2].map((r) => (
        <div key={r} style={{
          position: "absolute", left: 12, top: 18 + r * 14, display: "flex", alignItems: "center", gap: 7,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, opacity: 0.7 }} />
          <div style={{ width: `${50 + hash(x + r, 9) * 30}%`, height: 2.4, background: "rgba(239,229,204,.22)" }} />
        </div>
      ))}
      {kind === "note" && (
        <div style={{
          position: "absolute", inset: 12,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(239,229,204,.14) 0 1.5px, transparent 1.5px 9px)`,
        }} />
      )}
      {kind === "media" && (
        <>
          <div style={{
            position: "absolute", inset: 10, borderRadius: 3,
            background: `linear-gradient(140deg, rgba(91,196,212,.10), rgba(242,166,90,.08))`,
          }} />
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent",
            borderLeft: `11px solid ${accent}`,
          }} />
        </>
      )}
      {/* 底缘余光 */}
      <div style={{
        position: "absolute", left: 8, right: 8, bottom: 5, height: 1.4,
        background: `linear-gradient(90deg, transparent, ${accent}${Math.round(lit * 140).toString(16).padStart(2, "0")}, transparent)`,
      }} />
    </div>
  );
};

const HERO_X = 640, HERO_Y = 556;

export const V45Searchlight: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 4, 52);
  /* 光锥终点 = 聚焦面板 */
  const FOCUS = { x: 1330, y: 508 };
  const coneAngle = (Math.atan2(FOCUS.y - HERO_Y, FOCUS.x - HERO_X) * 180) / Math.PI;
  const coneLen = Math.hypot(FOCUS.x - HERO_X, FOCUS.y - HERO_Y);
  return (
    <CinemaFrame variant="cold" glow={[38, 54]} glowColor="rgba(12,26,34,.55)">
      {/* 06 大尺度地面网格（空旷） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 22, opacity: p }}>
        <GridFloor opacity={0.09} horizon={438} />
      </div>

      {/* 03 星尘稀疏 —— 左侧大面积留黑 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={40} seed={11} area={[300, 120, W - 300, 700]} opacity={0.34 * p} maxSize={1.7} />
      </div>

      {/* 05 巨字 SEARCHLIGHT 被上缘裁切（标题序列式） */}
      <GiantType word="SEARCHLIGHT" x={-30} y={-128} size={288} tracking={-9}
        variant="gold" zIndex={30} opacity={0.96 * p} />

      {/* 极简负空间标记：左下一枚孤点十字 */}
      <div style={{ position: "absolute", left: 296, top: 866, zIndex: 34, opacity: 0.5 * p }}>
        <div style={{ width: 22, height: 1, background: "rgba(159,216,232,.6)" }} />
        <div style={{ width: 1, height: 22, background: "rgba(159,216,232,.6)", marginTop: -11.5, marginLeft: 10.5 }} />
      </div>

      {/* 08 探照灯锥（从主体到聚焦面板） */}
      <div style={{
        position: "absolute", left: HERO_X + 40, top: HERO_Y, width: coneLen + 120, height: 470,
        transformOrigin: "0 50%", transform: `rotate(${coneAngle}deg) translateY(-50%)`,
        clipPath: "polygon(0 46%, 100% 0, 100% 100%, 0 54%)",
        background: `linear-gradient(90deg, rgba(242,166,90,.16), rgba(242,166,90,.05) 62%, transparent)`,
        filter: "blur(14px)", mixBlendMode: "screen", zIndex: 42, opacity: p,
      }} />
      {/* 光锥中心亮线 */}
      <LightPath zIndex={44}
        d={`M ${HERO_X + 30} ${HERO_Y} L ${FOCUS.x - 170} ${FOCUS.y}`}
        color={C.gold} width={1.4} opacity={0.4 * p} dash={[2, 26]} />

      {/* 工作区地面光池 */}
      <div style={{
        position: "absolute", left: FOCUS.x - 320, top: 826, width: 640, height: 130,
        background: "radial-gradient(ellipse, rgba(242,166,90,.13), transparent 68%)",
        filter: "blur(6px)", zIndex: 44, opacity: p,
      }} />

      {/* 04 远景暗面板（未照亮的工作区残影） */}
      {[[1010, 330, 120, 78, -6], [1655, 690, 132, 86, 8], [1120, 742, 98, 64, -4]].map(([x, y, w, h, r], i) => (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: w, height: h, zIndex: 24,
          transform: `translate(-50%,-50%) rotate(${r}deg)`, opacity: 0.3 * p,
          border: "1px solid rgba(159,216,232,.22)",
          background: "linear-gradient(160deg, rgba(126,158,170,.04), rgba(7,12,15,.5))",
        }} />
      ))}

      {/* 07/04 工作区面板群：一主四辅，尺寸角度各异 */}
      <HoloPanel kind="brief" x={1330} y={508} w={330} h={216} rotY={-8} rotZ={-1.5}
        accent={C.gold} focus={1} p={p} />
      <HoloPanel kind="chart" x={1098} y={414} w={188} h={128} rotY={16} rotZ={2}
        accent={C.cyan} focus={0.34} p={p} />
      <HoloPanel kind="list" x={1102} y={678} w={176} h={118} rotY={12} rotZ={-2}
        accent={C.teal} focus={0.3} p={p} />
      <HoloPanel kind="media" x={1583} y={404} w={172} h={116} rotY={-18} rotZ={3}
        accent={C.ice} focus={0.26} p={p} />
      <HoloPanel kind="note" x={1596} y={682} w={190} h={126} rotY={-14} rotZ={-3}
        accent={C.cream} focus={0.24} p={p} />

      {/* 13 bloom：主体与聚焦面板 */}
      <Bloom x={HERO_X} y={HERO_Y} r={330} color="rgba(242,166,90,.14)" strength={p} />
      <Bloom x={FOCUS.x} y={FOCUS.y} r={300} color="rgba(240,215,154,.10)" strength={p} />

      {/* 07 HERO —— 张开探照灯的 Signal Shard */}
      <div style={{ opacity: p }}>
        <SignalShard x={HERO_X} y={HERO_Y} scale={0.92} tilt={-7} coreBoost={1} orbitNode={210} />
      </div>

      {/* 09 HUD：聚焦面板锁定 */}
      <HUDReticle x={FOCUS.x} y={FOCUS.y} r={172} accent={C.gold} opacity={0.86 * p}
        label="WORKSPACE · FOCUS 01" />
      {/* 光锥角度刻度 */}
      <div style={{
        position: "absolute", left: 292, top: HERO_Y + 178, zIndex: 72, opacity: 0.66 * p,
        fontSize: 13, letterSpacing: 2.4, color: "rgba(159,216,232,.72)",
        fontFamily: "'Segoe UI',sans-serif",
      }}>BEAM 04° · 12,400 lm</div>

      {/* 10 辅助排版 */}
      <KickerLine y={178} text="SEARCHLIGHT / WORKSPACE" />
      <SubText x={86} y={H - 150} width={600} opacity={p}
        lines={<>注意把一处照亮，展开成<span style={{ color: C.gold, fontWeight: 700 }}>此刻的工作区</span>；<br />
        其余世界，暂时退入黑暗。</>} />

      {/* 11/12 前景失焦 */}
      <FGShard x={360} y={1000} w={620} h={470} rotate={-24} opacity={0.85 * p} blur={9} edge="rgba(159,216,232,.34)" tint="rgba(159,216,232,.05)" />
      <FGShard x={172} y={902} w={360} h={280} rotate={-10} opacity={0.8 * p} blur={7} edge="rgba(240,215,154,.30)" />
      <FGShard x={W + 90} y={140} w={520} h={430} rotate={17} opacity={0.13 * p} blur={20}
        tint="rgba(91,196,212,.05)" />
    </CinemaFrame>
  );
};
