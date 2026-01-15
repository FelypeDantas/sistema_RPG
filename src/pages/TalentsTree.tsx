import { ArrowLeft, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTalents } from "../hooks/useTalents";
import TalentNode from "../components/TalentNode";
import TalentEdge from "../components/TalentEdge";

export default function TalentsTree() {
  const navigate = useNavigate();
  const { talents, byId, collapsed, toggleCollapse } = useTalents();

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white overflow-hidden">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="text-purple-400" />
            Árvore de Habilidades
          </h1>
          <p className="text-sm text-gray-400">
            Evolução estratégica do personagem
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
        >
          <ArrowLeft />
          Voltar
        </button>
      </header>

      <div className="relative w-full h-[800px] border border-white/10 rounded-xl">
        <svg className="absolute inset-0 w-full h-full">
          {talents.map(talent =>
            talent.children?.map(childId => {
              if (collapsed[talent.id]) return null;
              const child = byId[childId];
              if (!child) return null;

              return (
                <TalentEdge
                  key={`${talent.id}-${childId}`}
                  from={talent}
                  to={child}
                />
              );
            })
          )}
        </svg>

        {talents.map(talent => {
          if (talent.locked) return null;

          return (
            <TalentNode
              key={talent.id}
              title={talent.title}
              x={talent.x}
              y={talent.y}
              progress={talent.progress}
              locked={talent.locked}
              hasChildren={!!talent.children}
              collapsed={collapsed[talent.id]}
              onToggle={() => toggleCollapse(talent.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
