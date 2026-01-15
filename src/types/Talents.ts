// src/types/talent.ts
export interface Talent {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  requires?: string[];

  // 🌍 posição no grafo
  position: {
    x: number;
    y: number;
  };

  // 🔗 conexões visuais
  connections?: string[];

  // 🧠 futuro
  category?: "soft" | "hard" | "combat" | "intellect";
}
