import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ScrollText,
  GitBranch,
  LayoutDashboard,
  BookOpen,
  Coins,
  Calendar,
  Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  hover: string;
  color: string;
  external?: boolean;
}

/* -----------------------------
   Navigation Config (isolado)
------------------------------ */

const NAV_ITEMS: NavItem[] = [
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
    icon: Coins,
    path: "https://meu-dashboard-financeiro.vercel.app/",
    hover: "hover:border-neon-yellow",
    color: "text-neon-yellow",
    external: true
  },
  {
    label: "Acompanhamento Diário",
    icon: Calendar,
    path: "/daily-tracker",
    hover: "hover:border-neon-yellow/50 hover:bg-neon-yellow/10",
    color: "text-neon-yellow"
  },
  {
    label: "Hall da Glória",
    icon: Crown,
    path: "/hall-of-glory",
    hover: "hover:border-neon-yellow/50 hover:bg-neon-yellow/10",
    color: "text-neon-yellow"
  }
];

/* -----------------------------
   Component
------------------------------ */

export const ProfileDrawer = ({ open, onClose }: ProfileDrawerProps) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (path: string, external?: boolean) => {
      if (external) {
        window.open(path, "_blank", "noopener,noreferrer");
      } else {
        navigate(path);
      }
      onClose();
    },
    [navigate, onClose]
  );

  /* ESC + Scroll Lock */

  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="
              fixed right-0 top-0 h-full w-full max-w-md
              bg-cyber-dark border-l border-white/10
              z-50 p-6 outline-none
              shadow-2xl shadow-black/50
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
              <h2
                id="drawer-title"
                className="text-white text-lg font-semibold tracking-wide"
              >
                Menu do Personagem
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Fechar menu"
              >
                <X />
              </button>
            </header>

            {/* Navigation */}
            <nav className="space-y-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => goTo(item.path, item.external)}
                    className={`
                      w-full flex items-center gap-3 p-4 rounded-xl
                      bg-cyber-card border border-white/10
                      transition-all duration-200
                      hover:-translate-y-0.5 hover:shadow-lg
                      ${item.hover}
                    `}
                  >
                    <Icon className={`${item.color} shrink-0`} />
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