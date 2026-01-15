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
  requires?: string[];
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
     🎚 Pontos disponíveis
     (nível - custo total desbloqueado)
  ============================= */

  const spentPoints = useMemo(() => {
    return talents
      .filter(t => t.unlocked)
      .reduce((acc, t) => acc + t.cost, 0);
  }, [talents]);

  const points = Math.max(playerLevel - 1 - spentPoints, 0);

  /* =============================
     🔓 Validação de pré-requisitos
  ============================= */

  const canUnlock = (talent: Talent) => {
    if (talent.unlocked) return false;
    if (points < talent.cost) return false;

    if (!talent.requires || talent.requires.length === 0)
      return true;

    return talent.requires.every(req =>
      talents.some(t => t.id === req && t.unlocked)
    );
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
  };

  /* =============================
     🧮 Efeitos acumulados (talentos)
  ============================= */

  const talentEffects = useMemo(() => {
    return talents
      .filter(t => t.unlocked && t.effects)
      .reduce(
        (acc, t) => {
          acc.xpMultiplier += t.effects?.xpMultiplier ?? 0;
          acc.streakBonus += t.effects?.streakBonus ?? 0;
          acc.successChance += t.effects?.successChance ?? 0;
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

  const classEffects = useMemo<TalentEffect>(() => {
    switch (playerClass) {
      case "Mago":
        return { xpMultiplier: 0.05 };

      case "Guerreiro":
        return { streakBonus: 1 };

      case "Estrategista":
        return { successChance: 0.05 };

      default:
        return {};
    }
  }, [playerClass]);

  /* =============================
     ✨ Efeitos finais
  ============================= */

  const effects = {
    xpMultiplier:
      talentEffects.xpMultiplier +
      (classEffects.xpMultiplier ?? 0),

    streakBonus:
      talentEffects.streakBonus +
      (classEffects.streakBonus ?? 0),

    successChance:
      talentEffects.successChance +
      (classEffects.successChance ?? 0)
  };

  return {
    talents,
    points,
    unlockTalent,
    canUnlock,
    effects
  };
}
