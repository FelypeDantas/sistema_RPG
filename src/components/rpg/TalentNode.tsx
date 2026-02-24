import { Lock, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";

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
  rarity?: "common" | "rare" | "epic" | "legendary";
}

type NodeState = "locked" | "active" | "complete";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

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
  points = 0,
  rarity = "common",
}: TalentNodeProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ===============================
     🧠 DERIVED STATE
  =============================== */

  const safeProgress = useMemo(() => clamp(progress), [progress]);

  const state: NodeState = useMemo(() => {
    if (locked) return "locked";
    if (safeProgress >= 100) return "complete";
    return "active";
  }, [locked, safeProgress]);

  const canUnlock = locked && points > 0;
  const canTrain = !locked && safeProgress < 100;

  /* ===============================
     🎨 RARITY VISUAL
  =============================== */

  const rarityStyle = useMemo(() => {
    const styles = {
      common: "border-purple-500",
      rare: "border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.35)]",
      epic: "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.45)]",
      legendary:
        "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.6)]",
    };
    return styles[rarity];
  }, [rarity]);

  const cardStyle = useMemo(() => {
    if (state === "locked") {
      return canUnlock
        ? "opacity-80 border-gray-600 hover:border-purple-500 cursor-pointer"
        : "opacity-40 border-gray-700 cursor-not-allowed";
    }

    if (state === "complete") {
      return "border-neon-green shadow-[0_0_35px_rgba(34,197,94,0.5)]";
    }

    return `${rarityStyle} hover:shadow-[0_0_35px_rgba(34,211,238,0.35)]`;
  }, [state, canUnlock, rarityStyle]);

  /* ===============================
     🔓 UNLOCK
  =============================== */

  const handleUnlock = useCallback(() => {
    if (!canUnlock) return;

    onUnlock?.();
    setJustUnlocked(true);

    setTimeout(() => setJustUnlocked(false), 700);
  }, [canUnlock, onUnlock]);

  /* ===============================
     ⚡ TRAIN
  =============================== */

  const startTraining = useCallback(() => {
    if (!canTrain) return;

    setIsTraining(true);

    intervalRef.current = setInterval(() => {
      onTrain?.();
    }, 160);
  }, [canTrain, onTrain]);

  const stopTraining = useCallback(() => {
    setIsTraining(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ===============================
     🎬 RENDER
  =============================== */

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 110, damping: 14 }}
      whileHover={!locked ? { scale: 1.08 } : {}}
      className="absolute select-none"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        onClick={handleUnlock}
        onMouseDown={startTraining}
        onMouseUp={stopTraining}
        onMouseLeave={stopTraining}
        onMouseEnter={() => setHovered(true)}
        onMouseLeaveCapture={() => setHovered(false)}
        className={`w-56 rounded-2xl border p-4 text-center relative overflow-hidden
                    bg-cyber-card backdrop-blur-md transition-all duration-300
                    ${cardStyle}`}
      >
        {/* ✨ Unlock Flash */}
        <AnimatePresence>
          {justUnlocked && (
            <motion.div
              initial={{ opacity: 0.8, scale: 0.4 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 bg-neon-cyan/30 rounded-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* ⚡ Training Pulse */}
        {isTraining && (
          <motion.div
            className="absolute inset-0 bg-neon-cyan/10 pointer-events-none"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}

        {/* 🔒 / ✨ State Icon */}
        {state === "locked" && (
          <Lock className="mx-auto mb-2 text-gray-400" size={18} />
        )}

        {state === "complete" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            <Sparkles className="mx-auto mb-2 text-neon-green" size={16} />
          </motion.div>
        )}

        <h3
          className={`font-semibold text-sm ${
            state === "locked" ? "text-gray-400" : "text-white"
          }`}
        >
          {title}
        </h3>

        <div className="mt-2 text-xs text-gray-400">
          Treinado {safeProgress}%
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-2 w-full bg-gray-700/60 rounded overflow-hidden">
          <motion.div
            animate={{ width: `${safeProgress}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded ${
              state === "complete"
                ? "bg-neon-green"
                : "bg-gradient-to-r from-purple-500 via-blue-400 to-neon-cyan"
            }`}
          />
        </div>

        {hasChildren && state !== "locked" && (
          <button
            onClick={onToggle}
            className="mt-3 text-xs text-purple-400 flex items-center justify-center gap-1 hover:text-neon-cyan transition"
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
        <AnimatePresence>
          {description && hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-28 left-1/2 -translate-x-1/2 
                         bg-black/95 text-xs px-4 py-2 rounded-xl 
                         border border-purple-500/40 
                         shadow-[0_0_25px_rgba(168,85,247,0.45)] 
                         pointer-events-none z-20 w-max max-w-xs"
            >
              <div className="font-semibold mb-1 text-purple-300">
                {title}
              </div>
              {description}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}