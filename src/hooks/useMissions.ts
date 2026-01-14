import { useState } from "react";

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
  date: Date;
}

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);

  function addMission(mission: Mission) {
    setMissions(prev => [...prev, mission]);
  }

  function completeMission(
    mission: Mission,
    successChance: number
  ) {
    if (mission.done) return false;

    const success = Math.random() < successChance;

    setMissions(prev =>
      prev.map(m =>
        m.id === mission.id ? { ...m, done: true } : m
      )
    );

    setHistory(prev => [
      ...prev,
      {
        id: mission.id,
        xp: mission.xp,
        success,
        date: new Date()
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
