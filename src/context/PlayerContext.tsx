import { createContext, useContext, useState, ReactNode } from "react";

interface Player {
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

interface PlayerContextType {
  player: Player;
  gainXP: (amount: number) => void;
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>({
    level: 1,
    currentXP: 0,
    nextLevelXP: 100,
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

      return { level, currentXP: xp, nextLevelXP: nextXP };
    });
  }

  function resetPlayer() {
    setPlayer({
      level: 1,
      currentXP: 0,
      nextLevelXP: 100,
    });
  }

  return (
    <PlayerContext.Provider value={{ player, gainXP, resetPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
