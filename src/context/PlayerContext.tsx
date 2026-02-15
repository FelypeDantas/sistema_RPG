import { createContext, useContext, useState, ReactNode } from "react";

interface Player {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streak: number; // dias consecutivos completando missões
}

interface PlayerContextType {
  player: Player;
  gainXP: (amount: number) => void;
  loseXP: (amount: number) => void;
  resetPlayer: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  prestige: number;
  addPrestige: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>({
    level: 1,
    currentXP: 0,
    nextLevelXP: 100,
    streak: 0,
  });

  function gainXP(amount: number) {
    setPlayer(prev => {
      let xp = prev.currentXP + amount;
      let level = prev.level;
      let nextXP = prev.nextLevelXP;

      while (xp >= nextXP) {
        xp -= nextXP;
        level++;
        nextXP = Math.floor(nextXP * 1.2);
      }

      return { ...prev, level, currentXP: xp, nextLevelXP: nextXP };
    });
  }

  function loseXP(amount: number) {
    setPlayer(prev => {
      let xp = prev.currentXP - amount;
      let level = prev.level;
      let nextXP = prev.nextLevelXP;

      while (xp < 0 && level > 1) {
        level--;
        nextXP = Math.floor(nextXP / 1.2);
        xp += nextXP;
      }

      if (xp < 0) xp = 0;

      return { ...prev, level, currentXP: xp, nextLevelXP: nextXP };
    });
  }

  function resetPlayer() {
    setPlayer({
      level: 1,
      currentXP: 0,
      nextLevelXP: 100,
      streak: 0,
    });
  }

  function incrementStreak() {
    setPlayer(prev => ({ ...prev, streak: prev.streak + 1 }));
  }

  function resetStreak() {
    setPlayer(prev => ({ ...prev, streak: 0 }));
  }

  return (
    <PlayerContext.Provider
      value={{ player, gainXP, loseXP, resetPlayer, incrementStreak, resetStreak }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
