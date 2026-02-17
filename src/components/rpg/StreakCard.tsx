import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface StreakCardProps {
  weeklyXP: number[];
  currentStreak: number;
}

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const StreakCard = ({
  weeklyXP,
  currentStreak
}: StreakCardProps) => {

  const safeStreak = Math.max(0, currentStreak);

  // Sempre 7 posições e nunca negativas
  const safeWeeklyXP = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) =>
      Math.max(0, weeklyXP[i] ?? 0)
    );
  }, [weeklyXP]);

  const maxXP = useMemo(() => {
    return Math.max(...safeWeeklyXP, 1);
  }, [safeWeeklyXP]);

  // Ajuste correto de índice (Seg = 0)
  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay(); // 0 = Dom
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  // Próximo marco múltiplo de 5
  const nextMilestone = useMemo(() => {
    if (safeStreak === 0) return 5;
    return Math.ceil((safeStreak + 1) / 5) * 5;
  }, [safeStreak]);

  const remainingDays = Math.max(0, nextMilestone - safeStreak);

  return (
    <div className="bg-cyber-card border border-neon-orange/30 rounded-xl p-5 relative overflow-hidden">
      
      {/* Glow ambiente */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-neon-orange" />
            Streak Semanal
          </h3>

          <div className="flex items-center gap-2 bg-neon-orange/20 px-3 py-1 rounded-lg relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <Flame className="w-4 h-4 text-neon-orange" />
            </motion.div>

            <span className="text-neon-orange font-bold">
              {safeStreak} dias
            </span>

            {safeStreak >= 7 && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-6 text-xs text-neon-orange"
              >
                Em chamas 🔥
              </motion.span>
            )}
          </div>
        </div>

        {/* Weekly XP Chart */}
        <div className="flex items-end justify-between gap-2 h-24 mb-2">
          {safeWeeklyXP.map((xp, index) => {
            const normalizedHeight =
              xp > 0 ? (xp / maxXP) * 100 : 0;

            const isToday = index === todayIndex;
            const hasXP = xp > 0;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: hasXP
                      ? `${Math.max(normalizedHeight, 8)}%`
                      : "8%"
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05
                  }}
                  className={`
                    w-full rounded-t-lg relative
                    ${
                      isToday
                        ? "bg-gradient-to-t from-neon-orange to-neon-yellow shadow-[0_0_15px_rgba(255,140,0,0.4)]"
                        : hasXP
                        ? "bg-gradient-to-t from-neon-cyan/50 to-neon-cyan"
                        : "bg-gray-700/40"
                    }
                  `}
                >
                  {hasXP && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-mono">
                      {xp}
                    </span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Day labels */}
        <div className="flex justify-between gap-2">
          {days.map((day, index) => (
            <div
              key={day}
              className={`
                flex-1 text-center text-xs py-1 rounded-md transition-all
                ${
                  index === todayIndex
                    ? "bg-neon-orange/20 text-neon-orange font-bold"
                    : "text-gray-500"
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Milestone */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            {remainingDays === 0 ? (
              <>
                Você atingiu <span className="text-white font-semibold">
                  {nextMilestone} dias
                </span> 🎉
              </>
            ) : (
              <>
                Faltam{" "}
                <span className="text-neon-orange font-bold">
                  {remainingDays} dias
                </span>{" "}
                para alcançar{" "}
                <span className="text-white font-semibold">
                  {nextMilestone} dias
                </span>.
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};
