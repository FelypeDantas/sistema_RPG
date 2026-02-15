import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

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

export function useAchievements(userId: string) {
  const [player, setPlayer] = useState<Player>({ level: 1, attributes: {} });
  const [missions, setMissions] = useState<Missions>({ history: [] });
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    // Buscar dados do Firebase
    const fetchData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPlayer(data.player);
        setMissions(data.missions);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const achievements: Achievement[] = [];

    if (player.level >= 5) achievements.push({ id: "lv5", title: "Iniciado" });
    if (player.level >= 10) achievements.push({ id: "lv10", title: "Veterano" });

    if ((player.attributes.Mente ?? 0) >= 20)
      achievements.push({ id: "mind20", title: "Mente Afiada" });
    if ((player.attributes.Fisico ?? 0) >= 20)
      achievements.push({ id: "body20", title: "Corpo em Forma" });

    if (missions.history.length >= 10)
      achievements.push({ id: "quests10", title: "Persistente" });
    if (missions.history.length >= 50)
      achievements.push({ id: "quests50", title: "Determinação" });

    setUnlocked(achievements);
  }, [player, missions]);

  return { unlocked, player, missions };
}
