import { useEffect, useState, useCallback } from "react";
import { saveUserData, loadUserData } from "@/services/database";

const STORAGE_KEY = "life_rpg_player";

/* =============================
// 🧬 TRAITS
============================= */
export type TraitId = "disciplinado" | "impulsivo" | "persistente" | "econômico";

export interface Trait {
  id: TraitId;
  name: string;
  description: string;
}

/* =============================
// 🌳 TALENTOS
============================= */
export type TalentId = "focus" | "physical_mastery";

interface TalentEffect {
  segmentBonus?: Record<string, number>;
}

export interface Talent {
  id: TalentId;
  unlocked: boolean;
  effect?: TalentEffect;
}

/* =============================
// 🎮 PLAYER HOOK
============================= */
export function usePlayer(userId?: string) {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

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
    { id: "focus", unlocked: true, effect: { segmentBonus: { foco: 1.2 } } },
    { id: "physical_mastery", unlocked: false, effect: { segmentBonus: { forca: 1.15, resistencia: 1.1 } } },
  ]);

  const [traits, setTraits] = useState<Trait[]>([
    { id: "disciplinado", name: "Disciplinado", description: "Ganha mais XP ao manter streaks" },
  ]);

  const nextLevelXP = useCallback(() => Math.floor(100 + xp * 0.9), [xp]);

  /* =============================
     📥 LOAD PLAYER LOCAL + FIREBASE
  ============================= */
  useEffect(() => {
    // 1️⃣ Carrega do localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setLevel(data.level ?? 1);
      setXP(data.xp ?? 0);
      setAttributes(data.attributes ?? attributes);
      setTraits(data.traits ?? traits);
      setSegments(data.segments ?? segments);
      setTalents(data.talents ?? talents);
    }

    // 2️⃣ Carrega do Firebase se userId existir
    if (userId) {
      (async () => {
        try {
          const data = await loadUserData(userId);
          if (data?.player) {
            const player = data.player;
            setLevel(player.level ?? level);
            setXP(player.xp ?? xp);
            setAttributes(player.attributes ?? attributes);
            setTraits(player.traits ?? traits);
            setSegments(player.segments ?? segments);
            setTalents(player.talents ?? talents);
          }
        } catch (err) {
          console.error("Erro ao carregar player do Firebase:", err);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /* =============================
     📤 SAVE PLAYER LOCAL
  ============================= */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ level, xp, attributes, traits, segments, talents })
    );

    // Salvar no Firebase também se houver userId
    if (userId) {
      saveUserData(userId, { player: { level, xp, attributes, traits, segments, talents } }).catch(err =>
        console.error("Erro ao salvar player no Firebase:", err)
      );
    }
  }, [level, xp, attributes, traits, segments, talents, userId]);

  /* =============================
     🔍 HELPERS
  ============================= */
  const hasTrait = useCallback((id: TraitId) => traits.some(t => t.id === id), [traits]);
  const hasTalent = useCallback((id: TalentId) => talents.some(t => t.id === id && t.unlocked), [talents]);

  /* =============================
     ⭐ XP GLOBAL
  ============================= */
  const gainXP = useCallback(
    (amount: number, attribute?: keyof typeof attributes) => {
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

      if (attribute) {
        setAttributes(prev => ({ ...prev, [attribute]: prev[attribute] + 1 }));
      }
    },
    [level, nextLevelXP]
  );

  /* =============================
     🧬 XP DE SEGMENTO (COM TALENTOS)
  ============================= */
  const gainSegmentXP = useCallback(
    (segmentId: string, baseAmount: number) => {
      let finalAmount = baseAmount;
      talents.forEach(talent => {
        if (talent.unlocked && talent.effect?.segmentBonus?.[segmentId]) {
          finalAmount *= talent.effect.segmentBonus[segmentId];
        }
      });

      setSegments(prev => ({
        ...prev,
        [segmentId]: Math.min(100, Math.round((prev[segmentId] ?? 0) + finalAmount)),
      }));
    },
    [talents]
  );

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
  };
}
