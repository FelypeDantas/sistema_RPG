import { Lock, CheckCircle } from "lucide-react";
import { Talent } from "@/types/talent";

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
        absolute rounded-xl p-4 w-56
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
        left: talent.position.x,
        top: talent.position.y
      }}
    >
      {/* Ícone */}
      <div className="flex justify-center mb-2">
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
      {talent.requires?.length > 0 && !unlocked && (
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
              text-xs px-3 py-1 rounded-md
              bg-purple-600 hover:bg-purple-700 transition
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
