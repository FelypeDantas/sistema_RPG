import { useEffect, useMemo, useState } from "react";
import { db } from "@/services/firebase";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ============================= */
/* 🎯 TIPOS                     */
/* ============================= */

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

/* ============================= */
/* 🧠 HOOK PRINCIPAL             */
/* ============================= */

export function useMissions() {
  const { user } = useAuth();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================= */
  /* ☁️ CARREGAR DADOS INICIAIS    */
  /* ============================= */

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setMissions(data.missions || []);
          setHistory(data.history || []);
        } else {
          // inicializa dados do usuário
          await setDoc(docRef, { missions: [], history: [] });
          setMissions([]);
          setHistory([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  /* ============================= */
  /* 🔄 FUNÇÃO DE SALVAR NO FIREBASE */
  /* ============================= */

  const saveToFirestore = async (updatedMissions: Mission[], updatedHistory: MissionHistory[]) => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { missions: updatedMissions, history: updatedHistory }, { merge: true });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  /* ============================= */
  /* 🌅 MISSÃO DIÁRIA              */
  /* ============================= */

  useEffect(() => {
    if (!user || loading) return;

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

    addMission(dailyMission);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]); // dispara apenas após carregar dados

  /* ============================= */
  /* ➕ ADD MISSÃO                  */
  /* ============================= */

  const addMission = (mission: Mission) => {
    setMissions(prevMissions => {
      const newMissions = [...prevMissions, mission];
      saveToFirestore(newMissions, history); // usa estado atualizado
      return newMissions;
    });
  };

  /* ============================= */
  /* ✅ COMPLETAR MISSÃO            */
  /* ============================= */

  const completeMission = (missionId: string, success: boolean) => {
    setMissions(prevMissions => {
      const mission = prevMissions.find(m => m.id === missionId);
      if (!mission) return prevMissions;

      const newMissions = prevMissions.filter(m => m.id !== missionId);

      setHistory(prevHistory => {
        const newHistory: MissionHistory[] = [
          ...prevHistory,
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
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        saveToFirestore(newMissions, newHistory); // salva arrays atualizados
        return newHistory;
      });

      return newMissions;
    });
  };

  /* ============================= */
  /* 📊 ESTATÍSTICAS               */
  /* ============================= */

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

    return { totalMissions: total, successRate, xpByAttribute, xpBySegment };
  }, [history]);

  /* ============================= */
  /* 🔄 RESETAR MISSÕES             */
  /* ============================= */

  const resetMissions = () => {
    setMissions([]);
    setHistory([]);
    saveToFirestore([], []);
  };

  /* ============================= */
  /* 📦 EXPORT                     */
  /* ============================= */

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
