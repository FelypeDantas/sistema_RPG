// src/hooks/useTalents.ts
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { BASE_TALENTS, BASE_TREE_VERSION } from "@/core/talents/baseTree";

/* ======================================================
   🔐 TYPES
====================================================== */

export interface TalentNodeData {
  id: string;
  title: string;
  description: string;
  cost: number;

  progress: number;
  locked: boolean;

  parentId?: string;

  x: number;
  y: number;

  children: string[];

  category?: "soft" | "hard" | "combat" | "intellect";
}

interface PersistedState {
  talents: Record<string, Partial<TalentNodeData>>;
  customTalents?: Record<string, TalentNodeData>;
  collapsed: Record<string, boolean>;
  treeVersion: number;
}

/* ======================================================
   🧱 SAFE DEFAULT NODE
====================================================== */

function createSafeNode(
  id: string,
  data?: Partial<TalentNodeData>
): TalentNodeData {
  return {
    id,
    title: data?.title ?? "Untitled",
    description: data?.description ?? "",
    cost: data?.cost ?? 1,
    progress: data?.progress ?? 0,
    locked: data?.locked ?? true,
    parentId: data?.parentId ?? undefined,
    x: typeof data?.x === "number" ? data.x : 0,
    y: typeof data?.y === "number" ? data.y : 0,
    children: Array.isArray(data?.children)
      ? data!.children
      : [],
    category: data?.category,
  };
}

/* ======================================================
   🌳 BUILD TREE SAFE
====================================================== */

function buildTreeSafe(
  nodes: Record<string, TalentNodeData>
) {
  const map: Record<string, TalentNodeData> = {};

  // clone defensivo
  Object.values(nodes || {}).forEach(n => {
    if (!n?.id) return;
    map[n.id] = {
      ...createSafeNode(n.id, n),
      children: [],
    };
  });

  // reconstruir filhos
  Object.values(map).forEach(n => {
    if (!n.parentId) return;

    const parent = map[n.parentId];
    if (!parent) return; // pai inexistente não quebra

    parent.children.push(n.id);
  });

  // ordem estável
  Object.values(map).forEach(n => {
    n.children = (n.children || []).sort();
  });

  return map;
}

/* ======================================================
   📐 LAYOUT SAFE
====================================================== */

const CARD_W = 220;
const CARD_H = 130;
const H_SPACE = 80;
const V_SPACE = 140;

function computeLayoutSafe(
  tree: Record<string, TalentNodeData>
) {
  if (!tree || Object.keys(tree).length === 0) {
    return {};
  }

  const roots = Object.values(tree).filter(
    n => !n.parentId || !tree[n.parentId]
  );

  const levels: Record<number, string[]> = {};

  const visited = new Set<string>();

  function dfs(id: string, depth: number) {
    if (!tree[id]) return;
    if (visited.has(id)) return; // evita loop infinito

    visited.add(id);

    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(id);

    (tree[id].children || []).forEach(child =>
      dfs(child, depth + 1)
    );
  }

  roots
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(r => dfs(r.id, 0));

  Object.entries(levels).forEach(([depthStr, ids]) => {
    const depth = Number(depthStr);
    const totalWidth =
      Math.max(ids.length - 1, 0) *
      (CARD_W + H_SPACE);

    ids.forEach((id, i) => {
      if (!tree[id]) return;

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
  const readyRef = useRef(false);

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

    const unsub = onSnapshot(
      ref,
      snap => {
        const data = snap.data() || {};

        setPersisted({
          talents:
            typeof data.talents === "object"
              ? data.talents
              : {},
          customTalents:
            typeof data.customTalents === "object"
              ? data.customTalents
              : {},
          collapsed:
            typeof data.collapsed === "object"
              ? data.collapsed
              : {},
          treeVersion:
            data.treeVersion ?? treeVersion,
        });

        readyRef.current = true;
      },
      error => {
        console.error("Talent snapshot error:", error);
      }
    );

    return unsub;
  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {
    if (!readyRef.current) return;

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(
      db,
      "users",
      user.uid,
      "talents",
      "state"
    );

    setDoc(ref, persisted, {
      merge: true,
    }).catch(err =>
      console.error("Talent save error:", err)
    );
  }, [persisted]);

  /* ================= MERGE ================= */

  const talentsMap = useMemo(() => {
    const merged: Record<string, TalentNodeData> =
      {};

    // base
    Object.entries(BASE_TALENTS || {}).forEach(
      ([id, base]) => {
        merged[id] = createSafeNode(id, {
          ...base,
          ...persisted.talents?.[id],
        });
      }
    );

    // custom
    const customTalents: Record<string, TalentNodeData> =
      persisted.customTalents ?? {};

    Object.entries(customTalents).forEach(
      ([id, node]) => {
        if (!node) return;

        merged[id] = createSafeNode(id, node);
      }
    );

    const tree = buildTreeSafe(merged);
    return computeLayoutSafe(tree);
  }, [persisted]);

  const talentList = useMemo(() => {
    return Object.values(talentsMap || {});
  }, [talentsMap]);

  /* ================= POINTS ================= */

  const points = useMemo(() => {
    const spent = (talentList || [])
      .filter(t => !t?.locked)
      .reduce(
        (acc, t) => acc + (t?.cost ?? 0),
        0
      );

    const earned = Math.max(level - 1, 0);

    return Math.max(earned - spent, 0);
  }, [talentList, level]);

  /* ================= ACTIONS ================= */

  const unlockTalent = useCallback(
    (id: string) => {
      if (!id || points <= 0) return;

      setPersisted(prev => ({
        ...prev,
        talents: {
          ...prev.talents,
          [id]: {
            ...prev.talents?.[id],
            locked: false,
            progress: 1,
          },
        },
      }));
    },
    [points]
  );

  const trainTalent = useCallback((id: string) => {
    if (!id) return;

    setPersisted(prev => {
      const current = prev.talents?.[id];

      if (!current || current.locked) return prev;

      const nextProgress = Math.min(
        (current.progress ?? 0) + 1,
        100
      );

      return {
        ...prev,
        talents: {
          ...prev.talents,
          [id]: {
            ...current,
            progress: nextProgress
          }
        }
      };
    });
  }, []);

  const addCustomTalent = useCallback(
    (
      parentId: string,
      title: string,
      description: string,
      cost: number
    ) => {
      if (!parentId) return;

      const id = `custom_${Date.now()}`;

      setPersisted(prev => ({
        ...prev,
        customTalents: {
          ...prev.customTalents,
          [id]: createSafeNode(id, {
            parentId,
            title,
            description,
            cost,
          }),
        },
      }));
    },
    []
  );

  const toggleCollapse = useCallback(
    (id: string) => {
      if (!id) return;

      setPersisted(prev => ({
        ...prev,
        collapsed: {
          ...prev.collapsed,
          [id]: !prev.collapsed?.[id],
        },
      }));
    },
    []
  );

  return {
    talents: Array.isArray(talentList) ? talentList : [],
    byId: talentsMap && typeof talentsMap === "object" ? talentsMap : {},
    points: points ?? 0,
    unlockTalent,
    addCustomTalent,
    collapsed:
      persisted?.collapsed &&
        typeof persisted.collapsed === "object"
        ? persisted.collapsed
        : {},
    toggleCollapse,
    trainTalent
  };
}