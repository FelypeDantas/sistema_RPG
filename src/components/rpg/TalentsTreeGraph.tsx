import { TALENT_GRAPH } from "@/data/talents.graph";
import { useTalents } from "@/hooks/useTalents";
import { usePlayer } from "@/hooks/usePlayer";
import { motion } from "framer-motion";

export default function TalentsTreeGraph() {
  const { level, playerClass } = usePlayer();
  const { unlocked, unlockTalent, canUnlock } =
    useTalents(level, playerClass);

  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-[600px] bg-cyber-dark rounded-xl"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Conexões */}
      {TALENT_GRAPH.map(t =>
        t.requires?.map(req => {
          const from = TALENT_GRAPH.find(n => n.id === req);
          if (!from) return null;

          const unlockedConnection =
            unlocked.includes(req) && unlocked.includes(t.id);

          return (
            <motion.line
              key={`${req}-${t.id}`}
              x1={from.position.x}
              y1={from.position.y}
              x2={t.position.x}
              y2={t.position.y}
              stroke={
                unlockedConnection
                  ? "#22c55e"
                  : "#555"
              }
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={
                unlockedConnection
                  ? { filter: "url(#glow)" }
                  : {}
              }
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
            {/* Glow pulse */}
            {isUnlocked && (
              <motion.circle
                cx={t.position.x}
                cy={t.position.y}
                r="30"
                fill="#22c55e"
                initial={{ opacity: 0.4, scale: 0.8 }}
                animate={{
                  opacity: [0.4, 0.1, 0.4],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              />
            )}

            <circle
              cx={t.position.x}
              cy={t.position.y}
              r="22"
              fill={
                isUnlocked
                  ? "#22c55e"
                  : available
                  ? "#a855f7"
                  : "#444"
              }
              style={
                isUnlocked
                  ? { filter: "url(#glow)" }
                  : {}
              }
            />

            <text
              x={t.position.x}
              y={t.position.y + 38}
              textAnchor="middle"
              fill="#ccc"
              fontSize="10"
            >
              {t.title}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
