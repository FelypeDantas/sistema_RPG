import { useState } from "react";
import { 
  Zap, Brain, Users, Wallet, Trophy, Flame, 
  Target, Star, Shield, Swords, ChevronUp,
  Activity, BookOpen, Dumbbell, TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AttributeBar } from "@/components/rpg/AttributeBar";
import { AchievementCard } from "@/components/rpg/AchievementCard";
import { QuestCard } from "@/components/rpg/QuestCard";
import { StatsCard } from "@/components/rpg/StatsCard";
import { AvatarCard } from "@/components/rpg/AvatarCard";
import { StreakCard } from "@/components/rpg/StreakCard";

const RPGDashboard = () => {
  // Player data
  const playerData = {
    name: "Player One",
    title: "Cyber Warrior",
    level: 12,
    currentXP: 2450,
    nextLevelXP: 3000,
    totalXP: 15450,
    rank: "Silver II",
    avatar: "🧑‍💻"
  };

  // Attributes (0-100)
  const attributes = [
    { 
      name: "Físico", 
      value: 68, 
      icon: Dumbbell, 
      color: "from-neon-red to-neon-orange",
      bgColor: "bg-neon-red/20",
      description: "Saúde, exercícios, sono"
    },
    { 
      name: "Mente", 
      value: 85, 
      icon: Brain, 
      color: "from-neon-blue to-neon-cyan",
      bgColor: "bg-neon-blue/20",
      description: "Foco, estudos, leitura"
    },
    { 
      name: "Social", 
      value: 52, 
      icon: Users, 
      color: "from-neon-purple to-neon-pink",
      bgColor: "bg-neon-purple/20",
      description: "Relacionamentos, networking"
    },
    { 
      name: "Finanças", 
      value: 74, 
      icon: Wallet, 
      color: "from-neon-green to-neon-cyan",
      bgColor: "bg-neon-green/20",
      description: "Economia, investimentos"
    }
  ];

  // Achievements
  const achievements = [
    { 
      name: "Early Bird", 
      description: "Acorde 5h por 7 dias", 
      icon: "🌅", 
      unlocked: true,
      rarity: "common"
    },
    { 
      name: "Bookworm", 
      description: "Leia 10 livros", 
      icon: "📚", 
      unlocked: true,
      rarity: "rare"
    },
    { 
      name: "Iron Will", 
      description: "30 dias de streak", 
      icon: "💪", 
      unlocked: false,
      progress: 18,
      maxProgress: 30,
      rarity: "epic"
    },
    { 
      name: "Millionaire", 
      description: "Economize R$100k", 
      icon: "💎", 
      unlocked: false,
      progress: 45000,
      maxProgress: 100000,
      rarity: "legendary"
    }
  ];

  // Active quests
  const activeQuests = [
    {
      title: "Treino Matinal",
      xp: 50,
      attribute: "Físico",
      completed: true,
      streak: 5
    },
    {
      title: "Ler 30 minutos",
      xp: 30,
      attribute: "Mente",
      completed: true,
      streak: 12
    },
    {
      title: "Meditar 10 min",
      xp: 25,
      attribute: "Mente",
      completed: false,
      streak: 0
    },
    {
      title: "Estudar 1h",
      xp: 75,
      attribute: "Mente",
      completed: false,
      streak: 8
    },
    {
      title: "Networking",
      xp: 40,
      attribute: "Social",
      completed: false,
      streak: 2
    }
  ];

  // Stats
  const stats = {
    questsToday: 2,
    totalQuests: 5,
    xpToday: 80,
    streak: 18,
    weeklyXP: [120, 95, 150, 80, 110, 0, 0]
  };

  const xpProgress = (playerData.currentXP / playerData.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-cyber-dark p-4 md:p-6 lg:p-8">
      {/* Scan lines effect overlay */}
      <div className="fixed inset-0 pointer-events-none bg-scanlines opacity-5 z-50" />
      
      {/* Grid background */}
      <div className="fixed inset-0 bg-cyber-grid opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              <span className="text-neon-cyan text-glow-cyan">LIFE</span>
              <span className="text-neon-purple text-glow-purple">.RPG</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Sistema de Gamificação Pessoal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-cyber-card border border-neon-cyan/30 px-4 py-2 rounded-lg">
              <Flame className="w-5 h-5 text-neon-orange animate-pulse" />
              <span className="text-white font-bold">{stats.streak}</span>
              <span className="text-gray-400 text-sm">dias</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Attributes */}
          <div className="space-y-6">
            <AvatarCard player={playerData} xpProgress={xpProgress} />
            
            {/* Attributes */}
            <div className="bg-cyber-card border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-cyan" />
                Atributos
              </h3>
              <div className="space-y-4">
                {attributes.map((attr) => (
                  <AttributeBar key={attr.name} attribute={attr} />
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Quests */}
          <div className="space-y-6">
            <StatsCard stats={stats} />
            
            <div className="bg-cyber-card border border-white/10 rounded-xl p-5">
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

          {/* Right Column - Achievements & Streak */}
          <div className="space-y-6">
            <StreakCard weeklyXP={stats.weeklyXP} currentStreak={stats.streak} />
            
            <div className="bg-cyber-card border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-orange" />
                Conquistas
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <AchievementCard key={index} achievement={achievement} />
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
