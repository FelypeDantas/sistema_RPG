import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { ReactNode } from "react";

type TraitType = "active" | "passive";

type Trait = {
  id: string;
  name: string;
  description: string;
  type: TraitType;
  stacks?: number;
  icon?: ReactNode;
  category?: string;
};

type Props = {
  traits: Trait[];
};

export const TraitsPanel = ({ traits }: Props) => {
  const grouped = traits.reduce<Record<string, Trait[]>>(
    (acc, trait) => {
      const key = trait.category ?? "Geral";
      if (!acc[key]) acc[key] = [];
      acc[key].push(trait);
      return acc;
    },
    {}
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-cyber-card p-6 rounded-xl border border-white/10 space-y-6"
    >
      <h3 className="text-white font-semibold flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-neon-cyan" />
        Traits
      </h3>

      {Object.entries(grouped).map(([category, categoryTraits]) => (
        <div key={category}>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">
            {category}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {categoryTraits.map((trait, index) => (
                <motion.div
                  key={trait.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                >
                  {/* Glow ativo */}
                  {trait.type === "active" && (
                    <motion.div
                      className="absolute inset-0 bg-neon-cyan/10"
                      animate={{ opacity: [0.1, 0.25, 0.1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}

                  <div className="relative flex items-start gap-3">
                    <div className="mt-1">
                      {trait.icon ?? (
                        trait.type === "active" ? (
                          <Zap className="w-4 h-4 text-neon-cyan" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        )
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">
                          {trait.name}
                        </p>

                        {trait.stacks && trait.stacks > 1 && (
                          <motion.span
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.8
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-neon-cyan text-black font-bold"
                          >
                            x{trait.stacks}
                          </motion.span>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        {trait.description}
                      </p>

                      <span className="text-[10px] uppercase tracking-wide text-gray-500">
                        {trait.type === "active"
                          ? "Ativo"
                          : "Passivo"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {traits.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Nenhum trait ativo no momento.
        </p>
      )}
    </motion.div>
  );
};
