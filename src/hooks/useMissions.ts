import { useEffect, useState } from "react";

export type MissionAttribute =
  | "Mente"
  | "Físico"
  | "Social"
  | "Finanças";

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  attribute: MissionAttribute;
  done: boolean;
}

interface MissionHistory {
  id: string;
  xp: number;
  success: boolean;
  date: string;
}

const STORAGE_KEY = "rpg_missions";
const HISTORY_KEY = "rpg_mission_history";

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [history, setHistory] = useState<MissionHistory[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  function addMission(mission: Mission) {
    setMissions(prev => [...prev, mission]);
  }

  function completeMission(
    mission: Mission,
    successChance: number
  ) {
    const success = Math.random() < successChance;

    // Remove a missão da lista ativa
    setMissions(prev =>
      prev.filter(m => m.id !== mission.id)
    );

    // Registra no histórico
    setHistory(prev => [
      ...prev,
      {
        id: mission.id,
        xp: mission.xp,
        success,
        date: new Date().toISOString()
      }
    ]);

    return success;
  }

  return {
    missions,
    history,
    addMission,
    completeMission
  };
}
