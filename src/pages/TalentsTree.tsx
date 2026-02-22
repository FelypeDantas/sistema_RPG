import { ArrowLeft, GitBranch, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useCallback } from "react";
import { useTalents } from "../hooks/useTalents";
import TalentNode from "../components/rpg/TalentNode";
import TalentEdge from "../components/rpg/TalentEdge";
import { usePlayerRealtime } from "../hooks/usePlayer";
import CreateTalentModal from "../components/rpg/CreateTalentModal";

export default function TalentsTree() {
  const navigate = useNavigate();
  const player = usePlayerRealtime();
  const level = player?.level ?? 1;
  const containerRef = useRef<HTMLDivElement>(null);

  const talentsHook = useTalents(level);

  const {
    talents = [],
    byId = {},
    collapsed = {},
    toggleCollapse,
    addCustomTalent,
    points = 0,
    unlockTalent,
    trainTalent
  } = talentsHook ?? {};

  const safeTalents = useMemo(() => talents || [], [talents]);
  const safeById = useMemo(() => byId || {}, [byId]);
  const safeCollapsed = useMemo(() => collapsed || {}, [collapsed]);

  const [modalOpen, setModalOpen] = useState(false);
  const [scale, setScale] = useState(1);

  /* =============================
     🔎 HIDE SAFE
  ============================== */
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

  const visibleTalents = useMemo(() => {
    return safeTalents.filter(
      t => t?.id && !isHiddenByAncestor(t.id)
    );
  }, [safeTalents, isHiddenByAncestor]);

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

  const childrenMap = useMemo(() => {
    const map: Record<string, number> = {};
    safeTalents.forEach(t => {
      if (t?.parentId) {
        map[t.parentId] = (map[t.parentId] || 0) + 1;
      }
    });
    return map;
  }, [safeTalents]);

  /* =============================
     🔎 ZOOM SMOOTH
  ============================== */
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setScale(prev =>
        Math.min(1.6, Math.max(0.4, prev - e.deltaY * 0.0008))
      );
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white p-6 relative overflow-hidden">

      {/* 🌌 Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08),transparent_60%)] pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="mb-8 flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">

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

          <div className="flex items-center justify-center gap-2 mt-1">
            <Sparkles size={14} className="text-neon-cyan" />
            <span className="text-sm text-gray-400">
              Pontos Disponíveis:
            </span>

            <span
              className={`text-sm font-bold px-3 py-1 rounded-full transition ${
                points > 0
                  ? "bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {points}
            </span>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-neon-cyan px-5 py-2 rounded-xl font-semibold text-black hover:opacity-90 transition shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          + Nova Habilidade
        </button>
      </header>

      {/* ================= TREE ================= */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="relative w-full h-[80vh] border border-white/10 rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px]"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center"
          }}
          className="absolute inset-0 transition-transform duration-200"
        >
          {/* 🔗 EDGES */}
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

          {/* 🌳 NODES */}
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

        {/* 🔎 Zoom Indicator */}
        <div className="absolute bottom-3 right-4 text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full backdrop-blur">
          Zoom: {(scale * 100).toFixed(0)}%
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