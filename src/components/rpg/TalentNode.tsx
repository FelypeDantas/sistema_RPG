import { motion } from "framer-motion";
import { Lock, CheckCircle, ChevronDown } from "lucide-react";
import { Talent } from "@/hooks/useTalents";

interface TalentNodeProps {
  talent: Talent;
  canUnlock: boolean;
  onUnlock: () => void;
  onToggle?: () => void;
}

export function TalentNode({
  talent,
  canUnlock,
  onUnlock,
  onToggle
}: TalentNodeProps) {
  const unlocked = talent.unlocked;

  return (
    <motion.div
      className={`
        absolute rounded-xl p-4 w-48
        bg-cyber-card border text-center
        ${
          unlocked
            ? "border-neon-green"
            : canUnlock
            ? "border-purple-500/50"
            : "border-white/10 opacity-60"
        }
      `}
      style={{
        left: talent.node?.x ?? 0,
        top: talent.node?.y ?? 0
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
    >
      {/* Ícone */}
      <div className="flex justify-center mb-2">
        {unlocked ? (
          <CheckCircle className="text-neon-green" />
        ) : (
          <Lock className="text-gray-500" />
        )}
      </div>

      <h3 className="font-semibold text-sm">
        {talent.title}
      </h3>

      <p className="text-[11px] text-gray-400 mt-1">
        {talent.description}
      </p>

      {/* Progresso (placeholder futuro) */}
      {"progress" in talent && (
        <p className="text-xs mt-1 text-purple-300">
          Treinado {(talent as any).progress ?? 0}%
        </p>
      )}

      {/* Ações */}
      <div className="mt-3 space-y-1">
        {!unlocked && canUnlock && (
          <button
            onClick={onUnlock}
            className="w-full text-xs px-2 py-1 rounded
              bg-purple-600 hover:bg-purple-700 transition"
          >
            Desbloquear ({talent.cost})
          </button>
        )}

        {talent.requires && onToggle && unlocked && (
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-1
              text-xs text-gray-300 hover:text-white"
          >
            <ChevronDown size={14} />
            Expandir
          </button>
        )}
      </div>
    </motion.div>
  );
}
