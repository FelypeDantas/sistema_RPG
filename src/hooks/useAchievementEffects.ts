// hooks/useAchievementEffects.ts
import { ReactNode, useEffect, useRef, useState } from "react";
import type { Rarity } from "@/types/achievement";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  unlocked: boolean;
  rarity: Rarity;
  progress?: number;
  maxProgress?: number;

  grantsTraitId?: string;
  unlocksAchievementIds?: string[];
}

export function useAchievementEffects(unlocked: boolean, soundUrl?: string) {
  const previousUnlocked = useRef(unlocked);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (!previousUnlocked.current && unlocked) {
      setTrigger(true);

      if (soundUrl) {
        const audio = new Audio(soundUrl);
        audio.volume = 0.6;
        audio.play().catch(() => {});
      }

      setTimeout(() => setTrigger(false), 1200);
    }

    previousUnlocked.current = unlocked;
  }, [unlocked, soundUrl]);

  return trigger;
}