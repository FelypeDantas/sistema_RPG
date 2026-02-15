import { TALENT_GRAPH } from "@/data/talents.graph";
import { useTalents } from "@/hooks/useTalents";
import { usePlayer } from "@/hooks/usePlayer";
import { motion } from "framer-motion";

export default function TalentsTreeGraph() {
  const { level, playerClass } = usePlayer();
  const { unlocked, unlockTalent, canUnlock } =
    useTalents(level, playerClass);

  const getCurvePath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const dx = (x2 - x1) * 0.4;
    return `M ${x1} ${y1} 
            C ${x1 + dx} ${y1}, 
              ${x2 - dx} ${y2}, 
              ${x2} ${y2}`;
  };

  return (
    <svg
      viewBox="0 0 800 600"
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
      </defs>

      {/* Conexões curvas */}
      {TALENT_GRAPH.map(t =>
        t.requires?.map(req => {
          const from = TALENT_GRAPH.find(n => n.id === req);
          if (!from) return null;

          const active =
            unlocked.includes(req) && unlocked.includes(t.id);

          const path = getCurvePath(
            from.position.x,
            from.position.y,
            t.position.x,
            t.position.y
          );

          return (
            <motion.path
              key={`${req}-${t.id}`}
              d={path}
              stroke={active ? "#22c55e" : "#444"}
              strokeWidth="3"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
              style={active ? { filter: "url(#glow)" } : {}}
            />
          );
        })
      )}

      {/* Nós */}
      {TALENT_GRAPH.map(t => {
        const isUnlocked = unlocked.includes(t.id);
        const available = canUnlock(t);

        return (
          <motion.g
            key={t.id}
            whileHover={
              available && !isUnlocked
                ? { scale: 1.15 }
                : {}
            }
            onClick={() =>
              available && unlockTalent(t.id)
            }
            className="cursor-pointer"
          >
            {/* Nó disponível pulsando */}
            {available && !isUnlocked && (
              <motion.circle
                cx={t.position.x}
                cy={t.position.y}
                r="30"
                fill="#a855f7"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}

            {/* Glow desbloqueado */}
            {isUnlocked && (
              <motion.circle
                cx={t.position.x}
                cy={t.position.y}
                r="34"
                fill="#22c55e"
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: [0.3, 0.1, 0.3],
                  scale: [1, 1.15, 1]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}

            {/* Círculo principal */}
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
                  : {}
              }
            />

            {/* Anel externo */}
            <circle
              cx={t.position.x}
              cy={t.position.y}
              r="26"
              fill="none"
              stroke={available ? "#22d3ee" : "#444"}
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
