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

  const edges = talents
    .filter(t => t.requires && t.node)
    .flatMap(t =>
      t.requires!.map(req => {
        const parent = talents.find(p => p.id === req);
        if (!parent?.node) return null;
        return { from: parent, to: t };
      })
    )
    .filter(Boolean) as { from: any; to: any }[];

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
          className="flex items-center gap-2 text-sm
            text-gray-300 hover:text-white"
        >
          <ArrowLeft />
          Voltar
        </button>
      </header>

      {/* Grafo */}
      <div className="relative w-full h-[600px] bg-cyber-card rounded-xl overflow-hidden">
        {/* Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((e, i) => (
            <TalentEdge
              key={i}
              from={e.from}
              to={e.to}
            />
          ))}
        </svg>

        {/* Nodes */}
        {talents.map(talent => (
          <TalentNode
            key={talent.id}
            talent={talent}
            canUnlock={canUnlock(talent)}
            onUnlock={() => unlockTalent(talent.id)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Em breve: sub-árvores colapsáveis, progresso real e hubs de classe 🌳
      </p>
    </div>
  );
}
