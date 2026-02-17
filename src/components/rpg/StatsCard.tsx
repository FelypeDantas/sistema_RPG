import { Activity, Target, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

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
  const safeTotal = Math.max(0, stats.totalQuests);
  const safeToday = Math.max(0, stats.questsToday);
  const safeXpToday = Math.max(0, stats.xpToday);
  const safeStreak = Math.max(0, stats.streak);

  const completionRate = useMemo(() => {
    if (safeTotal === 0) return 0;
    return Math.min(100, Math.round((safeToday / safeTotal) * 100));
  }, [safeToday, safeTotal]);

  const [displayXp, setDisplayXp] = useState(0);
  const animationRef = useRef<number | null>(null);
  const previousXpRef = useRef(0);

  useEffect(() => {
    if (safeXpToday === previousXpRef.current) return;

    previousXpRef.current = safeXpToday;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (safeXpToday <= 0) {
      setDisplayXp(0);
      return;
    }

    const duration = 700;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const value = Math.floor(progress * safeXpToday);
      setDisplayXp(value);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [safeXpToday]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-cyber-card border border-white/10 rounded-xl p-5 relative overflow-hidden"
    >
      {completionRate >= 80 && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 pointer-events-none" />
      )}

      <div className="grid grid-cols-2 gap-4 relative z-10">
        
        {/* Missões */}
        <div className="bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-neon-purple" />
            <span className="text-gray-400 text-sm">Missões</span>
          </div>

          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-white">
              {safeToday}
            </span>
            <span className="text-gray-500 text-lg mb-1">
              /{safeTotal}
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

        {/* XP Hoje */}
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
              {safeXpToday > 0
                ? "Progresso sólido hoje"
                : "Hora de iniciar a jornada"}
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
              {safeStreak} dias
            </span>

            {safeStreak >= 7 && (
              <motion.span
                initial={{ scale: 0.95 }}
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
