import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { BASE_TALENTS, BASE_TREE_VERSION } from "@/core/talents/baseTree";

export function useTalents(level: number): UseTalentsReturn {

  /* =============================
     🌳 ÁRVORE BASE (CÓDIGO)
  ============================= */

  const baseTree = BASE_TALENTS;
  const treeVersion = BASE_TREE_VERSION;

  /* =============================
     👤 ESTADO DO JOGADOR
  ============================= */

  const [talentsMap, setTalentsMap] =
    useState<Record<string, TalentNodeData>>(baseTree);

  const [collapsed, setCollapsed] =
    useState<Record<string, boolean>>({});

  const [points, setPoints] = useState(0);

  const isInitialSync = useRef(true);

  /* =============================
     🔄 SINCRONIZAR PROGRESSO
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    const unsubscribe = onSnapshot(ref, snapshot => {

      const data = snapshot.data() as {
        talents?: Partial<Record<string, Partial<TalentNodeData>>>;
        collapsed?: Record<string, boolean>;
        treeVersion?: number;
      };

      const merged: Record<string, TalentNodeData> = {};

      for (const id in baseTree) {
        merged[id] = {
          ...baseTree[id],
          ...data?.talents?.[id]
        };
      }

      setTalentsMap(merged);
      setCollapsed(data?.collapsed ?? {});

      // 🔥 Atualiza versão caso mude no código futuramente
      if (data?.treeVersion !== treeVersion) {
        setDoc(ref, { treeVersion }, { merge: true });
      }

      isInitialSync.current = false;
    });

    return unsubscribe;

  }, []);

  /* =============================
     💾 AUTO SAVE
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || isInitialSync.current) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    setDoc(ref, {
      talents: talentsMap,
      collapsed,
      treeVersion
    }, { merge: true });

  }, [talentsMap, collapsed]);

  /* =============================
     📋 LISTA TIPADA
  ============================= */

  const talentList = useMemo<TalentNodeData[]>(
    () => Object.values(talentsMap),
    [talentsMap]
  );

  /* =============================
     🔢 CÁLCULO DE PONTOS
  ============================= */

  useEffect(() => {
    const spentPoints = talentList
      .filter(t => !t.locked)
      .reduce((acc, t) => acc + t.cost, 0);

    const totalEarnedPoints = Math.max(level - 1, 0);

    setPoints(Math.max(totalEarnedPoints - spentPoints, 0));

  }, [level, talentList]);

  /* =============================
     🔓 UNLOCK
  ============================= */

  const unlockTalent = useCallback((id: string) => {
    if (points <= 0) return;

    setTalentsMap(prev => {
      const talent = prev[id];
      if (!talent || !talent.locked) return prev;

      return {
        ...prev,
        [id]: {
          ...talent,
          locked: false,
          progress: Math.max(talent.progress, 1)
        }
      };
    });
  }, [points]);

  /* =============================
     🎯 MISSÕES AUTOMÁTICAS
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unlockedMissions = talentList
      .filter(t => t.unlocksMission && t.progress >= 100);

    unlockedMissions.forEach(async talent => {
      const missionRef =
        doc(db, "missions", `${user.uid}_${talent.id}`);

      await setDoc(missionRef, {
        title: `Missão desbloqueada: ${talent.title}`,
        unlockedAt: new Date(),
        completed: false
      }, { merge: true });
    });

  }, [talentList]);

  /* =============================
     🏆 LEADERBOARD
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const totalPower =
      talentList.reduce((acc, t) => acc + t.progress, 0);

    const leaderboardRef =
      doc(db, "leaderboard", user.uid);

    updateDoc(leaderboardRef, { totalPower })
      .catch(() =>
        setDoc(leaderboardRef, { totalPower })
      );

  }, [talentList]);

  /* =============================
     ⭐ SUGERIDOS
  ============================= */

  const suggestedTalents = useMemo(() => {
    return talentList.filter(talent => {
      if (!talent.locked) return false;

      const parents = talentList.filter(parent =>
        parent.children?.includes(talent.id)
      );

      return parents.some(parent => !parent.locked);
    });
  }, [talentList]);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  return {
    talents: talentList,
    byId: talentsMap,
    suggestedTalents,
    points,
    unlockTalent,
    collapsed,
    toggleCollapse
  };
}