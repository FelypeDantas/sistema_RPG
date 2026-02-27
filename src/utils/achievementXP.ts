// utils/achievementXP.ts
import type { Rarity } from "@/types/achievement";

export function getXPByRarity(rarity: Rarity) {
  switch (rarity) {
    case "legendary":
      return 1000;
    case "epic":
      return 500;
    case "rare":
      return 200;
    default:
      return 100;
  }
}