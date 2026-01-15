import { Check, Zap } from "lucide-react";
import { Mission } from "@/hooks/useMissions";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface QuestCardProps {
  quest: Mission;
  onComplete: () => void;
}

const attributeColors: Record<string, string> = {
  "Físico": "text-neon-red border-neon-red/30 bg-neon-red/10",
  "Mente": "text-neon-blue border-neon-blue/30 bg-neon-blue/10",
  "Social": "text-neon-purple border-neon-purple/30 bg-neon-purple/10",
  "Finanças": "text-neon-green border-neon-green/30 bg-neon-green/10"
};

export const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering) {
      setShowTooltip(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [hovering]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.96,
        filter: "blur(4px)"
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${quest.done
          ? "bg-neon-green/10 border-neon-green/30"
          : "bg-cyber-darker border-white/10 hover:border-neon-cyan/50 hover:bg-cyber-card"
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            onClick={() => {
              if (!quest.done) onComplete();
            }}
            className={`
              w-6 h-6 rounded-lg border-2 flex items-center justify-center
              transition-all cursor-pointer
              ${quest.done
                ? "bg-neon-green border-neon-green"
                : "border-gray-600 hover:border-neon-cyan"
              }
            `}
          >
            {quest.done && (
              <Check className="w-4 h-4 text-cyber-dark" />
            )}
          </div>

          <div>
            <h4
              className={`font-medium ${
                quest.done
                  ? "text-gray-400 line-through"
                  : "text-white"
              }`}
            >
              {quest.title}
            </h4>

            <span
              className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full border ${attributeColors[quest.attribute]}`}
            >
              {quest.attribute}
            </span>
          </div>
        </div>

        <div
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg
            ${quest.done ? "bg-neon-green/20" : "bg-neon-cyan/10"}
          `}
        >
          <Zap
            className={`w-4 h-4 ${
              quest.done ? "text-neon-green" : "text-neon-cyan"
            }`}
          />
          <span
            className={`font-bold text-sm ${
              quest.done ? "text-neon-green" : "text-neon-cyan"
            }`}
          >
            +{quest.xp}
          </span>
        </div>
      </div>

      {/* Tooltip com delay */}
      {quest.description && showTooltip && (
        <div
          className="
            absolute z-30 left-1/2 -translate-x-1/2 top-full mt-3
            w-64 p-3 rounded-lg
            bg-black/90 border border-neon-cyan/30
            text-xs text-gray-200
            animate-fade-in
            pointer-events-none
          "
        >
          {quest.description}
        </div>
      )}

      {quest.done && (
        <div className="absolute inset-0 rounded-xl bg-neon-green/5 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  );
};
