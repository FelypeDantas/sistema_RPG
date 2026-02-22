// src/core/talents/baseTree.ts

export const BASE_TREE_VERSION = 1;

export const BASE_TALENTS: Record<string, TalentNodeData> = {
  base_hardSkills: {
    id: "base_hardSkills",
    title: "Hard Skills",
    description: "Habilidades técnicas e específicas.",
    cost: 1,
    progress: 0,
    locked: false,
    children: []
  },

  base_softSkils: {
    id: "base_softSkils",
    title: "Soft Skills",
    description: "Habilidades sociais e comportamentais.",
    cost: 1,
    progress: 0,
    locked: false,
    children: []
  },

  base_combate: {
    id: "base_combate",
    title: "Combate",
    description: "Habilidades e técnicas de combate.",
    cost: 1,
    progress: 0,
    locked: false,
    children: []
  }
};