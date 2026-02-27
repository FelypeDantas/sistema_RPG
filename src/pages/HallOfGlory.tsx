// pages/HallOfGlory.tsx
import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";
import { useProgression } from "@/providers/ProgressionProvider";

type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  rarity?: "common" | "rare" | "epic" | "legendary";
};

type HallOfGloryProps = {
  achievements?: Achievement[];
};

const rarityStyles = {
  common: "border-yellow-400/20 bg-yellow-400/5",
  rare: "border-blue-400/40 bg-blue-400/10",
  epic: "border-purple-500/40 bg-purple-500/10",
  legendary: "border-amber-400/70 bg-amber-400/15 shadow-amber-400/40",
};

export function HallOfGlory({ achievements }: HallOfGloryProps) {
  const { level, xp } = useProgression();

  const unlocked = achievements?.filter(a => a.unlocked) || [];

  return (
    <div className="relative p-12 min-h-screen overflow-hidden">

      {/* Background Aura */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="text-amber-400 w-8 h-8" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Hall da Glória
          </h1>
        </div>

        <div className="text-gray-400 text-lg">
          Nível {level} • {xp.toLocaleString()} XP acumulado
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {unlocked.map(a => {
          const rarity = a.rarity || "common";

          return (
            <motion.div
              key={a.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`relative p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 ${rarityStyles[rarity]}`}
            >
              {rarity === "legendary" && (
                <Sparkles className="absolute top-3 right-3 text-amber-300 w-5 h-5 animate-pulse" />
              )}

              <div className="text-xl font-bold text-white mb-2">
                {a.name}
              </div>

              <div className="text-sm text-gray-400">
                {a.description}
              </div>

              <div className="mt-4 text-xs uppercase tracking-wider text-gray-500">
                {rarity}
              </div>
            </motion.div>
          );
        })}
      </div>

      {unlocked.length === 0 && (
        <div className="text-center text-gray-500 mt-16">
          Nenhuma conquista desbloqueada ainda.
        </div>
      )}
    </div>
  );
}