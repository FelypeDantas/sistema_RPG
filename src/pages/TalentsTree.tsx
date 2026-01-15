import { ArrowLeft, GitBranch, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTalents } from "@/hooks/useTalents";
import { usePlayer } from "@/hooks/usePlayer"; // ajuste se o nome for outro

export default function TalentsTree() {
  const navigate = useNavigate();

  // 🔮 Player
  const { level, playerClass } = usePlayer();

  // 🌳 Talentos
  const {
    talents,
    points,
    unlockTalent,
    canUnlock
  } = useTalents(level, playerClass);

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white">
      {/* =============================
          Header
      ============================== */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="text-purple-400" />
            Árvore de Habilidades
          </h1>
          <p className="text-sm text-gray-400">
            Pontos disponíveis:{" "}
            <span className="text-purple-300 font-medium">
              {points}
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="
            flex items-center gap-2 text-sm
            text-gray-300 hover:text-white transition
          "
        >
          <ArrowLeft />
          Voltar ao Dashboard
        </button>
      </header>

      {/* =============================
          Talents Grid (base do grafo)
      ============================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {talents.map(talent => {
          const unlocked = talent.unlocked;
          const available = canUnlock(talent);

          return (
            <div
              key={talent.id}
              className={`
                relative rounded-xl p-5 border
                bg-cyber-card transition
                ${
                  unlocked
                    ? "border-neon-green"
                    : available
                    ? "border-purple-500/50 hover:border-purple-400"
                    : "border-white/10 opacity-60"
                }
              `}
            >
              {/* Ícone */}
              <div className="mb-3 flex justify-center">
                {unlocked ? (
                  <CheckCircle className="text-neon-green" />
                ) : (
                  <Lock className="text-gray-500" />
                )}
              </div>

              {/* Título */}
              <h3 className="font-semibold text-center">
                {talent.title}
              </h3>

              {/* Descrição */}
              <p className="text-xs text-gray-400 text-center mt-2">
                {talent.description}
              </p>

              {/* Requisitos */}
              {talent.requires && !unlocked && (
                <p className="text-[11px] text-red-400 text-center mt-2">
                  Requer:{" "}
                  {talent.requires.join(", ")}
                </p>
              )}

              {/* Ação */}
              <div className="mt-4 flex justify-center">
                {!unlocked && available && (
                  <button
                    onClick={() => unlockTalent(talent.id)}
                    className="
                      text-xs px-4 py-2 rounded-lg
                      bg-purple-600 hover:bg-purple-700
                      transition
                    "
                  >
                    Desbloquear ({talent.cost})
                  </button>
                )}

                {unlocked && (
                  <span className="text-xs text-neon-green">
                    Desbloqueado
                  </span>
                )}

                {!unlocked && !available && (
                  <span className="text-xs text-gray-500">
                    Bloqueado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =============================
          Nota futura
      ============================== */}
      <p className="text-xs text-gray-500 mt-10 text-center">
        Em breve: visualização em grafo interativo 🌐
      </p>
    </div>
  );
}
