import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, LightPath, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, GridFloor, VolumeShaft, W, H,
  C, hash, clamp, settle,
} from "./v45-common";

/* ============================================================
   V45_Attention —— ATTENTION / SIGNAL FLOOD
   构图：左暗右亮的对角线。巨型 ATTENTION 横贯下三分之二并延伸出画面，
   被 Hero SignalShard 遮挡一角；信号洪流从左上深渊涌向主体。
   层级：01大气 02远景碎片场 03星尘 04深景卡片 05巨字 06地面网格
        07主体 08光路 09HUD 10辅助文案 11前景卡 12前景失焦 13bloom 14grain 15vignette
   ============================================================ */

/* 02 FAR MEDIA FIELD —— 远景信息碎片（信号洪流） */
const FragmentField: React.FC<{p: number}> = ({ p }) => {
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 96; i++) {
    const depth = hash(i, 11);
    const x = -60 + hash(i, 12) * 1500;
    const y = 40 + hash(i, 13) * 680;
    const kind = i % 3;
    const a = (0.08 + depth * 0.30) * p;
    const blur = 0.4 + (1 - depth) * 2.6;
    if (kind === 0) {
      // 远处细线
      items.push(<div key={i} style={{
        position: "absolute", left: x, top: y, width: 18 + depth * 60, height: 1.4,
        background: i % 7 === 0 ? C.cyan : "rgba(239,229,204,.8)", opacity: a, filter: `blur(${blur}px)`,
      }} />);
    } else if (kind === 1) {
      // 远处微缩卡片
      const w = 20 + depth * 26, h = 14 + depth * 18;
      items.push(<div key={i} style={{
        position: "absolute", left: x, top: y, width: w, height: h,
        border: `1px solid ${i % 9 === 0 ? "rgba(242,166,90,.8)" : "rgba(159,216,232,.5)"}`,
        background: "rgba(8,14,18,.6)", opacity: a, filter: `blur(${blur}px)`,
        transform: `rotate(${(hash(i, 14) - 0.5) * 14}deg)`,
      }} />);
    } else {
      // 远处文字块（三条微行）
      items.push(<div key={i} style={{
        position: "absolute", left: x, top: y, opacity: a, filter: `blur(${blur}px)`,
      }}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{
            width: 14 + hash(i * 3 + r, 15) * 34, height: 2,
            marginBottom: 2.5, background: "rgba(239,229,204,.85)",
          }} />
        ))}
      </div>);
    }
  }
  return <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>{items}</div>;
};

/* 04 BACKGROUND CARDS —— 深景中的少量完整卡片（比碎片大，仍很暗） */
const DeepCards: React.FC<{p: number}> = ({ p }) => (
  <>
    {[[-40, 210, 150, 96, -7], [320, 118, 120, 78, 5], [1660, 150, 165, 104, 9], [1380, 92, 108, 70, -5]].map(
      ([x, y, w, h, rot], i) => (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: w, height: h,
          transform: `rotate(${rot}deg)`, zIndex: 20, opacity: p * (0.14 + i * 0.03),
          border: "1px solid rgba(159,216,232,.30)", borderRadius: 4,
          background: `linear-gradient(150deg, rgba(126,158,170,.08), rgba(6,10,13,.66))`,
        }}>
          <div style={{
            position: "absolute", left: 8, top: 8, right: 8, height: 3,
            background: "rgba(239,229,204,.28)",
          }} />
          {[0, 1, 2].map((r) => (
            <div key={r} style={{
              position: "absolute", left: 8, top: 20 + r * 6, width: "76%", height: 1.6,
              background: "rgba(239,229,204,.16)",
            }} />
          ))}
        </div>
      )
    )}
  </>
);

const HERO_X = 1205, HERO_Y = 492;

export const V45Attention: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 4, 52);          // 之后完全静止
  return (
    <CinemaFrame variant="cold" glow={[64, 46]} glowColor="rgba(16,30,40,.55)">
      {/* 08 前置光路（在巨字之上、主体之下） */}
      <LightPath zIndex={26}
        d={`M -80 320 C 420 380, 820 240, ${HERO_X - 130} ${HERO_Y - 40}`}
        color={C.cyan} width={1.6} opacity={0.34 * p} dash={[26, 22]} />
      <LightPath zIndex={26}
        d={`M -60 760 C 480 700, 900 640, ${HERO_X - 110} ${HERO_Y + 60}`}
        color={C.gold} width={2.2} opacity={0.42 * p} dash={[30, 24]} />
      <LightPath zIndex={26}
        d={`M -40 540 C 500 500, 860 420, ${HERO_X - 120} ${HERO_Y + 8}`}
        color={C.amber} width={1.2} opacity={0.26 * p} dash={[14, 18]} />

      {/* 06 地面网格（中景结构） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 22, opacity: p }}>
        <GridFloor opacity={0.10} horizon={512} />
      </div>

      {/* 02/03/04 远景三件套 */}
      <FragmentField p={p} />
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={70} seed={3} area={[0, 0, W, H]} opacity={0.55 * p} maxSize={2} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 20, opacity: 1 }}>
        <DeepCards p={p} />
      </div>

      {/* 顶部体积光（右上暖金） */}
      <VolumeShaft x={1330} y={-80} len={1450} wid={360} angle={118}
        color="rgba(242,166,90,.055)" opacity={p} />

      {/* 05 巨型排版：ATTENTION 横贯画面，右侧被主体遮挡 */}
      <GiantType word="ATTENTION" x={-36} y={588} size={292} tracking={-10}
        variant="gold" zIndex={30} opacity={p} />
      {/* 巨字左侧压暗（左暗右亮） */}
      <div style={{
        position: "absolute", left: 0, top: 560, width: 760, height: 320, zIndex: 31,
        background: "linear-gradient(90deg, rgba(2,3,5,.62), transparent)",
        opacity: 0.8 * p, pointerEvents: "none",
      }} />

      {/* 13 主体背后 bloom */}
      <Bloom x={HERO_X} y={HERO_Y} r={430} color="rgba(242,166,90,.14)" strength={p} />

      {/* 07 HERO —— Signal Shard */}
      <div style={{ opacity: p }}>
        <SignalShard x={HERO_X} y={HERO_Y} scale={1.02} tilt={-12} coreBoost={1} orbitNode={38} />
      </div>

      {/* 09 HUD/RETICLE */}
      <HUDReticle x={HERO_X} y={HERO_Y - 10} r={168} accent={C.gold} opacity={0.85 * p}
        label="SIGNAL 0x2F · LOCK 99.2%" />
      {/* 屏幕角标 */}
      {[[74, 58], [W - 74, 58], [74, H - 58], [W - 74, H - 58]].map(([cx, cy], i) => (
        <div key={i} style={{
          position: "absolute", left: cx, top: cy, width: 26, height: 26, zIndex: 75,
          borderTop: i < 2 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          borderBottom: i >= 2 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          borderLeft: i % 2 === 0 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          borderRight: i % 2 === 1 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          opacity: p,
        }} />
      ))}
      {/* 右缘微刻度尺 */}
      <div style={{ position: "absolute", right: 46, top: 220, zIndex: 75, opacity: 0.5 * p }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{
            width: i % 4 === 0 ? 14 : 7, height: 1, background: "rgba(159,216,232,.55)",
            marginLeft: "auto", marginBottom: 17,
          }} />
        ))}
      </div>

      {/* 10 辅助排版 */}
      <KickerLine text="ATTENTION / SIGNAL FLOOD" />
      <SubText x={86} y={H - 176} width={560} opacity={p}
        lines={<>每天约 <span style={{ color: C.gold, fontWeight: 700 }}>10⁹ bit</span> 的世界经过你。<br />
        真正进入意识的，不足 <span style={{ color: C.cyan, fontWeight: 700 }}>10 bit</span>。</>} />
      <div style={{
        position: "absolute", left: 86, bottom: 44, zIndex: 80, opacity: 0.72 * p,
        fontFamily: "'Segoe UI','Noto Sans CJK SC',sans-serif", fontSize: 15, letterSpacing: 1,
        color: "rgba(239,229,204,.66)",
      }}>Zheng &amp; Meister, Neuron 113(2), 2025</div>

      {/* 11/12 前景失焦遮挡 */}
      <FGShard x={-60} y={H - 40} w={760} h={520} rotate={-24} scale={1.25} opacity={0.16 * p} blur={17} />
      <FGShard x={W + 40} y={120} w={560} h={420} rotate={19} opacity={0.12 * p} blur={20}
        tint="rgba(91,196,212,.05)" />
    </CinemaFrame>
  );
};
