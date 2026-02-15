import { useEffect, useState, useCallback, useRef } from "react";
import { db } from "@/services/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export type TraitId = "disciplinado" | "impulsivo" | "persistente" | "econômico";
export interface Trait { id: TraitId; name: string; description: string; }

export type TalentId = "focus" | "physical_mastery";
interface TalentEffect { segmentBonus?: Record<string, number>; }
export interface Talent { id: TalentId; unlocked: boolean; effect?: TalentEffect; }

export function usePlayerRealtime(userId?: string) {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [attributes, setAttributes] = useState({ Físico: 10, Mente: 10, Social: 10, Finanças: 10 });
  const [segments, setSegments] = useState<Record<string, number>>({ forca: 10, foco: 20 });
  const [talents, setTalents] = useState<Talent[]>([
    { id: "focus", unlocked: true, effect: { segmentBonus: { foco: 1.2 } } },
    { id: "physical_mastery", unlocked: false, effect: { segmentBonus: { forca: 1.15, resistencia: 1.1 } } },
  ]);
  const [traits, setTraits] = useState<Trait[]>([
    { id: "disciplinado", name: "Disciplinado", description: "Ganha mais XP ao manter streaks" },
  ]);

  const undoStack = useRef<Array<{ xp: number; attributes: typeof attributes }>>([]);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const nextLevelXP = useCallback(() => Math.floor(100 + xp * 0.9), [xp]);

  /* ==============================
     FIRESTORE REALTIME SYNC
  ============================== */
  useEffect(() => {
    if (!userId) return;

    const docRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(docRef, snapshot => {
      const data = snapshot.data()?.player;
      if (!data) return;

      // Valida e aplica dados
      setLevel(typeof data.level === "number" ? data.level : 1);
      setXP(typeof data.xp === "number" ? data.xp : 0);
      setAttributes(typeof data.attributes === "object" ? data.attributes : { Físico: 10, Mente: 10, Social: 10, Finanças: 10 });
      setSegments(typeof data.segments === "object" ? data.segments : { forca: 10, foco: 20 });
      setTalents(Array.isArray(data.talents) ? data.talents : []);
      setTraits(Array.isArray(data.traits) ? data.traits : []);
    });

    return () => unsubscribe();
  }, [userId]);

  /* ==============================
     SAVE FUNCTION (DEBOUNCED)
  ============================== */
  const savePlayer = useCallback(() => {
    if (!userId) return;

    const data = {
      level,
      xp,
      attributes,
      segments,
      talents: talents.map(t => ({
        id: t.id,
        unlocked: t.unlocked,
        effect: t.effect ? { ...t.effect } : undefined,
      })),
      traits: traits.map(t => ({ id: t.id, name: t.name, description: t.description })),
    };

    const docRef = doc(db, "users", userId);
    setDoc(docRef, { player: data }, { merge: true }).catch(console.error);
  }, [level, xp, attributes, segments, talents, traits, userId]);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(savePlayer, 300);
  }, [level, xp, attributes, segments, talents, traits, savePlayer]);

  /* ==============================
     HELPERS
  ============================== */
  const hasTrait = useCallback((id: TraitId) => traits.some(t => t.id === id), [traits]);
  const hasTalent = useCallback((id: TalentId) => talents.some(t => t.id === id && t.unlocked), [talents]);

  const gainXP = useCallback((amount: number, attribute?: keyof typeof attributes) => {
    undoStack.current.push({ xp, attributes: { ...attributes } });

    setXP(prevXP => {
      let total = prevXP + amount;
      let newLevel = level;
      while (total >= nextLevelXP()) {
        total -= nextLevelXP();
        newLevel += 1;
      }
      if (newLevel !== level) setLevel(newLevel);
      return total;
    });

    if (attribute) setAttributes(prev => ({ ...prev, [attribute]: prev[attribute] + 1 }));
  }, [xp, attributes, level, nextLevelXP]);

  const gainSegmentXP = useCallback((segmentId: string, baseAmount: number) => {
    let finalAmount = baseAmount;
    talents.forEach(t => {
      if (t.unlocked && t.effect?.segmentBonus?.[segmentId]) {
        finalAmount *= t.effect.segmentBonus[segmentId];
      }
    });
    setSegments(prev => ({
      ...prev,
      [segmentId]: Math.min(100, Math.round((prev[segmentId] ?? 0) + finalAmount)),
    }));
  }, [talents]);

  const undoLast = useCallback(() => {
    const last = undoStack.current.pop();
    if (!last) return;
    setXP(last.xp);
    setAttributes(last.attributes);
  }, []);

  return {
    level,
    xp,
    nextLevelXP: nextLevelXP(),
    attributes,
    segments,
    talents,
    traits,
    hasTrait,
    hasTalent,
    gainXP,
    gainSegmentXP,
    undoLast,
  };
}
