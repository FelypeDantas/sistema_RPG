// src/hooks/useTalents.ts
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { BASE_TALENTS, BASE_TREE_VERSION } from "@/core/talents/baseTree";
import { Talent } from "@/types/Talents";

export interface TalentNodeData extends Talent {
  progress: number;
  locked: boolean;
  parentId?: string;
  x: number;
  y: number;
}

interface PersistedState {
  talents: Record<string, Partial<TalentNodeData>>;
  customTalents: Record<string, TalentNodeData>;
  collapsed: Record<string, boolean>;
  treeVersion: number;
}

/* ======================================================
   🌳 BUILD TREE
====================================================== */
function buildTree(
  nodes: Record<string, TalentNodeData>
) {
  const map: Record<
    string,
    TalentNodeData & { children: string[] }
  > = {};

  // clone
  Object.values(nodes).forEach(n => {
    map[n.id] = { ...n, children: [] };
  });

  // rebuild children
  Object.values(map).forEach(n => {
    if (n.parentId && map[n.parentId]) {
      map[n.parentId].children.push(n.id);
    }
  });

  // garantir ordem estável
  Object.values(map).forEach(n => {
    n.children.sort();
  });

  return map;
}

/* ======================================================
   📐 LAYOUT ESTÁVEL SEM COLISÃO
====================================================== */
const CARD_W = 220;
const CARD_H = 130;
const H_SPACE = 80;
const V_SPACE = 140;

function computeLayout(
  tree: Record<string, TalentNodeData & { children: string[] }>
) {
  const roots = Object.values(tree).filter(n => !n.parentId);

  const levels: Record<number, string[]> = {};

  function dfs(id: string, depth: number) {
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(id);

    tree[id].children.forEach(child =>
      dfs(child, depth + 1)
    );
  }

  roots.sort((a, b) => a.id.localeCompare(b.id));
  roots.forEach(r => dfs(r.id, 0));

  Object.entries(levels).forEach(([depthStr, ids]) => {
    const depth = Number(depthStr);

    const totalWidth =
      (ids.length - 1) * (CARD_W + H_SPACE);

    ids.forEach((id, i) => {
      tree[id].x =
        i * (CARD_W + H_SPACE) -
        totalWidth / 2 +
        800;

      tree[id].y =
        depth * (CARD_H + V_SPACE) + 150;
    });
  });

  return tree;
}

/* ======================================================
   🧠 HOOK
====================================================== */
export function useTalents(level: number) {
  const treeVersion = BASE_TREE_VERSION;
  const isReady = useRef(false);

  const [persisted, setPersisted] =
    useState<PersistedState>({
      talents: {},
      customTalents: {},
      collapsed: {},
      treeVersion,
    });

  /* ================= FIREBASE ================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(
      db,
      "users",
      user.uid,
      "talents",
      "state"
    );

    const unsub = onSnapshot(ref, snap => {
      const data = snap.data();

      setPersisted({
        talents: data?.talents ?? {},
        customTalents: data?.customTalents ?? {},
        collapsed: data?.collapsed ?? {},
        treeVersion:
          data?.treeVersion ?? treeVersion,
      });

      isReady.current = true;
    });

    return unsub;
  }, []);

  /* ================= SAVE ================= */
  useEffect(() => {
    if (!isReady.current) return;

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(
      db,
      "users",
      user.uid,
      "talents",
      "state"
    );

    setDoc(ref, persisted, { merge: true });
  }, [persisted]);

  /* ================= MERGE + TREE ================= */
  const talentsMap = useMemo(() => {
    const merged: Record<
      string,
      TalentNodeData
    > = {};

    // base
    Object.entries(BASE_TALENTS).forEach(
      ([id, base]) => {
        merged[id] = {
          ...base,
          locked:
            persisted.talents[id]?.locked ??
            base.locked,
          progress:
            persisted.talents[id]?.progress ??
            0,
        };
      }
    );

    // custom
    Object.entries(
      persisted.customTalents
    ).forEach(([id, node]) => {
      merged[id] = node;
    });

    const tree = buildTree(merged);
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
      .reduce((a, t) => a + t.cost, 0);

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
    (
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
            parentId,
            x: 0,
            y: 0,
          },
        },
      }));
    },
    []
  );

  const toggleCollapse = useCallback(
    (id: string) => {
      setPersisted(prev => ({
        ...prev,
        collapsed: {
          ...prev.collapsed,
          [id]: !prev.collapsed[id],
        },
      }));
    },
    []
  );

  return {
    talents: talentList,
    byId: talentsMap,
    points,
    unlockTalent,
    addCustomTalent,
    collapsed: persisted.collapsed,
    toggleCollapse,
  };
}