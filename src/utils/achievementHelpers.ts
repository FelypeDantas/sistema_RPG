import { AchievementRarity } from "@/hooks/useAchievements";

export function getRarityColor(rarity: AchievementRarity) {
  switch (rarity) {
    case "Comum":
      return "text-green-500";
    case "Rara":
      return "text-blue-500";
    case "Épica":
      return "text-purple-500";
    case "Lendária":
      return "text-yellow-500";
    case "Mítica":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}
