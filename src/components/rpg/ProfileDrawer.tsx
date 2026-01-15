import { motion, AnimatePresence } from "framer-motion";
import { X, ScrollText, GitBranch, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({ open, onClose }: ProfileDrawerProps) => {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
    onClose();
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
              <h2 className="text-white text-lg font-semibold">
                Menu do Personagem
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X />
              </button>
            </header>

            {/* Navegação */}
            <nav className="space-y-4">
              <button
                onClick={() => goTo("/")}
                className="w-full flex items-center gap-3 p-4 rounded-xl
                           bg-cyber-card border border-white/10
                           hover:border-neon-cyan transition"
              >
                <LayoutDashboard className="text-neon-cyan" />
                <span className="text-white font-medium">
                  Dashboard
                </span>
              </button>

              <button
                onClick={() => goTo("/quests/history")}
                className="w-full flex items-center gap-3 p-4 rounded-xl
                           bg-cyber-card border border-white/10
                           hover:border-neon-green transition"
              >
                <ScrollText className="text-neon-green" />
                <span className="text-white font-medium">
                  Histórico de Quests
                </span>
              </button>

              <button
                onClick={() => goTo("/talents")}
                className="w-full flex items-center gap-3 p-4 rounded-xl
                           bg-cyber-card border border-white/10
                           hover:border-purple-400 transition"
              >
                <GitBranch className="text-purple-400" />
                <span className="text-white font-medium">
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
