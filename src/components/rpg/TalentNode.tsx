import { Lock, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  x: number;
  y: number;
  progress: number;
  locked?: boolean;
  hasChildren?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function TalentNode({
  title,
  x,
  y,
  progress,
  locked,
  hasChildren,
  collapsed,
  onToggle
}: Props) {
  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute transition-transform duration-300"
      style={{ left: x, top: y }}
      whileHover={!locked ? { scale: 1.05 } : {}}
    >
      <div
        className={`
          w-48 rounded-xl border p-4 text-center relative overflow-hidden
          bg-cyber-card transition-all duration-300
          ${
            locked
              ? "opacity-50 border-gray-700"
              : isComplete
              ? "border-neon-green shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              : "border-purple-500 hover:border-neon-cyan"
          }
        `}
      >
        {/* Glow quando completo */}
        {isComplete && (
          <div className="absolute inset-0 bg-neon-green/10 animate-pulse pointer-events-none" />
        )}

        {locked && (
          <Lock className="mx-auto mb-2 text-gray-400" size={18} />
        )}

        <h3
          className={`font-semibold text-sm ${
            locked ? "text-gray-400" : "text-white"
          }`}
        >
          {title}
        </h3>

        <div className="mt-2 text-xs text-gray-400">
          Treinado {progress}%
        </div>

        {/* Barra animada */}
        <div className="mt-2 h-1 w-full bg-gray-700 rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
            className={`
              h-full rounded
              ${
                isComplete
                  ? "bg-neon-green"
                  : "bg-gradient-to-r from-purple-500 to-neon-cyan"
              }
            `}
          />
        </div>

        {hasChildren && (
          <button
            onClick={onToggle}
            className="mt-3 text-xs text-purple-400 flex items-center justify-center gap-1 hover:text-neon-cyan transition"
          >
            <ChevronDown
              className={`transition-transform duration-300 ${
                collapsed ? "-rotate-90" : ""
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
