import { TALENT_GRAPH } from "@/data/talents.graph";
import { useTalents } from "@/hooks/useTalents";
import { usePlayerRealtime } from "@/hooks/usePlayer";
import { motion } from "framer-motion";
import { useMemo } from "react";

const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 600;
const NODE_RADIUS = 22;
const OUTER_RADIUS = 26;
const HOVER_RADIUS = 30;
const UNLOCK_GLOW_RADIUS = 34;

export default function TalentsTreeGraph() {
  const { level, playerClass } = usePlayerRealtime();
  const { unlocked, unlockTalent, canUnlock } =
    useTalents(level, playerClass);

  /* =============================
     🗺️ MAPA OTIMIZADO
  ============================= */

  const talentMap = useMemo(() => {
    const map = new Map<string, typeof TALENT_GRAPH[number]>();
    for (const t of TALENT_GRAPH) {
      map.set(t.id, t);
    }
    return map;
  }, []);

  /* =============================
     🔗 EDGES PRÉ-CALCULADAS
  ============================= */

  const edges = useMemo(() => {
    const result: {
      key: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
      active: boolean;
    }[] = [];

    for (const t of TALENT_GRAPH) {
      if (!t.requires) continue;

      for (const req of t.requires) {
        const from = talentMap.get(req);
        if (!from) continue;

        const active =
          unlocked.includes(req) &&
          unlocked.includes(t.id);

        result.push({
          key: `${req}-${t.id}`,
          from: from.position,
          to: t.position,
          active
        });
      }
    }

    return result;
  }, [talentMap, unlocked]);

  /* =============================
     🧠 CURVA SUAVE
  ============================= */

  const getCurvePath = (
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

  /* =============================
     🎨 RENDER
  ============================= */

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
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

        <linearGradient
          id="activeEdge"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* =============================
           🔗 CONEXÕES
         ============================= */}

      {edges.map(edge => (
        <motion.path
          key={edge.key}
          d={getCurvePath(
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
      ))}

      {/* =============================
           🔘 NÓS
         ============================= */}

      {TALENT_GRAPH.map(t => {
        if (!t.position) return null; // blindagem

        const isUnlocked = unlocked.includes(t.id);
        const available = canUnlock(t);
        const clickable = available && !isUnlocked;

        const fillColor = isUnlocked
          ? "#22c55e"
          : available
          ? "#a855f7"
          : "#333";

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
            {/* Nó disponível pulsando */}
            {clickable && (
              <motion.circle
                cx={t.position.x}
                cy={t.position.y}
                r={HOVER_RADIUS}
                fill="#a855f7"
                initial={{ opacity: 0.15 }}
                animate={{
                  opacity: [0.15, 0.35, 0.15]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              />
            )}

            {/* Glow desbloqueado */}
            {isUnlocked && (
              <motion.circle
                cx={t.position.x}
                cy={t.position.y}
                r={UNLOCK_GLOW_RADIUS}
                fill="#22c55e"
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: [0.3, 0.1, 0.3],
                  scale: [1, 1.15, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              />
            )}

            {/* Círculo principal */}
            <circle
              cx={t.position.x}
              cy={t.position.y}
              r={NODE_RADIUS}
              fill={fillColor}
              style={
                isUnlocked
                  ? { filter: "url(#glow)" }
                  : undefined
              }
            />

            {/* Anel externo */}
            <circle
              cx={t.position.x}
              cy={t.position.y}
              r={OUTER_RADIUS}
              fill="none"
              stroke={
                available ? "#22d3ee" : "#444"
              }
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Texto */}
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