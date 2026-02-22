import { Lock, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState, useRef, useEffect } from "react";

interface TalentNodeProps {
  title: string;
  description?: string;
  position: { x: number; y: number };
  progress: number;
  locked?: boolean;
  hasChildren?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  onUnlock?: () => void;
  onTrain?: () => void;
  points?: number;
}

export default function TalentNode({
  title,
  description,
  position,
  progress,
  locked = false,
  hasChildren = false,
  collapsed = false,
  onToggle,
  onUnlock,
  onTrain,
  points = 0
}: TalentNodeProps) {

  const [isTraining, setIsTraining] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        return points > 0
          ? "opacity-70 border-gray-600 hover:border-purple-500 cursor-pointer"
          : "opacity-50 border-gray-700 cursor-not-allowed";
      case "complete":
        return "border-neon-green shadow-[0_0_20px_rgba(34,197,94,0.35)]";
      default:
        return "border-purple-500 hover:border-neon-cyan hover:shadow-[0_0_18px_rgba(34,211,238,0.25)]";
    }
  }, [state, points]);

  /* =============================
     🔓 Clique para desbloquear
  ============================= */

  const handleClick = () => {
    if (locked && points > 0) {
      onUnlock?.();
      setJustUnlocked(true);

      setTimeout(() => {
        setJustUnlocked(false);
      }, 600);
    }
  };

  /* =============================
     🏋️ Segurar para treinar
  ============================= */

  const startTraining = () => {
    if (locked || safeProgress >= 100) return;

    setIsTraining(true);

    intervalRef.current = setInterval(() => {
      onTrain?.();
    }, 200);
  };

  const stopTraining = () => {
    setIsTraining(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      whileHover={!locked ? { scale: 1.05 } : {}}
      className="absolute select-none"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div
        onClick={handleClick}
        onMouseDown={startTraining}
        onMouseUp={stopTraining}
        onMouseLeave={stopTraining}
        className={`
          w-48 rounded-xl border p-4 text-center relative overflow-hidden
          bg-cyber-card transition-all duration-300
          ${cardStyle}
        `}
      >

        {/* 🔥 Efeito desbloqueio */}
        {justUnlocked && (
          <motion.div
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-neon-cyan/20 rounded-xl pointer-events-none"
          />
        )}

        {/* 🌊 Treinando aura */}
        {isTraining && (
          <motion.div
            className="absolute inset-0 bg-neon-cyan/10 pointer-events-none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}

        {/* Aura completa */}
        {state === "complete" && (
          <motion.div
            className="absolute inset-0 bg-neon-green/10 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
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
            animate={{ width: `${safeProgress}%` }}
            transition={{ duration: 0.4 }}
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

        {/* Tooltip */}
        {description && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 
                       bg-black/90 text-xs px-3 py-2 rounded 
                       border border-purple-500/40 
                       shadow-[0_0_15px_rgba(168,85,247,0.3)] 
                       pointer-events-none whitespace-nowrap z-20"
          >
            {description}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}