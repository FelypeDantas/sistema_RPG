import { Lock } from "lucide-react";
import { memo } from "react";

type Rarity = "common" | "rare" | "epic" | "legendary";

interface Achievement {
  name: string;
  description: string;
  icon: string;
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
  { border: string; bg: string; text: string; glow: string }
> = {
  common: {
    border: "border-gray-500/30",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    glow: ""
  },
  rare: {
    border: "border-neon-blue/30",
    bg: "bg-neon-blue/10",
    text: "text-neon-blue",
    glow: "shadow-[0_0_15px_rgba(0,212,255,0.2)]"
  },
  epic: {
    border: "border-neon-purple/30",
    bg: "bg-neon-purple/10",
    text: "text-neon-purple",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]"
  },
  legendary: {
    border: "border-neon-orange/30",
    bg: "bg-neon-orange/10",
    text: "text-neon-orange",
    glow: "shadow-[0_0_20px_rgba(251,146,60,0.3)]"
  }
};

export const AchievementCard = memo(
  ({ achievement }: AchievementCardProps) => {
    const style =
      rarityStyles[achievement.rarity] ?? rarityStyles.common;

    const progress =
      achievement.progress !== undefined &&
      achievement.maxProgress !== undefined &&
      achievement.maxProgress > 0
        ? Math.min(
            (achievement.progress / achievement.maxProgress) * 100,
            100
          )
        : 0;

    const containerClasses = `
      relative p-4 rounded-xl border transition-all duration-300
      ${
        achievement.unlocked
          ? `${style.border} ${style.bg} ${style.glow}`
          : "border-white/5 bg-cyber-darker opacity-60"
      }
    `;

    const iconClasses = `
      relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl
      ${achievement.unlocked ? style.bg : "bg-gray-800"}
    `;

    const badgeClasses = `
      text-xs px-1.5 py-0.5 rounded uppercase font-bold
      ${
        achievement.unlocked
          ? `${style.text} ${style.bg}`
          : "text-gray-500 bg-gray-800"
      }
    `;

    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={iconClasses}>
            {achievement.unlocked ? (
              achievement.icon
            ) : (
              <>
                <span className="opacity-30">
                  {achievement.icon}
                </span>
                <Lock className="absolute w-4 h-4 text-gray-500" />
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4
                className={`font-semibold truncate ${
                  achievement.unlocked
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {achievement.name}
              </h4>
              <span className={badgeClasses}>
                {achievement.rarity}
              </span>
            </div>

            <p className="text-gray-500 text-sm truncate">
              {achievement.description}
            </p>

            {/* Progress bar for locked achievements */}
            {!achievement.unlocked &&
              achievement.progress !== undefined &&
              achievement.maxProgress !== undefined && (
                <div className="mt-2">
                  <div className="h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gray-600 to-gray-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs mt-1">
                    {achievement.progress.toLocaleString()} /{" "}
                    {achievement.maxProgress.toLocaleString()}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
);

AchievementCard.displayName = "AchievementCard";
