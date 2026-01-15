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