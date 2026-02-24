import { createContext, useContext, useEffect, useState } from "react";

type PlayerClass = "Guerreiro" | "Mago" | "Mercador" | "Diplomata" | null;

interface PlayerContextType {
  xp: number;
  level: number;
  streak: number;
  playerClass: PlayerClass;
  xpToNextLevel: number;
  levelProgress: number;
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

function classBonus(
  playerClass: PlayerClass,
  attribute?: string
): number {
  if (!playerClass || !attribute) return 1;

  const bonusMap: Record<
    Exclude<PlayerClass, null>,
    string
  > = {
    Guerreiro: "Físico",
    Mago: "Mente",
    Mercador: "Finanças",
    Diplomata: "Social",
  };

  return bonusMap[playerClass] === attribute ? 1.2 : 1;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXP] = useState(() => Number(localStorage.getItem(XP_KEY)) || 0);
  const [level, setLevel] = useState(() => {
    const stored = Number(localStorage.getItem(LEVEL_KEY));
    return stored > 0 ? stored : 1;
  });
  const [streak, setStreak] = useState(() => Number(localStorage.getItem(STREAK_KEY)) || 0);
  const [playerClass, setPlayerClass] = useState<PlayerClass>(
    () => (localStorage.getItem(CLASS_KEY) as PlayerClass) || null
  );

  const xpToNextLevel = Math.max(xpToNext(level), 1);

  const levelProgress =
    xpToNextLevel > 0
      ? Math.min((xp / xpToNextLevel) * 100, 100)
      : 0;

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

    setXP(prevXP => {
      let newXP = prevXP + finalXP;

      setLevel(prevLevel => {
        let newLevel = prevLevel;

        while (newXP >= xpToNext(newLevel)) {
          newXP -= xpToNext(newLevel);
          newLevel++;
        }

        return newLevel;
      });

      return newXP;
    });

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
        xpToNextLevel,
        levelProgress,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}