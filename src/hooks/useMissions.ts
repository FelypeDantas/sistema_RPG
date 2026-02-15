import { useEffect, useState, useMemo } from "react";
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
  date: string; // ISO string
  segment?: string;
  segmentXP?: number;
}

export interface PlayerData {
  level: number;
  xp: number;
  attributes: Record<MissionAttribute, number>;
  segments: Record<string, number>;
  talents: { id: string; unlocked: boolean; effect?: { segmentBonus?: Record<string, number> } }[];
  traits: { id: string; name: string; description: string }[];
}

/* =============================
   🧠 HOOK INTEGRADO
============================= */

export function useLifeRPG() {
  const { user } = useAuth();

  // ---------------- Player ----------------
  const [player, setPlayer] = useState<PlayerData>({
    level: 1,
    xp: 0,
    attributes: { Físico: 10, Mente: 10, Social: 10, Finanças: 10 },
    segments: { forca: 10, foco: 20 },
    talents: [
      { id: "focus", unlocked: true, effect: { segmentBonus: { foco: 1.2 } } },
      { id: "physical_mastery", unlocked: false, effect: { segmentBonus: { forca: 1.15, resistencia: 1.1 } } }
    ],
    traits: [{ id: "disciplinado", name: "Disciplinado", description: "Ganha mais XP ao manter streaks" }]
  });

  const nextLevelXP = Math.floor(100 + player.xp * 0.9);

  // ---------------- Missions ----------------
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<MissionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  /* =============================
     ☁️ CARREGAR DADOS FIRESTORE
  ============================= */
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          // Validar e carregar dados
          setMissions(Array.isArray(data.missions) ? data.missions : []);
          setHistory(Array.isArray(data.history) ? data.history : []);
          if (data.player) {
            setPlayer(prev => ({
              ...prev,
              ...data.player,
              attributes: { ...prev.attributes, ...(data.player.attributes || {}) },
              segments: { ...prev.segments, ...(data.player.segments || {}) },
            }));
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.uid]);

  /* ==============================
     🌅 MISSÃO DIÁRIA
  ============================== */
  useEffect(() => {
    if (!user?.uid) return;

    const today = new Date().toISOString().split("T")[0];
    const dailyId = `daily-${today}`;

    const alreadyExists =
      missions.some(m => m.id === dailyId) ||
      history.some(h => h.id === dailyId);

    if (alreadyExists) return;

    const dailyMission: Mission = {
      id: dailyId,
      title: "Treino diário",
      description: "100 agachamentos, 20 flexões e 10 minutos de meditação",
      xp: 50,
      attribute: "Físico",
      completed: false,
    };

    addMission(dailyMission);
  }, [user?.uid, missions, history]);

  /* =============================
     💾 SALVAR NO FIRESTORE
  ============================= */
  const saveToFirestore = async (updatedMissions: Mission[], updatedHistory: MissionHistory[], updatedPlayer?: PlayerData) => {
    if (!user?.uid) return;

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        missions: updatedMissions.map(m => ({ ...m })),
        history: updatedHistory.map(h => ({ ...h })),
        player: updatedPlayer ? { ...updatedPlayer } : player
      }, { merge: true });
    } catch (err) {
      console.error("Erro ao salvar Firestore:", err);
    }
  };

  /* =============================
     ➕ ADD MISSÃO
  ============================= */
  const addMission = (mission: Mission) => {
    setMissions(prev => {
      const newMissions = [...prev, mission];
      saveToFirestore(newMissions, history);
      return newMissions;
    });
  };

  /* =============================
     ✅ CONCLUIR MISSÃO
  ============================= */
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
          }
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Atualizar XP do player
        if (success) {
          gainXP(mission.xp, mission.attribute);
        }

        saveToFirestore(newMissions, newHistory);
        return newHistory;
      });

      return newMissions;
    });
  };

  /* =============================
     ⭐ XP E ATRIBUTOS
  ============================= */
  const gainXP = (amount: number, attribute?: MissionAttribute) => {
    setPlayer(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;

      if (newXP >= nextLevelXP) {
        newXP -= nextLevelXP;
        newLevel += 1;
      }

      const newAttributes = attribute
        ? { ...prev.attributes, [attribute]: prev.attributes[attribute] + 1 }
        : { ...prev.attributes };

      return { ...prev, xp: newXP, level: newLevel, attributes: newAttributes };
    });
  };

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

    return { totalMissions: total, successRate, xpByAttribute, xpBySegment };
  }, [history]);

  /* =============================
     🔄 RESET COMPLETO
  ============================= */
  const resetAll = () => {
    setMissions([]);
    setHistory([]);
    setPlayer(prev => ({ ...prev, level: 1, xp: 0, attributes: { Físico: 10, Mente: 10, Social: 10, Finanças: 10 } }));
    saveToFirestore([], []);
  };

  return {
    player,
    missions,
    history,
    stats,
    loading,
    addMission,
    completeMission,
    gainXP,
    resetAll
  };
}
