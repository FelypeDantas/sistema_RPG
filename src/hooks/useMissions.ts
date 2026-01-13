import { useEffect, useState } from "react";

const STORAGE_KEY = "life_rpg_missions";

export interface Mission {
  id: number;
  title: string;
  xp: number;
  attribute: "Físico" | "Mente" | "Social" | "Finanças";
  done: boolean;
}

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);
    setMissions(data.missions || []);
    setHistory(data.history || []);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ missions, history })
    );
  }, [missions, history]);

  const addMission = (mission: Omit<Mission, "id" | "done">) => {
    setMissions(prev => [
      ...prev,
      { ...mission, id: Date.now(), done: false }
    ]);
  };

  const completeMission = (
  mission: Mission,
  successChance = 0.8
) => {
  const roll = Math.random();

  const success = roll <= successChance;

  setMissions(prev =>
    prev.map(m =>
      m.id === mission.id ? { ...m, done: true } : m
    )
  );

  setHistory(prev => [
    {
      title: mission.title,
      xp: success ? mission.xp : 0,
      attribute: mission.attribute,
      success,
      date: new Date().toISOString()
    },
    ...prev
  ]);

  return success;
};

}
