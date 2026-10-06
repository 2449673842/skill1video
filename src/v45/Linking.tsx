import React from "react";
import {useCurrentFrame} from "remotion";
import {
  CinemaFrame, GiantType, SignalShard, HUDReticle, KickerLine, SubText,
  FGShard, Bloom, StarDust, W, H,
  C, hash, settle,
} from "./v45-common";

/* ============================================================
   V45_Linking —— LINKING / NETWORK TO TRACK
   构图：SignalShard 在左中位置向外发出节点与细线，织成一张
   松散网络；网络右侧收敛出一条更亮的轨迹（TRACK）通向画外。
   巨字 LINKING 以 ghost 金字石形态沉在网络之后。
   ============================================================ */

type Node = { x: number; y: number; depth: number; onTrack: boolean; code: string };

const NODES: Node[] = [
  { x: 872, y: 322, depth: 0.68, onTrack: false, code: "N-02" },
  { x: 1018, y: 452, depth: 0.82, onTrack: true, code: "N-04" },
  { x: 912, y: 656, depth: 0.58, onTrack: false, code: "N-05" },
  { x: 1136, y: 266, depth: 0.5, onTrack: false, code: "N-07" },
  { x: 1204, y: 566, depth: 0.9, onTrack: true, code: "N-09" },
  { x: 1268, y: 386, depth: 0.62, onTrack: false, code: "N-11" },
  { x: 1372, y: 690, depth: 0.44, onTrack: false, code: "N-13" },
  { x: 1428, y: 312, depth: 0.56, onTrack: false, code: "N-15" },
  { x: 1544, y: 486, depth: 0.96, onTrack: true, code: "N-18" },
  { x: 1462, y: 588, depth: 0.7, onTrack: false, code: "N-20" },
  { x: 1658, y: 418, depth: 0.8, onTrack: false, code: "N-23" },
];

const HERO_X = 560, HERO_Y = 538;

/* 网络节点 */
const NetNode: React.FC<{ n: Node; p: number }> = ({ n, p }) => {
  const s = (3 + n.depth * 4.2) * (n.onTrack ? 1.5 : 1);
  const col = n.onTrack ? C.gold : n.depth > 0.6 ? C.cyan : "rgba(239,229,204,.8)";
  return (
    <div style={{ position: "absolute", left: n.x, top: n.y, zIndex: 50, opacity: p }}>
      <div style={{
        position: "absolute", transform: "translate(-50%,-50%)",
        width: s, height: s, borderRadius: "50%", background: col,
        boxShadow: `0 0 ${s * 3.4}px ${col}`,
      }} />
      {n.onTrack && (
        <div style={{
          position: "absolute", transform: "translate(-50%,-50%)",
          width: s * 4.6, height: s * 4.6, borderRadius: "50%",
          border: `1px solid ${C.goldMid}`, opacity: 0.55,
        }} />
      )}
      {/* 微坐标 */}
      <div style={{
        position: "absolute", left: s + 7, top: -16, fontSize: 10.5, letterSpacing: 1.8,
        color: n.onTrack ? "rgba(240,215,154,.66)" : "rgba(159,216,232,.42)",
        fontFamily: "'Segoe UI',sans-serif", whiteSpace: "nowrap",
      }}>{n.code}</div>
    </div>
  );
};

/* 连线（网络细线 + 轨道亮线） */
const NetLines: React.FC<{p: number}> = ({ p }) => {
  const curve = (x1: number, y1: number, x2: number, y2: number, bow: number) =>
    `M ${x1} ${y1} Q ${(x1 + x2) / 2 + bow} ${(y1 + y2) / 2 - bow * 0.4}, ${x2} ${y2}`;
  const track = NODES.filter((n) => n.onTrack);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 46, overflow: "visible" }}>
      {/* 大圆弧结构（背景几何） */}
      <ellipse cx={1180} cy={520} rx={560} ry={330} fill="none"
        stroke="rgba(159,216,232,.10)" strokeWidth={1} />
      <ellipse cx={1180} cy={520} rx={760} ry={470} fill="none"
        stroke="rgba(159,216,232,.06)" strokeWidth={1} transform="rotate(-4 1180 520)" />
      {/* shard → 各节点 */}
      {NODES.map((n, i) => (
        <path key={"s" + i} d={curve(HERO_X + 66, HERO_Y - 8, n.x, n.y, (hash(i, 31) - 0.5) * 150)}
          fill="none" stroke={n.onTrack ? C.gold : C.cyan}
          strokeOpacity={n.onTrack ? 0.5 : 0.13 + n.depth * 0.14}
          strokeWidth={n.onTrack ? 2 : 1} opacity={p} />
      ))}
      {/* 节点间稀疏横连 */}
      {[[0, 1], [2, 4], [3, 5], [5, 8], [7, 10], [9, 7], [1, 5], [4, 9], [6, 9], [8, 10]].map(([a, b], i) => (
        <path key={"c" + i} d={curve(NODES[a].x, NODES[a].y, NODES[b].x, NODES[b].y, (hash(i, 33) - 0.5) * 90)}
          fill="none" stroke="rgba(239,229,204,.8)" strokeOpacity={0.09} strokeWidth={0.9} opacity={p} />
      ))}
      {/* 轨道亮线：节点链 → 画外 */}
      <path d={`${track.map((n, i) => (i ? "L" : "M") + n.x + " " + n.y).join(" ")} L 1980 428`}
        fill="none" stroke={C.gold} strokeOpacity={0.9} strokeWidth={2.8} opacity={p} style={{ filter: "drop-shadow(0 0 8px rgba(240,215,154,.7))" }} />
    </svg>
  );
};

export const V45Linking: React.FC = () => {
  const f = useCurrentFrame();
  const p = settle(f, 4, 52);
  return (
    <CinemaFrame variant="cold" glow={[58, 48]} glowColor="rgba(10,24,34,.6)">
      {/* 03 密星尘（深空） */}
      <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
        <StarDust count={120} seed={17} opacity={0.5 * p} maxSize={1.9} />
      </div>

      {/* 05 巨字 LINKING —— ghost 金字石，沉于网络之后 */}
      <GiantType word="LINKING" x={330} y={286} size={404} tracking={-16}
        variant="ghost" zIndex={26} opacity={0.85 * p} />

      {/* 06 连线与结构几何 */}
      <NetLines p={p} />

      {/* 节点群 */}
      {NODES.map((n) => <NetNode key={n.code} n={n} p={p} />)}

      {/* 13 bloom */}
      <Bloom x={HERO_X} y={HERO_Y} r={320} color="rgba(242,166,90,.15)" strength={p} />
      <Bloom x={1544} y={486} r={240} color="rgba(240,215,154,.11)" strength={p} />

      {/* 07 HERO —— 发出网络的 Signal Shard */}
      <div style={{ opacity: p }}>
        <SignalShard x={HERO_X} y={HERO_Y} scale={0.84} tilt={7} coreBoost={0.95} orbitNode={286} />
      </div>

      {/* 09 HUD：轨道锁定 */}
      <HUDReticle x={1544} y={486} r={78} accent={C.gold} opacity={0.84 * p} label="TRACK LOCK · N-18" />
      {/* 网络微统计（右上，细如呼吸） */}
      <div style={{
        position: "absolute", right: 84, top: 64, zIndex: 80, textAlign: "right", opacity: 0.4 * p,
        fontFamily: "'Segoe UI',sans-serif", fontSize: 14, letterSpacing: 3,
        color: "rgba(159,216,232,.62)", lineHeight: 1.9,
      }}>
        NODES 11 · LINKS 26<br />TRACK CONFIDENCE 0.94
      </div>

      {/* 10 辅助排版 */}
      <KickerLine text="LINKING / NETWORK TO TRACK" />
      <SubText x={86} y={H - 150} width={620} opacity={p}
        lines={<>被注意的对象开始<span style={{ color: C.gold, fontWeight: 700 }}>连接</span>，织成网络；<br />
        网络里被反复走的那条，压成一条<span style={{ color: C.cyan, fontWeight: 700 }}>轨道</span>。</>} />

      {/* 11/12 前景失焦：大光斑 + 玻璃 */}
      <div style={{
        position: "absolute", left: 312, top: 880, width: 90, height: 90, borderRadius: "50%",
        background: "rgba(240,215,154,.24)", filter: "blur(26px)", zIndex: 90, opacity: p,
      }} />
      <div style={{
        position: "absolute", left: 1720, top: 760, width: 120, height: 120, borderRadius: "50%",
        background: "rgba(91,196,212,.16)", filter: "blur(34px)", zIndex: 90, opacity: p,
      }} />
      <FGShard x={-80} y={H - 60} w={620} h={470} rotate={-23} opacity={0.15 * p} blur={18} />
    </CinemaFrame>
  );
};
