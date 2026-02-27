import { memo, useMemo } from "react";
import { ChevronUp, Star, Zap, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import clsx from "clsx";

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
  onOpenProfile: () => void;
}

const safeNumber = (value?: number) =>
  typeof value === "number" && !isNaN(value) ? value : 0;

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const formatNumber = (value: number) =>
  value.toLocaleString("pt-BR");

const getRankColor = (rank: string) => {
  const normalized = rank.toUpperCase();

  if (normalized === "SS") return "text-red-400";
  if (normalized === "S") return "text-orange-400";
  if (normalized === "A") return "text-green-400";
  if (normalized === "B") return "text-blue-400";
  return "text-gray-400";
};

export const AvatarCard = memo(
  ({ player, onOpenProfile }: AvatarCardProps) => {
    const currentXP = safeNumber(player.currentXP);
    const nextLevelXP = safeNumber(player.nextLevelXP);
    const totalXP = safeNumber(player.totalXP);

    const xpProgress = useMemo(() => {
      if (nextLevelXP <= 0) return 0;
      return clamp((currentXP / nextLevelXP) * 100);
    }, [currentXP, nextLevelXP]);

    const isLevelUpReady = xpProgress >= 100;

    const rankColor = useMemo(
      () => getRankColor(player.rank),
      [player.rank]
    );

    const containerClasses = clsx(
      "bg-cyber-card border border-white/10 rounded-xl p-5",
      "relative overflow-hidden transition-all duration-200",
      "hover:scale-[1.01] active:scale-[0.99]",
      "focus:outline-none focus:ring-2 focus:ring-neon-cyan/40",
      isLevelUpReady &&
        "ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
    );

    return (
      <button
        onClick={onOpenProfile}
        className={containerClasses}
        aria-label={`Abrir perfil de ${player.name}`}
      >
        {/* Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div
            className={clsx(
              "text-5xl select-none transition-transform duration-300",
              isLevelUpReady && "animate-bounce"
            )}
          >
            {player.avatar}
          </div>

          <div className="flex-1 min-w-0 text-left">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 truncate">
              {player.name}
              <Star className="w-4 h-4 text-neon-yellow flex-shrink-0" />
              {player.rank === "SS" || player.rank === "S" ? (
                <Crown className="w-4 h-4 text-yellow-400" />
              ) : null}
            </h2>

            <p className="text-sm text-gray-400 truncate">
              {player.title}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={clsx(
                  "font-semibold",
                  isLevelUpReady
                    ? "text-yellow-400 animate-pulse"
                    : "text-neon-cyan"
                )}
              >
                Lv. {player.level}
              </span>

              <ChevronUp className="w-4 h-4 text-neon-green" />

              <span
                className={clsx(
                  "text-xs truncate font-medium",
                  rankColor
                )}
              >
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

          <div className="relative">
            <Progress
              value={xpProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={xpProgress}
            />

            {isLevelUpReady && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 animate-pulse pointer-events-none rounded-md" />
            )}
          </div>

          {isLevelUpReady && (
            <div className="text-xs text-yellow-400 font-semibold animate-pulse">
              Pronto para subir de nível ⚡
            </div>
          )}
        </div>
      </button>
    );
  }
);

AvatarCard.displayName = "AvatarCard";