import { Flame, Calendar } from "lucide-react";

interface StreakCardProps {
  weeklyXP: number[];
  currentStreak: number;
}

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const StreakCard = ({ weeklyXP, currentStreak }: StreakCardProps) => {
  const maxXP = Math.max(...weeklyXP, 1);
  const todayIndex = 4; // Friday for demo

  return (
    <div className="bg-cyber-card border border-neon-orange/30 rounded-xl p-5 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-orange/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-neon-orange" />
            Streak Semanal
          </h3>
          <div className="flex items-center gap-2 bg-neon-orange/20 px-3 py-1 rounded-lg">
            <Flame className="w-4 h-4 text-neon-orange animate-pulse" />
            <span className="text-neon-orange font-bold">{currentStreak} dias</span>
          </div>
        </div>

        {/* Weekly XP Chart */}
        <div className="flex items-end justify-between gap-2 h-24 mb-2">
          {weeklyXP.map((xp, index) => {
            const height = (xp / maxXP) * 100;
            const isToday = index === todayIndex;
            const hasSomeXP = xp > 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className={`
                    w-full rounded-t-lg transition-all duration-500 relative
                    ${isToday 
                      ? 'bg-gradient-to-t from-neon-orange to-neon-yellow' 
                      : hasSomeXP 
                        ? 'bg-gradient-to-t from-neon-cyan/50 to-neon-cyan' 
                        : 'bg-gray-700/50'
                    }
                  `}
                  style={{ height: `${Math.max(height, 8)}%` }}
                >
                  {hasSomeXP && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-mono">
                      {xp}
                    </span>
                  )}
                </div>
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
                flex-1 text-center text-xs py-1 rounded-md
                ${index === todayIndex 
                  ? 'bg-neon-orange/20 text-neon-orange font-bold' 
                  : 'text-gray-500'
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Streak message */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            🔥 Continue assim! Faltam <span className="text-neon-orange font-bold">12 dias</span> para o próximo milestone!
          </p>
        </div>
      </div>
    </div>
  );
};
