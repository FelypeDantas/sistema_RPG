import { TALENT_GRAPH } from "@/data/talents.graph";
import { useTalents } from "@/hooks/useTalents";
import { usePlayerRealtime } from "@/hooks/usePlayer";
import { motion } from "framer-motion";
import { useMemo } from "react";

const WIDTH = 800;
const HEIGHT = 600;

export default function TalentsTreeGraph() {
  const { level, playerClass } = usePlayerRealtime();
  const { unlocked, unlockTalent, canUnlock } =
    useTalents(level, playerClass);

  /* =============================
     🗺️ MAPA VALIDADO
  ============================= */

  const validTalents = useMemo(() => {
    return TALENT_GRAPH.filter(
      t => t?.id && t?.position?.x != null && t?.position?.y != null
    );
  }, []);

  const talentMap = useMemo(() => {
    const map = new Map();
    for (const t of validTalents) {
      map.set(t.id, t);
    }
    return map;
  }, [validTalents]);

  /* =============================
     🔗 EDGES SEGURAS
  ============================= */

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
        const from = talentMap.get(req);
        if (!from?.position) continue;

        if (!t.position) continue;

        result.push({
          key: `${req}-${t.id}`,
          from: from.position,
          to: t.position,
          active:
            unlocked.includes(req) &&
            unlocked.includes(t.id)
        });
      }
    }

    return result;
  }, [validTalents, talentMap, unlocked]);

  const getCurve = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const dx = (x2 - x1) * 0.4;

    return `
      M ${x1} ${y1}
      C ${x1 + dx} ${y1},
        ${x2 - dx} ${y2},
        ${x2} ${y2}
    `;
  };

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-[600px] bg-cyber-dark rounded-xl"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="activeEdge">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* CONEXÕES */}
      {edges.map(edge => {
        if (
          edge.from?.x == null ||
          edge.from?.y == null ||
          edge.to?.x == null ||
          edge.to?.y == null
        ) {
          return null;
        }

        return (
          <motion.path
            key={edge.key}
            d={getCurve(
              edge.from.x,
              edge.from.y,
              edge.to.x,
              edge.to.y
            )}
            stroke={
              edge.active
                ? "url(#activeEdge)"
                : "#444"
            }
            strokeWidth="3"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
            style={
              edge.active
                ? { filter: "url(#glow)" }
                : undefined
            }
          />
        );
      })}

      {/* NÓS */}
      {validTalents.map(t => {
        if (!t.position) return null;

        const isUnlocked = unlocked.includes(t.id);
        const available = canUnlock(t);
        const clickable = available && !isUnlocked;

        return (
          <motion.g
            key={t.id}
            whileHover={
              clickable ? { scale: 1.12 } : {}
            }
            onClick={() =>
              clickable && unlockTalent(t.id)
            }
            className={
              clickable ? "cursor-pointer" : ""
            }
          >
            <circle
              cx={t.position.x}
              cy={t.position.y}
              r="22"
              fill={
                isUnlocked
                  ? "#22c55e"
                  : available
                  ? "#a855f7"
                  : "#333"
              }
              style={
                isUnlocked
                  ? { filter: "url(#glow)" }
                  : undefined
              }
            />

            <text
              x={t.position.x}
              y={t.position.y + 40}
              textAnchor="middle"
              fill="#ccc"
              fontSize="11"
            >
              {t.title}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}