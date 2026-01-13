import { useEffect, useState } from "react";

export function useAchievements(player: any, missions: any) {
  const [unlocked, setUnlocked] = useState<any[]>([]);

  useEffect(() => {
    const achievements = [];

    if (player.level >= 5)
      achievements.push({ id: "lv5", title: "Iniciado" });

    if (player.attributes.Mente >= 20)
      achievements.push({ id: "mind20", title: "Mente Afiada" });

    if (missions.history.length >= 10)
      achievements.push({ id: "quests10", title: "Persistente" });

    setUnlocked(achievements);
  }, [player, missions]);

  return { unlocked };
}
