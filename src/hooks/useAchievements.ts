import { useEffect, useState, useCallback, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

interface Achievement {
  id: string;
  title: string;
  condition?: (player: Player, missions: Missions) => boolean;
}

interface Player {
  level: number;
  attributes: Record<string, number>;
}

interface Missions {
  history: { id: string; completed: boolean }[];
}

const ACHIEVEMENT_RULES: Achievement[] = [
  { id: "lv5", title: "Iniciado", condition: (p) => p.level >= 5 },
  { id: "lv10", title: "Veterano", condition: (p) => p.level >= 10 },
  { id: "mind20", title: "Mente Afiada", condition: (p) => (p.attributes.Mente ?? 0) >= 20 },
  { id: "body20", title: "Corpo em Forma", condition: (p) => (p.attributes.Fisico ?? 0) >= 20 },
  {
    id: "quests10",
    title: "Persistente",
    condition: (_, m) => m.history.length >= 10,
  },
  {
    id: "quests50",
    title: "Determinação",
    condition: (_, m) => m.history.length >= 50,
  },
];

export function useAchievements(userId: string) {
  const [player, setPlayer] = useState<Player>({ level: 1, attributes: {} });
  const [missions, setMissions] = useState<Missions>({ history: [] });
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);

  // ✅ Função de fetch memoizada e cancelável
  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as { player?: Player; missions?: Missions };
      setPlayer(data.player ?? { level: 1, attributes: {} });
      setMissions(data.missions ?? { history: [] });
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // ✅ Calcula conquistas com useMemo para evitar recalculos desnecessários
  const computedUnlocked = useMemo(() => {
    return ACHIEVEMENT_RULES.filter((a) => a.condition?.(player, missions) ?? true);
  }, [player, missions]);

  useEffect(() => {
    setUnlocked(computedUnlocked);
  }, [computedUnlocked]);

  return { unlocked, player, missions, refresh: fetchUserData };
}
