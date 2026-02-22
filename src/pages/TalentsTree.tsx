import { ArrowLeft, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useCallback } from "react";
import { useTalents } from "../hooks/useTalents";
import TalentNode from "../components/rpg/TalentNode";
import TalentEdge from "../components/rpg/TalentEdge";
import { usePlayerRealtime } from "../hooks/usePlayer";
import CreateTalentModal from "../components/rpg/CreateTalentModal";

export default function TalentsTree() {
  const navigate = useNavigate();
  const { level } = usePlayerRealtime();
  const containerRef = useRef<HTMLDivElement>(null);

  const talentsHook = useTalents(level);

  const safeTalents = Array.isArray(talentsHook?.talents)
    ? talentsHook.talents
    : [];

  const safeById =
    typeof talentsHook?.byId === "object" && talentsHook.byId
      ? talentsHook.byId
      : {};

  const safeCollapsed =
    typeof talentsHook?.collapsed === "object" && talentsHook.collapsed
      ? talentsHook.collapsed
      : {};

  const {
    toggleCollapse,
    addCustomTalent,
    points = 0,
    unlockTalent,
    trainTalent
  } = talentsHook;

  const [modalOpen, setModalOpen] = useState(false);
  const [scale, setScale] = useState(1);

  /* =====================================================
     🔎 PROTEÇÃO CONTRA LOOP E UNDEFINED
  ===================================================== */
  const isHiddenByAncestor = useCallback(
    (talentId: string) => {
      const visited = new Set<string>();
      let current = safeById[talentId];

      while (current?.parentId) {
        if (visited.has(current.id)) break;
        visited.add(current.id);

        if (safeCollapsed[current.parentId]) return true;
        current = safeById[current.parentId];
      }

      return false;
    },
    [safeById, safeCollapsed]
  );

  /* =====================================================
     🌳 TALENTOS VISÍVEIS SEGUROS
  ===================================================== */
  const visibleTalents = useMemo(() => {
    return safeTalents.filter(
      t => t?.id && !isHiddenByAncestor(t.id)
    );
  }, [safeTalents, isHiddenByAncestor]);

  /* =====================================================
     🔗 EDGES SEGURAS
  ===================================================== */
  const visibleEdges = useMemo(() => {
    return visibleTalents
      .filter(t => t?.parentId && safeById[t.parentId])
      .map(t => ({
        key: `${t.parentId}-${t.id}`,
        from: safeById[t.parentId!],
        to: t
      }))
      .filter(edge => edge.from && edge.to);
  }, [visibleTalents, safeById]);

  /* =====================================================
     🔎 ZOOM CONTROL
  ===================================================== */
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setScale(prev =>
        Math.min(1.5, Math.max(0.5, prev - e.deltaY * 0.001))
      );
    }
  };

  /* =====================================================
     🧠 MAPA DE FILHOS SEGURO
  ===================================================== */
  const childrenMap = useMemo(() => {
    const map: Record<string, number> = {};

    safeTalents.forEach(t => {
      if (t?.parentId) {
        map[t.parentId] = (map[t.parentId] || 0) + 1;
      }
    });

    return map;
  }, [safeTalents]);

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white">
      {/* HEADER */}
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
            <GitBranch className="text-purple-400" />
            Árvore de Habilidades
          </h1>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-400">
              Pontos Disponíveis:
            </span>

            <span
              className={`text-sm font-bold px-2 py-0.5 rounded ${
                points > 0
                  ? "bg-neon-cyan/20 text-neon-cyan"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {points}
            </span>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-neon-cyan px-4 py-1.5 rounded font-semibold text-black hover:opacity-90 transition shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
          + Nova Habilidade
        </button>
      </header>

      {/* ÁRVORE */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="relative w-full h-[85vh] border border-white/10 rounded-xl overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px]"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center"
          }}
          className="absolute inset-0 transition-transform duration-200"
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
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

          {visibleTalents.map(talent => (
            <TalentNode
              key={talent.id}
              title={talent.title ?? ""}
              position={{
                x: talent.x ?? 0,
                y: talent.y ?? 0
              }}
              progress={talent.progress ?? 0}
              locked={!!talent.locked}
              hasChildren={!!childrenMap[talent.id]}
              collapsed={!!safeCollapsed[talent.id]}
              onToggle={() => toggleCollapse?.(talent.id)}
              points={points}
              onUnlock={() => unlockTalent?.(talent.id)}
              onTrain={() => trainTalent?.(talent.id)}
            />
          ))}
        </div>
      </div>

      <CreateTalentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={addCustomTalent}
        talents={safeTalents}
      />
    </div>
  );
}