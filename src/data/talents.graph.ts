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
  // Intelecto
  {
    id: "focus",
    title: "Foco Profundo",
    description: "+10% XP em missões mentais",
    category: "intelecto",
    cost: 1,
    position: { x: 300, y: 80 },
    effects: { xpMultiplier: 0.1 }
  },
  {
    id: "estrategia",
    title: "Estratégia Avançada",
    description: "+15% chance de sucesso em missões mentais",
    category: "intelecto",
    cost: 2,
    requires: ["focus"],
    position: { x: 300, y: 160 },
    effects: { successChance: 0.15 }
  },

  // Disciplina
  {
    id: "disciplina_basica",
    title: "Disciplina Básica",
    description: "Streak nunca começa em zero",
    category: "disciplina",
    cost: 1,
    position: { x: 300, y: 220 },
    effects: { streakBonus: 1 }
  },
  {
    id: "autocontrole",
    title: "Autocontrole",
    description: "+5% chance de sucesso em missões difíceis",
    category: "disciplina",
    cost: 2,
    requires: ["disciplina_basica"],
    position: { x: 300, y: 280 },
    effects: { successChance: 0.05 }
  },
  {
    id: "resiliente",
    title: "Resiliente",
    description: "Reduz penalidades por falhas em 50%",
    category: "disciplina",
    cost: 3,
    requires: ["autocontrole"],
    position: { x: 300, y: 380 },
    effects: { failurePenaltyReduction: 0.5 }
  },

  // Comunicação
  {
    id: "comunicacao_clara",
    title: "Comunicação Clara",
    description: "+10% XP em missões sociais",
    category: "comunicacao",
    cost: 1,
    position: { x: 500, y: 180 },
    effects: { xpMultiplier: 0.1 }
  },
  {
    id: "negociacao",
    title: "Negociação",
    description: "Melhora chance de sucesso em missões sociais em 10%",
    category: "comunicacao",
    cost: 2,
    requires: ["comunicacao_clara"],
    position: { x: 500, y: 260 },
    effects: { successChance: 0.1 }
  },
  {
    id: "lideranca",
    title: "Liderança",
    description: "+15% XP em missões sociais complexas",
    category: "comunicacao",
    cost: 3,
    requires: ["negociacao"],
    position: { x: 500, y: 340 },
    effects: { xpMultiplier: 0.15 }
  },

  // Corpo
  {
    id: "forca",
    title: "Força Bruta",
    description: "+10% desempenho físico",
    category: "corpo",
    cost: 1,
    position: { x: 700, y: 80 },
    effects: { successChance: 0.1 }
  },
  {
    id: "resistencia",
    title: "Resistência",
    description: "Aumenta capacidade de esforço prolongado",
    category: "corpo",
    cost: 2,
    requires: ["forca"],
    position: { x: 700, y: 160 }
  },
  {
    id: "agilidade",
    title: "Agilidade",
    description: "Velocidade e coordenação aprimoradas",
    category: "corpo",
    cost: 2,
    requires: ["resistencia"],
    position: { x: 700, y: 240 }
  },

  // Combate
  {
    id: "capoeira",
    title: "Capoeira",
    description: "Desbloqueia missões físicas avançadas",
    category: "combate",
    cost: 1,
    position: { x: 900, y: 120 }
  },
  {
    id: "ginga",
    title: "Ginga",
    description: "Aumenta agilidade em combates",
    category: "combate",
    cost: 2,
    requires: ["capoeira"],
    position: { x: 900, y: 200 }
  },
  {
    id: "armada",
    title: "Armada",
    description: "Aumenta força em desafios físicos",
    category: "combate",
    cost: 2,
    requires: ["capoeira"],
    position: { x: 900, y: 280 }
  }
];
