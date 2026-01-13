import { useEffect, useState } from "react";

export interface Mission {
  id: string;
  title: string;
  xp: number;
  attribute: "Físico" | "Mente" | "Social" | "Finanças";
  done?: boolean;
}

interface MissionHistory {
  id: string;
  title: string;
  xp: number;
  success: boolean;
  date: string;
}

const STORAGE_KEY = "rpg_missions_data";

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);

  // 🔄 Load LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMissions(parsed.missions ?? []);
      setHistory(parsed.history ?? []);
    }
  }, []);

  // 💾 Save LocalStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ missions, history })
    );
  }, [missions, history]);

  const addMission = (mission: Mission) => {
    setMissions(prev => [...prev, mission]);
  };

  const completeMission = (
    mission: Mission,
    successChance = 0.8
  ) => {
    const success = Math.random() < successChance;

    setHistory(prev => [
      ...prev,
      {
        id: mission.id,
        title: mission.title,
        xp: mission.xp,
        success,
        date: new Date().toISOString()
      }
    ]);

    setMissions(prev =>
      prev.map(m =>
        m.id === mission.id ? { ...m, done: true } : m
      )
    );

    return success;
  };

  // ⚠️ ISSO É O MAIS IMPORTANTE
  return {
    missions,
    history,
    addMission,
    completeMission
  };
};
