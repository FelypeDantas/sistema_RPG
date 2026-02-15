import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

type Rarity = "common" | "rare" | "epic" | "legendary";

type Talent = {
  id: string;
  title: string;
  description?: string;
  cost: number;
  level: number;
  maxLevel: number;
  rarity: Rarity;
  locked?: boolean;
};

type TalentTreeProps = {
  talents: Talent[];
  points: number;
  onUpgrade: (id: string) => void;
};

const rarityStyles: Record<Rarity, string> = {
  common: "border-gray-500 bg-gray-500/10",
  rare: "border-neon-cyan bg-neon-cyan/10",
  epic: "border-purple-500 bg-purple-500/10",
  legendary: "border-yellow-400 bg-yellow-400/10"
};

export const TalentTree: React.FC<TalentTreeProps> = ({
  talents,
  points,
  onUpgrade
}) => {
  return (
    <div className="bg-cyber-card p-6 rounded-xl space-y-5 border border-white/10">
      <h3 className="text-white font-semibold flex items-center gap-2">
        🗺️ Árvore de Talentos Lendária
      </h3>

      <p className="text-sm text-gray-400">
        Pontos disponíveis:{" "}
        <span className="text-neon-cyan font-semibold">
          {points}
        </span>
      </p>

      <div className="space-y-4">
        <AnimatePresence>
          {talents.map(talent => {
            const unlocked = !talent.locked;
            const maxed = talent.level >= talent.maxLevel;
            const canUpgrade =
              unlocked &&
              !maxed &&
              points >= talent.cost;

            const progress =
              (talent.level / talent.maxLevel) * 100;

            return (
              <motion.div
                key={talent.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-lg border relative overflow-hidden transition-all ${rarityStyles[talent.rarity]}`}
              >
                {/* Explosão suave quando maxa */}
                {maxed && (
                  <motion.div
                    className="absolute inset-0 bg-white/5"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}

                <div className="relative flex justify-between items-center gap-4">
                  <div className="space-y-2">
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

                      <span className="text-xs text-gray-400">
                        Lv {talent.level}/{talent.maxLevel}
                      </span>
                    </div>

                    {talent.description && (
                      <p className="text-xs text-gray-300 max-w-xs">
                        {talent.description}
                      </p>
                    )}

                    {/* Barra de nível */}
                    <div className="h-1.5 w-full bg-black/40 rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-white/60 to-white"
                      />
                    </div>
                  </div>

                  {!unlocked ? (
                    <span className="text-xs text-gray-500">
                      Bloqueado
                    </span>
                  ) : maxed ? (
                    <span className="text-xs text-yellow-400 font-semibold">
                      👑 Máximo
                    </span>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={
                        canUpgrade ? { scale: 1.05 } : {}
                      }
                      disabled={!canUpgrade}
                      onClick={() => onUpgrade(talent.id)}
                      className={`text-xs px-4 py-1.5 rounded font-semibold transition-all ${
                        canUpgrade
                          ? "bg-white text-black hover:bg-white/80"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      💎 {talent.cost}
                    </motion.button>
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
