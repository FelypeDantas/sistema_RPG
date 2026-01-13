import { useEffect, useState } from "react";
import { 
  Brain, Users, Wallet, Trophy, Flame, 
  Shield, Swords, Dumbbell
} from "lucide-react";

import { AttributeBar } from "@/components/rpg/AttributeBar";
import { AchievementCard } from "@/components/rpg/AchievementCard";
import { QuestCard } from "@/components/rpg/QuestCard";
import { StatsCard } from "@/components/rpg/StatsCard";
import { AvatarCard } from "@/components/rpg/AvatarCard";
import { StreakCard } from "@/components/rpg/StreakCard";

const STORAGE_KEY = "life_rpg_player";

const RPGDashboard = () => {

  /* =========================
     PLAYER STATE (PERSISTENT)
  ========================= */

  const [playerData, setPlayerData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          name: "Player One",
          title: "Cyber Warrior",
          level: 12,
          currentXP: 2450,
          totalXP: 15450,
          rank: "Silver II",
          avatar: "🧑‍💻"
        };
  });

  const [levelUpFlash, setLevelUpFlash] = useState(false);

  /* =========================
     XP CALCULATION
     nextLevelXP = 100 + (XPAtual * 90)
  ========================= */

  const nextLevelXP = 100 + playerData.currentXP * 90;

  const xpProgress = Math.min(
    (playerData.currentXP / nextLevelXP) * 100,
    100
  );

  /* =========================
     ATTRIBUTES
  ========================= */

  const attributes = [
    { name: "Físico", value: 68, icon: Dumbbell, color: "from-neon-red to-neon-orange", bgColor: "bg-neon-red/20" },
    { name: "Mente", value: 85, icon: Brain, color: "from-neon-blue to-neon-cyan", bgColor: "bg-neon-blue/20" },
    { name: "Social", value: 52, icon: Users, color: "from-neon-purple to-neon-pink", bgColor: "bg-neon-purple/20" },
    { name: "Finanças", value: 74, icon: Wallet, color: "from-neon-green to-neon-cyan", bgColor: "bg-neon-green/20" }
  ];

  /* =========================
     QUESTS
  ========================= */

  const activeQuests = [
    { title: "Treino Matinal", xp: 50, attribute: "Físico", completed: true },
    { title: "Ler 30 minutos", xp: 30, attribute: "Mente", completed: true },
    { title: "Meditar 10 min", xp: 25, attribute: "Mente", completed: false },
    { title: "Estudar 1h", xp: 75, attribute: "Mente", completed: false },
    { title: "Networking", xp: 40, attribute: "Social", completed: false }
  ];

  /* =========================
     STATS
  ========================= */

  const stats = {
    questsToday: activeQuests.filter(q => q.completed).length,
    totalQuests: activeQuests.length,
    xpToday: activeQuests
      .filter(q => q.completed)
      .reduce((acc, q) => acc + q.xp, 0),
    streak: 18,
    weeklyXP: [120, 95, 150, 80, 110, 0, 0]
  };

  /* =========================
     APPLY QUEST XP + LEVEL UP
  ========================= */

  useEffect(() => {
    const gainedXP = stats.xpToday;

    if (gainedXP === 0) return;

    setPlayerData(prev => {
      let newXP = prev.currentXP + gainedXP;
      let newLevel = prev.level;

      if (newXP >= nextLevelXP) {
        newXP = newXP - nextLevelXP;
        newLevel += 1;

        setLevelUpFlash(true);
        setTimeout(() => setLevelUpFlash(false), 1200);
      }

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        totalXP: prev.totalXP + gainedXP
      };
    });
  }, []);

  /* =========================
     SAVE TO LOCALSTORAGE
  ========================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData));
  }, [playerData]);

  return (
    <div className="min-h-screen bg-cyber-dark p-4 md:p-6 lg:p-8">
      <div className="fixed inset-0 pointer-events-none bg-scanlines opacity-5 z-50" />
      <div className="fixed inset-0 bg-cyber-grid opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              <span className="text-neon-cyan">LIFE</span>
              <span className="text-neon-purple">.RPG</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Sistema de Gamificação Pessoal
            </p>
          </div>

          <div className="flex items-center gap-2 bg-cyber-card px-4 py-2 rounded-lg border border-neon-cyan/30">
            <Flame className="w-5 h-5 text-neon-orange animate-pulse" />
            <span className="text-white font-bold">{stats.streak}</span>
            <span className="text-gray-400 text-sm">dias</span>
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="space-y-6">
            <AvatarCard
              player={{ ...playerData, nextLevelXP }}
              xpProgress={xpProgress}
              levelUp={levelUpFlash}
            />

            <div className="bg-cyber-card rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-cyan" />
                Atributos
              </h3>

              <div className="space-y-4">
                {attributes.map(attr => (
                  <AttributeBar key={attr.name} attribute={attr} />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div className="space-y-6">
            <StatsCard stats={stats} />

            <div className="bg-cyber-card rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Swords className="w-5 h-5 text-neon-purple" />
                Missões de Hoje
              </h3>

              <div className="space-y-3">
                {activeQuests.map((quest, index) => (
                  <QuestCard key={index} quest={quest} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <StreakCard weeklyXP={stats.weeklyXP} currentStreak={stats.streak} />

            <div className="bg-cyber-card rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-orange" />
                Conquistas
              </h3>

              <div className="space-y-3">
                {[
                  { name: "Early Bird", unlocked: true },
                  { name: "Bookworm", unlocked: true },
                  { name: "Iron Will", unlocked: false }
                ].map((a, i) => (
                  <AchievementCard key={i} achievement={a} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RPGDashboard;
