import { useNavigate } from "react-router-dom";
import {
  Shield,
  Brain,
  Swords,
  Crown,
  ArrowLeft
} from "lucide-react";

/* =============================
   🧬 TIPOS
============================= */

interface AdvancedClass {
  id: string;
  name: string;
  description: string;
  requirement: string;
}

interface PlayerClass {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  advanced: AdvancedClass[];
}

/* =============================
   📜 DEFINIÇÃO DAS CLASSES
============================= */

const CLASSES: PlayerClass[] = [
  {
    id: "warrior",
    name: "Guerreiro",
    icon: Shield,
    description:
      "Focado em disciplina, consistência e força física.",
    advanced: [
      {
        id: "paladin",
        name: "Paladino",
        description:
          "Disciplina absoluta. Bônus em streak e missões difíceis.",
        requirement: "Streak 14+ e talento Disciplina"
      },
      {
        id: "berserker",
        name: "Berserker",
        description:
          "Alta recompensa com alto risco. XP maior, chance menor.",
        requirement: "Talento Impulsivo desbloqueado"
      },
      {
        id: "sentinel",
        name: "Sentinela",
        description: "Resistente a falhas. Reduz penalidades e mantém streaks.",
        requirement: "Talento Resiliente desbloqueado"
      },
      {
        id: "champion",
        name: "Campeão",
        description: "Bônus de XP e chance de sucesso em missões difíceis.",
        requirement: "Talento Foco + nível 10"
      }
    ]
  },
  {
    id: "scholar",
    name: "Erudito",
    icon: Brain,
    description:
      "Especialista em aprendizado, foco e eficiência mental.",
    advanced: [
      {
        id: "strategist",
        name: "Estrategista",
        description:
          "Melhora chance de sucesso e reduz penalidades.",
        requirement: "Talento Foco + nível 10"
      },
      {
        id: "archivist",
        name: "Arquivista",
        description:
          "Ganha XP bônus ao revisar histórico e completar séries.",
        requirement: "10 quests de Mente concluídas"
      },
      {
        id: "sage",
        name: "Sábio",
        description:
          "Bônus de XP e chance de sucesso em missões difíceis.",
        requirement: "Talento Foco + nível 10"
      },
      {
        id: "alchemist",
        name: "Alquimista",
        description:
          "Transforma falhas em aprendizado. Reduz penalidades e mantém streaks.",
        requirement: "Talento Resiliente desbloqueado"
      }
    ]
  },
  {
    id: "rogue",
    name: "Errante",
    icon: Swords,
    description:
      "Flexível, adaptável e imprevisível.",
    advanced: [
      {
        id: "assassin",
        name: "Assassino",
        description:
          "Chance alta de sucesso em missões rápidas.",
        requirement: "Talento Velocidade"
      },
      {
        id: "trickster",
        name: "Trapaceiro",
        description:
          "Falhas não quebram streak facilmente.",
        requirement: "Talento Persistente"
      },
      {
        id: "shadow",
        name: "Sombra", 
        description:
          "Bônus de XP e chance de sucesso em missões difíceis.",
        requirement: "Talento Foco + nível 10"
       },
    ]
  }
];

/* =============================
   🧭 COMPONENTE
============================= */

export default function Classes() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-dark p-6 text-white">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="
            p-2 rounded-lg
            bg-cyber-card
            border border-white/10
            hover:border-neon-cyan/50
            transition
          "
        >
          <ArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="text-neon-yellow" />
            Classes
          </h1>
          <p className="text-sm text-gray-400">
            Escolha sua especialização e caminho de evolução
          </p>
        </div>
      </header>

      {/* Lista de Classes */}
      <div className="space-y-6">
        {CLASSES.map(cls => {
          const Icon = cls.icon;

          return (
            <div
              key={cls.id}
              className="
                bg-cyber-card
                border border-white/10
                rounded-xl
                p-5
              "
            >
              {/* Classe Base */}
              <div className="flex items-center gap-3 mb-3">
                <Icon className="text-neon-cyan" />
                <h2 className="text-lg font-semibold">
                  {cls.name}
                </h2>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                {cls.description}
              </p>

              {/* Classes Avançadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cls.advanced.map(adv => (
                  <div
                    key={adv.id}
                    className="
                      p-4 rounded-lg
                      border border-white/10
                      bg-cyber-darker
                    "
                  >
                    <h3 className="font-medium text-neon-purple">
                      {adv.name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {adv.description}
                    </p>

                    <p className="text-xs text-neon-cyan mt-2">
                      Requisito: {adv.requirement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
