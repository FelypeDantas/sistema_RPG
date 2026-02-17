import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

export type Talent = {
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
  const totalLockedCost = useMemo(() => {
    return talents
      .filter(t => t.locked)
      .reduce((acc, t) => acc + t.cost, 0);
  }, [talents]);

  const progress = useMemo(() => {
    if (totalLockedCost === 0) return 100;
    return Math.min((points / totalLockedCost) * 100, 100);
  }, [points, totalLockedCost]);

  return (
    <div className="bg-cyber-card p-6 rounded-xl space-y-5 border border-white/10">
      <h3 className="text-white font-semibold flex items-center gap-2">
        🗺️ Árvore de Talentos
      </h3>

      {/* Pontos + Barra */}
      <div>
        <p className="text-sm text-gray-400">
          Pontos disponíveis:{" "}
          <span className="text-neon-cyan font-semibold">
            {points}
          </span>
        </p>

        <div className="mt-2 h-2 bg-gray-800 rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-gradient-to-r from-purple-500 to-neon-cyan"
          />
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {talents.map(talent => {
            const unlocked = !talent.locked;
            const canUnlock = !unlocked && points >= talent.cost;

            return (
              <motion.div
                key={talent.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className={`p-4 rounded-lg border relative overflow-hidden transition-all ${
                  unlocked
                    ? "border-neon-green/50 bg-neon-green/10"
                    : canUnlock
                    ? "border-purple-500/50 bg-purple-500/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {/* Glow quando pode desbloquear */}
                {canUnlock && (
                  <motion.div
                    className="absolute inset-0 bg-purple-500/10"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}

                <div className="relative flex justify-between items-center gap-4">
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
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={
                        canUnlock ? { scale: 1.05 } : {}
                      }
                      disabled={!canUnlock}
                      onClick={() => onUnlock(talent.id)}
                      className={`text-xs px-4 py-1.5 rounded font-semibold transition-all ${
                        canUnlock
                          ? "bg-neon-purple hover:bg-neon-purple/80 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      💎 {talent.cost} TP
                    </motion.button>
                  ) : (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs text-neon-green font-semibold"
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
