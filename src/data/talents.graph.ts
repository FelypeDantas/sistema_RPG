export type TalentCategory =
  | "intelecto"
  | "comunicacao"
  | "disciplina"
  | "corpo"
  | "combate";

export interface TalentNode {
  id: string;
  title: string;
  description: string;
  category: TalentCategory;

  cost: number;
  requires?: string[];

  effects?: {
    xpMultiplier?: number;
    streakBonus?: number;
    successChance?: number;
    failurePenaltyReduction?: number;
  };

  position: {
    x: number;
    y: number;
  };
}

export const TALENT_GRAPH: TalentNode[] = [
  {
    id: "focus",
    title: "Foco Profundo",
    description: "+10% XP em missões mentais",
    category: "intelecto",
    cost: 1,
    position: { x: 300, y: 80 },
    effects: {
      xpMultiplier: 0.1
    }
  },

  {
    id: "disciplina_basica",
    title: "Disciplina Básica",
    description: "Streak nunca começa em zero",
    category: "disciplina",
    cost: 1,
    position: { x: 300, y: 180 },
    effects: {
      streakBonus: 1
    }
  },

  {
    id: "autocontrole",
    title: "Autocontrole",
    description: "+5% chance de sucesso em missões difíceis",
    category: "disciplina",
    cost: 2,
    requires: ["disciplina_basica"],
    position: { x: 300, y: 280 },
    effects: {
      successChance: 0.05
    }
  },

  {
    id: "comunicacao_clara",
    title: "Comunicação Clara",
    description: "+10% XP em missões sociais",
    category: "comunicacao",
    cost: 1,
    position: { x: 500, y: 180 },
    effects: {
      xpMultiplier: 0.1
    }
  }
];
