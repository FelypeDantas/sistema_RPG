import { useEffect, useState } from "react";

interface Achievement {
  id: string;
  title: string;
}

interface Player {
  level: number;
  attributes: Record<string, number>;
}

interface Missions {
  history: { id: string; completed: boolean }[];
}

export function useAchievements(player: Player, missions: Missions) {
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    const achievements: Achievement[] = [];

    // Conquistas de nível
    if (player.level >= 5) achievements.push({ id: "lv5", title: "Iniciado" });
    if (player.level >= 10) achievements.push({ id: "lv10", title: "Veterano" });

    // Conquistas de atributos
    if ((player.attributes.Mente ?? 0) >= 20)
      achievements.push({ id: "mind20", title: "Mente Afiada" });
    if ((player.attributes.Fisico ?? 0) >= 20)
      achievements.push({ id: "body20", title: "Corpo em Forma" });

    // Conquistas de missões
    if (missions.history.length >= 10)
      achievements.push({ id: "quests10", title: "Persistente" });
    if (missions.history.length >= 50)
      achievements.push({ id: "quests50", title: "Determinação" });

    setUnlocked(achievements);
  }, [player, missions]);

  return { unlocked };
}
