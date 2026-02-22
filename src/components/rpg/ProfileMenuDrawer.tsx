import { AnimatePresence, motion } from "framer-motion";
import {
  ScrollText,
  GitBranch,
  LayoutDashboard,
  BookOpen,
  X,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

interface ProfileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileMenuDrawer = ({
  open,
  onClose
}: ProfileMenuDrawerProps) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  function goTo(path: string) {
    onClose();
    setTimeout(() => navigate(path), 180);
  }

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

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

            {/* Menu */}
            <motion.nav
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <MenuButton
                icon={LayoutDashboard}
                label="Dashboard"
                color="text-neon-green"
                hover="hover:border-neon-green/50 hover:bg-neon-green/10"
                onClick={() => goTo("/")}
                variants={itemVariants}
              />

              <MenuButton
                icon={ScrollText}
                label="Histórico de Quests"
                color="text-neon-purple"
                hover="hover:border-neon-purple/50 hover:bg-neon-purple/10"
                onClick={() => goTo("/quests/history")}
                variants={itemVariants}
              />

              <MenuButton
                icon={GitBranch}
                label="Árvore de Habilidades"
                color="text-neon-cyan"
                hover="hover:border-neon-cyan/50 hover:bg-neon-cyan/10"
                onClick={() => goTo("/skills")}
                variants={itemVariants}
              />

              <MenuButton
                icon={BookOpen}
                label="Codex de Atributos"
                color="text-neon-orange"
                hover="hover:border-neon-orange/50 hover:bg-neon-orange/10"
                onClick={() => goTo("/attributes")}
                variants={itemVariants}
              />

              <MenuButton
                icon={Calendar}
                label="Acompanhamento Diário"
                color="text-neon-yellow"
                hover="hover:border-neon-yellow/50 hover:bg-neon-yellow/10"
                onClick={() => goTo("/daily-tracker")}
                variants={itemVariants}
              />
            </motion.nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

interface MenuButtonProps {
  icon: any;
  label: string;
  color: string;
  hover: string;
  onClick: () => void;
  variants: any;
}

function MenuButton({
  icon: Icon,
  label,
  color,
  hover,
  onClick,
  variants
}: MenuButtonProps) {
  return (
    <motion.button
      variants={variants}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-4 rounded-xl
        bg-cyber-card border border-white/10
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg
        ${hover}
      `}
    >
      <Icon className={`${color} shrink-0`} />
      <span className="text-white font-medium tracking-wide">
        {label}
      </span>
    </motion.button>
  );
}
