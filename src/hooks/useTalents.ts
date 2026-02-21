import { useEffect, useMemo, useState, useCallback } from "react";

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
   💾 STORAGE KEY
============================= */

const STORAGE_KEY = "lifeRpg_talents_state";

/* =============================
   🧠 HOOK
============================= */

export function useTalents(level: number) {

  /* =============================
     🔄 CARREGA ESTADO PERSISTIDO
  ============================= */

  const [talents, setTalents] = useState<Record<string, TalentNodeData>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialTalents;

    try {
      const parsed = JSON.parse(saved);

      // Mescla estado salvo com estrutura atual
      const merged: Record<string, TalentNodeData> = {};

      Object.keys(initialTalents).forEach(id => {
        merged[id] = {
          ...initialTalents[id],
          ...parsed.talents?.[id]
        };
      });

      return merged;
    } catch {
      return initialTalents;
    }
  });

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    try {
      const parsed = JSON.parse(saved);
      return parsed.collapsed ?? {};
    } catch {
      return {};
    }
  });

  const [points, setPoints] = useState(0);

  /* =============================
     💾 SALVA AUTOMATICAMENTE
  ============================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        talents,
        collapsed
      })
    );
  }, [talents, collapsed]);

  /* =============================
     🔢 CALCULA PONTOS DISPONÍVEIS
  ============================= */

  useEffect(() => {
  const spentPoints = Object.values(talents as Record<string, TalentNodeData>)
    .filter((t: TalentNodeData) => !t.locked)
    .reduce((acc: number, t: TalentNodeData) => acc + t.cost, 0);

  const totalEarnedPoints = Math.max(level - 1, 0);
  setPoints(Math.max(totalEarnedPoints - spentPoints, 0));
}, [level, talents]);

  /* =============================
     🔓 DESBLOQUEIA TALENTO
  ============================= */

  const unlockTalent = useCallback((id: string) => {
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
  }, [points]);

  /* =============================
     ⭐ TALENTOS SUGERIDOS
  ============================= */

const suggestedTalents = useMemo(() => {
  const talentList = Object.values(talents) as TalentNodeData[];

  return talentList.filter(talent => {
    if (!talent.locked) return false;

    const parents = talentList.filter(p =>
      p.children?.includes(talent.id)
    );

    return parents.some(parent => !parent.locked);
  });
}, [talents]);

  /* =============================
     📦 UI
  ============================= */

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /* =============================
     📦 API
  ============================= */

  return {
    talents: Object.values(talents),
    byId: talents,
    suggestedTalents,
    points,
    unlockTalent,
    collapsed,
    toggleCollapse
  };
}