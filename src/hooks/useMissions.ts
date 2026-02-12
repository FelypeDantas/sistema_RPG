import { useEffect, useState } from "react";

/* =============================
   🎯 TIPOS
============================= */

export type MissionAttribute = "Mente" | "Físico" | "Social" | "Finanças";

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  attribute: MissionAttribute;
  completed: boolean;

  // 🧬 Segmento evolutivo (opcional)
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
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<MissionHistory[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
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
     ✅ COMPLETE
  ============================= */

  function completeMission(missionId: string, success: boolean) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    setMissions(prev => prev.filter(m => m.id !== missionId));

    setHistory(prev => [
      ...prev,
      {
        id: mission.id,
        xp: mission.xp,
        success,
        date: new Date().toISOString(),
        segment: mission.segment,
        segmentXP: mission.segmentXP,
      },
    ]);
  }

  /* =============================
     🔄 RESET
  ============================= */

  function resetMissions() {
    setMissions([]);
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
  }

  /* =============================
     📦 EXPORT
  ============================= */

  return {
    missions,
    history,
    addMission,
    completeMission,
    resetMissions,
  };
}
