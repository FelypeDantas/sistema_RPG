import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ScrollText,
  GitBranch,
  LayoutDashboard,
  BookOpen,
  X,
  Calendar
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";

interface ProfileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
  color: string;
  hover: string;
}

/* -------------------------
   Menu Config
-------------------------- */

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    color: "text-neon-green",
    hover: "hover:border-neon-green/50 hover:bg-neon-green/10"
  },
  {
    label: "Histórico de Quests",
    icon: ScrollText,
    path: "/quests/history",
    color: "text-neon-purple",
    hover: "hover:border-neon-purple/50 hover:bg-neon-purple/10"
  },
  {
    label: "Árvore de Habilidades",
    icon: GitBranch,
    path: "/skills",
    color: "text-neon-cyan",
    hover: "hover:border-neon-cyan/50 hover:bg-neon-cyan/10"
  },
  {
    label: "Codex de Atributos",
    icon: BookOpen,
    path: "/attributes",
    color: "text-neon-orange",
    hover: "hover:border-neon-orange/50 hover:bg-neon-orange/10"
  },
  {
    label: "Acompanhamento Diário",
    icon: Calendar,
    path: "/daily-tracker",
    color: "text-neon-yellow",
    hover: "hover:border-neon-yellow/50 hover:bg-neon-yellow/10"
  }
];

/* -------------------------
   Animation Variants
-------------------------- */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

/* -------------------------
   Component
-------------------------- */

export const ProfileMenuDrawer = ({
  open,
  onClose
}: ProfileMenuDrawerProps) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (path: string) => {
      onClose();
      setTimeout(() => navigate(path), 180);
    },
    [navigate, onClose]
  );

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
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-menu-title"
            className="
              fixed right-0 top-0 h-full w-full sm:w-[360px]
              bg-cyber-dark z-50 p-6
              border-l border-white/10 outline-none
              shadow-2xl shadow-black/50
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2
                id="profile-menu-title"
                className="text-lg font-bold text-white tracking-wide"
              >
                Menu do Personagem
              </h2>

              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X />
              </button>
            </div>

            {/* Navigation */}
            <motion.nav
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {MENU_ITEMS.map((item) => (
                <MenuButton
                  key={item.label}
                  item={item}
                  onClick={() => goTo(item.path)}
                />
              ))}
            </motion.nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

/* -------------------------
   Menu Button
-------------------------- */

interface MenuButtonProps {
  item: MenuItem;
  onClick: () => void;
}

function MenuButton({ item, onClick }: MenuButtonProps) {
  const Icon = item.icon;

  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-4 rounded-xl
        bg-cyber-card border border-white/10
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg
        ${item.hover}
      `}
    >
      <Icon className={`${item.color} shrink-0`} />
      <span className="text-white font-medium tracking-wide">
        {item.label}
      </span>
    </motion.button>
  );
}