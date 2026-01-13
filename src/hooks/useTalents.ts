import { useEffect, useState } from "react";

const STORAGE_KEY = "life_rpg_talents";

export interface Talent {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
}

export function useTalents(playerLevel: number) {
  const [points, setPoints] = useState(0);
  const [talents, setTalents] = useState<Talent[]>([
    {
      id: "focus",
      title: "Foco Profundo",
      description: "+10% XP em missões mentais",
      cost: 1,
      unlocked: false
    },
    {
      id: "discipline",
      title: "Disciplina",
      description: "+1 atributo extra por missão",
      cost: 2,
      unlocked: false
    },
    {
      id: "resilience",
      title: "Resiliência",
      description: "Falhas causam menos penalidade",
      cost: 2,
      unlocked: false
    }
  ]);

  // Pontos por nível
  useEffect(() => {
    setPoints(playerLevel - 1);
  }, [playerLevel]);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    setTalents(data.talents);
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ talents })
    );
  }, [talents]);

  const unlockTalent = (id: string) => {
    const talent = talents.find(t => t.id === id);
    if (!talent || talent.unlocked || points < talent.cost) return;

    setTalents(prev =>
      prev.map(t =>
        t.id === id ? { ...t, unlocked: true } : t
      )
    );

    setPoints(p => p - talent.cost);
  };

  return { talents, points, unlockTalent };
}
