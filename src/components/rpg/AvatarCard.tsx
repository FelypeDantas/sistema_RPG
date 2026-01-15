import { ChevronUp, Star, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PlayerData {
  name: string;
  title: string;
  level: number;
  currentXP?: number;
  nextLevelXP?: number;
  totalXP?: number;
  rank: string;
  avatar: string;
}

interface AvatarCardProps {
  player: PlayerData;
  xpProgress: number;
}

// 🔐 Função de segurança contra undefined
const safeNumber = (value?: number) =>
  typeof value === "number" && !isNaN(value) ? value : 0;

export const AvatarCard = ({ player, xpProgress }: AvatarCardProps) => {
  const currentXP = safeNumber(player.currentXP);
  const nextLevelXP = safeNumber(player.nextLevelXP);
  const totalXP = safeNumber(player.totalXP);

  return (
    <div className="bg-cyber-card border border-white/10 rounded-xl p-5 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="text-5xl">{player.avatar}</div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {player.name}
            <Star className="w-4 h-4 text-neon-yellow" />
          </h2>

          <p className="text-sm text-gray-400">
            {player.title}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-neon-cyan font-semibold">
              Lv. {player.level}
            </span>

            <ChevronUp className="w-4 h-4 text-neon-green" />

            <span className="text-xs text-gray-400">
              {player.rank}
            </span>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-xs text-gray-400">
          <span>
            XP: {currentXP.toLocaleString()} /{" "}
            {nextLevelXP.toLocaleString()}
          </span>

          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-neon-yellow" />
            Total: {totalXP.toLocaleString()}
          </span>
        </div>

        <Progress value={xpProgress} />
      </div>
    </div>
  );
};
