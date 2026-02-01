import React from "react";

type Talent = {
  id: string;
  title: string;
  description?: string;
  cost: number;
  locked?: boolean;
};

type TalentTreeProps = {
  talents: Talent[];
  points: number;
  onUnlock: (id: string) => void;
};

export const TalentTree: React.FC<TalentTreeProps> = ({
  talents,
  points,
  onUnlock
}) => {
  return (
    <div className="bg-cyber-card p-5 rounded-xl space-y-4">
      <h3 className="text-white font-semibold">
        🗺️ Árvore de Talentos
      </h3>

      <p className="text-sm text-gray-400">
        Pontos disponíveis:{" "}
        <span className="text-neon-cyan font-medium">
          {points}
        </span>
      </p>

      <div className="space-y-3">
        {talents.map(talent => {
          const unlocked = !talent.locked;
          const canUnlock = points >= talent.cost;

          return (
            <div
              key={talent.id}
              className={`p-3 rounded border transition-colors ${
                unlocked
                  ? "border-neon-green/50 bg-neon-green/10"
                  : "border-white/10"
              }`}
            >
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    {talent.title}
                  </p>

                  {talent.description && (
                    <p className="text-xs text-gray-400 max-w-xs">
                      {talent.description}
                    </p>
                  )}
                </div>

                {!unlocked ? (
                  <button
                    disabled={!canUnlock}
                    onClick={() => onUnlock(talent.id)}
                    className={`text-xs px-3 py-1 rounded transition ${
                      canUnlock
                        ? "bg-neon-purple hover:bg-neon-purple/80"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {talent.cost} TP
                  </button>
                ) : (
                  <span className="text-xs text-neon-green">
                    Desbloqueado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
