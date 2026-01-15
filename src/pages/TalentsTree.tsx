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

  /* =============================
     🔗 Gerar conexões (edges)
  ============================== */

  const edges = talents
    .filter(t => t.requires?.length && t.node)
    .flatMap(t =>
      t.requires!
        .map(reqId => {
          const parent = talents.find(p => p.id === reqId);
          if (!parent?.node) return null;
          return { from: parent, to: t };
        })
        .filter(Boolean)
    );

  return (
    <div className="min-h-screen bg-cyber-dark text-white overflow-hidden">
      {/* =============================
          Header
      ============================== */}
      <header className="p-6 flex items-center justify-between">
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
          Container do Grafo
      ============================== */}
      <div className="relative w-full h-[calc(100vh-120px)] overflow-hidden">
        {/* SVG das conexões */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, i) => (
            <TalentEdge
              key={i}
              from={edge!.from}
              to={edge!.to}
            />
          ))}
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

      {/* =============================
          Nota futura
      ============================== */}
      <p className="text-xs text-gray-500 text-center pb-6">
        Em breve: pan, zoom e sub-árvores avançadas 🌐
      </p>
    </div>
  );
}
