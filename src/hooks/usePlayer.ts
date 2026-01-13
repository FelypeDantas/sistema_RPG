import { useEffect, useState } from "react";

const STORAGE_KEY = "life_rpg_player";

export function usePlayer() {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

  const [attributes, setAttributes] = useState({
    Físico: 10,
    Mente: 10,
    Social: 10,
    Finanças: 10
  });

  const nextLevelXP = Math.floor(100 + xp * 0.9);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);
    setLevel(data.level);
    setXP(data.xp);
    setAttributes(data.attributes);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ level, xp, attributes })
    );
  }, [level, xp, attributes]);

  const gainXP = (amount: number, attribute?: keyof typeof attributes) => {
    setXP(prev => {
      const total = prev + amount;

      if (total >= nextLevelXP) {
        setLevel(l => l + 1);
        return total - nextLevelXP;
      }

      return total;
    });

    if (attribute) {
      setAttributes(prev => ({
        ...prev,
        [attribute]: prev[attribute] + 1
      }));
    }
  };

  return {
    level,
    xp,
    nextLevelXP,
    attributes,
    gainXP
  };
}
