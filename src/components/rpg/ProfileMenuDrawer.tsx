import { AnimatePresence, motion } from "framer-motion";
import {
  ScrollText,
  GitBranch,
  LayoutDashboard,
  BookOpen,
  X
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
    setTimeout(() => navigate(path), 150);
  }

  // Fecha com ESC + trava scroll + foco
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
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="
              fixed right-0 top-0 h-full w-full sm:w-[360px]
              bg-cyber-dark z-50 p-6
              border-l border-white/10 outline-none
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white">
                Menu do Personagem
              </h2>

              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="text-gray-400 hover:text-white transition"
              >
                <X />
              </button>
            </div>

            {/* Menu */}
            <nav className="space-y-4">
              <MenuButton
                icon={LayoutDashboard}
                label="Dashboard"
                color="text-neon-green"
                hover="hover:border-neon-green/50 hover:bg-neon-green/10"
                onClick={() => goTo("/")}
              />

              <MenuButton
                icon={ScrollText}
                label="Histórico de Quests"
                color="text-neon-purple"
                hover="hover:border-neon-purple/50 hover:bg-neon-purple/10"
                onClick={() => goTo("/quests/history")}
              />

              <MenuButton
                icon={GitBranch}
                label="Árvore de Habilidades"
                color="text-neon-cyan"
                hover="hover:border-neon-cyan/50 hover:bg-neon-cyan/10"
                onClick={() => goTo("/skills")}
              />

              <MenuButton
                icon={BookOpen}
                label="Codex de Atributos"
                color="text-neon-orange"
                hover="hover:border-neon-orange/50 hover:bg-neon-orange/10"
                onClick={() => goTo("/attributes")}
              />
            </nav>
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
}

function MenuButton({
  icon: Icon,
  label,
  color,
  hover,
  onClick
}: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-4 rounded-xl
        bg-cyber-card border border-white/10
        transition duration-200
        ${hover}
      `}
    >
      <Icon className={color} />
      <span className="text-white font-medium">
        {label}
      </span>
    </button>
  );
}
