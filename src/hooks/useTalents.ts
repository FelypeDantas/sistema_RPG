import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { BASE_TALENTS, BASE_TREE_VERSION } from "@/core/talents/baseTree";

export interface TalentNodeData {
  id: string;
  title: string;
  description: string;
  cost: number;
  progress: number;
  locked: boolean;
  parentId?: string;
  children?: string[];
  unlocksMission?: boolean;
}

interface UseTalentsReturn {
  talents: TalentNodeData[];
  byId: Record<string, TalentNodeData>;
  suggestedTalents: TalentNodeData[];
  points: number;
  unlockTalent: (id: string) => void;
  addCustomTalent: (
    parentId: string,
    title: string,
    description: string,
    cost: number
  ) => void;
  collapsed: Record<string, boolean>;
  toggleCollapse: (id: string) => void;
}

export function useTalents(level: number): UseTalentsReturn {

  const baseTree = BASE_TALENTS;
  const treeVersion = BASE_TREE_VERSION;

  const [playerTalents, setPlayerTalents] =
    useState<Record<string, Partial<TalentNodeData>>>({});

  const [customTalents, setCustomTalents] =
    useState<Record<string, TalentNodeData>>({});

  const [collapsed, setCollapsed] =
    useState<Record<string, boolean>>({});

  const [points, setPoints] = useState(0);

  const isInitialSync = useRef(true);

  /* =============================
     🔄 CARREGAR DO FIREBASE
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    const unsubscribe = onSnapshot(ref, snapshot => {

      const data = snapshot.data() as {
        talents?: Record<string, Partial<TalentNodeData>>;
        customTalents?: Record<string, TalentNodeData>;
        collapsed?: Record<string, boolean>;
        treeVersion?: number;
      };

      setPlayerTalents(data?.talents ?? {});
      setCustomTalents(data?.customTalents ?? {});
      setCollapsed(data?.collapsed ?? {});

      if (data?.treeVersion !== treeVersion) {
        setDoc(ref, { treeVersion }, { merge: true });
      }

      isInitialSync.current = false;
    });

    return unsubscribe;
  }, []);

  /* =============================
     🧬 MERGE BASE + CUSTOM
  ============================= */

  const talentsMap = useMemo(() => {

    const merged: Record<string, TalentNodeData> = {};

    // base
    for (const id in baseTree) {
      merged[id] = {
        ...baseTree[id],
        ...playerTalents[id],
        children: []
      };
    }

    // custom
    for (const id in customTalents) {
      merged[id] = {
        ...customTalents[id],
        children: []
      };
    }

    // reconstruir filhos dinamicamente
    for (const id in merged) {
      const talent = merged[id];
      if (talent.parentId && merged[talent.parentId]) {
        merged[talent.parentId].children!.push(id);
      }
    }

    return merged;

  }, [baseTree, playerTalents, customTalents]);

  const talentList = useMemo(
    () => Object.values(talentsMap),
    [talentsMap]
  );

  /* =============================
     💾 AUTO SAVE
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || isInitialSync.current) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    setDoc(ref, {
      talents: playerTalents,
      customTalents,
      collapsed,
      treeVersion
    }, { merge: true });

  }, [playerTalents, customTalents, collapsed]);

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

    setPlayerTalents(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        locked: false,
        progress: Math.max(prev[id]?.progress ?? 0, 1)
      }
    }));

  }, [points]);

  /* =============================
     🌿 ADD CUSTOM TALENT
  ============================= */

  const addCustomTalent = useCallback((
    parentId: string,
    title: string,
    description: string,
    cost: number
  ) => {

    const id = `custom_${Date.now()}`;

    setCustomTalents(prev => ({
      ...prev,
      [id]: {
        id,
        title,
        description,
        cost,
        progress: 0,
        locked: true,
        parentId
      }
    }));

  }, []);

  /* =============================
     🎯 MISSÕES
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unlocked = talentList
      .filter(t => t.unlocksMission && t.progress >= 100);

    unlocked.forEach(async talent => {
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

      if (!talent.parentId) return false;

      const parent = talentsMap[talent.parentId];
      return parent && !parent.locked;
    });
  }, [talentList, talentsMap]);

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
    addCustomTalent,
    collapsed,
    toggleCollapse
  };
}