import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  xpProgress: number;
  onOpenProfile: () => void;
}

const safeNumber = (value?: number) =>
  typeof value === "number" && !isNaN(value) ? value : 0;

const clampPercentage = (value: number) =>
  Math.min(Math.max(value, 0), 100);

const formatNumber = (value: number) =>
  value.toLocaleString("pt-BR");

export const AvatarCard = memo(
  ({ player, xpProgress, onOpenProfile }: AvatarCardProps) => {
    const currentXP = safeNumber(player.currentXP);
    const nextLevelXP = safeNumber(player.nextLevelXP);
    const totalXP = safeNumber(player.totalXP);

    const safeProgress = clampPercentage(xpProgress);
    const isLevelUpReady = safeProgress >= 100;

    // ✨ Animação real da barra
    const [animatedXP, setAnimatedXP] = useState(0);

    useEffect(() => {
      const frame = requestAnimationFrame(() => {
        setAnimatedXP(safeProgress);
      });
      return () => cancelAnimationFrame(frame);
    }, [safeProgress]);

    // 🌟 Rank visual dinâmico
    const rankStyles = useMemo(() => {
      if (player.rank.includes("SS"))
        return "text-red-400";
      if (player.rank.includes("S"))
        return "text-orange-400";
      if (player.rank.includes("A"))
        return "text-green-400";
      if (player.rank.includes("B"))
        return "text-blue-400";
      return "text-gray-400";
    }, [player.rank]);

    const containerClasses = useMemo(
      () =>
        clsx(
          "bg-cyber-card border border-white/10 rounded-xl p-5",
          "relative overflow-hidden cursor-pointer",
          "hover:scale-[1.01] active:scale-[0.99]",
          "focus:outline-none focus:ring-2 focus:ring-neon-cyan/40",
          "transition-transform duration-200",
          isLevelUpReady &&
            "ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
        ),
      [isLevelUpReady]
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
        {/* Glow de fundo */}
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

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 truncate">
              {player.name}
              <Star className="w-4 h-4 text-neon-yellow flex-shrink-0" />
              {player.rank.includes("S") && (
                <Crown className="w-4 h-4 text-yellow-400" />
              )}
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
                  rankStyles
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

          {/* Barra customizada com animação */}
          <div className="relative">
            <Progress
              value={animatedXP}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={animatedXP}
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
      </div>
    );
  }
);

AvatarCard.displayName = "AvatarCard";