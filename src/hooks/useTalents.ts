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

interface PersistedState {
  talents: Record<string, Partial<TalentNodeData>>;
  customTalents: Record<string, TalentNodeData>;
  collapsed: Record<string, boolean>;
  treeVersion: number;
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

  /* =============================
     🌳 BASE
  ============================= */

  const baseTree = BASE_TALENTS;
  const treeVersion = BASE_TREE_VERSION;

  /* =============================
     📦 LOCAL STATE
  ============================= */

  const [persisted, setPersisted] = useState<PersistedState>({
    talents: {},
    customTalents: {},
    collapsed: {},
    treeVersion
  });

  const isInitialSync = useRef(true);

  /* =============================
     🔄 FIREBASE SYNC
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    const unsub = onSnapshot(ref, snapshot => {
      const data = snapshot.data() as Partial<PersistedState> | undefined;

      setPersisted(prev => ({
        talents: data?.talents ?? {},
        customTalents: data?.customTalents ?? {},
        collapsed: data?.collapsed ?? {},
        treeVersion: data?.treeVersion ?? treeVersion
      }));

      if (data?.treeVersion !== treeVersion) {
        setDoc(ref, { treeVersion }, { merge: true });
      }

      isInitialSync.current = false;
    });

    return unsub;
  }, []);

  /* =============================
     💾 AUTO SAVE
  ============================= */

  useEffect(() => {
    if (isInitialSync.current) return;

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    setDoc(ref, persisted, { merge: true });

  }, [persisted]);

  /* =============================
     🧬 MERGE TREE
  ============================= */

  const talentsMap = useMemo(() => {

    const merged: Record<string, TalentNodeData> = {};

    // 1️⃣ Base
    for (const id in baseTree) {
      merged[id] = {
        ...baseTree[id],
        ...persisted.talents[id],
        children: []
      };
    }

    // 2️⃣ Custom
    for (const id in persisted.customTalents) {
      merged[id] = {
        ...persisted.customTalents[id],
        children: []
      };
    }

    // 3️⃣ Reconstruir filhos
    for (const id in merged) {
      const parentId = merged[id].parentId;
      if (parentId && merged[parentId]) {
        merged[parentId].children!.push(id);
      }
    }

    return merged;

  }, [baseTree, persisted]);

  const talentList = useMemo(
    () => Object.values(talentsMap),
    [talentsMap]
  );

  /* =============================
     🎯 POINT SYSTEM
  ============================= */

  const points = useMemo(() => {
    const spent = talentList
      .filter(t => !t.locked)
      .reduce((acc, t) => acc + t.cost, 0);

    const earned = Math.max(level - 1, 0);
    return Math.max(earned - spent, 0);
  }, [level, talentList]);

  /* =============================
     🔓 UNLOCK
  ============================= */

  const unlockTalent = useCallback((id: string) => {
    if (points <= 0) return;

    setPersisted(prev => ({
      ...prev,
      talents: {
        ...prev.talents,
        [id]: {
          ...prev.talents[id],
          locked: false,
          progress: Math.max(
            prev.talents[id]?.progress ?? 0,
            1
          )
        }
      }
    }));
  }, [points]);

  /* =============================
     🌿 ADD CUSTOM
  ============================= */

  const addCustomTalent = useCallback((
    parentId: string,
    title: string,
    description: string,
    cost: number
  ) => {

    const id = `custom_${Date.now()}`;

    setPersisted(prev => ({
      ...prev,
      customTalents: {
        ...prev.customTalents,
        [id]: {
          id,
          title,
          description,
          cost,
          progress: 0,
          locked: true,
          parentId
        }
      }
    }));

  }, []);

  /* =============================
     🎯 MISSIONS
  ============================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const completed = talentList.filter(
      t => t.unlocksMission && t.progress >= 100
    );

    completed.forEach(async talent => {
      const ref = doc(
        db,
        "missions",
        `${user.uid}_${talent.id}`
      );

      await setDoc(ref, {
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

    const totalPower = talentList
      .reduce((acc, t) => acc + t.progress, 0);

    const ref = doc(db, "leaderboard", user.uid);

    updateDoc(ref, { totalPower })
      .catch(() =>
        setDoc(ref, { totalPower })
      );

  }, [talentList]);

  /* =============================
     ⭐ SUGGESTIONS
  ============================= */

  const suggestedTalents = useMemo(() => {
    return talentList.filter(t => {
      if (!t.locked || !t.parentId) return false;
      const parent = talentsMap[t.parentId];
      return parent && !parent.locked;
    });
  }, [talentList, talentsMap]);

  const toggleCollapse = useCallback((id: string) => {
    setPersisted(prev => ({
      ...prev,
      collapsed: {
        ...prev.collapsed,
        [id]: !prev.collapsed[id]
      }
    }));
  }, []);

  return {
    talents: talentList,
    byId: talentsMap,
    suggestedTalents,
    points,
    unlockTalent,
    addCustomTalent,
    collapsed: persisted.collapsed,
    toggleCollapse
  };
}