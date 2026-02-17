import { useMemo } from "react";

interface Player {
  level: number;
  attributes: Record<string, number>;
}

interface Missions {
  history: { id: string; completed?: boolean; success?: boolean }[];
}

export type AchievementRarity =
  | "Comum"
  | "Rara"
  | "Épica"
  | "Lendária"
  | "Mítica";

interface Achievement {
  id: string;
  title: string;
  rarity: AchievementRarity;
  description: string;
  condition: (player: Player, missions: Missions) => boolean;
}

const ACHIEVEMENT_RULES: Achievement[] = [
  {
    id: "lv5",
    title: "Iniciado",
    rarity: "Comum",
    description: "Alcance o nível 5.",
    condition: (p) => p.level >= 5,
  },
  {
    id: "lv10",
    title: "Veterano",
    rarity: "Rara",
    description: "Alcance o nível 10.",
    condition: (p) => p.level >= 10,
  },
  {
    id: "mind20",
    title: "Mente Afiada",
    rarity: "Épica",
    description: "Alcance 20 pontos em Mente.",
    condition: (p) => (p.attributes.Mente ?? 0) >= 20,
  },
  {
    id: "body30",
    title: "Titã",
    rarity: "Lendária",
    description: "Alcance 30 pontos em Físico.",
    condition: (p) => (p.attributes.Físico ?? 0) >= 30,
  },
  {
    id: "quests100",
    title: "Imparável",
    rarity: "Mítica",
    description: "Complete 100 missões com sucesso.",
    condition: (_, m) =>
      m.history.filter((h) => h.success).length >= 100,
  },
];

export function useAchievements(player: Player, missions: Missions) {
  const unlocked = useMemo(() => {
    return ACHIEVEMENT_RULES.filter((achievement) =>
      achievement.condition(player, missions)
    );
  }, [player, missions]);

  return { unlocked };
}
