import { Lock, CheckCircle } from "lucide-react";
import { Talent } from "@/hooks/useTalents";

interface Props {
  talent: Talent;
  canUnlock: boolean;
  onUnlock: (id: string) => void;
}

export function TalentNode({
  talent,
  canUnlock,
  onUnlock
}: Props) {
  if (!talent.node) return null;

  return (
    <div
      className={`
        absolute rounded-xl p-4 w-52
        border bg-cyber-card transition
        ${
          talent.unlocked
            ? "border-neon-green"
            : canUnlock
            ? "border-purple-500/60 hover:border-purple-400"
            : "border-white/10 opacity-60"
        }
      `}
      style={{
        left: talent.node.x,
        top: talent.node.y
      }}
    >
      {/* Ícone */}
      <div className="mb-2 flex justify-center">
        {talent.unlocked ? (
          <CheckCircle className="text-neon-green" />
        ) : (
          <Lock className="text-gray-500" />
        )}
      </div>

      {/* Título */}
      <h3 className="font-semibold text-center text-sm">
        {talent.title}
      </h3>

      {/* Descrição */}
      <p className="text-[11px] text-gray-400 text-center mt-1">
        {talent.description}
      </p>

      {/* Requisitos */}
      {talent.requires && !talent.unlocked && (
        <p className="text-[10px] text-red-400 text-center mt-1">
          Requer: {talent.requires.join(", ")}
        </p>
      )}

      {/* Ação */}
      <div className="mt-3 flex justify-center">
        {!talent.unlocked && canUnlock && (
          <button
            onClick={() => onUnlock(talent.id)}
            className="
              text-xs px-3 py-1 rounded-md
              bg-purple-600 hover:bg-purple-700
              transition
            "
          >
            Desbloquear ({talent.cost})
          </button>
        )}

        {talent.unlocked && (
          <span className="text-xs text-neon-green">
            Desbloqueado
          </span>
        )}

        {!talent.unlocked && !canUnlock && (
          <span className="text-xs text-gray-500">
            Bloqueado
          </span>
        )}
      </div>
    </div>
  );
}
