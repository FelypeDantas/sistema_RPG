import { useEffect, useState } from "react";

/* =============================
   🧬 TIPOS
============================= */

export type TalentNodeData = {
  id: string;
  title: string;
  category: "soft" | "hard" | "combat" | "mental";
  x: number;
  y: number;
  progress: number; // 0–100
  locked?: boolean;
  children?: string[];
  unlocksMission?: boolean;
};

/* =============================
   🌱 TALENTOS INICIAIS
============================= */

const initialTalents: Record<string, TalentNodeData> = {
  foco: {
    id: "foco",
    title: "Foco",
    category: "mental",
    x: 100,
    y: 100,
    progress: 30,
    locked: false,
    children: ["disciplina"]
  },
  disciplina: {
    id: "disciplina",
    title: "Disciplina",
    category: "mental",
    x: 300,
    y: 220,
    progress: 0,
    locked: true
  },
  capoeira: {
    id: "capoeira",
    title: "Capoeira",
    category: "combat",
    x: 600,
    y: 120,
    progress: 10,
    locked: false,
    children: ["ginga", "armada"],
    unlocksMission: true
  },
  ginga: {
    id: "ginga",
    title: "Ginga",
    category: "combat",
    x: 500,
    y: 260,
    progress: 0,
    locked: true
  },
  armada: {
    id: "armada",
    title: "Armada",
    category: "combat",
    x: 700,
    y: 260,
    progress: 0,
    locked: true
  }
};

/* =============================
   🧠 HOOK
============================= */

export function useTalents(level: number) {
  const [talents, setTalents] =
    useState<Record<string, TalentNodeData>>(initialTalents);

  const [collapsed, setCollapsed] =
    useState<Record<string, boolean>>({});

  const [points, setPoints] = useState(0);

  /* =============================
     🔢 CÁLCULO DE PONTOS
  ============================= */

  useEffect(() => {
    const unlockedCount = Object.values(talents).filter(
      t => !t.locked
    ).length;

    // 1 ponto por nível acima do 1
    const totalPoints = Math.max(level - 1, 0);

    setPoints(totalPoints - unlockedCount);
  }, [level, talents]);

  /* =============================
     🔓 DESBLOQUEAR TALENTO
  ============================= */

  function unlockTalent(id: string) {
    if (points <= 0) return;

    setTalents(prev => {
      const talent = prev[id];
      if (!talent || !talent.locked) return prev;

      const updated: Record<string, TalentNodeData> = {
        ...prev,
        [id]: {
          ...talent,
          locked: false,
          progress: Math.max(talent.progress, 1)
        }
      };

      // libera talentos filhos
      talent.children?.forEach(childId => {
        if (updated[childId]) {
          updated[childId] = {
            ...updated[childId],
            locked: false
          };
        }
      });

      return updated;
    });
  }

  /* =============================
     📦 UI
  ============================= */

  function toggleCollapse(id: string) {
    setCollapsed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  /* =============================
     📤 API
  ============================= */

  return {
    talents: Object.values(talents),
    byId: talents,
    points,
    unlockTalent,
    collapsed,
    toggleCollapse
  };
}
