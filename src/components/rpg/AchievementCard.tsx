import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { memo, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  unlocked: boolean;
  rarity?: Rarity;
  progress?: number;
  maxProgress?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

/* ----------------------------- */
/* 🎖 AUTO RARITY SYSTEM */
/* ----------------------------- */
function autoRarity(maxProgress: number): Rarity {
  if (maxProgress >= 10000) return "legendary";
  if (maxProgress >= 5000) return "epic";
  if (maxProgress >= 1000) return "rare";
  return "common";
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
    glow: "shadow-[0_0_15px_rgba(0,212,255,0.3)]",
    progressBg: "bg-neon-blue"
  },
  epic: {
    border: "border-neon-purple/30",
    bg: "bg-neon-purple/10",
    text: "text-neon-purple",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.35)]",
    progressBg: "bg-neon-purple"
  },
  legendary: {
    border: "border-neon-orange/40",
    bg: "bg-neon-orange/10",
    text: "text-neon-orange",
    glow: "shadow-[0_0_25px_rgba(251,146,60,0.45)]",
    progressBg: "bg-neon-orange"
  }
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
    progress = 0,
    maxProgress = 0
  } = achievement;

  const rarity: Rarity =
    achievement.rarity ?? autoRarity(maxProgress);

  const style = rarityStyles[rarity];

  const hasProgress = maxProgress > 0;
  const progressPercent = calculateProgress(progress, maxProgress);
  const almostUnlocked =
    hasProgress && progressPercent >= 80 && !unlocked;

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const previousUnlocked = useRef(unlocked);

  /* ----------------------------- */
  /* 📈 Progress Animation */
  /* ----------------------------- */
  useEffect(() => {
    if (!hasProgress) return;
    setAnimatedProgress(progressPercent);
  }, [progressPercent, hasProgress]);

  /* ----------------------------- */
  /* 🏆 Unlock Flash Detection */
  /* ----------------------------- */
  useEffect(() => {
    if (!previousUnlocked.current && unlocked) {
      setJustUnlocked(true);
      setTimeout(() => setJustUnlocked(false), 900);
    }
    previousUnlocked.current = unlocked;
  }, [unlocked]);

  const dynamicGlow = useMemo(() => {
    if (!unlocked || !hasProgress) return style.glow;
    const intensity = Math.max(15, progressPercent / 3);
    return `shadow-[0_0_${intensity}px_rgba(255,255,255,0.25)]`;
  }, [unlocked, hasProgress, progressPercent, style.glow]);

  const progressBarColor = unlocked
    ? style.progressBg
    : "bg-gray-600";

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        scale: unlocked ? 1 : 0.98
      }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`
        relative overflow-hidden group p-4 rounded-xl border
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        ${unlocked
          ? `${style.border} ${style.bg} ${dynamicGlow}`
          : "border-white/5 bg-cyber-darker opacity-70"}
        ${almostUnlocked ? "animate-pulse border-yellow-400/40" : ""}
      `}
    >
      {/* 🏆 FLASH EFFECT */}
      <AnimatePresence>
        {justUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-white/20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <motion.div
          initial={false}
          animate={{
            rotate: unlocked ? [0, 8, -8, 0] : 0
          }}
          transition={{ duration: 0.6 }}
          className={`
            relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            ${unlocked ? style.bg : "bg-gray-800"}
          `}
        >
          {unlocked ? (
            icon
          ) : (
            <>
              <span className="opacity-30">{icon}</span>
              <Lock className="absolute w-4 h-4 text-gray-500" />
            </>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`font-semibold truncate ${
                unlocked ? "text-white" : "text-gray-500"
              }`}
            >
              {name}
            </h4>

            <span
              className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                unlocked
                  ? `${style.text} ${style.bg}`
                  : "text-gray-500 bg-gray-800"
              }`}
            >
              {rarity}
            </span>
          </div>

          <p className="text-gray-500 text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {description}
          </p>

          {hasProgress && (
            <div className="mt-2">
              <div className="h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${progressBarColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedProgress}%` }}
                  transition={{ duration: 0.7 }}
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
    </motion.div>
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