// src/data/attributes.ts
import {
  Dumbbell,
  Brain,
  Users,
  Wallet,
  Heart,
  Zap
} from "lucide-react";

export const ALL_ATTRIBUTES = [
  {
    id: "fisico",
    name: "Físico",
    icon: Dumbbell,
    description: "Capacidade corporal, energia e resistência.",
    segments: [
      {
        id: "forca",
        name: "Força",
        description: "Impacta tarefas físicas e treinos intensos."
      },
      {
        id: "resistencia",
        name: "Resistência",
        description: "Define constância e tolerância ao esforço."
      },
      {
        id: "agilidade",
        name: "Agilidade",
        description: "Velocidade de reação e movimento."
      }
    ]
  },
  {
    id: "mente",
    name: "Mente",
    icon: Brain,
    description: "Capacidade cognitiva e foco mental.",
    segments: [
      {
        id: "foco",
        name: "Foco",
        description: "Aumenta chance de sucesso em missões."
      },
      {
        id: "criatividade",
        name: "Criatividade",
        description: "Desbloqueia soluções alternativas."
      },
      {
        id: "memoria",
        name: "Memória",
        description: "Retenção de aprendizado."
      }
    ]
  }
];
