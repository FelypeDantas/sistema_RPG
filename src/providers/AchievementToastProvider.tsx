// providers/AchievementToastProvider.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToastData {
  id: string;
  name: string;
  rarity: string;
}

interface ContextType {
  showAchievement: (data: ToastData) => void;
}

const AchievementToastContext = createContext<ContextType | null>(null);

export function useAchievementToast() {
  const ctx = useContext(AchievementToastContext);
  if (!ctx) throw new Error("Wrap with AchievementToastProvider");
  return ctx;
}

export function AchievementToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showAchievement = (data: ToastData) => {
    setToast(data);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <AchievementToastContext.Provider value={{ showAchievement }}>
      {children}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-yellow-400/40 px-6 py-3 rounded-xl shadow-2xl"
          >
            <div className="text-yellow-400 font-bold tracking-widest text-sm">
              ACHIEVEMENT UNLOCKED
            </div>
            <div className="text-white text-lg font-semibold">
              {toast.name}
            </div>
            <div className="text-gray-400 text-xs uppercase">
              {toast.rarity}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AchievementToastContext.Provider>
  );
}