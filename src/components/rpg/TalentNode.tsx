import { Lock, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  rarity?: "common" | "rare" | "epic" | "legendary";
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
  points = 0,
  rarity = "common"
}: TalentNodeProps) {

  const [isTraining, setIsTraining] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [hovered, setHovered] = useState(false);
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

  const rarityStyle = useMemo(() => {
    switch (rarity) {
      case "rare":
        return "border-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.35)]";
      case "epic":
        return "border-purple-500 shadow-[0_0_22px_rgba(168,85,247,0.4)]";
      case "legendary":
        return "border-yellow-400 shadow-[0_0_28px_rgba(250,204,21,0.5)]";
      default:
        return "border-purple-500";
    }
  }, [rarity]);

  const cardStyle = useMemo(() => {
    if (state === "locked") {
      return points > 0
        ? "opacity-80 border-gray-600 hover:border-purple-500 cursor-pointer"
        : "opacity-50 border-gray-700 cursor-not-allowed";
    }

    if (state === "complete") {
      return "border-neon-green shadow-[0_0_25px_rgba(34,197,94,0.4)]";
    }

    return `${rarityStyle} hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]`;
  }, [state, rarityStyle, points]);

  const handleClick = () => {
    if (locked && points > 0) {
      onUnlock?.();
      setJustUnlocked(true);
      setTimeout(() => setJustUnlocked(false), 700);
    }
  };

  const startTraining = () => {
    if (locked || safeProgress >= 100) return;
    setIsTraining(true);
    intervalRef.current = setInterval(() => {
      onTrain?.();
    }, 180);
  };

  const stopTraining = () => {
    setIsTraining(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 110, damping: 14 }}
      whileHover={!locked ? { scale: 1.07 } : {}}
      className="absolute select-none"
      style={{ left: position.x, top: position.y }}
    >
      <div
        onClick={handleClick}
        onMouseDown={startTraining}
        onMouseUp={stopTraining}
        onMouseLeave={stopTraining}
        onMouseEnter={() => setHovered(true)}
        onMouseLeaveCapture={() => setHovered(false)}
        className={`
          w-52 rounded-2xl border p-4 text-center relative overflow-hidden
          bg-cyber-card backdrop-blur-md transition-all duration-300
          ${cardStyle}
        `}
      >

        {/* Desbloqueio explosão suave */}
        <AnimatePresence>
          {justUnlocked && (
            <motion.div
              initial={{ opacity: 0.8, scale: 0.4 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 bg-neon-cyan/20 rounded-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Aura de progresso dinâmica */}
        {!locked && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: 0.08 + safeProgress / 200 }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(34,211,238,0.5), transparent 70%)"
            }}
          />
        )}

        {/* Treinando */}
        {isTraining && (
          <motion.div
            className="absolute inset-0 bg-neon-cyan/10 pointer-events-none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}

        {/* Completo */}
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

        {state === "complete" && (
          <Sparkles className="mx-auto mb-2 text-neon-green" size={16} />
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

        {/* Barra viva */}
        <div className="mt-2 h-2 w-full bg-gray-700 rounded overflow-hidden relative z-10">
          <motion.div
            animate={{ width: `${safeProgress}%` }}
            transition={{ duration: 0.3 }}
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

        {/* Tooltip melhorado */}
        <AnimatePresence>
          {description && hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-24 left-1/2 -translate-x-1/2 
                         bg-black/95 text-xs px-3 py-2 rounded-xl 
                         border border-purple-500/40 
                         shadow-[0_0_20px_rgba(168,85,247,0.35)] 
                         pointer-events-none whitespace-nowrap z-20"
            >
              {description}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}