import { AnimatePresence, motion } from "framer-motion";
import { ScrollText, GitBranch, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileMenuDrawer = ({
  open,
  onClose
}: ProfileMenuDrawerProps) => {
  const navigate = useNavigate();

  function goTo(path: string) {
    onClose();
    setTimeout(() => navigate(path), 150);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="
              fixed right-0 top-0 h-full w-full sm:w-[360px]
              bg-cyber-dark z-50 p-6
              border-l border-white/10
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white">
                Perfil do Personagem
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
              >
                <X />
              </button>
            </div>

            {/* Menu */}
            <nav className="space-y-4">
              <button
                onClick={() => goTo("/quests/history")}
                className="
                  w-full flex items-center gap-3 p-4 rounded-xl
                  bg-cyber-card border border-white/10
                  hover:border-neon-purple/50 hover:bg-neon-purple/10
                  transition
                "
              >
                <ScrollText className="text-neon-purple" />
                <span className="text-white font-medium">
                  Histórico de Quests
                </span>
              </button>

              <button
                onClick={() => goTo("/skills")}
                className="
                  w-full flex items-center gap-3 p-4 rounded-xl
                  bg-cyber-card border border-white/10
                  hover:border-neon-cyan/50 hover:bg-neon-cyan/10
                  transition
                "
              >
                <GitBranch className="text-neon-cyan" />
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
