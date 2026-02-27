// hooks/useAchievementEffects.ts
import { useEffect, useRef, useState } from "react";

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