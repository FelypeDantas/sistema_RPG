import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ScrollText,
  GitBranch,
  LayoutDashboard,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({
  open,
  onClose
}: ProfileDrawerProps) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      hover: "hover:border-neon-cyan",
      color: "text-neon-cyan"
    },
    {
      label: "Histórico de Quests",
      icon: ScrollText,
      path: "/quests/history",
      hover: "hover:border-neon-green",
      color: "text-neon-green"
    },
    {
      label: "Árvore de Habilidades",
      icon: GitBranch,
      path: "/talents",
      hover: "hover:border-purple-400",
      color: "text-purple-400"
    },
    {
      label: "Codex de Atributos",
      icon: BookOpen,
      path: "/attributes",
      hover: "hover:border-neon-orange",
      color: "text-neon-orange"
    },
    {
      label: "Moedas",
      icon: BookOpen,
      path: "https://meu-dashboard-financeiro.vercel.app/",
      hover: "hover:border-neon-yellow",
      color: "text-neon-yellow"
    }
  ];

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
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="
              fixed right-0 top-0 h-full w-full max-w-md
              bg-cyber-dark border-l border-white/10
              z-50 p-6 outline-none
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
              <h2 className="text-white text-lg font-semibold">
                Menu do Personagem
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
                aria-label="Fechar menu"
              >
                <X />
              </button>
            </header>

            {/* Navegação */}
            <nav className="space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => goTo(item.path)}
                    className={`
                      w-full flex items-center gap-3 p-4 rounded-xl
                      bg-cyber-card border border-white/10
                      transition duration-200
                      ${item.hover}
                    `}
                  >
                    <Icon className={item.color} />
                    <span className="text-white font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
