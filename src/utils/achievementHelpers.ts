import { AchievementRarity } from "@/hooks/useAchievements";

export function getRarityClasses(rarity: AchievementRarity) {
  switch (rarity) {
    case "Comum":
      return "text-green-400";

    case "Rara":
      return "text-blue-400";

    case "Épica":
      return "text-purple-400";

    case "Lendária":
      return "text-yellow-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]";

    case "Mítica":
      return "text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(255,0,0,0.7)]";

    default:
      return "text-gray-400";
  }
}
