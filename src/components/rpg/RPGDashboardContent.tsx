import { useState, useMemo, useEffect, ReactNode, useCallback } from "react";
import { Shield, Swords, Trophy, Dumbbell, Brain, Users, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
import { useAuthWithPlayer } from "@/hooks/useAuth"

import "@/components/rpg/MissionModal.css";
import { getRarityClasses } from "@/utils/achievementHelpers";

const RPGDashboardContent = (): ReactNode => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // 👇 NOVO: nome definitivo do avatar
  const [avatarName, setAvatarName] = useState<string>(() => {
    return localStorage.getItem("rpg_avatar_name") || "Player One";
  });

  const { user } = useAuthWithPlayer();
  const player = usePlayerRealtime(typeof user?.uid === "string" ? user.uid : undefined);
  const missions = useMissions();

  if (!player) {
    return null;
  }

  const achievements = useAchievements(player, missions);
  const playerClass = usePlayerClass(player);
  const { talents, points, unlockTalent } =
    useTalents(player.level);

  const now = new Date();
  const todayKey = now.toISOString().split("T")[0];
  const history = missions.history ?? [];
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
    return history.reduce(
      (acc, h) => acc + (h.success ? h.xp : 0),
      0
    );
  }, [history]);

  const xpByDay = useMemo(() => {
    const map = new Map<string, number>();

    history.forEach((h) => {
      if (!h.success) return;

      const key = h.date.split("T")[0];
      map.set(key, (map.get(key) ?? 0) + h.xp);
    });

    return map;
  }, [history]);

  // Quests hoje
  const questsToday = useMemo(() => {
    return history.filter(
      (h) => h.success && h.date.startsWith(todayKey)
    ).length;
  }, [history, todayKey]);

  // Streak
  const currentStreak = useMemo(() => {
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const day = new Date();
      day.setDate(now.getDate() - i);
      const key = day.toISOString().split("T")[0];

      if ((xpByDay.get(key) ?? 0) > 0) {
        streak++;
      } else {
        break;
      }
    }

    if (streak === 0 && player.hasTrait?.("persistente")) {
      return 1;
    }

    return streak;
  }, [xpByDay, player]);

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

      return xpByDay.get(key) ?? 0;
    });
  }, [xpByDay]);

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

  const safeNextLevelXP = Math.max(player.xpToNextLevel ?? 1, 1);

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
                  nextLevelXP: player.xpToNextLevel,
                  totalXP,
                  rank: playerClass.rank,
                  avatar: playerClass.avatar,
                }}
                xpProgress={xpProgress}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            </div>

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-neon-cyan" />
                Atributos
              </h3>

              <AttributeBar attribute={{ name: "Físico", value: player.attributes.Físico, icon: Dumbbell, color: "from-neon-red to-neon-orange", bgColor: "bg-red-500/30", description: "Atributo físico do personagem" }} />
              <AttributeBar attribute={{ name: "Mente", value: player.attributes.Mente, icon: Brain, color: "from-neon-blue to-neon-cyan", bgColor: "bg-blue-500/30", description: "Atributo mental do personagem" }} />
              <AttributeBar attribute={{ name: "Social", value: player.attributes.Social, icon: Users, color: "from-neon-purple to-neon-pink", bgColor: "bg-purple-500/30", description: "Atributo social do personagem" }} />
              <AttributeBar attribute={{ name: "Finanças", value: player.attributes.Finanças, icon: Wallet, color: "from-neon-green to-neon-cyan", bgColor: "bg-green-500/30", description: "Atributo financeiro do personagem" }} />
            </div>

            <TalentTree
              talents={talents.filter(t => t?.locked).slice(0, 3)}
              points={points}
              onUnlock={unlockTalent}
            />
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
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <QuestCard
                      quest={mission}
                      onComplete={() => {
                        setPendingMission(mission);
                        setShowConfirm(true);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <StreakCard weeklyXP={weeklyXP} currentStreak={currentStreak} />

            <div className="bg-cyber-card p-5 rounded-xl">
              <h3 className="text-white flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-neon-orange" />
                Conquistas
              </h3>
              <ul className="space-y-3 text-sm">
                {achievements.unlocked.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className={`font-bold ${getRarityClasses(a.rarity)}`}>
                      🏆 {a.title}
                    </span>

                    <span className="text-xs opacity-70 bg-zinc-800 px-2 py-1 rounded-full">
                      {a.rarity}
                    </span>
                  </li>
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
