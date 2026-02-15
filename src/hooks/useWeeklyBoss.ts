import { useEffect, useMemo, useState } from "react";
import { useMissions } from "./useMissions";

type Attribute = "Mente" | "Físico" | "Social" | "Finanças";

interface WeeklyBoss {
  name: string;
  attribute: Attribute;
  requiredXP: number;
  week: string;
}

const BOSS_STORAGE = "rpg_weekly_boss";

function getWeekKey() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  const pastDays = Math.floor(
    (now.getTime() - firstDay.getTime()) / 86400000
  );
  const week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

function bossName(attribute: Attribute) {
  const names: Record<Attribute, string> = {
    Mente: "Arquimago da Distração",
    Físico: "Titã da Inércia",
    Social: "Sombra do Isolamento",
    Finanças: "Dragão do Caos Financeiro",
  };

  return names[attribute];
}

export function useWeeklyBoss() {
  const { stats } = useMissions();
  const weekKey = getWeekKey();

  const weakestAttribute = useMemo(() => {
    const entries = Object.entries(stats.xpByAttribute);
    entries.sort((a, b) => a[1] - b[1]);
    return entries[0][0] as Attribute;
  }, [stats]);

  const [boss, setBoss] = useState<WeeklyBoss | null>(() => {
    try {
      const stored = localStorage.getItem(BOSS_STORAGE);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!boss || boss.week !== weekKey) {
      const newBoss: WeeklyBoss = {
        name: bossName(weakestAttribute),
        attribute: weakestAttribute,
        requiredXP: 300,
        week: weekKey,
      };

      setBoss(newBoss);
      localStorage.setItem(BOSS_STORAGE, JSON.stringify(newBoss));
    }
  }, [weekKey, weakestAttribute]);

  const currentXP = stats.xpByAttribute[boss?.attribute as Attribute] || 0;
  const progress = boss ? Math.min((currentXP / boss.requiredXP) * 100, 100) : 0;
  const defeated = boss ? currentXP >= boss.requiredXP : false;

  return {
    boss,
    progress,
    defeated,
  };
}
