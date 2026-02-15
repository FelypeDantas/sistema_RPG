import { useEffect, useMemo, useState } from "react";
import { db } from "@/services/firebase";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
   🧠 HOOK
============================= */

export function useMissions() {
  const { user } = useAuth();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  /* =============================
     ☁️ CARREGAR DADOS DO FIRESTORE
  ============================= */

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setMissions(data.missions || []);
          setHistory(data.history || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  /* =============================
     ➕ ADICIONAR MISSÃO
     - qualquer missão (diária ou do form)
     - salva no Firestore imediatamente
  ============================= */

  async function addMission(mission: Mission) {
    setMissions(prev => {
      const newMissions = [...prev, mission];
      saveToFirestore(newMissions, history);
      return newMissions;
    });
  }

  /* =============================
     ✅ CONCLUIR MISSÃO
     - remove do dashboard
     - adiciona no histórico
     - salva no Firestore imediatamente
  ============================= */

  async function completeMission(missionId: string, success: boolean) {
    setMissions(prev => prev.filter(m => m.id !== missionId));

    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    setHistory(prev => {
      const newHistory = [
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
      ].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      saveToFirestore(
        missions.filter(m => m.id !== missionId),
        newHistory
      );

      return newHistory;
    });
  }

  /* =============================
     ☁️ SALVAR NO FIRESTORE
  ============================= */

  async function saveToFirestore(currentMissions: Mission[], currentHistory: MissionHistory[]) {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { missions: currentMissions, history: currentHistory }, { merge: true });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  }

  /* =============================
     🌅 ADICIONAR MISSÃO DIÁRIA AUTOMÁTICA
     - só adiciona se ainda não existir
  ============================= */

  useEffect(() => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const alreadyExists = missions.some(m => m.id === `daily-${today}`);
    if (alreadyExists) return;

    const dailyMission: Mission = {
      id: `daily-${today}`,
      title: "Treino diário",
      description: "100 agachamentos, 20 flexões e 10 minutos de meditação",
      xp: 50,
      attribute: "Físico",
      completed: false,
    };

    addMission(dailyMission); // ✅ usa addMission para persistência
  }, [user, missions]);

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
          xpBySegment[h.segment] = (xpBySegment[h.segment] || 0) + (h.segmentXP || 0);
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
     🔄 RESETAR MISSÕES
  ============================= */

  function resetMissions() {
    setMissions([]);
    setHistory([]);
    saveToFirestore([], []);
  }

  /* =============================
     📦 EXPORT
  ============================= */

  return {
    missions,
    history,
    stats,
    loading,
    addMission,
    completeMission,
    resetMissions,
  };
}
