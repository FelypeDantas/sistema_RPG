import { Activity, Target, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

interface Stats {
  questsToday: number;
  totalQuests: number;
  xpToday: number;
  streak: number;
  weeklyXP: number[];
}

interface StatsCardProps {
  stats: Stats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  const {
    questsToday = 0,
    totalQuests = 0,
    xpToday = 0,
    streak = 0,
    weeklyXP = []
  } = stats;

  const safeTotal = Math.max(totalQuests, 0);
  const safeToday = Math.max(questsToday, 0);
  const safeXpToday = Math.max(xpToday, 0);
  const safeStreak = Math.max(streak, 0);

  /* ---------------- COMPLETION RATE ---------------- */

  const completionRate = useMemo(() => {
    if (safeTotal === 0) return 0;
    return Math.min(100, Math.round((safeToday / safeTotal) * 100));
  }, [safeToday, safeTotal]);

  /* ---------------- XP COUNTER ANIMATION ---------------- */

  const [displayXp, setDisplayXp] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = displayXp;
    const endValue = safeXpToday;

    if (startValue === endValue) return;

    const duration = 600;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);

      const current = Math.floor(
        startValue + (endValue - startValue) * progress
      );

      setDisplayXp(current);

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

  /* ---------------- MINI WEEKLY CHART ---------------- */

  const maxWeeklyXP = useMemo(() => {
    return Math.max(...weeklyXP, 1);
  }, [weeklyXP]);

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

        {/* MISSÕES */}
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

        {/* XP HOJE */}
        <div className="bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-neon-cyan" />
            <span className="text-gray-400 text-sm">XP Hoje</span>
          </div>

          <motion.div
            key={safeXpToday}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.4 }}
            className="flex items-end gap-1"
          >
            <span className="text-3xl font-bold text-neon-cyan text-glow-cyan">
              +{displayXp}
            </span>
          </motion.div>

          <div className="flex items-center gap-1 mt-2 text-neon-green text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>
              {safeXpToday > 0
                ? "Progresso sólido hoje"
                : "Hora de iniciar a jornada"}
            </span>
          </div>
        </div>

        {/* STREAK + MINI CHART */}
        <div className="col-span-2 bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-neon-orange" />
            <span className="text-gray-400 text-sm">Streak</span>
          </div>

          <div className="flex items-center justify-between mb-3">
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

          {/* MINI BAR CHART */}
          <div className="flex items-end justify-between gap-2 h-16">
            {weeklyXP.map((xp, index) => {
              const heightPercent = (xp / maxWeeklyXP) * 100;

              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-neon-cyan to-neon-purple rounded-md"
                />
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
};