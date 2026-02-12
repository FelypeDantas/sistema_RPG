export interface Talent {
  id: string;
  title: string;
  description: string;

  cost: number;
  unlocked: boolean;

  requires?: string[];

  // 🌱 NOVO
  progress?: number;        // 0–100
  maxProgress?: number;     // ex: 100
  unlocksMissions?: string[];

  // 🌿 Sub-árvore
  children?: string[];
  collapsed?: boolean;

  // 🎯 Grafo
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
  {
    id: "focus",  
    title: "Foco Profundo",
    description: "+10% XP em missões mentais",
    cost: 1,
    unlocked: false,
    effects: { xpMultiplier: 0.1 },
    node: { x: 300, y: 80 }
  },
  {
    id: "basic_discipline", 
    title: "Disciplina Básica",
    description: "Streak nunca começa em zero",
    cost: 1,
    unlocked: false,
    requires: ["focus"],
    effects: { streakBonus: 1 },
    node: { x: 300, y: 180 }
  },
  {
    id: "self_control",  
    title: "Autocontrole",
    description: "+5% chance de sucesso em missões difíceis",
    cost: 2,
    unlocked: false,
    requires: ["basic_discipline"],
    effects: { successChance: 0.05 },
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
  {
    id: "clear_communication",
    title: "Comunicação Clara", 
    description: "+10% XP em missões sociais",
    cost: 1,
    unlocked: false,
    effects: { xpMultiplier: 0.1 },
    node: { x: 500, y: 180 }
  }
];