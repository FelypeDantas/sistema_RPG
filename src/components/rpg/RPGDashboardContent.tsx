import { useState, useMemo, useEffect } from "react";
import { Shield, Swords, Trophy, Dumbbell, Brain, Users, Wallet } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { AvatarCard } from "@/components/rpg/AvatarCard";
import { AttributeBar } from "@/components/rpg/AttributeBar";
import { QuestCard } from "@/components/rpg/QuestCard";
import { StatsCard } from "@/components/rpg/StatsCard";
import { StreakCard } from "@/components/rpg/StreakCard";
import { MissionForm } from "@/components/rpg/MissionForm";
import { TalentTree } from "@/components/rpg/TalentTree";
import { ProfileDrawer } from "@/components/rpg/ProfileDrawer";

import { usePlayerRealtime } from "@/hooks/usePlayer";
import { useMissions, Mission } from "@/hooks/useMissions";
import { useAchievements } from "@/hooks/useAchievements";
import { usePlayerClass } from "@/hooks/usePlayerClass";
import { useTalents } from "@/hooks/useTalents";

import "@/components/rpg/MissionModal.css";

const RPGDashboardContent = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // 👇 NOVO: nome definitivo do avatar
  const [avatarName, setAvatarName] = useState<string>(() => {
    return localStorage.getItem("rpg_avatar_name") || "Player One";
  });

  const player = usePlayerRealtime();
  const missions = useMissions();
  const achievements = useAchievements(player, missions);
  const playerClass = usePlayerClass(player);
  const { talents, suggestedTalents, points, unlockTalent } =
    useTalents(player.level);

  const now = new Date();
  const todayKey = now.toISOString().split("T")[0];

  // 👇 Quando subir para nível > 1 e ainda for nome padrão, pede nome definitivo
  useEffect(() => {
    if (player.level > 1 && avatarName === "Player One") {
      const newName = window.prompt("Você evoluiu! Escolha o nome definitivo do seu avatar:");
      if (newName && newName.trim().length > 0) {
        const trimmed = newName.trim();
        setAvatarName(trimmed);
        localStorage.setItem("rpg_avatar_name", trimmed);
      }
    }
  }, [player.level]);

  // Total XP acumulado
  const totalXP = useMemo(() => {
    return missions.history.reduce(
      (acc, h) => acc + (h.success ? h.xp : 0),
      0
    );
  }, [missions.history]);

  // Quests hoje
  const questsToday = useMemo(() => {
    return missions.history.filter(
      (h) => h.success && h.date.startsWith(todayKey)
    ).length;
  }, [missions.history, todayKey]);

  // Streak
  const currentStreak = useMemo(() => {
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const day = new Date();
      day.setDate(now.getDate() - i);
      const key = day.toISOString().split("T")[0];

      const didSomething = missions.history.some(
        (h) => h.success && h.date.startsWith(key)
      );

      if (didSomething) streak++;
      else break;
    }

    if (streak === 0 && player.hasTrait?.("persistente")) {
      return 1;
    }

    return streak;
  }, [missions.history, player]);

  const handleMissionComplete = (mission: Mission, success: boolean) => {
    missions.completeMission(mission.id, success);

    if (!success) return;

    let finalXP = mission.xp;

    if (player.hasTrait?.("econômico") && mission.attribute === "Finanças") {
      finalXP *= 1.2;
    }

    if (player.hasTrait?.("disciplinado") && currentStreak >= 3) {
      finalXP *= 1.1;
    }

    player.gainXP(Math.round(finalXP), mission.attribute);
  };

  // Weekly XP
  const weeklyXP = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date();
      day.setDate(now.getDate() - (6 - i));
      const key = day.toISOString().split("T")[0];

      return missions.history
        .filter((h) => h.success && h.date.startsWith(key))
        .reduce((acc, h) => acc + h.xp, 0);
    });
  }, [missions.history]);

  // ESC fecha modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowConfirm(false);
        setPendingMission(null);
      }
    };

    if (showConfirm) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showConfirm]);

  const safeNextLevelXP = player.nextLevelXP || 1;
  const xpProgress = Math.min(
    100,
    (player.xp / safeNextLevelXP) * 100
  );

  return (
    <>
      <div className="min-h-screen bg-cyber-dark p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT */}
          <div className="space-y-6">
            <div
              onClick={() => setIsProfileOpen(true)}
              className="cursor-pointer"
            >
              <AvatarCard
                player={{
                  name: avatarName,
                  title: playerClass.title,
                  level: player.level,
                  currentXP: player.xp,
                  nextLevelXP: player.nextLevelXP,
                  totalXP,
                  rank: playerClass.rank,
                  avatar: playerClass.avatar
                }}
                xpProgress={xpProgress}
              />
            </div>

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-neon-cyan" />
                Atributos
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
                questsToday,
                totalQuests: missions.missions.length,
                xpToday: weeklyXP[6] ?? 0,
                streak: currentStreak,
                weeklyXP
              }}
            />

            <MissionForm onAdd={missions.addMission} />

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Swords className="w-5 h-5 text-neon-purple" />
                Missões
              </h3>

              <AnimatePresence>
                {missions.missions.map((mission) => (
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

            {suggestedTalents.length > 0 && (
              <div className="bg-cyber-card p-5 rounded-xl">
                <h3 className="text-white mb-4">
                  Sugestões de Talento
                </h3>
                <ul className="space-y-2">
                  {suggestedTalents.map((talent) => (
                    <li
                      key={talent.id}
                      className="flex justify-between items-center text-sm text-gray-300"
                    >
                      <span>{talent.title}</span>
                      <button
                        onClick={() => unlockTalent(talent.id)}
                        className="text-neon-cyan hover:underline"
                      >
                        Desbloquear
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-neon-orange" />
                Conquistas
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {achievements.unlocked.map((a) => (
                  <li key={a.id}>🏆 {a.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showConfirm && pendingMission && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Concluir Missão</h2>
            <p>
              Tem certeza de que deseja concluir a missão{" "}
              <strong>"{pendingMission.title}"</strong>?
            </p>

            <div className="actions">
              <button
                className="fail"
                onClick={() => {
                  handleMissionComplete(pendingMission, false);
                  setShowConfirm(false);
                  setPendingMission(null);
                }}
              >
                ❌ Falha
              </button>

              <button
                className="success"
                onClick={() => {
                  handleMissionComplete(pendingMission, true);
                  setShowConfirm(false);
                  setPendingMission(null);
                }}
              >
                ✅ Sucesso
              </button>
            </div>
          </div>
        </div>
      )}

      <ProfileDrawer
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default RPGDashboardContent;
