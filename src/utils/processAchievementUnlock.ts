// utils/processAchievementUnlock.ts
import { getXPByRarity } from "./achievementXP";

export function processAchievementUnlock({
  achievement,
  addXP,
  unlockTrait,
  unlockAchievement
}: {
  achievement: any;
  addXP: (xp: number) => void;
  unlockTrait: (id: string) => void;
  unlockAchievement: (id: string) => void;
}) {
  const xp = getXPByRarity(achievement.rarity);

  addXP(xp);

  if (achievement.grantsTraitId) {
    unlockTrait(achievement.grantsTraitId);
  }

  if (achievement.unlocksAchievementIds) {
    achievement.unlocksAchievementIds.forEach(unlockAchievement);
  }
}