// src/core/talents/baseTree.ts

export const BASE_TREE_VERSION = 1;

export const BASE_TALENTS: Record<string, TalentNodeData> = {
  base_disciplina: {
    id: "base_disciplina",
    title: "Disciplina",
    description: "Capacidade de agir mesmo sem motivação.",
    cost: 1,
    progress: 0,
    locked: false,
    children: []
  },

  base_foco: {
    id: "base_foco",
    title: "Foco",
    description: "Direcionar energia para uma única meta.",
    cost: 1,
    progress: 0,
    locked: false,
    children: []
  },

  base_energia: {
    id: "base_energia",
    title: "Energia",
    description: "Capacidade física e mental para execução contínua.",
    cost: 1,
    progress: 0,
    locked: false,
    children: []
  }
};