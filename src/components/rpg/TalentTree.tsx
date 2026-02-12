import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

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
      <h3 className="text-white font-semibold flex items-center gap-2">
        🗺️ Árvore de Talentos
      </h3>

      <p className="text-sm text-gray-400">
        Pontos disponíveis:{" "}
        <span className="text-neon-cyan font-medium">
          {points}
        </span>
      </p>

      <div className="space-y-3">
        <AnimatePresence>
          {talents.map(talent => {
            const unlocked = !talent.locked;
            const canUnlock = points >= talent.cost;

            return (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className={`p-3 rounded border transition-all ${
                  unlocked
                    ? "border-neon-green/50 bg-neon-green/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {!unlocked && (
                        <Lock
                          size={14}
                          className="text-gray-500"
                        />
                      )}
                      <p className="text-white font-medium">
                        {talent.title}
                      </p>
                    </div>

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
                      className={`text-xs px-3 py-1 rounded font-medium transition-all ${
                        canUnlock
                          ? "bg-neon-purple hover:bg-neon-purple/80 hover:scale-105"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      💎 {talent.cost} TP
                    </button>
                  ) : (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs text-neon-green font-medium"
                    >
                      ✨ Desbloqueado
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
