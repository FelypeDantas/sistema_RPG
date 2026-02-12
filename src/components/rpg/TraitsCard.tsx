import { motion } from "framer-motion";

type Trait = {
  id: string;
  name: string;
  description: string;
};

type Props = {
  traits: Trait[];
};

export const TraitsCard = ({ traits }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-cyber-card p-5 rounded-xl border border-white/10"
  >
    <h3 className="text-white mb-4 font-semibold flex items-center gap-2">
      ✨ Traits
    </h3>

    <ul className="space-y-3 text-sm text-gray-300">
      {traits.map(trait => (
        <motion.li
          key={trait.id}
          whileHover={{ scale: 1.02 }}
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
        >
          <div className="flex items-start gap-2">
            <span className="text-neon-cyan mt-0.5">✦</span>

            <div>
              <p className="text-white font-medium">
                {trait.name}
              </p>

              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {trait.description}
              </p>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);
