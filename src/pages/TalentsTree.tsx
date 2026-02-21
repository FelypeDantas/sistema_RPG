import { ArrowLeft, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTalents } from "../hooks/useTalents";
import TalentNode from "../components/rpg/TalentNode";
import TalentEdge from "../components/rpg/TalentEdge";
import { usePlayerRealtime } from "../hooks/usePlayer";
import CreateTalentModal from "../components/rpg/CreateTalentModal";

export default function TalentsTree() {
  const navigate = useNavigate();
  const { level } = usePlayerRealtime();

  const {
    talents,
    byId,
    collapsed,
    toggleCollapse,
    addCustomTalent
  } = useTalents(level);

  const [modalOpen, setModalOpen] = useState(false);

  const visibleEdges = useMemo(() => {
    const edges: { from: any; to: any; key: string }[] = [];

    talents.forEach(talent => {
      if (collapsed[talent.id]) return;

      talent.children?.forEach(childId => {
        const child = byId[childId];
        if (!child) return;

        edges.push({
          from: talent,
          to: child,
          key: `${talent.id}-${childId}`
        });
      });
    });

    return edges;
  }, [talents, byId, collapsed]);

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white overflow-hidden">

      <header className="mb-8 flex items-center justify-between">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
            <GitBranch className="text-purple-400" />
            Árvore de Habilidades
          </h1>
          <p className="text-sm text-gray-400">
            Evolução estratégica do personagem
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-neon-cyan px-4 py-1.5 rounded font-semibold text-black hover:opacity-90 transition shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
          + Nova Habilidade
        </button>

      </header>

      <div className="relative w-full h-[800px] border border-white/10 rounded-xl overflow-hidden">

        <svg className="absolute inset-0 w-full h-full">

          <defs>
            <linearGradient id="edgeGradient">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {visibleEdges.map(edge => (
            <TalentEdge
              key={edge.key}
              from={edge.from}
              to={edge.to}
            />
          ))}

        </svg>

        {talents.map(talent => {
          if (talent.locked) return null;

          return (
            <TalentNode
              key={talent.id}
              title={talent.title}
              position={{ x: talent.x, y: talent.y }}
              progress={talent.progress}
              locked={talent.locked}
              hasChildren={!!talent.children?.length}
              collapsed={collapsed[talent.id]}
              onToggle={() => toggleCollapse(talent.id)}
            />
          );
        })}

      </div>

      <CreateTalentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={addCustomTalent}
        talents={talents}
      />

    </div>
  );
}