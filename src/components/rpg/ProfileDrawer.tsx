import { motion, AnimatePresence } from "framer-motion";
import { X, ScrollText } from "lucide-react";

/* =============================
   📜 TIPAGEM LOCAL
   (não acopla ao hook)
============================== */

interface MissionHistory {
  id: string;
  xp: number;
  success: boolean;
  date: string;
}

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  history: MissionHistory[];
}

export const ProfileDrawer = ({
  open,
  onClose,
  history
}: ProfileDrawerProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.aside
            className="
              fixed right-0 top-0 h-full w-full max-w-md
              bg-cyber-dark border-l border-white/10
              z-50 p-6 overflow-y-auto
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
              <h2 className="text-white flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-neon-cyan" />
                Histórico de Quests
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
              >
                <X />
              </button>
            </header>

            {/* Conteúdo */}
            <ul className="space-y-3">
              {history.length === 0 && (
                <p className="text-gray-400 text-sm">
                  Nenhuma quest finalizada ainda.
                </p>
              )}

              {history
                .slice()
                .reverse()
                .map(h => (
                  <li
                    key={h.id + h.date}
                    className="
                      p-3 rounded-lg border border-white/10
                      bg-cyber-card
                      flex justify-between items-center
                    "
                  >
                    <span
                      className={`text-sm font-medium ${
                        h.success
                          ? "text-neon-green"
                          : "text-neon-red"
                      }`}
                    >
                      {h.success ? "✔ Sucesso" : "✖ Falha"}
                    </span>

                    <span className="text-xs text-gray-400">
                      +{h.xp} XP
                    </span>
                  </li>
                ))}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
