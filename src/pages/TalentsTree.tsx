import { ArrowLeft, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTalents } from "@/hooks/useTalents";
import { usePlayer } from "@/hooks/usePlayer";
import { TalentNode } from "@/components/TalentNode";
import { TalentEdge } from "@/components/TalentEdge";
import { useRef, useState } from "react";

export default function TalentsTree() {
  const navigate = useNavigate();
  const { level, playerClass } = usePlayer();
  const { talents, points, unlockTalent, canUnlock } =
    useTalents(level, playerClass);

  // 🖐️ pan
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    setOffset(prev => ({
      x: prev.x + (e.clientX - last.current.x),
      y: prev.y + (e.clientY - last.current.y)
    }));
    last.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseUp() {
    dragging.current = false;
  }

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
            <span className="text-purple-300">{points}</span>
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

      {/* 🌳 Grafo */}
      <div
        className="
          relative w-full h-[70vh]
          overflow-hidden rounded-xl
          border border-white/10
          bg-black/20
          cursor-grab
        "
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* SVG das conexões */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`
          }}
        >
          {talents.map(talent =>
            talent.connections?.map(connId => {
              const target = talents.find(t => t.id === connId);
              if (!target) return null;

              return (
                <TalentEdge
                  key={`${talent.id}-${connId}`}
                  from={{
                    x: talent.position.x + 112,
                    y: talent.position.y + 40
                  }}
                  to={{
                    x: target.position.x + 112,
                    y: target.position.y
                  }}
                  active={talent.unlocked}
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`
          }}
        >
          {talents.map(talent => (
            <TalentNode
              key={talent.id}
              talent={talent}
              canUnlock={canUnlock(talent)}
              onUnlock={unlockTalent}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Arraste para explorar • Em breve: zoom, sub-árvores e classes avançadas
      </p>
    </div>
  );
}
