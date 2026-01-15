import { motion, AnimatePresence } from "framer-motion";
import { X, ScrollText, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({
  open,
  onClose
}: ProfileDrawerProps) => {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    onClose();
    navigate(path);
  };

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
              z-50 p-6
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
              <h2 className="text-white flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-neon-cyan" />
                Perfil do Personagem
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
              >
                <X />
              </button>
            </header>

            {/* Menu */}
            <nav className="space-y-3">
              <button
                onClick={() => goTo("/quests/history")}
                className="
                  w-full flex items-center justify-between
                  p-4 rounded-lg
                  border border-white/10
                  bg-cyber-card
                  hover:border-neon-cyan/60
                  hover:bg-cyber-card/80
                  transition
                "
              >
                <span className="flex items-center gap-2 text-sm">
                  <ScrollText className="w-4 h-4 text-neon-cyan" />
                  Histórico de Quests
                </span>
              </button>

              <button
                onClick={() => goTo("/talents")}
                className="
                  w-full flex items-center justify-between
                  p-4 rounded-lg
                  border border-white/10
                  bg-cyber-card
                  hover:border-purple-400/60
                  hover:bg-cyber-card/80
                  transition
                "
              >
                <span className="flex items-center gap-2 text-sm">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  Árvore de Habilidades
                </span>
              </button>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
