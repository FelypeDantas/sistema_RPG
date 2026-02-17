import { useMemo } from "react";

interface Player {
  level: number;
  attributes: Record<string, number>;
}

interface Missions {
  history: { id: string; completed: boolean }[];
}

interface Achievement {
  id: string;
  title: string;
  condition: (player: Player, missions: Missions) => boolean;
}

const ACHIEVEMENT_RULES: Achievement[] = [
  {
    id: "lv5",
    title: "Iniciado",
    condition: (p, _) => p.level >= 5,
  },
  {
    id: "lv10",
    title: "Veterano",
    condition: (p, _) => p.level >= 10,
  },
  {
    id: "mind20",
    title: "Mente Afiada",
    condition: (p, _) => (p.attributes.Mente ?? 0) >= 20,
  },
  {
    id: "body20",
    title: "Corpo em Forma",
    condition: (p, _) => (p.attributes.Fisico ?? 0) >= 20,
  },
  {
    id: "quests10",
    title: "Persistente",
    condition: (_, m) =>
      m.history.filter((h) => h.completed).length >= 10,
  },
  {
    id: "quests50",
    title: "Determinação",
    condition: (_, m) =>
      m.history.filter((h) => h.completed).length >= 50,
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
