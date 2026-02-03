import { useEffect, useState } from "react";

/* =============================
   🎯 TIPOS
============================= */

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

  // 🧬 segmento evolutivo
  segment?: string;
  segmentXP?: number;
}

export interface MissionHistory {
  id: string;
  xp: number;
  success: boolean;
  date: string;

  segment?: string;
  segmentXP?: number;
}

/* =============================
   💾 STORAGE
============================= */

const STORAGE_KEY = "rpg_missions";
const HISTORY_KEY = "rpg_mission_history";

/* =============================
   🧠 HOOK
============================= */

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [history, setHistory] = useState<MissionHistory[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  /* =============================
     📤 SAVE
  ============================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  /* =============================
     ➕ ADD
  ============================= */

  function addMission(mission: Mission) {
    setMissions(prev => [...prev, mission]);
  }

  /* =============================
     ✅ COMPLETE (manual)
  ============================= */

  function completeMission(
    mission: Mission,
    success: boolean
  ) {
    setMissions(prev =>
      prev.filter(m => m.id !== mission.id)
    );

    setHistory(prev => [
      ...prev,
      {
        id: mission.id,
        xp: mission.xp,
        success,
        date: new Date().toISOString(),
        segment: mission.segment,
        segmentXP: mission.segmentXP
      }
    ]);
  }

  /* =============================
     📦 EXPORT
  ============================= */

  return {
    missions,
    history,
    addMission,
    completeMission
  };
}
