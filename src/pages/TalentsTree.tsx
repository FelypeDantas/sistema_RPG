import { ArrowLeft, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTalents } from "@/hooks/useTalents";
import { usePlayer } from "@/hooks/usePlayer";

import { TalentNode } from "@/components/rpg/TalentNode";
import { TalentEdge } from "@/components/rpg/TalentEdge";

export default function TalentsTree() {
  const navigate = useNavigate();
  const { level, playerClass } = usePlayer();

  const {
    talents,
    points,
    unlockTalent,
    canUnlock
  } = useTalents(level, playerClass);

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
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
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
        >
          <ArrowLeft />
          Voltar ao Dashboard
        </button>
      </header>

      {/* =============================
          Grafo
      ============================== */}
      <div className="relative w-full h-[900px] overflow-hidden bg-cyber-card rounded-xl border border-white/10">
        {/* SVG das conexões */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {talents.map(talent =>
            talent.requires?.map(reqId => {
              const from = talents.find(t => t.id === reqId);
              if (!from) return null;

              return (
                <TalentEdge
                  key={`${from.id}-${talent.id}`}
                  from={from}
                  to={talent}
                />
              );
            })
          )}
        </svg>

        {/* Nós */}
        {talents.map(talent => (
          <TalentNode
            key={talent.id}
            talent={talent}
            canUnlock={canUnlock(talent)}
            onUnlock={unlockTalent}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        🌱 Cada nó representa uma habilidade real a ser aprendida e
        dominada.
      </p>
    </div>
  );
}
