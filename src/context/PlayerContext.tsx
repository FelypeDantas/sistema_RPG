import { createContext, useContext, useEffect, useState } from "react";

type PlayerClass = "Guerreiro" | "Mago" | "Mercador" | "Diplomata" | null;

interface PlayerContextType {
  xp: number;
  level: number;
  streak: number;
  playerClass: PlayerClass;
  chooseClass: (c: PlayerClass) => void;
  gainXP: (amount: number, attribute?: string) => void;
  loseXP: (amount: number) => void;
  resetStreak: () => void;
}

const PlayerContext = createContext<PlayerContextType>(
  {} as PlayerContextType
);

const XP_KEY = "rpg_xp";
const LEVEL_KEY = "rpg_level";
const STREAK_KEY = "rpg_streak";
const CLASS_KEY = "rpg_class";

function xpToNext(level: number) {
  return Math.round(100 * Math.pow(level, 1.4));
}

function classBonus(playerClass: PlayerClass, attribute?: string) {
  if (!playerClass || !attribute) return 1;

  if (playerClass === "Guerreiro" && attribute === "Físico") return 1.2;
  if (playerClass === "Mago" && attribute === "Mente") return 1.2;
  if (playerClass === "Mercador" && attribute === "Finanças") return 1.2;
  if (playerClass === "Diplomata" && attribute === "Social") return 1.2;

  return 1;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXP] = useState(() => Number(localStorage.getItem(XP_KEY)) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem(LEVEL_KEY)) || 1);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem(STREAK_KEY)) || 0);
  const [playerClass, setPlayerClass] = useState<PlayerClass>(
    () => (localStorage.getItem(CLASS_KEY) as PlayerClass) || null
  );

  useEffect(() => {
    localStorage.setItem(XP_KEY, String(xp));
    localStorage.setItem(LEVEL_KEY, String(level));
    localStorage.setItem(STREAK_KEY, String(streak));
  }, [xp, level, streak]);

  function chooseClass(c: PlayerClass) {
    setPlayerClass(c);
    localStorage.setItem(CLASS_KEY, c || "");
  }

  function gainXP(amount: number, attribute?: string) {
    const bonus = classBonus(playerClass, attribute);
    const finalXP = Math.round(amount * bonus);

    let newXP = xp + finalXP;
    let newLevel = level;

    while (newXP >= xpToNext(newLevel)) {
      newXP -= xpToNext(newLevel);
      newLevel++;
    }

    setXP(newXP);
    setLevel(newLevel);
    setStreak(prev => prev + 1);
  }

  function loseXP(amount: number) {
    setXP(prev => Math.max(prev - amount, 0));
  }

  function resetStreak() {
    setStreak(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        xp,
        level,
        streak,
        playerClass,
        chooseClass,
        gainXP,
        loseXP,
        resetStreak,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
