import { useEffect, useState } from "react";

const STORAGE_KEY = "life_rpg_player";

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

export function usePlayer() {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

  const [attributes, setAttributes] = useState({
    Físico: 10,
    Mente: 10,
    Social: 10,
    Finanças: 10
  });

  const [traits, setTraits] = useState<Trait[]>([
    {
      id: "disciplinado",
      name: "Disciplinado",
      description: "Ganha mais XP ao manter streaks"
    }
  ]);

  const nextLevelXP = Math.floor(100 + xp * 0.9);

  // 🔹 LOAD
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);
    setLevel(data.level ?? 1);
    setXP(data.xp ?? 0);
    setAttributes(data.attributes ?? attributes);
    setTraits(data.traits ?? traits);
  }, []);

  // 🔹 SAVE
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        level,
        xp,
        attributes,
        traits
      })
    );
  }, [level, xp, attributes, traits]);

  const hasTrait = (id: TraitId) => {
    return traits.some(t => t.id === id);
  };

  const gainXP = (amount: number, attribute?: keyof typeof attributes) => {
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

  return {
    level,
    xp,
    nextLevelXP,
    attributes,
    traits,
    hasTrait,
    gainXP
  };
}
