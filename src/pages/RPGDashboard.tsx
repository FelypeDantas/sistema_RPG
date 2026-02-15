/* RPGDashboard.tsx */
import { useState, useMemo } from "react";
import { Shield, Swords, Trophy, Dumbbell, Brain, Users, Wallet, Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { AvatarCard } from "@/components/rpg/AvatarCard";
import { AttributeBar } from "@/components/rpg/AttributeBar";
import { QuestCard } from "@/components/rpg/QuestCard";
import { StatsCard } from "@/components/rpg/StatsCard";
import { StreakCard } from "@/components/rpg/StreakCard";
import { MissionForm } from "@/components/rpg/MissionForm";
import { TalentTree } from "@/components/rpg/TalentTree";
import { ProfileDrawer } from "@/components/rpg/ProfileDrawer";

import { usePlayer } from "@/hooks/usePlayer";
import { useMissions, Mission } from "@/hooks/useMissions";
import { useAchievements } from "@/hooks/useAchievements";
import { usePlayerClass } from "@/hooks/usePlayerClass";
import { useTalents } from "@/hooks/useTalents";

import "@/components/rpg/MissionModal.css";

const RPGDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const player = usePlayer();
  const missions = useMissions();
  const achievements = useAchievements(player, missions);
  const playerClass = usePlayerClass(player);
  const { talents, suggestedTalents, points, unlockTalent } = useTalents(player.level);

  const totalXP = missions.history.reduce((acc, h) => acc + (h.success ? h.xp : 0), 0);

  const now = new Date();

  /* =============================
     🧠 QUEST AI LOCAL
  ============================== */
  const aiSuggestions = useMemo(() => {
    const attributes = {
      Físico: player.attributes.Físico,
      Mente: player.attributes.Mente,
      Social: player.attributes.Social,
      Finanças: player.attributes.Finanças,
    };

    const weakest = Object.entries(attributes).sort((a, b) => a[1] - b[1])[0][0];

    const suggestions = {
      Físico: [
        "Treinar por 20 minutos",
        "Caminhar 3km",
        "Alongar por 15 minutos"
      ],
      Mente: [
        "Estudar 30 minutos focado",
        "Ler 10 páginas de um livro",
        "Resolver 5 problemas desafiadores"
      ],
      Social: [
        "Iniciar conversa com alguém novo",
        "Responder mensagens pendentes",
        "Agendar uma call estratégica"
      ],
      Finanças: [
        "Registrar gastos do dia",
        "Revisar orçamento semanal",
        "Pesquisar um investimento"
      ]
    };

    return {
      weakest,
      quests: suggestions[weakest as keyof typeof suggestions]
    };
  }, [player.attributes]);

  /* ============================= */

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const day = new Date();
    day.setDate(now.getDate() - i);
    const key = day.toISOString().split("T")[0];
    const didSomething = missions.history.some(h => h.success && h.date.startsWith(key));
    if (didSomething) streak++;
    else break;
  }
  const currentStreak = streak === 0 && player.hasTrait?.("persistente") ? 1 : streak;

  const handleMissionComplete = (mission: Mission, success: boolean) => {
    missions.completeMission(mission.id, success);
    if (!success) return;

    let finalXP = mission.xp;
    if (player.hasTrait?.("econômico") && mission.attribute === "Finanças") finalXP *= 1.2;
    if (player.hasTrait?.("disciplinado") && currentStreak >= 3) finalXP *= 1.1;

    player.gainXP(Math.round(finalXP), mission.attribute);
  };

  const weeklyXP = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(now.getDate() - (6 - i));
    const key = day.toISOString().split("T")[0];
    return missions.history
      .filter(h => h.success && h.date.startsWith(key))
      .reduce((acc, h) => acc + h.xp, 0);
  });

  const createAIMission = (title: string) => {
    missions.addMission({
      id: `ai-${Date.now()}`,
      title,
      description: "Missão sugerida pela IA",
      xp: 40 + player.level * 5,
      attribute: aiSuggestions.weakest as any,
      completed: false
    });
  };

  return (
    <>
      <div className="min-h-screen bg-cyber-dark p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="space-y-6">
            <div onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
              <AvatarCard
                player={{
                  name: "Player One",
                  title: playerClass.title,
                  level: player.level,
                  currentXP: player.xp,
                  nextLevelXP: player.nextLevelXP,
                  totalXP,
                  rank: playerClass.rank,
                  avatar: playerClass.avatar
                }}
                xpProgress={(player.xp / player.nextLevelXP) * 100}
              />
            </div>

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-neon-cyan" /> Atributos
              </h3>

              <AttributeBar attribute={{ name: "Físico", value: player.attributes.Físico, icon: Dumbbell, color: "from-neon-red to-neon-orange" }} />
              <AttributeBar attribute={{ name: "Mente", value: player.attributes.Mente, icon: Brain, color: "from-neon-blue to-neon-cyan" }} />
              <AttributeBar attribute={{ name: "Social", value: player.attributes.Social, icon: Users, color: "from-neon-purple to-neon-pink" }} />
              <AttributeBar attribute={{ name: "Finanças", value: player.attributes.Finanças, icon: Wallet, color: "from-neon-green to-neon-cyan" }} />
            </div>

            <TalentTree talents={talents} points={points} onUnlock={unlockTalent} />
          </div>

          {/* CENTER */}
          <div className="space-y-6">
            <StatsCard
              stats={{
                questsToday: 0,
                totalQuests: missions.missions.length,
                xpToday: weeklyXP[6] ?? 0,
                streak: currentStreak,
                weeklyXP
              }}
            />

            <MissionForm onAdd={missions.addMission} />

            {/* 🤖 IA QUESTS */}
            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-neon-cyan" />
                Sugestões Inteligentes ({aiSuggestions.weakest})
              </h3>

              <ul className="space-y-2 text-sm text-gray-300">
                {aiSuggestions.quests.map((quest, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{quest}</span>
                    <button
                      onClick={() => createAIMission(quest)}
                      className="text-neon-cyan hover:underline"
                    >
                      Criar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Swords className="w-5 h-5 text-neon-purple" /> Missões
              </h3>

              <AnimatePresence>
                {missions.missions.map(mission => (
                  <QuestCard
                    key={mission.id}
                    quest={mission}
                    onComplete={() => {
                      setPendingMission(mission);
                      setShowConfirm(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <StreakCard weeklyXP={weeklyXP} currentStreak={currentStreak} />

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-neon-orange" /> Conquistas
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {achievements.unlocked.map(a => (
                  <li key={a.id}>🏆 {a.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ProfileDrawer open={isProfileOpen} onClose={() => setIsProfileOpen(false)} history={missions.history} />
    </>
  );
};

export default RPGDashboard;
