import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "@/services/firebase";
import { useAuthWithPlayer } from "@/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

export interface MissionHistory extends Omit<Mission, "completed"> {
  success: boolean;
  date: string;
}

const DAILY_MISSION_TEMPLATE: Omit<Mission, "id" | "completed"> = {
  title: "Treino diário",
  description: "100 agachamentos, 20 flexões e 10 minutos de meditação",
  xp: 50,
  attribute: "Físico",
};

export function useMissions() {
  const { user } = useAuthWithPlayer();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Fetch de dados do Firestore
  // ==============================
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadData() {
      try {
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);

        if (!isMounted) return;

        if (snapshot.exists()) {
          const data = snapshot.data() as { missions?: Mission[]; history?: MissionHistory[] };
          setMissions(Array.isArray(data.missions) ? data.missions : []);
          setHistory(Array.isArray(data.history) ? data.history : []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // ==============================
  // Salvar no Firestore com debounce
  // ==============================
  const saveToFirestore = useCallback(
    (() => {
      let timeout: NodeJS.Timeout | null = null;

      return (updatedMissions: Mission[], updatedHistory: MissionHistory[]) => {
        if (!user?.uid) return;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
          try {
            const docRef = doc(db, "users", user.uid);
            await setDoc(
              docRef,
              { missions: updatedMissions, history: updatedHistory },
              { merge: true }
            );
          } catch (err) {
            console.error("Erro ao salvar no Firestore:", err);
          }
        }, 500); // debounce 500ms
      };
    })(),
    [user?.uid]
  );

  // ==============================
  // Missão diária
  // ==============================
  useEffect(() => {
    if (!user?.uid) return;

    const today = new Date().toISOString().split("T")[0];
    const dailyId = `daily-${today}`;

    const exists = missions.some(m => m.id === dailyId) || history.some(h => h.id === dailyId);
    if (exists) return;

    const dailyMission: Mission = { ...DAILY_MISSION_TEMPLATE, id: dailyId, completed: false };
    addMission(dailyMission);
  }, [user?.uid, missions, history]);

  // ==============================
  // Add mission
  // ==============================
  const addMission = useCallback(
    (mission: Mission) => {
      setMissions(prev => {
        const newMissions = [...prev, mission];
        saveToFirestore(newMissions, history);
        return newMissions;
      });
    },
    [history, saveToFirestore]
  );

  // ==============================
  // Complete mission
  // ==============================
  const completeMission = useCallback(
    (missionId: string, success: boolean) => {
      setMissions(prevMissions => {
        const mission = prevMissions.find(m => m.id === missionId);
        if (!mission) return prevMissions;

        const newMissions = prevMissions.filter(m => m.id !== missionId);

        setHistory(prevHistory => {
          const newHistory: MissionHistory[] = [
            ...prevHistory,
            { ...mission, success, completed: true, date: new Date().toISOString() },
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          saveToFirestore(newMissions, newHistory);
          return newHistory;
        });

        return newMissions;
      });
    },
    [saveToFirestore]
  );

  // ==============================
  // Estatísticas
  // ==============================
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
        if (h.segment) xpBySegment[h.segment] = (xpBySegment[h.segment] || 0) + (h.segmentXP || 0);
      }
    });

    return { totalMissions: total, successRate, xpByAttribute, xpBySegment };
  }, [history]);

  // ==============================
  // Reset
  // ==============================
  const resetMissions = useCallback(() => {
    setMissions([]);
    setHistory([]);
    saveToFirestore([], []);
  }, [saveToFirestore]);

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
