import { TALENT_GRAPH } from "@/data/talents.graph";
import { useTalents } from "@/hooks/useTalents";
import { usePlayer } from "@/hooks/usePlayer";

export default function TalentsTreeGraph() {
  const { level, playerClass } = usePlayer();
  const {
    unlocked,
    unlockTalent,
    canUnlock
  } = useTalents(level, playerClass);

  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-[600px] bg-cyber-dark rounded-xl"
    >
      {/* Conexões */}
      {TALENT_GRAPH.map(t =>
        t.requires?.map(req => {
          const from = TALENT_GRAPH.find(n => n.id === req);
          if (!from) return null;

          return (
            <line
              key={`${req}-${t.id}`}
              x1={from.position.x}
              y1={from.position.y}
              x2={t.position.x}
              y2={t.position.y}
              stroke="#555"
              strokeWidth="2"
            />
          );
        })
      )}

      {/* Nós */}
      {TALENT_GRAPH.map(t => {
        const isUnlocked = unlocked.includes(t.id);
        const available = canUnlock(t);

        return (
          <g
            key={t.id}
            onClick={() =>
              available && unlockTalent(t.id)
            }
            className="cursor-pointer"
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
                  : "#444"
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
          </g>
        );
      })}
    </svg>
  );
}
