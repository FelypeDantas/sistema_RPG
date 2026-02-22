// src/hooks/useTalents.ts
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { BASE_TALENTS, BASE_TREE_VERSION } from "@/core/talents/baseTree";
import { Talent } from "@/types/Talents";

interface PlayerTalent extends Talent {
  progress: number;
}

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

  x: number;
  y: number;
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
  trainTalent: (id: string) => void;
}

export function useTalents(level: number): UseTalentsReturn {
  const baseTree = BASE_TALENTS;
  const treeVersion = BASE_TREE_VERSION;

  const [persisted, setPersisted] = useState<PersistedState>({
    talents: {},
    customTalents: {},
    collapsed: {},
    treeVersion,
  });

  const [playerTalents, setPlayerTalents] = useState<Record<string, PlayerTalent>>({});
  const isInitialSync = useRef(true);

  /* =============================
     🧬 TRAIN TALENT
  ============================= */
  const trainTalent = useCallback((id: string) => {
    setPlayerTalents(prev => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          progress: Math.min((prev[id]?.progress ?? 0) + 2, 100)
        }
      };
      localStorage.setItem('playerTalents', JSON.stringify(updated));
      return updated;
    });
  }, []);

  /* =============================
     🔄 FIREBASE SYNC
  ============================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    const unsub = onSnapshot(ref, snapshot => {
      const data = snapshot.data() as Partial<PersistedState> | undefined;

      setPersisted({
        talents: data?.talents ?? {},
        customTalents: data?.customTalents ?? {},
        collapsed: data?.collapsed ?? {},
        treeVersion: data?.treeVersion ?? treeVersion,
      });

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

    for (const id in baseTree) {
      merged[id] = {
        ...baseTree[id],
        ...persisted.talents[id],
        children: [],
      };
    }

    for (const id in persisted.customTalents) {
      merged[id] = {
        ...persisted.customTalents[id],
        children: [],
      };
    }

    const roots = Object.values(merged).filter(t => !t.parentId);
    const levelMap: Record<number, TalentNodeData[]> = {};

    function traverse(node: TalentNodeData, depth = 0) {
      if (!levelMap[depth]) levelMap[depth] = [];
      levelMap[depth].push(node);

      node.children?.forEach(childId => {
        const child = merged[childId];
        if (child) traverse(child, depth + 1);
      });
    }

    roots.forEach(root => traverse(root));

    const verticalSpacing = 140;
    const horizontalSpacing = 200;

    Object.entries(levelMap).forEach(([depthStr, nodes]) => {
      const depth = Number(depthStr);
      const totalWidth = (nodes.length - 1) * horizontalSpacing;

      nodes.forEach((node, index) => {
        node.x = index * horizontalSpacing - totalWidth / 2 + 400;
        node.y = depth * verticalSpacing + 100;
      });
    });

    return merged;
  }, [baseTree, persisted]);

  const talentList = useMemo(() => Object.values(talentsMap), [talentsMap]);

  /* =============================
     🎯 POINT SYSTEM
  ============================= */
  const points = useMemo(() => {
    const spent = talentList.filter(t => !t.locked).reduce((acc, t) => acc + t.cost, 0);
    const earned = Math.max(level - 1, 0);
    return Math.max(earned - spent, 0);
  }, [level, talentList]);

  /* =============================
     🔓 UNLOCK
  ============================= */
  const unlockTalent = useCallback(
    (id: string) => {
      if (points <= 0) return;

      setPersisted(prev => ({
        ...prev,
        talents: {
          ...prev.talents,
          [id]: {
            ...prev.talents[id],
            locked: false,
            progress: Math.max(prev.talents[id]?.progress ?? 0, 1),
          },
        },
      }));
    },
    [points]
  );

  /* =============================
     🌿 ADD CUSTOM + SAVE NO FIREBASE
  ============================= */
  const addCustomTalent = useCallback(
    async (parentId: string, title: string, description: string, cost: number) => {
      const id = `custom_${Date.now()}`;
      const newTalent: TalentNodeData = {
        id,
        title,
        description,
        cost,
        progress: 0,
        locked: true,
        parentId,
        x: 0,
        y: 0,
      };

      // Atualiza local state
      setPersisted(prev => ({
        ...prev,
        customTalents: {
          ...prev.customTalents,
          [id]: newTalent,
        },
      }));

      // Salva direto no Firebase
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "users", user.uid, "talents", "state");
      await setDoc(ref, { customTalents: { [id]: newTalent } }, { merge: true });
    },
    []
  );

  /* =============================
     🎯 MISSIONS
  ============================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const completed = talentList.filter(t => t.unlocksMission && t.progress >= 100);

    completed.forEach(async talent => {
      const ref = doc(db, "missions", `${user.uid}_${talent.id}`);
      await setDoc(
        ref,
        { title: `Missão desbloqueada: ${talent.title}`, unlockedAt: new Date(), completed: false },
        { merge: true }
      );
    });
  }, [talentList]);

  /* =============================
     🏆 LEADERBOARD
  ============================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const totalPower = talentList.reduce((acc, t) => acc + t.progress, 0);
    const ref = doc(db, "leaderboard", user.uid);

    updateDoc(ref, { totalPower }).catch(() => setDoc(ref, { totalPower }));
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
        [id]: !prev.collapsed[id],
      },
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
    toggleCollapse,
    trainTalent,
  };
}