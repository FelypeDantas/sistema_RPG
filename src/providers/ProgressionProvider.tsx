// providers/ProgressionProvider.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface ProgressionContextType {
  xp: number;
  level: number;
  addXP: (amount: number) => void;
}

const ProgressionContext = createContext<ProgressionContextType | null>(null);

export function useProgression() {
  const ctx = useContext(ProgressionContext);
  if (!ctx) throw new Error("Wrap with ProgressionProvider");
  return ctx;
}

function calculateLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function ProgressionProvider({ children }: { children: ReactNode }) {
  const [xp, setXP] = useState(0);

  const level = calculateLevel(xp);

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  return (
    <ProgressionContext.Provider value={{ xp, level, addXP }}>
      {children}
    </ProgressionContext.Provider>
  );
}