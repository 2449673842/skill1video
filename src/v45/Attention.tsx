import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, LightPath, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, GridFloor, VolumeShaft, Ripple, W, H,
  C, hash, clamp, lerp, settle, outCubic, pulseAt,
} from "./v45-common";

/* ============================================================
   V45_Attention —— ATTENTION / SIGNAL FLOOD（动态版）
   五阶段：
     0–14   Preparation  深空就位，洪流碎片开始涌入
     30–50  Trigger      SignalShard 核心点火（bloom 脉冲 + 涟漪）
     14–64  Main Event   碎片洪流减速汇聚；巨字 ATTENTION 升起；光路接通
     56–86  Settle       HUD 捕获、环形轨道减速停住；辅助文案进入
     86+    New State    完全静止（海报状态）
   相机：锁定。主体自带运动，无需运镜。
   ============================================================ */

/* 02 FAR MEDIA FIELD —— 远景信息碎片（信号洪流，向右涌并减速停住） */
const FragmentField: React.FC<{f: number; p: number}> = ({ f, p }) => {
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 96; i++) {
    const depth = hash(i, 11);
    const bx = -60 + hash(i, 12) * 1500;
    const by = 40 + hash(i, 13) * 680;
    const kind = i % 3;
    /* 每片有自己的到达窗口：起始更靠左，减速滑入到终位（终位 = 静帧位置） */
    const from = 12 + hash(i, 16) * 34;
    const q = outCubic(f, 0, 1, from, 30 + hash(i, 17) * 22);
    const x = bx - (520 + hash(i, 18) * 460) * (1 - q);
    const y = by - (30 + hash(i, 19) * 60) * (1 - q);
    const a = (0.08 + depth * 0.30) * p * clamp(q * 1.6);
    const blur = 0.4 + (1 - depth) * 2.6;
    if (kind === 0) {
      items.push(<div key={i} style={{
        position: "absolute", left: x, top: y, width: 18 + depth * 60, height: 1.4,
        background: i % 7 === 0 ? C.cyan : "rgba(239,229,204,.8)", opacity: a, filter: `blur(${blur}px)`,
      }} />);
    } else if (kind === 1) {
      const w = 20 + depth * 26, h = 14 + depth * 18;
      items.push(<div key={i} style={{
        position: "absolute", left: x, top: y, width: w, height: h,
        border: `1px solid ${i % 9 === 0 ? "rgba(242,166,90,.8)" : "rgba(159,216,232,.5)"}`,
        background: "rgba(8,14,18,.6)", opacity: a, filter: `blur(${blur}px)`,
        transform: `rotate(${(hash(i, 14) - 0.5) * 14}deg)`,
      }} />);
    } else {
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

/* 04 BACKGROUND CARDS —— 深景卡片（随洪流浮现） */
const DeepCards: React.FC<{p: number}> = ({ p }) => (
  <>
    {[[-40, 210, 150, 96, -7], [320, 118, 120, 78, 5], [1660, 150, 165, 104, 9], [1380, 92, 108, 70, -5]].map(
      ([x, y, w, h, rot], i) => {
        const q = outCubic(p * 150, 0, 1, 10 + i * 7, 26);
        return (
          <div key={i} style={{
            position: "absolute", left: x - (1 - q) * 40, top: y, width: w, height: h,
            transform: `rotate(${rot}deg)`, zIndex: 20, opacity: q * (0.14 + i * 0.03),
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
        );
      }
    )}
  </>
);

const HERO_X = 1205, HERO_Y = 492;

export const V45Attention: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 0, 14);                      // Preparation：快速在场
  /* --- 主事件参数（全部在 86 帧前收敛到静帧值） --- */
  const heroQ = outCubic(f, 0, 1, 8, 56);          // 主体减速入场
  const heroX = lerp(1740, HERO_X, heroQ);
  const heroScale = lerp(0.78, 1.02, heroQ);
  const heroTilt = lerp(-34, -12, heroQ);
  const ignite = outCubic(f, 0, 1, 30, 20);        // Trigger：核心点火
  const core = lerp(0.12, 1, ignite);
  const spin = outCubic(f, 0, 1, 34, 44) * 64;     // 轨道旋转减速停住
  const ringIn = outCubic(f, 0, 1, 34, 24);
  const acquire = outCubic(f, 0, 1, 56, 20);       // Settle：HUD 捕获
  const titleQ = outCubic(f, 0, 1, 12, 42);        // 巨字升起
  const titleY = lerp(648, 588, titleQ);
  const flow = outCubic(f, 0, 1, 18, 46);          // 光路接通（虚线流动后停住）
  const lateIn = outCubic(f, 0, 1, 62, 22);        // 辅助文案 / 角标
  const fgIn = outCubic(f, 0, 1, 66, 20);
  const ignitePulse = pulseAt(f, 34, 8);           // 点火瞬间的 bloom 脉冲
  return (
    <CinemaFrame variant="cold" glow={[64, 46]} glowColor="rgba(16,30,40,.55)">
      {/* 08 光路：从左侧深渊流向主体 */}
      <LightPath zIndex={26}
        d={`M -80 320 C 420 380, 820 240, ${heroX - 130} ${HERO_Y - 40}`}
        color={C.cyan} width={1.6} opacity={0.34 * p * clamp(flow * 1.4)} dash={[26, 22]}
        offset={-(1 - flow) * 380} />
      <LightPath zIndex={26}
        d={`M -60 760 C 480 700, 900 640, ${heroX - 110} ${HERO_Y + 60}`}
        color={C.gold} width={2.2} opacity={0.42 * p * clamp(flow * 1.4)} dash={[30, 24]}
        offset={-(1 - flow) * 420} />
      <LightPath zIndex={26}
        d={`M -40 540 C 500 500, 860 420, ${heroX - 120} ${HERO_Y + 8}`}
        color={C.amber} width={1.2} opacity={0.26 * p * clamp(flow * 1.4)} dash={[14, 18]}
        offset={-(1 - flow) * 300} />

      {/* 06 地面网格 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 22, opacity: p }}>
        <GridFloor opacity={0.10} horizon={512} />
      </div>

      {/* 02/03/04 远景三件套 */}
      <FragmentField f={f} p={p} />
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={70} seed={3} area={[0, 0, W, H]} opacity={0.55 * p} maxSize={2} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 20, opacity: 1 }}>
        <DeepCards p={p} />
      </div>

      {/* 顶部体积光（随点火增强） */}
      <VolumeShaft x={1330} y={-80} len={1450} wid={360} angle={118}
        color="rgba(242,166,90,.055)" opacity={p * (0.55 + 0.45 * ignite)} />

      {/* 05 巨型排版：ATTENTION 横贯画面，右侧被主体遮挡 */}
      <GiantType word="ATTENTION" x={-36} y={titleY} size={292} tracking={-10}
        variant="gold" zIndex={30} opacity={p * clamp(titleQ * 1.3)} />
      {/* 巨字左侧压暗（左暗右亮） */}
      <div style={{
        position: "absolute", left: 0, top: 560, width: 760, height: 320, zIndex: 31,
        background: "linear-gradient(90deg, rgba(2,3,5,.62), transparent)",
        opacity: 0.8 * p * clamp(titleQ * 1.3), pointerEvents: "none",
      }} />

      {/* 13 主体背后 bloom（点火时脉冲增强） */}
      <Bloom x={heroX} y={HERO_Y} r={430} color="rgba(242,166,90,.14)"
        strength={p * (0.4 + 0.6 * ignite + ignitePulse * 0.55)} />

      {/* 07 HERO —— Signal Shard（减速入场 → 点火） */}
      <div style={{ opacity: p }}>
        <SignalShard x={heroX} y={HERO_Y} scale={heroScale} tilt={heroTilt}
          coreBoost={core} orbitNode={38} orbitSpin={spin} orbitAlpha={ringIn} />
      </div>

      {/* 点火涟漪 */}
      <Ripple f={f} events={[34]} x={heroX} y={HERO_Y} color={C.gold} maxR={300} layers={3} />

      {/* 09 HUD/RETICLE（捕获：缩合到位） */}
      <HUDReticle x={heroX} y={HERO_Y - 10} r={lerp(228, 168, acquire)} accent={C.gold}
        opacity={0.85 * acquire} label="SIGNAL 0x2F · LOCK 99.2%" />
      {/* 屏幕角标 */}
      {[[74, 58], [W - 74, 58], [74, H - 58], [W - 74, H - 58]].map(([cx, cy], i) => (
        <div key={i} style={{
          position: "absolute", left: cx, top: cy, width: 26, height: 26, zIndex: 75,
          borderTop: i < 2 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          borderBottom: i >= 2 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          borderLeft: i % 2 === 0 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          borderRight: i % 2 === 1 ? `1.5px solid rgba(159,216,232,.34)` : undefined,
          opacity: lateIn,
        }} />
      ))}
      {/* 右缘微刻度尺 */}
      <div style={{ position: "absolute", right: 46, top: 220, zIndex: 75, opacity: 0.5 * lateIn }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{
            width: i % 4 === 0 ? 14 : 7, height: 1, background: "rgba(159,216,232,.55)",
            marginLeft: "auto", marginBottom: 17,
          }} />
        ))}
      </div>

      {/* 10 辅助排版 */}
      <KickerLine text="ATTENTION / SIGNAL FLOOD" />
      <SubText x={86} y={H - 176} width={560} opacity={lateIn}
        lines={<>每天约 <span style={{ color: C.gold, fontWeight: 700 }}>10⁹ bit</span> 的世界经过你。<br />
        真正进入意识的，不足 <span style={{ color: C.cyan, fontWeight: 700 }}>10 bit</span>。</>} />
      <div style={{
        position: "absolute", left: 86, bottom: 44, zIndex: 80, opacity: 0.72 * lateIn,
        fontFamily: "'Segoe UI','Noto Sans CJK SC',sans-serif", fontSize: 15, letterSpacing: 1,
        color: "rgba(239,229,204,.66)",
      }}>Zheng &amp; Meister, Neuron 113(2), 2025</div>

      {/* 11/12 前景失焦遮挡（最后进入，强化纵深） */}
      <FGShard x={-60} y={H - 40} w={760} h={520} rotate={-24} scale={1.25} opacity={0.16 * fgIn} blur={17} />
      <FGShard x={W + 40} y={120} w={560} h={420} rotate={19} opacity={0.12 * fgIn} blur={20}
        tint="rgba(91,196,212,.05)" />
    </CinemaFrame>
  );
};
