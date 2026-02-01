import { useEffect, useMemo, useState } from "react";

/* =============================
   🧬 TIPOS
============================= */

export type TalentNodeData = {
  id: string;
  title: string;
  description: string;
  cost: number;
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
    description: "Aumenta a chance de sucesso em missões.",
    cost: 1,
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
    description: "Bônus de XP quando mantém sequência de dias.",
    cost: 1,
    category: "mental",
    x: 300,
    y: 220,
    progress: 0,
    locked: true
  },
  capoeira: {
    id: "capoeira",
    title: "Capoeira",
    description: "Desbloqueia missões físicas avançadas.",
    cost: 1,
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
    description: "Aumenta agilidade em missões físicas.",
    cost: 1,
    category: "combat",
    x: 500,
    y: 260,
    progress: 0,
    locked: true
  },
  armada: {
    id: "armada",
    title: "Armada",
    description: "Aumenta poder em desafios físicos.",
    cost: 1,
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
    const spentPoints = Object.values(talents)
      .filter(t => !t.locked)
      .reduce((acc, t) => acc + t.cost, 0);

    const totalEarnedPoints = Math.max(level - 1, 0);
    const available = totalEarnedPoints - spentPoints;

    setPoints(Math.max(available, 0));
  }, [level, talents]);

  /* =============================
     🔓 DESBLOQUEAR TALENTO
  ============================= */

  function unlockTalent(id: string) {
    if (points <= 0) return;

    setTalents(prev => {
      const talent = prev[id];
      if (!talent || !talent.locked) return prev;

      const updated = {
        ...prev,
        [id]: {
          ...talent,
          locked: false,
          progress: Math.max(talent.progress, 1)
        }
      };

      // libera filhos (aparecem na árvore, mas continuam bloqueados)
      talent.children?.forEach(childId => {
        if (updated[childId]) {
          updated[childId] = {
            ...updated[childId],
            locked: true
          };
        }
      });

      return updated;
    });
  }

  /* =============================
     ⭐ TALENTOS SUGERIDOS (DASHBOARD)
  ============================= */

  const suggestedTalents = useMemo(() => {
    return Object.values(talents).filter(talent => {
      if (!talent.locked) return false;

      // verifica se algum pai está desbloqueado
      const parents = Object.values(talents).filter(parent =>
        parent.children?.includes(talent.id)
      );

      return parents.some(parent => !parent.locked);
    });
  }, [talents]);

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
    talents: Object.values(talents),      // árvore completa
    suggestedTalents,                     // dashboard
    byId: talents,
    points,
    unlockTalent,
    collapsed,
    toggleCollapse
  };
}
