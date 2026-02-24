import { TALENT_GRAPH } from "@/data/talents.graph";
import { useTalents } from "@/hooks/useTalents";
import { usePlayerRealtime } from "@/hooks/usePlayer";
import { motion } from "framer-motion";
import { useMemo } from "react";

const WIDTH = 900;
const HEIGHT = 650;
const CURVE_FACTOR = 0.4;

export default function TalentsTreeGraph() {
  const { level, playerClass } = usePlayerRealtime();

  
  const { unlocked, unlockTalent, points } =
    useTalents(level, playerClass);

  /* ===============================
     🧠 DERIVED STRUCTURES
  =============================== */

  const unlockedSet = useMemo(
    () => new Set(unlocked),
    [unlocked]
  );

  const validTalents = useMemo(() => {
    return TALENT_GRAPH.filter(
      t =>
        t?.id &&
        t?.position?.x != null &&
        t?.position?.y != null
    );
  }, []);

  const talentMap = useMemo(() => {
    const map = new Map<string, typeof validTalents[number]>();
    for (const t of validTalents) {
      map.set(t.id, t);
    }
    return map;
  }, [validTalents]);

  const edges = useMemo(() => {
    const result: {
      key: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
      active: boolean;
    }[] = [];

    for (const t of validTalents) {
      if (!t.requires) continue;

      for (const req of t.requires) {
        const fromTalent = talentMap.get(req);
        if (!fromTalent?.position) continue;

        result.push({
          key: `${req}-${t.id}`,
          from: fromTalent.position,
          to: t.position,
          active:
            unlockedSet.has(req) &&
            unlockedSet.has(t.id),
        });
      }
    }

    return result;
  }, [validTalents, talentMap, unlockedSet]);

  /* ===============================
     🎨 CURVE BUILDER
  =============================== */

  const buildCurve = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const dx = (x2 - x1) * CURVE_FACTOR;

    return `
      M ${x1} ${y1}
      C ${x1 + dx} ${y1},
        ${x2 - dx} ${y2},
        ${x2} ${y2}
    `;
  };

  /* ===============================
     🎬 RENDER
  =============================== */

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-[650px] rounded-2xl 
                 bg-gradient-to-br from-[#0f0f1a] 
                 via-[#111827] to-[#0c0c16] 
                 shadow-2xl"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="activeEdge">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        <radialGradient id="nodeActive">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#166534" />
        </radialGradient>

        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#1f2937"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* GRID */}
      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        opacity="0.3"
      />

      {/* EDGES */}
      {edges.map(edge => (
        <motion.path
          key={edge.key}
          d={buildCurve(
            edge.from.x,
            edge.from.y,
            edge.to.x,
            edge.to.y
          )}
          stroke={
            edge.active
              ? "url(#activeEdge)"
              : "#374151"
          }
          strokeWidth="3"
          fill="transparent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
          style={
            edge.active
              ? { filter: "url(#glow)" }
              : undefined
          }
        />
      ))}

      {/* NODES */}
      {validTalents.map(t => {
        const isUnlocked = unlockedSet.has(t.id);
        const available = points(t);
        const clickable = available && !isUnlocked;

        const ringColor = isUnlocked
          ? "#22c55e"
          : available
          ? "#a855f7"
          : "#333";

        const coreFill = isUnlocked
          ? "url(#nodeActive)"
          : available
          ? "#9333ea"
          : "#1f2937";

        return (
          <motion.g
            key={t.id}
            whileHover={
              clickable ? { scale: 1.15 } : {}
            }
            transition={{
              type: "spring",
              stiffness: 200,
            }}
            onClick={() =>
              clickable && unlockTalent(t.id)
            }
            className={
              clickable ? "cursor-pointer" : ""
            }
          >
            {/* Outer Ring */}
            <circle
              cx={t.position.x}
              cy={t.position.y}
              r="30"
              fill="transparent"
              stroke={ringColor}
              strokeWidth="2"
              opacity="0.4"
            />

            {/* Core */}
            <circle
              cx={t.position.x}
              cy={t.position.y}
              r="20"
              fill={coreFill}
              style={
                isUnlocked
                  ? { filter: "url(#glow)" }
                  : undefined
              }
            />

            {/* Title */}
            <text
              x={t.position.x}
              y={t.position.y + 45}
              textAnchor="middle"
              fill="#e5e7eb"
              fontSize="12"
              fontWeight="500"
            >
              {t.title}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}