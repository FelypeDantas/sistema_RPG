import { Check, Zap } from "lucide-react";
import { Mission } from "@/hooks/useMissions";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestCardProps {
  quest: Mission;
  onComplete: () => void;
}

const attributeColors: Record<string, string> = {
  Físico: "text-neon-red border-neon-red/30 bg-neon-red/10",
  Mente: "text-neon-blue border-neon-blue/30 bg-neon-blue/10",
  Social: "text-neon-purple border-neon-purple/30 bg-neon-purple/10",
  Finanças: "text-neon-green border-neon-green/30 bg-neon-green/10"
};

export const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [displayXp, setDisplayXp] = useState(quest.completed ? quest.xp : 0);
  const [burst, setBurst] = useState(false);

  // Tooltip imediato
  useEffect(() => {
    setShowTooltip(hovering);
  }, [hovering]);

  // XP counter animation
  useEffect(() => {
    if (!quest.completed) return;

    let start = 0;
    const duration = 600;
    const increment = quest.xp / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= quest.xp) {
        setDisplayXp(quest.xp);
        clearInterval(counter);
      } else {
        setDisplayXp(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [quest.completed, quest.xp]);

  // Sound + burst effect
  useEffect(() => {
    if (!quest.completed) return;

    setBurst(true);
    const audio = new Audio("/complete.mp3"); // coloque em /public
    audio.volume = 0.4;
    audio.play().catch(() => {});

    const timer = setTimeout(() => setBurst(false), 600);
    return () => clearTimeout(timer);
  }, [quest.completed]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, scale: 0.96, filter: "blur(4px)" }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={!quest.completed ? { scale: 1.02 } : {}}
      className={`
        relative p-4 rounded-xl border
        transition-all duration-300
        ${quest.completed
          ? "bg-neon-green/10 border-neon-green/40 shadow-[0_0_25px_rgba(34,197,94,0.25)]"
          : "bg-cyber-darker border-white/10 hover:border-neon-cyan/60 hover:bg-cyber-card"
        }
      `}
    >
      {/* Holographic overlay */}
      {!quest.completed && hovering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-neon-cyan via-transparent to-neon-purple pointer-events-none"
        />
      )}

      {/* Burst particles */}
      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-xl border-2 border-neon-green pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start gap-3">
          <div
            onClick={() => { if (!quest.completed) onComplete(); }}
            className={`
              w-6 h-6 rounded-lg border-2 flex items-center justify-center
              transition-all cursor-pointer
              ${quest.completed
                ? "bg-neon-green border-neon-green"
                : "border-gray-600 hover:border-neon-cyan"
              }
            `}
          >
            {quest.completed && <Check className="w-4 h-4 text-cyber-dark" />}
          </div>

          <div>
            <h4 className={`font-medium ${quest.completed ? "text-gray-400 line-through" : "text-white"}`}>
              {quest.title}
            </h4>

            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full border ${attributeColors[quest.attribute]}`}>
              {quest.attribute}
            </span>
          </div>
        </div>

        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-lg
          ${quest.completed ? "bg-neon-green/20" : "bg-neon-cyan/10"}
        `}>
          <Zap className={`w-4 h-4 ${quest.completed ? "text-neon-green" : "text-neon-cyan"}`} />
          <span className={`font-bold text-sm ${quest.completed ? "text-neon-green" : "text-neon-cyan"}`}>
            +{quest.completed ? displayXp : quest.xp}
          </span>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {quest.description && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute z-30 left-1/2 -translate-x-1/2 top-full mt-3
              w-64 p-3 rounded-lg
              bg-black/90 border border-neon-cyan/30
              text-xs text-gray-200 shadow-xl
              pointer-events-none
            "
          >
            {quest.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
