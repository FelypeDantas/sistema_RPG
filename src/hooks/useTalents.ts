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

const CARD_WIDTH = 220;
const CARD_HEIGHT = 130;
const H_SPACING = 80;
const V_SPACING = 120;

/* ======================================================
   🌳 BUILD TREE STRUCTURE (RECONSTRÓI VIA parentId)
====================================================== */
function buildTreeStructure(
  nodes: Record<string, TalentNodeData>
): Record<string, TalentNodeData & { children: string[] }> {
  const map: Record<string, TalentNodeData & { children: string[] }> = {};

  // clone
  Object.values(nodes).forEach(node => {
    map[node.id] = { ...node, children: [] };
  });

  // rebuild children
  Object.values(map).forEach(node => {
    if (node.parentId && map[node.parentId]) {
      map[node.parentId].children.push(node.id);
    }
  });

  return map;
}

/* ======================================================
   📐 AUTO LAYOUT (NO COLLISION)
====================================================== */
function computeLayout(
  tree: Record<string, TalentNodeData & { children: string[] }>
) {
  const roots = Object.values(tree).filter(n => !n.parentId);

  const levels: Record<number, string[]> = {};

  function traverse(id: string, depth: number) {
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(id);

    tree[id].children.forEach(child =>
      traverse(child, depth + 1)
    );
  }

  roots.forEach(root => traverse(root.id, 0));

  Object.entries(levels).forEach(([depthStr, ids]) => {
    const depth = Number(depthStr);
    const totalWidth =
      (ids.length - 1) * (CARD_WIDTH + H_SPACING);

    ids.forEach((id, index) => {
      tree[id].x =
        index * (CARD_WIDTH + H_SPACING) -
        totalWidth / 2 +
        500;

      tree[id].y =
        depth * (CARD_HEIGHT + V_SPACING) + 100;
    });
  });

  return tree;
}

/* ======================================================
   🧠 HOOK
====================================================== */
export function useTalents(level: number) {
  const treeVersion = BASE_TREE_VERSION;
  const isInitialSync = useRef(true);

  const [persisted, setPersisted] = useState<PersistedState>({
    talents: {},
    customTalents: {},
    collapsed: {},
    treeVersion,
  });

  /* ================= FIREBASE ================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "talents", "state");

    const unsub = onSnapshot(ref, snapshot => {
      const data = snapshot.data();

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

  useEffect(() => {
    if (isInitialSync.current) return;

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "talents", "state");
    setDoc(ref, persisted, { merge: true });
  }, [persisted]);

  /* ================= MERGE ================= */
  const talentsMap = useMemo(() => {
    const merged: Record<string, TalentNodeData> = {};

    // Base
    Object.entries(BASE_TALENTS).forEach(([id, base]) => {
      merged[id] = {
        ...base,
        ...persisted.talents[id],
      };
    });

    // Custom
    Object.entries(persisted.customTalents).forEach(([id, node]) => {
      merged[id] = node;
    });

    const tree = buildTreeStructure(merged);
    return computeLayout(tree);
  }, [persisted]);

  const talentList = useMemo(
    () => Object.values(talentsMap),
    [talentsMap]
  );

  /* ================= POINTS ================= */
  const points = useMemo(() => {
    const spent = talentList
      .filter(t => !t.locked)
      .reduce((acc, t) => acc + t.cost, 0);

    const earned = Math.max(level - 1, 0);

    return Math.max(earned - spent, 0);
  }, [talentList, level]);

  /* ================= ACTIONS ================= */
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
            progress: 1,
          },
        },
      }));
    },
    [points]
  );

  const addCustomTalent = useCallback(
    (parentId: string, title: string, description: string, cost: number) => {
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

      setPersisted(prev => ({
        ...prev,
        customTalents: {
          ...prev.customTalents,
          [id]: newTalent,
        },
      }));
    },
    []
  );

  const toggleCollapse = useCallback((id: string) => {
    setPersisted(prev => ({
      ...prev,
      collapsed: {
        ...prev.collapsed,
        [id]: !prev.collapsed[id],
      },
    }));
  }, []);

  /* ================= SUGGESTIONS ================= */
  const suggestedTalents = useMemo(() => {
    return talentList.filter(t => {
      if (!t.locked || !t.parentId) return false;
      const parent = talentsMap[t.parentId];
      return parent && !parent.locked;
    });
  }, [talentList, talentsMap]);

  return {
    talents: talentList,
    byId: talentsMap,
    suggestedTalents,
    points,
    unlockTalent,
    addCustomTalent,
    collapsed: persisted.collapsed,
    toggleCollapse,
  };
}