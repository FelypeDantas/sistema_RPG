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
  progress: number;
  locked?: boolean;
  children?: string[];
  unlocksMission?: boolean;
};

type UseTalentsReturn = {
  talents: TalentNodeData[];
  byId: Record<string, TalentNodeData>;
  suggestedTalents: TalentNodeData[];
  points: number;
  unlockTalent: (id: string) => void;
  collapsed: Record<string, boolean>;
  toggleCollapse: (id: string) => void;
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

const STORAGE_KEY = "lifeRpg_talents_state";

/* =============================
   🧠 HOOK
============================= */

export function useTalents(level: number): UseTalentsReturn {
  const [talents, setTalents] = useState<Record<string, TalentNodeData>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialTalents;

    try {
      const parsed = JSON.parse(saved);

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

  useEffect(() => {
  async function loadFromServer() {
    const response = await fetch("/api/player/talents");
    const data = await response.json();

    setTalents(prev => {
      const merged: Record<string, TalentNodeData> = {};

      Object.keys(prev).forEach(id => {
        merged[id] = {
          ...prev[id],
          ...data.talents?.[id]
        };
      });

      return merged;
    });

    setCollapsed(data.collapsed ?? {});
  }

  loadFromServer();
}, []);

useEffect(() => {
  async function sync() {
    await fetch("/api/player/talents", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ talents, collapsed })
    });
  }

  sync();
}, [talents, collapsed]);


  /* =============================
     💾 Persistência
  ============================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ talents, collapsed })
    );
  }, [talents, collapsed]);

  /* =============================
     🔢 Cálculo de pontos
  ============================= */

  useEffect(() => {
    const talentList: TalentNodeData[] = Object.values(talents);

    const spentPoints = talentList
      .filter(t => !t.locked)
      .reduce((acc, t) => acc + t.cost, 0);

    const totalEarnedPoints = Math.max(level - 1, 0);
    setPoints(Math.max(totalEarnedPoints - spentPoints, 0));
  }, [level, talents]);

  /* =============================
     🔓 Unlock
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

      return updated;
    });
  }, [points]);

  /* =============================
     ⭐ Suggested
  ============================= */

  const suggestedTalents = useMemo(() => {
    const talentList: TalentNodeData[] = Object.values(talents);

    return talentList.filter(talent => {
      if (!talent.locked) return false;

      const parents = talentList.filter(p =>
        p.children?.includes(talent.id)
      );

      return parents.some(parent => !parent.locked);
    });
  }, [talents]);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

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