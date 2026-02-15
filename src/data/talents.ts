export interface Talent {
  id: string;
  title: string;
  description: string;

  cost: number;
  unlocked: boolean;

  requires?: string[];

  progress?: number;        // 0–100
  maxProgress?: number;     // ex: 100
  unlocksMissions?: string[];

  children?: string[];
  collapsed?: boolean;

  node?: {
    x: number;
    y: number;
  };

  effects?: TalentEffect;
}

export interface TalentEffect {
  xpMultiplier?: number;       // ex: 0.1 = +10%
  streakBonus?: number;        // bônus direto
  successChance?: number;      // ex: 0.05 = +5%
  failurePenaltyReduction?: number; // ex: 0.05 = -5%
}

export const TALENTS: Talent[] = [
  // Intelecto
  {
    id: "focus",
    title: "Foco Profundo",
    description: "+10% XP em missões mentais",
    cost: 1,
    unlocked: false,
    effects: { xpMultiplier: 0.1 },
    children: ["advanced_strategy"],
    node: { x: 300, y: 80 }
  },
  {
    id: "advanced_strategy",
    title: "Estratégia Avançada",
    description: "+15% chance de sucesso em missões mentais",
    cost: 2,
    unlocked: false,
    requires: ["focus"],
    effects: { successChance: 0.15 },
    node: { x: 300, y: 160 }
  },

  // Disciplina
  {
    id: "basic_discipline",
    title: "Disciplina Básica",
    description: "Streak nunca começa em zero",
    cost: 1,
    unlocked: false,
    requires: ["focus"],
    effects: { streakBonus: 1 },
    children: ["self_control"],
    node: { x: 300, y: 220 }
  },
  {
    id: "self_control",
    title: "Autocontrole",
    description: "+5% chance de sucesso em missões difíceis",
    cost: 2,
    unlocked: false,
    requires: ["basic_discipline"],
    effects: { successChance: 0.05 },
    children: ["resilient"],
    node: { x: 300, y: 280 }
  },
  {
    id: "resilient",
    title: "Resiliente",
    description: "Reduz penalidades por falhas em 50%",
    cost: 3,
    unlocked: false,
    requires: ["self_control"],
    effects: { failurePenaltyReduction: 0.5 },
    node: { x: 300, y: 380 }
  },

  // Comunicação
  {
    id: "clear_communication",
    title: "Comunicação Clara",
    description: "+10% XP em missões sociais",
    cost: 1,
    unlocked: false,
    children: ["negotiation"],
    effects: { xpMultiplier: 0.1 },
    node: { x: 500, y: 180 }
  },
  {
    id: "negotiation",
    title: "Negociação",
    description: "+10% chance de sucesso em missões sociais",
    cost: 2,
    unlocked: false,
    requires: ["clear_communication"],
    children: ["leadership"],
    effects: { successChance: 0.1 },
    node: { x: 500, y: 260 }
  },
  {
    id: "leadership",
    title: "Liderança",
    description: "+15% XP em missões sociais complexas",
    cost: 3,
    unlocked: false,
    requires: ["negotiation"],
    effects: { xpMultiplier: 0.15 },
    node: { x: 500, y: 340 }
  },

  // Corpo
  {
    id: "strength",
    title: "Força Bruta",
    description: "+10% desempenho físico",
    cost: 1,
    unlocked: false,
    children: ["endurance"],
    effects: { successChance: 0.1 },
    node: { x: 700, y: 80 }
  },
  {
    id: "endurance",
    title: "Resistência",
    description: "Aumenta capacidade de esforço prolongado",
    cost: 2,
    unlocked: false,
    requires: ["strength"],
    children: ["agility"],
    node: { x: 700, y: 160 }
  },
  {
    id: "agility",
    title: "Agilidade",
    description: "Velocidade e coordenação aprimoradas",
    cost: 2,
    unlocked: false,
    requires: ["endurance"],
    node: { x: 700, y: 240 }
  },

  // Combate
  {
    id: "capoeira",
    title: "Capoeira",
    description: "Desbloqueia missões físicas avançadas",
    cost: 1,
    unlocked: false,
    children: ["ginga", "armada"],
    node: { x: 900, y: 120 }
  },
  {
    id: "ginga",
    title: "Ginga",
    description: "Aumenta agilidade em combates",
    cost: 2,
    unlocked: false,
    requires: ["capoeira"],
    node: { x: 900, y: 200 }
  },
  {
    id: "armada",
    title: "Armada",
    description: "Aumenta força em desafios físicos",
    cost: 2,
    unlocked: false,
    requires: ["capoeira"],
    node: { x: 900, y: 280 }
  }
];
