import { Lock, CheckCircle } from "lucide-react";
import { Talent } from "@/hooks/useTalents";

interface TalentNodeProps {
  talent: Talent;
  canUnlock: boolean;
  onUnlock: (id: string) => void;
}

export function TalentNode({
  talent,
  canUnlock,
  onUnlock
}: TalentNodeProps) {
  const unlocked = talent.unlocked;

  return (
    <div
      className={`
        absolute rounded-xl p-4 w-52
        bg-cyber-card border transition
        ${
          unlocked
            ? "border-neon-green"
            : canUnlock
            ? "border-purple-500/60 hover:border-purple-400"
            : "border-white/10 opacity-60"
        }
      `}
      style={{
        left: talent.node?.x ?? 0,
        top: talent.node?.y ?? 0
      }}
    >
      {/* Ícone */}
      <div className="mb-2 flex justify-center">
        {unlocked ? (
          <CheckCircle className="text-neon-green" />
        ) : (
          <Lock className="text-gray-500" />
        )}
      </div>

      {/* Título */}
      <h3 className="text-sm font-semibold text-center">
        {talent.title}
      </h3>

      {/* Descrição */}
      <p className="text-[11px] text-gray-400 text-center mt-1">
        {talent.description}
      </p>

      {/* Requisitos */}
      {talent.requires && !unlocked && (
        <p className="text-[10px] text-red-400 text-center mt-1">
          Requer: {talent.requires.join(", ")}
        </p>
      )}

      {/* Ação */}
      <div className="mt-3 flex justify-center">
        {!unlocked && canUnlock && (
          <button
            onClick={() => onUnlock(talent.id)}
            className="
              text-xs px-3 py-1 rounded-lg
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

        {!unlocked && !canUnlock && (
          <span className="text-xs text-gray-500">
            Bloqueado
          </span>
        )}
      </div>
    </div>
  );
}
