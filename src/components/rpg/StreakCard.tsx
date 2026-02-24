import { Flame, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface StreakCardProps {
  weeklyXP: number[];
  currentStreak: number;
}

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MIN_BAR_HEIGHT = 8;

export const StreakCard = ({
  weeklyXP,
  currentStreak,
}: StreakCardProps) => {

  /* ---------------- SAFE VALUES ---------------- */

  const safeStreak = Math.max(0, currentStreak);

  const safeWeeklyXP = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) =>
      Math.max(0, weeklyXP[i] ?? 0)
    );
  }, [weeklyXP]);

  const maxXP = useMemo(() => {
    return Math.max(...safeWeeklyXP, 1);
  }, [safeWeeklyXP]);

  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  const todayXP = safeWeeklyXP[todayIndex];

  /* ---------------- MILESTONE ---------------- */

  const nextMilestone = useMemo(() => {
    if (safeStreak === 0) return 5;
    return Math.ceil((safeStreak + 1) / 5) * 5;
  }, [safeStreak]);

  const remainingDays = Math.max(0, nextMilestone - safeStreak);
  const milestoneProgress = (safeStreak / nextMilestone) * 100;

  /* ---------------- LEVEL SYSTEM ---------------- */

  const level = useMemo(() => {
    if (safeStreak >= 20) return "Lendário";
    if (safeStreak >= 10) return "Focado";
    if (safeStreak >= 5) return "Consistente";
    return "Iniciante";
  }, [safeStreak]);

  /* ---------------- TREND DETECTION ---------------- */

  const trend = useMemo(() => {
    const firstHalf = safeWeeklyXP.slice(0, 3).reduce((a, b) => a + b, 0);
    const secondHalf = safeWeeklyXP.slice(3, 6).reduce((a, b) => a + b, 0);

    if (secondHalf > firstHalf) return "up";
    if (secondHalf < firstHalf) return "down";
    return "stable";
  }, [safeWeeklyXP]);

  /* ---------------- HELPERS ---------------- */

  const getBarHeight = (xp: number) => {
    if (xp <= 0) return `${MIN_BAR_HEIGHT}%`;
    const normalized = (xp / maxXP) * 100;
    return `${Math.max(normalized, MIN_BAR_HEIGHT)}%`;
  };

  const getBarStyle = (isToday: boolean, hasXP: boolean) => {
    if (isToday) {
      return "bg-gradient-to-t from-neon-orange to-neon-yellow shadow-[0_0_15px_rgba(255,140,0,0.4)]";
    }
    if (hasXP) {
      return "bg-gradient-to-t from-neon-cyan/50 to-neon-cyan";
    }
    return "bg-gray-700/40";
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="bg-cyber-card border border-neon-orange/30 rounded-xl p-5 relative overflow-hidden">

      <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-neon-orange" />
            Streak Semanal
          </h3>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-neon-orange/20 px-3 py-1 rounded-lg">
              <Flame className="w-4 h-4 text-neon-orange" />
              <span className="text-neon-orange font-bold">
                {safeStreak} dias
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {level}
            </span>
          </div>
        </div>

        {/* ALERTA DE RISCO */}
        {todayXP === 0 && (
          <div className="flex items-center gap-2 text-yellow-400 text-xs mb-3">
            <AlertTriangle size={14} />
            Hoje ainda sem XP. Não quebre a sequência.
          </div>
        )}

        {/* TREND */}
        <div className="flex items-center gap-2 text-xs mb-3 text-gray-400">
          {trend === "up" && (
            <>
              <TrendingUp size={14} className="text-green-400" />
              Semana melhorando
            </>
          )}
          {trend === "down" && (
            <>
              <TrendingDown size={14} className="text-red-400" />
              Ritmo caiu um pouco
            </>
          )}
          {trend === "stable" && <>Ritmo estável</>}
        </div>

        {/* WEEKLY CHART */}
        <div className="flex items-end justify-between gap-2 h-24 mb-2">
          {safeWeeklyXP.map((xp, index) => {
            const isToday = index === todayIndex;
            const hasXP = xp > 0;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: getBarHeight(xp) }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className={`w-full rounded-t-lg ${getBarStyle(
                    isToday,
                    hasXP
                  )}`}
                />
              </div>
            );
          })}
        </div>

        {/* DAY LABELS */}
        <div className="flex justify-between gap-2">
          {DAYS.map((day, index) => (
            <div
              key={day}
              className={`flex-1 text-center text-xs py-1 rounded-md ${
                index === todayIndex
                  ? "bg-neon-orange/20 text-neon-orange font-bold"
                  : "text-gray-500"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* PROGRESS BAR MILESTONE */}
        <div className="mt-4">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${milestoneProgress}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-neon-orange to-neon-yellow"
            />
          </div>

          <p className="text-gray-400 text-xs mt-2 text-center">
            {remainingDays === 0
              ? `Você atingiu ${nextMilestone} dias 🎉`
              : `Faltam ${remainingDays} dias para ${nextMilestone} dias`}
          </p>
        </div>

      </div>
    </div>
  );
};