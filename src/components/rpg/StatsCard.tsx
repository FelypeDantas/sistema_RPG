import { Activity, Target, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Stats {
  questsToday: number;
  totalQuests: number;
  xpToday: number;
  streak: number;
}

interface StatsCardProps {
  stats: Stats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  const completionRate =
    stats.totalQuests === 0
      ? 0
      : Math.round((stats.questsToday / stats.totalQuests) * 100);

  const [displayXp, setDisplayXp] = useState(0);

  // XP counter animation
  useEffect(() => {
    let start = 0;
    const duration = 700;
    const increment = stats.xpToday / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= stats.xpToday) {
        setDisplayXp(stats.xpToday);
        clearInterval(counter);
      } else {
        setDisplayXp(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [stats.xpToday]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-cyber-card border border-white/10 rounded-xl p-5 relative overflow-hidden"
    >
      {/* brilho sutil quando acima de 80% */}
      {completionRate >= 80 && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 pointer-events-none" />
      )}

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {/* Quests Progress */}
        <div className="bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-neon-purple" />
            <span className="text-gray-400 text-sm">Missões</span>
          </div>

          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-white">
              {stats.questsToday}
            </span>
            <span className="text-gray-500 text-lg mb-1">
              /{stats.totalQuests}
            </span>
          </div>

          <div className="mt-2 h-1.5 bg-cyber-dark rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
            />
          </div>

          <div className="text-xs text-gray-400 mt-1">
            {completionRate}% concluído
          </div>
        </div>

        {/* XP Today */}
        <div className="bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-neon-cyan" />
            <span className="text-gray-400 text-sm">XP Hoje</span>
          </div>

          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-neon-cyan text-glow-cyan">
              +{displayXp}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-neon-green text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>
              {stats.xpToday > 0 ? "Bom progresso!" : "Comece sua jornada"}
            </span>
          </div>
        </div>

        {/* Streak */}
        <div className="col-span-2 bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-neon-orange" />
            <span className="text-gray-400 text-sm">Streak</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-neon-orange">
              {stats.streak} dias
            </span>

            {stats.streak >= 7 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="text-xs bg-neon-orange/20 px-2 py-1 rounded-full text-neon-orange"
              >
                Em chamas 🔥
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
