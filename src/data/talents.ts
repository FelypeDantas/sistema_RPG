import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Zap,
  Flame,
  Shield
} from "lucide-react";

/* =============================
   🧬 TIPOS
============================= */

export interface TalentEffect {
  xpBonus?: number;
  successBonus?: number;
  streakProtection?: boolean;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  requires?: string[];
  effect: TalentEffect;
}

/* =============================
   🌳 DEFINIÇÃO DOS TALENTOS
============================= */

const TALENTS: Talent[] = [
  {
    id: "focus",
    name: "Foco",
    icon: Brain,
    description:
      "Aumenta a chance de sucesso em missões.",
    effect: {
      successBonus: 0.1
    }
  },
  {
    id: "discipline",
    name: "Disciplina",
    icon: Shield,
    description:
      "Streaks longas concedem XP bônus.",
    requires: ["focus"],
    effect: {
      xpBonus: 0.1
    }
  },
  {
    id: "momentum",
    name: "Impulso",
    icon: Zap,
    description:
      "Falhas não quebram o streak imediatamente.",
    requires: ["discipline"],
    effect: {
      streakProtection: true
    }
  },
  {
    id: "overdrive",
    name: "Sobrecarga",
    icon: Flame,
    description:
      "Missões difíceis concedem mais XP, mas com risco maior.",
    requires: ["focus"],
    effect: {
      xpBonus: 0.2,
      successBonus: -0.05
    }
  }
];

/* =============================
   🧠 MOCK DE ESTADO (futuro hook)
============================= */

const unlockedTalents = ["focus"]; // exemplo
const talentPoints = 2;

/* =============================
   🧭 COMPONENTE
============================= */

export default function Talents() {
  const navigate = useNavigate();

  const canUnlock = (talent: Talent) => {
    if (!talent.requires) return true;
    return talent.requires.every(req =>
      unlockedTalents.includes(req)
    );
  };

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
          <h1 className="text-2xl font-bold">
            Árvore de Talentos
          </h1>
          <p className="text-sm text-gray-400">
            Pontos disponíveis: {talentPoints}
          </p>
        </div>
      </header>

      {/* Talentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TALENTS.map(talent => {
          const Icon = talent.icon;
          const unlocked = unlockedTalents.includes(
            talent.id
          );
          const available =
            !unlocked && canUnlock(talent);

          return (
            <div
              key={talent.id}
              className={`
                relative p-5 rounded-xl border
                transition-all
                ${
                  unlocked
                    ? "border-neon-green bg-neon-green/10"
                    : available
                    ? "border-neon-cyan/40 bg-cyber-card hover:border-neon-cyan"
                    : "border-white/10 bg-cyber-darker opacity-50"
                }
              `}
            >
              {/* Ícone */}
              <div className="flex items-center gap-3 mb-2">
                <Icon
                  className={`w-6 h-6 ${
                    unlocked
                      ? "text-neon-green"
                      : "text-neon-cyan"
                  }`}
                />

                <h3 className="font-semibold">
                  {talent.name}
                </h3>
              </div>

              <p className="text-sm text-gray-400 mb-3">
                {talent.description}
              </p>

              {/* Requisitos */}
              {talent.requires && (
                <p className="text-xs text-gray-500 mb-3">
                  Requer:{" "}
                  {talent.requires.join(", ")}
                </p>
              )}

              {/* Estado */}
              {unlocked && (
                <span className="text-xs text-neon-green font-medium">
                  Desbloqueado
                </span>
              )}

              {available && (
                <button
                  className="
                    mt-3 w-full py-2 rounded-lg
                    bg-neon-cyan/20
                    text-neon-cyan text-sm font-medium
                    hover:bg-neon-cyan/30
                    transition
                  "
                >
                  Desbloquear
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
