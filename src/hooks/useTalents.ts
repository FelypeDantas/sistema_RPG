import { useState } from "react";

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

const initialTalents: Record<string, TalentNodeData> = {
  foco: {
    id: "foco",
    title: "Foco",
    category: "mental",
    x: 100,
    y: 100,
    progress: 30,
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

export function useTalents() {
  const [talents, setTalents] = useState(initialTalents);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleCollapse(id: string) {
    setCollapsed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  return {
    talents: Object.values(talents),
    byId: talents,
    collapsed,
    toggleCollapse
  };
}
