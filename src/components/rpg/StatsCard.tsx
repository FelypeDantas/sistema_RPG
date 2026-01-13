import { Activity, Target, Zap, TrendingUp } from "lucide-react";

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
  const completionRate = Math.round((stats.questsToday / stats.totalQuests) * 100);
  
  return (
    <div className="bg-cyber-card border border-white/10 rounded-xl p-5">
      <div className="grid grid-cols-2 gap-4">
        {/* Quests Progress */}
        <div className="bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-neon-purple" />
            <span className="text-gray-400 text-sm">Missões</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-white">{stats.questsToday}</span>
            <span className="text-gray-500 text-lg mb-1">/{stats.totalQuests}</span>
          </div>
          <div className="mt-2 h-1.5 bg-cyber-dark rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* XP Today */}
        <div className="bg-cyber-darker rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-neon-cyan" />
            <span className="text-gray-400 text-sm">XP Hoje</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-neon-cyan text-glow-cyan">+{stats.xpToday}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-neon-green text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Bom progresso!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
