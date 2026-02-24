import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { db } from "@/services/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

/* ==============================
   TYPES
============================== */

export type PlayerClass =
  | "warrior"
  | "scholar"
  | "strategist"
  | "merchant";

export type TraitId =
  | "disciplinado"
  | "impulsivo"
  | "persistente"
  | "econômico";

export interface Trait {
  id: TraitId;
  name: string;
  description: string;
}

export type TalentId = "focus" | "physical_mastery";

interface TalentEffect {
  segmentBonus?: Record<string, number>;
}

export interface Talent {
  id: TalentId;
  unlocked: boolean;
  effect?: TalentEffect;
}

/* ==============================
   CONSTANTS
============================== */

const DEFAULT_ATTRIBUTES = {
  Físico: 10,
  Mente: 10,
  Social: 10,
  Finanças: 10,
};

const DEFAULT_SEGMENTS: Record<string, number> = {
  forca: 10,
  foco: 20,
};

const DEFAULT_TALENTS: Talent[] = [
  {
    id: "focus",
    unlocked: true,
    effect: { segmentBonus: { foco: 1.2 } },
  },
  {
    id: "physical_mastery",
    unlocked: false,
    effect: { segmentBonus: { forca: 1.15 } },
  },
];

/* ==============================
   HOOK
============================== */

export function usePlayerRealtime(userId?: string) {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [avatarName, setAvatarName] = useState<string | null>(null);
  const [playerClass, setPlayerClass] =
    useState<PlayerClass>("warrior");
  const [attributes, setAttributes] =
    useState(DEFAULT_ATTRIBUTES);
  const [segments, setSegments] =
    useState(DEFAULT_SEGMENTS);
  const [talents, setTalents] =
    useState<Talent[]>(DEFAULT_TALENTS);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const undoStack = useRef<
    Array<{ xp: number; level: number; attributes: typeof attributes }>
  >([]);

  /* ==============================
     XP FORMULA
  ============================== */

  const nextLevelXP = useCallback(
    (lvl: number) =>
      Math.floor(100 * Math.pow(1.15, lvl - 1)),
    []
  );

  const xpToNextLevel = useMemo(
    () => nextLevelXP(level),
    [level, nextLevelXP]
  );

  const levelProgress = useMemo(
    () => Math.min(100, (xp / xpToNextLevel) * 100),
    [xp, xpToNextLevel]
  );

  /* ==============================
     REALTIME SYNC
  ============================== */

  useEffect(() => {
    if (!userId) return;

    const docRef = doc(db, "users", userId);

    const unsub = onSnapshot(docRef, snap => {
      const data = snap.data()?.player;
      if (!data) {
        setIsLoaded(true);
        return;
      }

      setLevel(data.level ?? 1);
      setXP(data.xp ?? 0);
      setAvatarName(data.avatarName ?? null);
      setAttributes(data.attributes ?? DEFAULT_ATTRIBUTES);
      setSegments(data.segments ?? DEFAULT_SEGMENTS);
      setTalents(data.talents ?? DEFAULT_TALENTS);
      setPlayerClass(data.playerClass ?? "warrior");
      setTraits(data.traits ?? []);
      setIsLoaded(true);
    });

    return () => unsub();
  }, [userId]);

  /* ==============================
     SAVE (DEBOUNCED)
  ============================== */

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const savePlayer = useCallback(() => {
    if (!userId) return;

    const docRef = doc(db, "users", userId);

    setDoc(
      docRef,
      {
        player: {
          level,
          xp,
          avatarName,
          attributes,
          segments,
          talents,
          traits,
          playerClass,
        },
      },
      { merge: true }
    );
  }, [
    level,
    xp,
    avatarName,
    attributes,
    segments,
    talents,
    traits,
    playerClass,
    userId,
  ]);

  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeout.current)
      clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(savePlayer, 300);
  }, [
    level,
    xp,
    avatarName,
    attributes,
    segments,
    talents,
    traits,
    playerClass,
    savePlayer,
    isLoaded,
  ]);

  /* ==============================
     GAME LOGIC
  ============================== */

  const gainXP = useCallback(
    (amount: number, attribute?: keyof typeof attributes) => {
      undoStack.current.push({
        xp,
        level,
        attributes: { ...attributes },
      });

      let totalXP = xp + amount;
      let newLevel = level;

      while (totalXP >= nextLevelXP(newLevel)) {
        totalXP -= nextLevelXP(newLevel);
        newLevel++;
      }

      setLevel(newLevel);
      setXP(totalXP);

      if (attribute) {
        setAttributes(prev => ({
          ...prev,
          [attribute]: prev[attribute] + 1,
        }));
      }
    },
    [xp, level, attributes, nextLevelXP]
  );

  const gainSegmentXP = useCallback(
    (segmentId: string, baseAmount: number) => {
      let finalAmount = baseAmount;

      talents.forEach(t => {
        if (
          t.unlocked &&
          t.effect?.segmentBonus?.[segmentId]
        ) {
          finalAmount *=
            t.effect.segmentBonus[segmentId];
        }
      });

      setSegments(prev => ({
        ...prev,
        [segmentId]: Math.min(
          100,
          Math.round((prev[segmentId] ?? 0) + finalAmount)
        ),
      }));
    },
    [talents]
  );

  const undoLast = useCallback(() => {
    const last = undoStack.current.pop();
    if (!last) return;

    setXP(last.xp);
    setLevel(last.level);
    setAttributes(last.attributes);
  }, []);

  /* ==============================
     RETURN
  ============================== */

  return {
    level,
    xp,
    xpToNextLevel,
    levelProgress,
    avatarName,
    attributes,
    segments,
    talents,
    traits,
    playerClass,
    gainXP,
    gainSegmentXP,
    undoLast,
    setAvatarName,
  };
}