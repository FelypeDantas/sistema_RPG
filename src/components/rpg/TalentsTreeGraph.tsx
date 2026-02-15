import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  title: string;
  x: number;
  y: number;
  progress: number;
  icon?: ReactNode;
  locked?: boolean;
};

export default function TalentNode({
  title,
  x,
  y,
  progress,
  icon,
  locked = false
}: Props) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const isComplete = safeProgress >= 100;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (safeProgress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute flex flex-col items-center"
      style={{ left: x, top: y }}
      whileHover={!locked ? { scale: 1.08 } : {}}
    >
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Glow completo */}
        {isComplete && (
          <motion.div
            className="absolute inset-0 rounded-full bg-neon-green/20 blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}

        {/* Anel SVG */}
        <svg width="100" height="100" className="absolute">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#1f2937"
            strokeWidth="6"
            fill="transparent"
          />

          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={isComplete ? "#22c55e" : "#22d3ee"}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1 }}
            style={{
              filter: isComplete
                ? "drop-shadow(0 0 8px #22c55e)"
                : "drop-shadow(0 0 6px #22d3ee)"
            }}
          />
        </svg>

        {/* Núcleo */}
        <div
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-300
            ${
              locked
                ? "bg-gray-800 border border-gray-700"
                : isComplete
                ? "bg-neon-green/20 border border-neon-green"
                : "bg-cyber-card border border-purple-500"
            }
          `}
        >
          {locked ? (
            <Lock size={18} className="text-gray-500" />
          ) : (
            icon
          )}
        </div>
      </div>

      <span
        className={`mt-3 text-xs font-medium text-center ${
          locked ? "text-gray-500" : "text-white"
        }`}
      >
        {title}
      </span>

      <span className="text-[10px] text-gray-400 mt-1">
        {safeProgress}%
      </span>
    </motion.div>
  );
}
