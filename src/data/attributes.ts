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
      },
      {
        id: "flexibilidade",
        name: "Flexibilidade",
        description: "Amplitude de movimento.",
        unlockLevel: 8
      },
      {
        id: "equilibrio",
        name: "Equilíbrio",
        description: "Estabilidade corporal.",
        unlockLevel: 10
      },
      {
        id: "resiliencia_fisica",
        name: "Resiliência Física",
        description: "Recuperação e adaptação a estressores físicos.",
        unlockLevel: 12
      },
      {
        id: "saude",
        name: "Saúde",
        description: "Estado geral de bem-estar físico.",
        unlockLevel: 15
      },
      {
        id: "vitalidade",
        name: "Vitalidade",
        description: "Energia e vigor para enfrentar desafios diários.",
        unlockLevel: 18
      },
      {
        id: "performance",
        name: "Performance",
        description: "Capacidade de alcançar resultados físicos excepcionais.",
        unlockLevel: 20
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
      },
      {
        id: "memoria",
        name: "Memória",
        description: "Retenção de informações.",
        unlockLevel: 7
      },
      {
        id: "resiliencia",
        name: "Resiliência",
        description: "Superar desafios mentais.",
        unlockLevel: 10
      },
      {
        id: "inteligencia",
        name: "Inteligência",
        description: "Capacidade de aprendizado e adaptação.",
        unlockLevel: 12
      },
      {
        id: "sabedoria",
        name: "Sabedoria",
        description: "Julgamento e tomada de decisões.",
        unlockLevel: 15
      },
      {
        id: "inteligencia_emocional",
        name: "Inteligência Emocional",
        description: "Gerenciar emoções próprias e alheias.",
        unlockLevel: 18
      },
      {
        id: "pensamento_critico",
        name: "Pensamento Crítico",
        description: "Analisar e avaliar informações de forma objetiva.",
        unlockLevel: 20
      }
    ]
  },
  {
    id: "social",
    name: "Social",
    icon: Users,
    description: "Habilidades interpessoais.",
    segments: [
      {
        id: "comunicacao",
        name: "Comunicação",
        description: "Expressar ideias claramente.",
        unlockLevel: 2,
        evolvesWith: ["Networking"]
      },
      {
        id: "empatia",
        name: "Empatia",
        description: "Compreender emoções alheias.",
        unlockLevel: 4
      },
      {
        id: "lideranca",
        name: "Liderança",
        description: "Inspirar e guiar outros.",
        unlockLevel: 6,
        affectedByTalents: ["charisma"]
      },
      {
        id: "trabalho_em_equipa",
        name: "Trabalho em Equipa",
        description: "Colaborar eficazmente.",
        unlockLevel: 8
      },
      {
        id: "resolucao_de_conflitos",
        name: "Resolução de Conflitos",
        description: "Gerenciar e resolver desentendimentos.",
        unlockLevel: 10
      },
      {
        id: "inteligencia_social",
        name: "Inteligência Social",
        description: "Navegar em situações sociais complexas.",
        unlockLevel: 12
      },
      {
        id: "carisma",
        name: "Carisma",
        description: "Atração e influência sobre os outros.",
        unlockLevel: 15
      },
      {
        id: "habilidades_de_negociacao",
        name: "Habilidades de Negociação",
        description: "Alcançar acordos vantajosos.",
        unlockLevel: 18
      },
      {
        id: "inteligencia_cultural",
        name: "Inteligência Cultural",
        description: "Compreender e respeitar diferentes culturas.",
        unlockLevel: 20
      }
    ]
  },
  {
    id: "financeiro",
    name: "Financeiro",
    icon: Wallet,
    description: "Gestão de recursos monetários.",
    segments: [
      {
        id: "planejamento",
        name: "Planejamento",
        description: "Organização financeira eficaz.",
        unlockLevel: 2,
        evolvesWith: ["Orçamento"]
      },
      {
        id: "investimento",
        name: "Investimento",
        description: "Crescimento de patrimônio.",
        unlockLevel: 5
      },
      {
        id: "poupanca",
        name: "Poupança",
        description: "Economia para o futuro.",
        unlockLevel: 7
      },
      {
        id: "gestao_de_dividas",
        name: "Gestão de Dívidas",
        description: "Controlar e reduzir dívidas.",
        unlockLevel: 10
      },
      { 
        id: "renda_passiva",
        name: "Renda Passiva",
        description: "Gerar renda sem esforço contínuo.",
        unlockLevel: 12
      },
      {
        id: "inteligencia_financeira",
        name: "Inteligência Financeira",  
        description: "Tomar decisões financeiras inteligentes.",
        unlockLevel: 15
      },
      {
        id: "empreendedorismo",
        name: "Empreendedorismo",
        description: "Criar e gerir negócios de sucesso.",
        unlockLevel: 18
      },
      {
        id: "filantropia",
        name: "Filantropia",
        description: "Contribuir para o bem-estar social.",
        unlockLevel: 20
      }
    ]
  }
];
