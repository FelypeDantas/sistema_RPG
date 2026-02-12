import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

/* =============================
   🌟 TIPOS
============================= */
export type TraitId = "disciplinado" | "impulsivo" | "persistente" | "econômico";
export interface Trait {
  id: TraitId;
  name: string;
  description: string;
}

export type TalentId = "focus" | "physical_mastery";
export interface TalentEffect {
  segmentBonus?: Record<string, number>;
}
export interface Talent {
  id: TalentId;
  unlocked: boolean;
  effect?: TalentEffect;
}

export type MissionAttribute = "Mente" | "Físico" | "Social" | "Finanças";
export interface Mission {
  id: string;
  title: string;
  xp: number;
  attribute: MissionAttribute;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
}

/* =============================
   💾 STORAGE KEYS
============================= */
const STORAGE_KEY = "life_rpg_player";
const DAILY_KEY = "life_rpg_daily";
const STREAK_KEY = "life_rpg_streak";
const ACHIEVEMENTS_KEY = "life_rpg_achievements";

/* =============================
   🎯 HOOK COMPLETO
============================= */
export function usePlayerRPG() {
  /* -----------------------------
     Player stats
  ----------------------------- */
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [attributes, setAttributes] = useState({
    Físico: 10,
    Mente: 10,
    Social: 10,
    Finanças: 10,
  });

  const [segments, setSegments] = useState<Record<string, number>>({
    forca: 10,
    foco: 20,
  });

  /* -----------------------------
     Talents & Traits
  ----------------------------- */
  const [talents, setTalents] = useState<Talent[]>([
    { id: "focus", unlocked: true, effect: { segmentBonus: { foco: 1.2 } } },
    { id: "physical_mastery", unlocked: false, effect: { segmentBonus: { forca: 1.15, resistencia: 1.1 } } },
  ]);

  const [traits, setTraits] = useState<Trait[]>([
    { id: "disciplinado", name: "Disciplinado", description: "Ganha mais XP ao manter streaks" },
  ]);

  const nextLevelXP = Math.floor(100 * Math.pow(1.2, level - 1));

  /* -----------------------------
     Daily & streak
  ----------------------------- */
  const [streak, setStreak] = useState(0);
  const [lastDaily, setLastDaily] = useState<string | null>(null);

  /* -----------------------------
     Missions & Achievements
  ----------------------------- */
  const [missions, setMissions] = useState<Mission[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  /* =============================
     📥 LOAD STATE
  ============================= */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setLevel(data.level ?? 1);
      setXP(data.xp ?? 0);
      setAttributes(data.attributes ?? attributes);
      setSegments(data.segments ?? segments);
      setTalents(data.talents ?? talents);
      setTraits(data.traits ?? traits);
    }

    const savedStreak = localStorage.getItem(STREAK_KEY);
    if (savedStreak) setStreak(Number(savedStreak));

    const savedDaily = localStorage.getItem(DAILY_KEY);
    if (savedDaily) setLastDaily(savedDaily);

    const savedAch = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (savedAch) setAchievements(JSON.parse(savedAch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =============================
     📤 SAVE STATE
  ============================= */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ level, xp, attributes, segments, talents, traits })
    );
  }, [level, xp, attributes, segments, talents, traits]);

  useEffect(() => localStorage.setItem(STREAK_KEY, String(streak)), [streak]);
  useEffect(() => localStorage.setItem(DAILY_KEY, lastDaily ?? ""), [lastDaily]);
  useEffect(() => localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements)), [achievements]);

  /* =============================
     🔹 HELPERS
  ============================= */
  const hasTrait = (id: TraitId) => traits.some(t => t.id === id);
  const hasTalent = (id: TalentId) => talents.some(t => t.id === id && t.unlocked);

  /* =============================
     ⭐ XP & LEVEL
  ============================= */
  const gainXP = (amount: number, attribute?: keyof typeof attributes) => {
    let finalAmount = amount;
    if (hasTrait("disciplinado")) finalAmount *= 1.1;

    setXP(prev => {
      let total = prev + finalAmount;
      let lvl = level;
      while (total >= nextLevelXP) {
        total -= nextLevelXP;
        lvl++;
      }
      if (lvl !== level) setLevel(lvl);
      return total;
    });

    if (attribute) {
      setAttributes(prev => ({ ...prev, [attribute]: prev[attribute] + 1 }));
    }
  };

  const gainSegmentXP = (segmentId: string, baseAmount: number) => {
    let finalAmount = baseAmount;
    talents.forEach(t => {
      if (t.unlocked && t.effect?.segmentBonus?.[segmentId]) {
        finalAmount *= t.effect.segmentBonus[segmentId];
      }
    });
    setSegments(prev => ({
      ...prev,
      [segmentId]: Math.min(100, Math.round((prev[segmentId] ?? 0) + finalAmount)),
    }));
  };

  /* =============================
     🌅 DAILY QUESTS
  ============================= */
  const DAILY_QUESTS: Omit<Mission, "id" | "completed">[] = [
    { title: "Estudar por 25 minutos", xp: 50, attribute: "Mente" },
    { title: "Caminhar por 10 minutos", xp: 50, attribute: "Físico" },
    { title: "Conversar com alguém", xp: 50, attribute: "Social" },
    { title: "Organizar finanças do dia", xp: 50, attribute: "Finanças" },
  ];

  const generateDaily = () => {
    const today = new Date().toISOString().split("T")[0];
    if (lastDaily === today) return;

    const random = DAILY_QUESTS[Math.floor(Math.random() * DAILY_QUESTS.length)];
    setMissions(prev => [
      ...prev,
      { ...random, id: uuid(), completed: false },
    ]);
    setLastDaily(today);
  };

  const completeMission = (id: string) => {
    const mission = missions.find(m => m.id === id && !m.completed);
    if (!mission) return;

    gainXP(mission.xp, mission.attribute);

    setMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: true } : m))
    );

    setStreak(prev => prev + 1);
    unlockAchievements(streak + 1);
  };

  /* =============================
     🏆 ACHIEVEMENTS
  ============================= */
  const unlockAchievements = (newStreak: number) => {
    const unlocks: Record<number, string> = {
      1: "🌅 Primeiro Amanhecer",
      7: "🔥 Ritual da Semana",
      30: "🏆 Disciplina Lendária",
      100: "👁️ Entidade da Rotina",
    };
    const title = unlocks[newStreak];
    if (!title) return;
    if (achievements.some(a => a.title === title)) return;

    setAchievements(prev => [...prev, { id: uuid(), title }]);
  };

  /* =============================
     🔄 RESET PLAYER
  ============================= */
  const resetPlayer = () => {
    setLevel(1);
    setXP(0);
    setAttributes({ Físico: 10, Mente: 10, Social: 10, Finanças: 10 });
    setSegments({ forca: 10, foco: 20 });
    setTalents(talents.map(t => ({ ...t, unlocked: t.id === "focus" })));
    setTraits(traits);
    setStreak(0);
    setMissions([]);
    setAchievements([]);
    setLastDaily(null);
  };

  /* =============================
     📦 RETURN
  ============================= */
  return {
    level,
    xp,
    nextLevelXP,
    attributes,
    segments,
    talents,
    traits,
    streak,
    missions,
    achievements,
    hasTrait,
    hasTalent,
    gainXP,
    gainSegmentXP,
    generateDaily,
    completeMission,
    resetPlayer,
  };
}
