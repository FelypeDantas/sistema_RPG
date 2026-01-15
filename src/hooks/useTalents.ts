import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "life_rpg_talents";

/* =============================
   🧩 Tipagens
============================= */

export interface TalentEffect {
  xpMultiplier?: number;       // ex: 0.1 = +10%
  streakBonus?: number;        // bônus direto
  successChance?: number;      // ex: 0.05 = +5%
}

export interface Talent {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  requires?: string[];         // pré-requisitos
  effects?: TalentEffect;
  node?: {
    x: number;
    y: number;
  };
}

interface StoredData {
  talents: Talent[];
}

/* =============================
   🪄 Hook
============================= */

export function useTalents(
  playerLevel: number,
  playerClass?: string
) {
  const [points, setPoints] = useState(0);

  const [talents, setTalents] = useState<Talent[]>([
    {
      id: "focus",
      title: "Foco Profundo",
      description: "+10% XP em missões mentais",
      cost: 1,
      unlocked: false,
      effects: { xpMultiplier: 0.1 },
      node: { x: 100, y: 80 }
    },
    {
      id: "discipline",
      title: "Disciplina",
      description: "+1 de streak em missões concluídas",
      cost: 2,
      unlocked: false,
      requires: ["focus"],
      effects: { streakBonus: 1 },
      node: { x: 250, y: 140 }
    },
    {
      id: "resilience",
      title: "Resiliência",
      description: "+5% chance de sucesso após falhas",
      cost: 2,
      unlocked: false,
      effects: { successChance: 0.05 },
      node: { x: 100, y: 220 }
    }
  ]);

  /* =============================
     🎚 Pontos por nível
  ============================= */

  useEffect(() => {
    setPoints(playerLevel - 1);
  }, [playerLevel]);

  /* =============================
     💾 Load
  ============================= */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data: StoredData = JSON.parse(saved);
    if (data?.talents) {
      setTalents(data.talents);
    }
  }, []);

  /* =============================
     💾 Save
  ============================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ talents })
    );
  }, [talents]);

  /* =============================
     🔓 Validação de pré-requisitos
  ============================= */

  const canUnlock = (talent: Talent) => {
    if (talent.unlocked) return false;
    if (points < talent.cost) return false;

    if (talent.requires) {
      return talent.requires.every(req =>
        talents.find(t => t.id === req && t.unlocked)
      );
    }

    return true;
  };

  /* =============================
     🔓 Unlock
  ============================= */

  const unlockTalent = (id: string) => {
    const talent = talents.find(t => t.id === id);
    if (!talent || !canUnlock(talent)) return;

    setTalents(prev =>
      prev.map(t =>
        t.id === id ? { ...t, unlocked: true } : t
      )
    );

    setPoints(p => p - talent.cost);
  };

  /* =============================
     🧮 Efeitos acumulados
  ============================= */

  const effects = useMemo(() => {
    return talents
      .filter(t => t.unlocked)
      .reduce(
        (acc, t) => {
          if (t.effects?.xpMultiplier)
            acc.xpMultiplier += t.effects.xpMultiplier;

          if (t.effects?.streakBonus)
            acc.streakBonus += t.effects.streakBonus;

          if (t.effects?.successChance)
            acc.successChance += t.effects.successChance;

          return acc;
        },
        {
          xpMultiplier: 0,
          streakBonus: 0,
          successChance: 0
        }
      );
  }, [talents]);

  /* =============================
     🧙‍♂️ Sinergia com classe
  ============================= */

  const classEffects = useMemo(() => {
    if (!playerClass) return {};

    if (playerClass === "Mago") {
      return { xpMultiplier: 0.05 };
    }

    if (playerClass === "Guerreiro") {
      return { streakBonus: 1 };
    }

    return {};
  }, [playerClass]);

  return {
    talents,
    points,
    unlockTalent,
    canUnlock,

    effects: {
      xpMultiplier:
        effects.xpMultiplier +
        (classEffects as any)?.xpMultiplier || 0,

      streakBonus:
        effects.streakBonus +
        (classEffects as any)?.streakBonus || 0,

      successChance: effects.successChance
    }
  };
}
