import { useEffect, useState, useCallback, useRef } from "react";
import { db } from "@/services/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const DEFAULT_TALENTS: Talent[] = [
  {
    id: "focus",
    unlocked: true,
    effect: { segmentBonus: { foco: 1.2 } },
  },
  {
    id: "physical_mastery",
    unlocked: false,
    effect: {
      segmentBonus: { forca: 1.15, resistencia: 1.1 },
    },
  },
];

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

export type PlayerClass =
  | "warrior"
  | "scholar"
  | "strategist"
  | "merchant";

export type TalentId = "focus" | "physical_mastery";

interface TalentEffect {
  segmentBonus?: Record<string, number>;
}

export interface Talent {
  id: TalentId;
  unlocked: boolean;
  effect?: TalentEffect;
}

export function usePlayerRealtime(userId?: string) {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [avatarName, setAvatarNameState] = useState<string | null>(null);
  const [playerClass, setPlayerClass] = useState<PlayerClass>("warrior");

  const [attributes, setAttributes] = useState({
    Físico: 10,
    Mente: 10,
    Social: 10,
    Finanças: 10,
  });

  const [segments, setSegments] = useState<Record<string, number>>({
    forca: 10,
    foco: 20,
  });

  const [talents, setTalents] = useState<Talent[]>([
    {
      id: "focus",
      unlocked: true,
      effect: { segmentBonus: { foco: 1.2 } },
    },
    {
      id: "physical_mastery",
      unlocked: false,
      effect: {
        segmentBonus: { forca: 1.15, resistencia: 1.1 },
      },
    },
  ]);

  const [traits, setTraits] = useState<Trait[]>([
    {
      id: "disciplinado",
      name: "Disciplinado",
      description: "Ganha mais XP ao manter streaks",
    },
  ]);

  const undoStack = useRef<
    Array<{ xp: number; attributes: typeof attributes }>
  >([]);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextLevelXP = useCallback(
    (lvl: number) => Math.floor(100 * Math.pow(1.15, lvl - 1)),
    []
  );

  /* ==============================
     FIRESTORE REALTIME SYNC
  ============================== */
  useEffect(() => {
    if (!userId) return;

    const docRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(docRef, snapshot => {
      const data = snapshot.data()?.player;
      if (!data) {
        setIsLoaded(true);
        return;
      }

      setLevel(
        typeof data.level === "number" ? data.level : 1
      );

      setXP(typeof data.xp === "number" ? data.xp : 0);

      setAvatarNameState(
        typeof data.avatarName === "string"
          ? data.avatarName
          : null
      );

      setAttributes(
        typeof data.attributes === "object"
          ? data.attributes
          : {
            Físico: 10,
            Mente: 10,
            Social: 10,
            Finanças: 10,
          }
      );

      setSegments(
        typeof data.segments === "object"
          ? data.segments
          : { forca: 10, foco: 20 }
      );

      setTalents(
        Array.isArray(data.talents) && data.talents.length > 0
          ? data.talents
          : DEFAULT_TALENTS
      );

      setPlayerClass(
        data.playerClass ?? "warrior"
      );

      setTraits(
        Array.isArray(data.traits) ? data.traits : []
      );

      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [userId]);

  /* ==============================
     SAVE FUNCTION (DEBOUNCED)
  ============================== */
  const savePlayer = useCallback(() => {
    if (!userId || typeof userId !== "string") return;

    const data = {
      level,
      xp,
      avatarName,
      attributes,
      segments,
      playerClass,
      talents: talents.map(t => ({
        id: t.id,
        unlocked: t.unlocked,
        effect: t.effect ? { ...t.effect } : undefined,
      })),
      traits: traits.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
      })),
    };

    const docRef = doc(db, "users", userId);

    setDoc(docRef, { player: data }, { merge: true }).catch(
      console.error
    );
  }, [
    level,
    xp,
    avatarName,
    attributes,
    segments,
    talents,
    traits,
    userId,
  ]);

  useEffect(() => {
    if (!isLoaded) return; // 🚫 NÃO salva antes de carregar

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
    savePlayer,
    isLoaded
  ]);

  /* ==============================
     HELPERS
  ============================== */

  const hasTrait = useCallback(
    (id: TraitId) => traits.some(t => t.id === id),
    [traits]
  );

  const hasTalent = useCallback(
    (id: TalentId) =>
      talents.some(t => t.id === id && t.unlocked),
    [talents]
  );

  const gainXP = useCallback(
  (amount: number, attribute?: keyof typeof attributes) => {
    undoStack.current.push({
      xp,
      attributes: { ...attributes },
    });

    setXP(prevXP => {
      let totalXP = prevXP + amount;
      let newLevel = level;

      let xpRequired = nextLevelXP(newLevel);

      while (totalXP >= xpRequired) {
        totalXP -= xpRequired;
        newLevel += 1;
        xpRequired = nextLevelXP(newLevel);
      }

      if (newLevel !== level) {
        setLevel(newLevel);
      }

      return totalXP;
    });

    if (attribute) {
      setAttributes(prev => ({
        ...prev,
        [attribute]: prev[attribute] + 1,
      }));
    }
  },
  [level, xp, attributes]
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
    setAttributes(last.attributes);
  }, []);

  const setAvatarName = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      setAvatarNameState(name.trim());
    },
    []
  );

  return {
    level,
    xp,
    nextLevelXP: nextLevelXP(),
    avatarName,
    attributes,
    segments,
    talents,
    traits,
    hasTrait,
    hasTalent,
    gainXP,
    gainSegmentXP,
    undoLast,
    setAvatarName,
    playerClass
  };
}
