// pages/HallOfGlory.tsx
import { motion } from "framer-motion";
import { useProgression } from "@/providers/ProgressionProvider";

type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
};

type HallOfGloryProps = {
  achievements?: Achievement[];
};

export function HallOfGlory({ achievements }: HallOfGloryProps) {
  const { level, xp } = useProgression();

  const unlocked = achievements?.filter(a => a.unlocked) || [];

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        Hall da Glória
      </h1>

      <div className="mb-8 text-gray-400">
        Nível {level} • {xp.toLocaleString()} XP
      </div>

      <div className="grid grid-cols-3 gap-6">
        {unlocked.map(a => (
          <motion.div
            key={a.id}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl border border-yellow-400/30 bg-yellow-400/5"
          >
            <div className="text-lg font-semibold text-white">
              {a.name}
            </div>
            <div className="text-sm text-gray-400">
              {a.description}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}