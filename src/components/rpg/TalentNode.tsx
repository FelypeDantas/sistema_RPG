import { Lock, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface TalentNodeProps {
  title: string;
  position: { x: number; y: number };
  progress: number;
  locked?: boolean;
  hasChildren?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function TalentNode({
  title,
  position,
  progress,
  locked = false,
  hasChildren = false,
  collapsed = false,
  onToggle
}: TalentNodeProps) {

  const safeProgress = useMemo(
    () => Math.min(Math.max(progress ?? 0, 0), 100),
    [progress]
  );

  const state = useMemo(() => {
    if (locked) return "locked";
    if (safeProgress >= 100) return "complete";
    return "active";
  }, [locked, safeProgress]);

  const cardStyle = useMemo(() => {
    switch (state) {
      case "locked":
        return "opacity-50 border-gray-700 pointer-events-none";
      case "complete":
        return "border-neon-green shadow-[0_0_20px_rgba(34,197,94,0.35)]";
      default:
        return "border-purple-500 hover:border-neon-cyan hover:shadow-[0_0_18px_rgba(34,211,238,0.25)]";
    }
  }, [state]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      whileHover={!locked ? { scale: 1.05 } : {}}
      className="absolute select-none"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div
        className={`
          w-48 rounded-xl border p-4 text-center relative overflow-hidden
          bg-cyber-card transition-all duration-300
          ${cardStyle}
        `}
      >

        {/* Aura Completa */}
        {state === "complete" && (
          <motion.div
            className="absolute inset-0 bg-neon-green/10 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}

        {/* Glow ativo */}
        {state === "active" && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-neon-cyan/5 pointer-events-none" />
        )}

        {state === "locked" && (
          <Lock className="mx-auto mb-2 text-gray-400" size={18} />
        )}

        <h3
          className={`font-semibold text-sm relative z-10 ${
            state === "locked" ? "text-gray-400" : "text-white"
          }`}
        >
          {title}
        </h3>

        <div className="mt-2 text-xs text-gray-400 relative z-10">
          Treinado {safeProgress}%
        </div>

        <div className="mt-2 h-1.5 w-full bg-gray-700 rounded overflow-hidden relative z-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safeProgress}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded ${
              state === "complete"
                ? "bg-neon-green"
                : "bg-gradient-to-r from-purple-500 to-neon-cyan"
            }`}
          />
        </div>

        {hasChildren && state !== "locked" && (
          <button
            onClick={onToggle}
            className="mt-3 text-xs text-purple-400 flex items-center justify-center gap-1 hover:text-neon-cyan transition relative z-10"
          >
            <ChevronDown
              className={`transition-transform duration-300 ${
                collapsed ? "-rotate-90" : "rotate-0"
              }`}
              size={14}
            />
            Sub-habilidades
          </button>
        )}
      </div>
    </motion.div>
  );
}