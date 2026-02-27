import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { memo, ReactNode, useEffect } from "react";
import { useAchievementEffects } from "@/hooks/useAchievementEffects";
import { useAchievementToast } from "@/providers/AchievementToastProvider";
import { useProgression } from "@/providers/ProgressionProvider";
import { processAchievementUnlock } from "@/utils/processAchievementUnlock";

type Rarity = "common" | "rare" | "epic" | "legendary";
const { addXP } = useProgression();

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  unlocked: boolean;
  rarity: Rarity;
  progress?: number;
  maxProgress?: number;
}

function AchievementCardComponent({ achievement }: { achievement: Achievement }) {
  const { showAchievement } = useAchievementToast();

  const effectTrigger = useAchievementEffects(
    achievement.unlocked,
    "/sounds/achievement.mp3"
  );

  useEffect(() => {
    if (effectTrigger) {
      showAchievement({
        id: achievement.id,
        name: achievement.name,
        rarity: achievement.rarity
      });
    }
  }, [effectTrigger]);

  useEffect(() => {
  if (effectTrigger) {
    processAchievementUnlock({
      achievement,
      addXP,
      unlockTrait: (id) => console.log("Trait unlocked:", id),
      unlockAchievement: (id) => console.log("Achievement unlocked:", id)
    });
  }
}, [effectTrigger]);

  return (
    <motion.div
      layout
      className="relative overflow-hidden p-4 rounded-xl border bg-cyber-darker"
      animate={{ scale: achievement.unlocked ? 1 : 0.98 }}
    >
      {/* FLASH RADIAL */}
      <AnimatePresence>
        {effectTrigger && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute w-32 h-32 bg-yellow-400/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* PARTICLES */}
      <AnimatePresence>
        {effectTrigger &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                y: -40 - Math.random() * 40,
                x: (Math.random() - 0.5) * 100
              }}
              transition={{ duration: 1 }}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                top: "50%",
                left: "50%"
              }}
            />
          ))}
      </AnimatePresence>

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center relative">
          {achievement.unlocked ? (
            achievement.icon
          ) : (
            <>
              <span className="opacity-30">{achievement.icon}</span>
              <Lock className="absolute w-4 h-4 text-gray-500" />
            </>
          )}
        </div>

        <div>
          <h4 className="text-white font-semibold">
            {achievement.name}
          </h4>
          <p className="text-gray-400 text-sm">
            {achievement.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export const AchievementCard = memo(AchievementCardComponent);