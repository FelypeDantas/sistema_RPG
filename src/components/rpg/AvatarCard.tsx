import { ChevronUp, Star, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PlayerData {
  name: string;
  title: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  rank: string;
  avatar: string;
}

interface AvatarCardProps {
  player: PlayerData;
  xpProgress: number;
}

export const AvatarCard = ({ player, xpProgress }: AvatarCardProps) => {
  return (
    <div className="bg-cyber-card border border-neon-cyan/30 rounded-xl p-6 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-cyan/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neon-purple/20 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan p-[2px]">
              <div className="w-full h-full rounded-xl bg-cyber-dark flex items-center justify-center text-4xl">
                {player.avatar}
              </div>
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 bg-neon-cyan text-cyber-dark font-bold text-xs px-2 py-1 rounded-md">
              LV.{player.level}
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{player.name}</h2>
            <p className="text-neon-purple text-sm">{player.title}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-neon-orange fill-neon-orange" />
              <span className="text-gray-400 text-sm">{player.rank}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Experiência</span>
            <span className="text-neon-cyan font-mono">
              {player.currentXP.toLocaleString()} / {player.nextLevelXP.toLocaleString()} XP
            </span>
          </div>
          <div className="relative h-4 bg-cyber-darker rounded-full overflow-hidden border border-white/10">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">
              {(player.nextLevelXP - player.currentXP).toLocaleString()} XP para level {player.level + 1}
            </span>
            <div className="flex items-center gap-1 text-neon-green text-xs">
              <ChevronUp className="w-3 h-3" />
              <span>{Math.round(xpProgress)}%</span>
            </div>
          </div>
        </div>

        {/* Total XP */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-gray-400 text-sm">XP Total Acumulado</span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-orange" />
            <span className="text-white font-bold font-mono">{player.totalXP.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
