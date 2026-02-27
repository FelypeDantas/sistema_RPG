import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import { useProgression } from "@/providers/ProgressionProvider";
import { getRarityClasses } from "@/utils/achievementHelpers";
import type { AchievementRarity } from "@/hooks/useAchievements";

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  rarity: AchievementRarity;
};

type HallOfGloryProps = {
  achievements?: Achievement[];
};

export function HallOfGlory({ achievements }: HallOfGloryProps) {
  const { level, xp } = useProgression();

  const unlocked = achievements?.filter(a => a.unlocked) ?? [];

<span className={`font-bold text-sm ${getRarityClasses(achievements?.[0]?.rarity)}`}></span>

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER estilo igual dashboard */}
        <div className="bg-cyber-card p-6 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-6 h-6 text-neon-orange" />
            <h1 className="text-2xl font-bold text-white">
              Hall da Glória
            </h1>
          </div>

          <div className="text-sm text-zinc-400">
            Nível {level} • {xp.toLocaleString()} XP acumulado
          </div>
        </div>

        {/* GRID */}
        {unlocked.length === 0 ? (
          <div className="bg-cyber-card p-8 rounded-xl border border-zinc-800 text-center text-zinc-500">
            Nenhuma conquista desbloqueada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {unlocked.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-cyber-card p-5 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold text-sm ${getRarityClasses(a.rarity)}`}>
                    🏆 {a.title}
                  </span>

                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                    {a.rarity}
                  </span>
                </div>

                <p className="text-xs text-zinc-400">
                  {a.description}
                </p>

                {a.rarity === "Lendária" && (
                  <div className="mt-3 flex items-center gap-2 text-neon-orange text-xs">
                    <Sparkles className="w-4 h-4" />
                    Conquista Lendária
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}