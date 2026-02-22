import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export type Talent = {
  id: string;
  title: string;
  description?: string;
  cost: number;
};

type TalentTreeProps = {
  talents: Talent[]; // agora apenas bloqueados
  points: number;
  onUnlock: (id: string) => void;
};

export const TalentTree: React.FC<TalentTreeProps> = ({
  talents,
  points,
  onUnlock
}) => {
  const totalCost = useMemo(() => {
    return talents.reduce((acc, t) => acc + t.cost, 0);
  }, [talents]);

  const progress = useMemo(() => {
    if (totalCost === 0) return 100;
    return Math.min((points / totalCost) * 100, 100);
  }, [points, totalCost]);

  return (
    <div className="relative bg-gradient-to-br from-[#12121c] to-[#0f172a] p-6 rounded-2xl border border-white/10 shadow-xl space-y-6 overflow-hidden">
      
      {/* brilho sutil no fundo */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold tracking-wide">
            🌌 Talentos Disponíveis
          </h3>

          <div className="text-sm text-gray-400">
            Pontos:{" "}
            <span className="text-cyan-400 font-semibold">
              {points}
            </span>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"
            />
          </div>

          <p className="text-xs text-gray-500">
            {Math.round(progress)}% do poder desbloqueável alcançado
          </p>
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {talents.map(talent => {
            const canUnlock = points >= talent.cost;

            return (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.25 }}
                className={`relative p-4 rounded-xl border transition-all ${
                  canUnlock
                    ? "border-purple-500/40 bg-purple-500/5 shadow-lg"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {/* Aura animada se puder desbloquear */}
                {canUnlock && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-purple-500/10"
                    animate={{ opacity: [0.1, 0.25, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}

                <div className="relative flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock
                        size={14}
                        className="text-gray-500"
                      />
                      <p className="text-white font-medium">
                        {talent.title}
                      </p>
                    </div>

                    {talent.description && (
                      <p className="text-xs text-gray-400 max-w-sm">
                        {talent.description}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={
                      canUnlock ? { scale: 1.05 } : {}
                    }
                    disabled={!canUnlock}
                    onClick={() => onUnlock(talent.id)}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                      canUnlock
                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    💎 {talent.cost} TP
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};