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
  done?: boolean;        // boolean
  segment?: string;
  segmentXP?: number;
}

export interface MissionHistory extends Omit<Mission, "completed"> {
  success: boolean;       // boolean
  date: string;
}

export function useMissions() {
  const { user } = useAuthWithPlayer();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  /* ==============================
     FETCH FIRESTORE
  ============================== */
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

          setMissions(Array.isArray(data.missions)
            ? data.missions.map(m => ({
                ...m,
                id: String(m.id),
                segment: m.segment ? String(m.segment) : undefined,
                done: Boolean(m.done),
                completed: Boolean(m.completed)
              }))
            : []
          );

          setHistory(Array.isArray(data.history)
            ? data.history.map(h => ({
                ...h,
                id: String(h.id),
                segment: h.segment ? String(h.segment) : undefined,
                success: Boolean(h.success),
                done: Boolean(h.done)
              }))
            : []
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [user?.uid]);

  /* ==============================
     SAVE FIRESTORE (DEBOUNCE)
  ============================== */
  const saveToFirestore = useCallback(() => {
    let timeout: NodeJS.Timeout | null = null;

    return (updatedMissions: Mission[], updatedHistory: MissionHistory[]) => {
      if (!user?.uid) return;

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, {
            missions: updatedMissions.map(m => ({
              ...m,
              id: String(m.id),
              segment: m.segment ? String(m.segment) : undefined,
              done: Boolean(m.done),
              completed: Boolean(m.completed)
            })),
            history: updatedHistory.map(h => ({
              ...h,
              id: String(h.id),
              segment: h.segment ? String(h.segment) : undefined,
              success: Boolean(h.success),
              done: Boolean(h.done)
            })),
          }, { merge: true });
        } catch (err) {
          console.error("Erro ao salvar no Firestore:", err);
        }
      }, 500);
    };
  }, [user?.uid])();

  /* ==============================
     ADD MISSION
  ============================== */
  const addMission = useCallback(
    (mission: Mission) => {
      setMissions(prev => {
        const newMissions = [...prev, {
          ...mission,
          id: String(mission.id),
          segment: mission.segment ? String(mission.segment) : undefined,
          done: Boolean(mission.done),
          completed: Boolean(mission.completed)
        }];
        saveToFirestore(newMissions, history);
        return newMissions;
      });
    },
    [history, saveToFirestore]
  );

  /* ==============================
     COMPLETE MISSION
  ============================== */
  const completeMission = useCallback(
    (missionId: string, success: boolean) => {
      setMissions(prevMissions => {
        const mission = prevMissions.find(m => m.id === missionId);
        if (!mission) return prevMissions;

        const newMissions = prevMissions.filter(m => m.id !== missionId);

        setHistory(prevHistory => {
          const newHistory: MissionHistory[] = [
            ...prevHistory,
            {
              ...mission,
              id: String(mission.id),
              segment: mission.segment ? String(mission.segment) : undefined,
              success: Boolean(success),
              done: true,
              date: new Date().toISOString()
            }
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          saveToFirestore(newMissions, newHistory);
          return newHistory;
        });

        return newMissions;
      });
    },
    [saveToFirestore]
  );

  /* ==============================
     STATS
  ============================== */
  const stats = useMemo(() => {
    const total = history.length;
    const successes = history.filter(h => h.success).length;
    const successRate = total ? Math.round((successes / total) * 100) : 0;

    const xpByAttribute: Record<MissionAttribute, number> = { Mente: 0, Físico: 0, Social: 0, Finanças: 0 };
    const xpBySegment: Record<string, number> = {};

    history.forEach(h => {
      if (h.success) {
        xpByAttribute[h.attribute] += h.xp;
        if (h.segment) xpBySegment[String(h.segment)] = (xpBySegment[String(h.segment)] || 0) + (h.segmentXP || 0);
      }
    });

    return { totalMissions: total, successRate, xpByAttribute, xpBySegment };
  }, [history]);

  /* ==============================
     RESET
  ============================== */
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
