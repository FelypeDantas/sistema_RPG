import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { db } from "@/services/firebase";
import { useAuthWithPlayer } from "@/hooks/useAuth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export type MissionAttribute = "Mente" | "Físico" | "Social" | "Finanças";

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  attribute: MissionAttribute;
  completed: boolean;
  done?: boolean;
  segment?: string;
  segmentXP?: number;
}

export interface MissionHistory extends Omit<Mission, "completed"> {
  success: boolean;
  date: string;
}

export function useMissions() {
  const { user } = useAuthWithPlayer();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ==============================
     REALTIME LOAD
  ============================== */
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data()?.missions;

      if (!data) {
        setMissions([]);
        setHistory([]);
        setIsLoaded(true);
        setLoading(false);
        return;
      }

      setMissions(Array.isArray(data.active) ? data.active : []);
      setHistory(Array.isArray(data.history) ? data.history : []);

      setIsLoaded(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  /* ==============================
     SAVE (SAFE + MERGE)
  ============================== */
  const saveToFirestore = useCallback(
    (updatedMissions: Mission[], updatedHistory: MissionHistory[]) => {
      if (!user?.uid || !isLoaded) return;

      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        try {
          const docRef = doc(db, "users", user.uid);

          await setDoc(
            docRef,
            {
              missions: {
                active: updatedMissions,
                history: updatedHistory,
              },
            },
            { merge: true }
          );
        } catch (err) {
          console.error("Erro ao salvar missões:", err);
        }
      }, 400);
    },
    [user?.uid, isLoaded]
  );

  /* ==============================
     ADD
  ============================== */
  const addMission = useCallback(
    (mission: Mission) => {
      setMissions((prev) => {
        const updated = [...prev, { ...mission, id: String(mission.id) }];
        saveToFirestore(updated, history);
        return updated;
      });
    },
    [history, saveToFirestore]
  );

  /* ==============================
     COMPLETE
  ============================== */
  const completeMission = useCallback(
    (missionId: string, success: boolean) => {
      setMissions((prev) => {
        const mission = prev.find((m) => m.id === missionId);
        if (!mission) return prev;

        const updatedMissions = prev.filter((m) => m.id !== missionId);

        const newHistory: MissionHistory[] = [
          ...history,
          {
            ...mission,
            success,
            done: true,
            date: new Date().toISOString(),
          },
        ];

        setHistory(newHistory);
        saveToFirestore(updatedMissions, newHistory);

        return updatedMissions;
      });
    },
    [history, saveToFirestore]
  );

  /* ==============================
     RESET
  ============================== */
  const resetMissions = useCallback(() => {
    setMissions([]);
    setHistory([]);
    saveToFirestore([], []);
  }, [saveToFirestore]);

  /* ==============================
     STATS
  ============================== */
  const stats = useMemo(() => {
    const total = history.length;
    const successes = history.filter((h) => h.success).length;
    const successRate = total ? Math.round((successes / total) * 100) : 0;

    return {
      totalMissions: total,
      successRate,
    };
  }, [history]);

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
