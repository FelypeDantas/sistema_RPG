import { memo, useCallback, useMemo } from "react";
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
  onOpenProfile: () => void;
}

// 🔐 Segurança contra undefined
const safeNumber = (value?: number) =>
  typeof value === "number" && !isNaN(value) ? value : 0;

// 🔒 Garante que porcentagem fique entre 0 e 100
const clampPercentage = (value: number) =>
  Math.min(Math.max(value, 0), 100);

// 🔢 Formatação padronizada
const formatNumber = (value: number) =>
  value.toLocaleString("pt-BR");

export const AvatarCard = memo(
  ({ player, xpProgress, onOpenProfile }: AvatarCardProps) => {
    const currentXP = safeNumber(player.currentXP);
    const nextLevelXP = safeNumber(player.nextLevelXP);
    const totalXP = safeNumber(player.totalXP);

    const safeProgress = clampPercentage(xpProgress);

    const containerClasses = useMemo(
      () => `
        bg-cyber-card border border-white/10 rounded-xl p-5
        relative overflow-hidden cursor-pointer
        hover:scale-[1.01]
        active:scale-[0.99]
        focus:outline-none focus:ring-2 focus:ring-neon-cyan/40
        transition-transform duration-200
      `,
      []
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenProfile();
        }
      },
      [onOpenProfile]
    );

    return (
      <div
        onClick={onOpenProfile}
        onKeyDown={handleKeyDown}
        className={containerClasses}
        role="button"
        tabIndex={0}
        aria-label={`Abrir perfil de ${player.name}`}
      >
        {/* Glow sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="text-5xl select-none">
            {player.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 truncate">
              {player.name}
              <Star className="w-4 h-4 text-neon-yellow flex-shrink-0" />
            </h2>

            <p className="text-sm text-gray-400 truncate">
              {player.title}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-neon-cyan font-semibold">
                Lv. {player.level}
              </span>

              <ChevronUp className="w-4 h-4 text-neon-green" />

              <span className="text-xs text-gray-400 truncate">
                {player.rank}
              </span>
            </div>
          </div>
        </div>

        {/* XP */}
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              XP: {formatNumber(currentXP)} /{" "}
              {formatNumber(nextLevelXP)}
            </span>

            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-neon-yellow" />
              Total: {formatNumber(totalXP)}
            </span>
          </div>

          <Progress
            value={safeProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeProgress}
          />
        </div>
      </div>
    );
  }
);

AvatarCard.displayName = "AvatarCard";
