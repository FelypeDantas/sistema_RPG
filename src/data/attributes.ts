import { Dumbbell, Brain, Users, Wallet } from "lucide-react";

export type Segment = {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  affectedByTalents?: string[];
  evolvesWith?: string[];
};

export type Attribute = {
  id: string;
  name: string;
  icon: any;
  description: string;
  segments: Segment[];
};

export const ALL_ATTRIBUTES: Attribute[] = [
  {
    id: "fisico",
    name: "Físico",
    icon: Dumbbell,
    description: "Domínio do corpo e disciplina física.",
    segments: [
      {
        id: "forca",
        name: "Força",
        description: "Capacidade de esforço bruto.",
        unlockLevel: 1,
        evolvesWith: ["Treino", "Exercício"]
      },
      {
        id: "resistencia",
        name: "Resistência",
        description: "Capacidade de manter esforço.",
        unlockLevel: 3,
        evolvesWith: ["Constância"]
      },
      {
        id: "agilidade",
        name: "Agilidade",
        description: "Velocidade e coordenação.",
        unlockLevel: 6,
        affectedByTalents: ["focus"]
      }
    ]
  },
  {
    id: "mente",
    name: "Mente",
    icon: Brain,
    description: "Foco, cognição e criatividade.",
    segments: [
      {
        id: "foco",
        name: "Foco",
        description: "Aumenta chance de sucesso.",
        unlockLevel: 1,
        affectedByTalents: ["focus"],
        evolvesWith: ["Estudo"]
      },
      {
        id: "criatividade",
        name: "Criatividade",
        description: "Soluções alternativas.",
        unlockLevel: 5
      }
    ]
  }
];
