import { useEffect, useMemo, useState } from "react";

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

  segment?: string;
  segmentXP?: number;
}

export interface MissionHistory {
  id: string;
  title: string;
  description: string;
  attribute: MissionAttribute;

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
    // evita duplicadas pelo mesmo título no mesmo dia
    const today = new Date().toISOString().split("T")[0];

    const alreadyExists = missions.some(
      m =>
        m.title === mission.title &&
        m.id.includes(today)
    );

    if (alreadyExists) return;

    setMissions(prev => [...prev, mission]);
  }

  /* =============================
     ✅ COMPLETE
  ============================= */

  function completeMission(missionId: string, success: boolean) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    setMissions(prev => prev.filter(m => m.id !== missionId));

    setHistory(prev =>
      [
        ...prev,
        {
          id: mission.id,
          title: mission.title,
          description: mission.description,
          attribute: mission.attribute,
          xp: mission.xp,
          success,
          date: new Date().toISOString(),
          segment: mission.segment,
          segmentXP: mission.segmentXP,
        },
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }

  /* =============================
     📊 ESTATÍSTICAS
  ============================= */

  const stats = useMemo(() => {
    const total = history.length;
    const successes = history.filter(h => h.success).length;
    const successRate = total ? Math.round((successes / total) * 100) : 0;

    const xpByAttribute: Record<MissionAttribute, number> = {
      Mente: 0,
      Físico: 0,
      Social: 0,
      Finanças: 0,
    };

    const xpBySegment: Record<string, number> = {};

    history.forEach(h => {
      if (h.success) {
        xpByAttribute[h.attribute] += h.xp;

        if (h.segment) {
          xpBySegment[h.segment] =
            (xpBySegment[h.segment] || 0) + (h.segmentXP || 0);
        }
      }
    });

    return {
      totalMissions: total,
      successRate,
      xpByAttribute,
      xpBySegment,
    };
  }, [history]);

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
    stats,
    addMission,
    completeMission,
    resetMissions,
  };
}
