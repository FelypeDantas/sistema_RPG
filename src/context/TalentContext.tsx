// TalentContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type TalentState = {
  unlockedTalents: string[];
  unlockTalent: (id: string) => void;
};

const TalentContext = createContext<TalentState | null>(null);

export const TalentProvider = ({ children }) => {
  const [unlockedTalents, setUnlockedTalents] = useState<string[]>([]);

  // Carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("talents");
    if (saved) {
      setUnlockedTalents(JSON.parse(saved));
    }
  }, []);

  // Salvar sempre que mudar
  useEffect(() => {
    localStorage.setItem("talents", JSON.stringify(unlockedTalents));
  }, [unlockedTalents]);

  const unlockTalent = (id: string) => {
    if (!unlockedTalents.includes(id)) {
      setUnlockedTalents(prev => [...prev, id]);
    }
  };

  return (
    <TalentContext.Provider value={{ unlockedTalents, unlockTalent }}>
      {children}
    </TalentContext.Provider>
  );
};

export const useTalent = () => {
  const context = useContext(TalentContext);
  if (!context) throw new Error("useTalent must be inside TalentProvider");
  return context;
};