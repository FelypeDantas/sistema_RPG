import { Lock } from "lucide-react";
import { memo, ReactNode, useEffect, useMemo, useState } from "react";

type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  unlocked: boolean;
  rarity: Rarity;
  progress?: number;
  maxProgress?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

const rarityStyles: Record<
  Rarity,
  { border: string; bg: string; text: string; glow: string; progressBg: string }
> = {
  common: {
    border: "border-gray-500/30",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    glow: "",
    progressBg: "bg-gray-500"
  },
  rare: {
    border: "border-neon-blue/30",
    bg: "bg-neon-blue/10",
    text: "text-neon-blue",
    glow: "shadow-[0_0_15px_rgba(0,212,255,0.2)]",
    progressBg: "bg-neon-blue"
  },
  epic: {
    border: "border-neon-purple/30",
    bg: "bg-neon-purple/10",
    text: "text-neon-purple",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    progressBg: "bg-neon-purple"
  },
  legendary: {
    border: "border-neon-orange/30",
    bg: "bg-neon-orange/10",
    text: "text-neon-orange",
    glow: "shadow-[0_0_20px_rgba(251,146,60,0.3)]",
    progressBg: "bg-neon-orange"
  }
};

const rarityLabel: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary"
};

function calculateProgress(progress: number, max: number) {
  if (!max) return 0;
  return Math.min((progress / max) * 100, 100);
}

function AchievementCardComponent({ achievement }: AchievementCardProps) {
  const {
    id,
    name,
    description,
    icon,
    unlocked,
    rarity,
    progress = 0,
    maxProgress = 0
  } = achievement;

  const style = rarityStyles[rarity] ?? rarityStyles.common;

  const hasProgress = maxProgress > 0;
  const progressPercent = calculateProgress(progress, maxProgress);
  const almostUnlocked =
    hasProgress && progressPercent >= 80 && !unlocked;

  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (!hasProgress) return;
    setAnimatedProgress(progressPercent);
  }, [progressPercent, hasProgress]);

  const dynamicGlow = useMemo(() => {
    if (!unlocked || !hasProgress) return style.glow;
    const intensity = Math.max(10, progressPercent / 4);
    return `shadow-[0_0_${intensity}px_rgba(255,255,255,0.15)]`;
  }, [unlocked, hasProgress, progressPercent, style.glow]);

  const containerClasses = useMemo(() => {
    return `
      relative group p-4 rounded-xl border transition-all duration-300
      hover:-translate-y-1 hover:scale-[1.02]
      ${unlocked
        ? `${style.border} ${style.bg} ${dynamicGlow} ring-1 ring-white/10`
        : "border-white/5 bg-cyber-darker opacity-70"}
      ${almostUnlocked ? "animate-pulse border-yellow-400/40" : ""}
    `;
  }, [unlocked, style, dynamicGlow, almostUnlocked]);

  const iconClasses = `
    relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl
    transition-all duration-300
    ${unlocked ? style.bg : "bg-gray-800"}
  `;

  const badgeClasses = `
    text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider
    ${unlocked ? `${style.text} ${style.bg}` : "text-gray-500 bg-gray-800"}
  `;

  const progressBarColor = unlocked ? style.progressBg : "bg-gray-600";

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={iconClasses}>
          {unlocked ? (
            icon
          ) : (
            <>
              <span className="opacity-30">{icon}</span>
              <Lock className="absolute w-4 h-4 text-gray-500" />
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`font-semibold truncate ${
                unlocked ? "text-white" : "text-gray-500"
              }`}
            >
              {name}
            </h4>

            <span className={badgeClasses}>
              {rarityLabel[rarity]}
            </span>
          </div>

          <p className="text-gray-500 text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {description}
          </p>

          {hasProgress && (
            <div className="mt-2">
              <div className="h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${progressBarColor}`}
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>

              <span className="text-gray-500 text-xs mt-1 block">
                {progress.toLocaleString()} /{" "}
                {maxProgress.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const AchievementCard = memo(
  AchievementCardComponent,
  (prev, next) => {
    const a = prev.achievement;
    const b = next.achievement;

    return (
      a.id === b.id &&
      a.unlocked === b.unlocked &&
      a.progress === b.progress &&
      a.maxProgress === b.maxProgress &&
      a.rarity === b.rarity
    );
  }
);

AchievementCard.displayName = "AchievementCard";