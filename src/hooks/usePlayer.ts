import { useEffect, useState } from "react";
import { saveUserData, loadUserData } from "@/services/database";

const STORAGE_KEY = "life_rpg_player";

/* =============================
   🧬 TRAITS
============================= */

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

/* =============================
   🌳 TALENTOS
============================= */

export type TalentId =
  | "focus"
  | "physical_mastery";

interface TalentEffect {
  segmentBonus?: Record<string, number>;
}

export interface Talent {
  id: TalentId;
  unlocked: boolean;
  effect?: TalentEffect;
}

/* =============================
   🎮 PLAYER HOOK
============================= */

export function usePlayer() {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

  const [attributes, setAttributes] = useState({
    Físico: 10,
    Mente: 10,
    Social: 10,
    Finanças: 10
  });

  /* 🧬 SEGMENTOS */
  const [segments, setSegments] = useState<Record<string, number>>({
    forca: 10,
    foco: 20
  });

  /* 🌳 TALENTOS */
  const [talents, setTalents] = useState<Talent[]>([
    {
      id: "focus",
      unlocked: true,
      effect: {
        segmentBonus: {
          foco: 1.2
        }
      }
    },
    {
      id: "physical_mastery",
      unlocked: false,
      effect: {
        segmentBonus: {
          forca: 1.15,
          resistencia: 1.1
        }
      }
    }
  ]);

  const [traits, setTraits] = useState<Trait[]>([
    {
      id: "disciplinado",
      name: "Disciplinado",
      description: "Ganha mais XP ao manter streaks"
    }
  ]);

  const nextLevelXP = Math.floor(100 + xp * 0.9);

  /* =============================
     📥 LOAD
  ============================= */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);

    setLevel(data.level ?? 1);
    setXP(data.xp ?? 0);
    setAttributes(data.attributes ?? attributes);
    setTraits(data.traits ?? traits);
    setSegments(data.segments ?? segments);
    setTalents(data.talents ?? talents);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // 🔹 CARREGAR ao iniciar
    useEffect(() => {
      async function load() {
        const data = await loadUserData(userId);
        if (data?.player) {
          setPlayer(data.player);
        }
      }
      load();
    }, []);
  }, []);

  /* =============================
     📤 SAVE
  ============================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        level,
        xp,
        attributes,
        traits,
        segments,
        talents
      })
    );
  }, [level, xp, attributes, traits, segments, talents]);

  /* =============================
     🔍 HELPERS
  ============================= */

  const hasTrait = (id: TraitId) =>
    traits.some(t => t.id === id);

  const hasTalent = (id: TalentId) =>
    talents.some(t => t.id === id && t.unlocked);

  /* =============================
     ⭐ XP GLOBAL
  ============================= */

  const gainXP = (
    amount: number,
    attribute?: keyof typeof attributes
  ) => {
    setXP(prev => {
      const total = prev + amount;

      if (total >= nextLevelXP) {
        setLevel(l => l + 1);
        return total - nextLevelXP;
      }

      return total;
    });

    if (attribute) {
      setAttributes(prev => ({
        ...prev,
        [attribute]: prev[attribute] + 1
      }));
    }
  };

  /* =============================
     🧬 XP DE SEGMENTO (COM TALENTOS)
  ============================= */

  const gainSegmentXP = (
    segmentId: string,
    baseAmount: number
  ) => {
    let finalAmount = baseAmount;

    talents.forEach(talent => {
      if (
        talent.unlocked &&
        talent.effect?.segmentBonus?.[segmentId]
      ) {
        finalAmount *=
          talent.effect.segmentBonus[segmentId];
      }
    });

    setSegments(prev => ({
      ...prev,
      [segmentId]: Math.min(
        100,
        Math.round(
          (prev[segmentId] ?? 0) + finalAmount
        )
      )
    }));
  };

  /* =============================
     📦 EXPORT
  ============================= */

  return {
    level,
    xp,
    nextLevelXP,
    attributes,
    segments,
    talents,
    traits,
    hasTrait,
    hasTalent,
    gainXP,
    gainSegmentXP
  };
}
