import { useState, useMemo, useEffect, useRef } from "react";
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

import "@/components/rpg/MissionModal.css";

const RPGDashboardContent = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  /* =========================
     NOVOS ESTADOS (ISOLADOS)
  ========================== */
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [showAscension, setShowAscension] = useState(false);
  const previousLevel = useRef(1);

  const player = usePlayerRealtime();
  const missions = useMissions();
  const achievements = useAchievements(player, missions);
  const playerClass = usePlayerClass(player);
  const { talents, suggestedTalents, points, unlockTalent } =
    useTalents(player.level);

  const now = new Date();
  const todayKey = now.toISOString().split("T")[0];

  /* =========================
     RITO DE PASSAGEM SEGURO
  ========================== */
  useEffect(() => {
    if (
      player.level > 1 &&
      !player.avatarName &&
      previousLevel.current === 1
    ) {
      setShowNameModal(true);
    }
    previousLevel.current = player.level;
  }, [player.level, player.avatarName]);

  const handleConfirmName = () => {
    if (!tempName.trim()) return;

    if (!player.avatarName) {
      player.setAvatarName(tempName.trim());
      setShowNameModal(false);
      setShowAscension(true);

      setTimeout(() => setShowAscension(false), 2500);
    }
  };

  /* ========================= */

  const totalXP = useMemo(() => {
    return missions.history.reduce(
      (acc, h) => acc + (h.success ? h.xp : 0),
      0
    );
  }, [missions.history]);

  const questsToday = useMemo(() => {
    return missions.history.filter(
      (h) => h.success && h.date.startsWith(todayKey)
    ).length;
  }, [missions.history, todayKey]);

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowConfirm(false);
        setPendingMission(null);
      }
    };

    if (showConfirm) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showConfirm]);

  const safeNextLevelXP = player.nextLevelXP || 1;
  const xpProgress = Math.min(
    100,
    (player.xp / safeNextLevelXP) * 100
  );

  return (
    <>
      <div className="min-h-screen bg-cyber-dark p-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT */}
          <div className="space-y-6">
            <div
              onClick={() => setIsProfileOpen(true)}
              className="cursor-pointer"
            >
              <AvatarCard
                player={{
                  name: player.avatarName ?? "Player One",
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

              {player.avatarName && (
                <div className="text-xs text-neon-cyan mt-2">
                  ✨ O Desperto
                </div>
              )}
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
          {/* INALTERADO */}

          {/* RIGHT */}
          {/* INALTERADO */}
        </div>

        {/* EFEITO ASCENSÃO */}
        <AnimatePresence>
          {showAscension && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-neon-cyan/10 backdrop-blur-xl z-40"
            >
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1.3 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-neon-cyan"
              >
                IDENTIDADE DESPERTA
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL NOME */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cyber-card p-8 rounded-xl border border-neon-cyan/40 w-full max-w-md text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">
              Escolha seu Nome
            </h2>

            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Digite seu nome..."
              className="w-full p-3 rounded bg-black/40 border border-white/10 text-white outline-none focus:border-neon-cyan"
            />

            <button
              disabled={!tempName.trim()}
              onClick={handleConfirmName}
              className="w-full py-3 rounded bg-neon-cyan text-black font-bold hover:opacity-90 transition disabled:opacity-40"
            >
              Confirmar Identidade
            </button>
          </motion.div>
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
