import {
  Shield,
  Swords,
  Trophy,
  Dumbbell,
  Brain,
  Users,
  Wallet
} from "lucide-react";

import { AvatarCard } from "@/components/rpg/AvatarCard";
import { AttributeBar } from "@/components/rpg/AttributeBar";
import { QuestCard } from "@/components/rpg/QuestCard";
import { StatsCard } from "@/components/rpg/StatsCard";
import { StreakCard } from "@/components/rpg/StreakCard";
import { MissionForm } from "@/components/rpg/MissionForm";
import { TalentTree } from "@/components/rpg/TalentTree";

import { usePlayer } from "@/hooks/usePlayer";
import { useMissions, Mission } from "@/hooks/useMissions";
import { useAchievements } from "@/hooks/useAchievements";
import { usePlayerClass } from "@/hooks/usePlayerClass";
import { useTalents } from "@/hooks/useTalents";

const RPGDashboard = () => {
  const player = usePlayer();
  const missions = useMissions();
  const achievements = useAchievements(player, missions);
  const playerClass = usePlayerClass(player);
  const talents = useTalents(player.level);

  const totalXP = missions.history.reduce(
    (acc, h) => acc + (h.success ? h.xp : 0),
    0
  );

  const handleMissionComplete = (mission: Mission) => {
    let successChance = 0.8;

    if (talents.talents.find(t => t.id === "focus" && t.unlocked)) {
      successChance += 0.1;
    }

    const success = missions.completeMission(mission, successChance);

    if (success) {
      player.gainXP(mission.xp, mission.attribute);
    }
  };

  /* =============================
     📊 STREAK SEMANAL (FIX)
  ============================== */

  const now = new Date();

  const weeklyXP = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(now.getDate() - (6 - i));

    const dayKey = day.toISOString().split("T")[0];

    const xp = missions.history
      .filter(
        h =>
          h.success &&
          h.date.startsWith(dayKey)
      )
      .reduce((acc, h) => acc + h.xp, 0);

    return xp;
  });

  const currentStreak = missions.history.filter(h => h.success).length;

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="space-y-6">
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

          <div className="bg-cyber-card p-5 rounded-xl">
            <h3 className="text-white flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-neon-cyan" />
              Atributos
            </h3>

            <AttributeBar
              attribute={{
                name: "Físico",
                value: player.attributes.Físico,
                icon: Dumbbell,
                color: "from-neon-red to-neon-orange"
              }}
            />

            <AttributeBar
              attribute={{
                name: "Mente",
                value: player.attributes.Mente,
                icon: Brain,
                color: "from-neon-blue to-neon-cyan"
              }}
            />

            <AttributeBar
              attribute={{
                name: "Social",
                value: player.attributes.Social,
                icon: Users,
                color: "from-neon-purple to-neon-pink"
              }}
            />

            <AttributeBar
              attribute={{
                name: "Finanças",
                value: player.attributes.Finanças,
                icon: Wallet,
                color: "from-neon-green to-neon-cyan"
              }}
            />
          </div>

          <TalentTree
            talents={talents.talents}
            points={talents.points}
            onUnlock={talents.unlockTalent}
          />
        </div>

        {/* CENTER */}
        <div className="space-y-6">
          <StatsCard
            stats={{
              questsToday: missions.missions.filter(m => m.done).length,
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

            {missions.missions.map(mission => (
              <QuestCard
                key={mission.id}
                quest={mission}
                onComplete={() => handleMissionComplete(mission)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <StreakCard
            weeklyXP={weeklyXP}
            currentStreak={currentStreak}
          />

          <div className="bg-cyber-card p-5 rounded-xl">
            <h3 className="text-white flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-neon-orange" />
              Conquistas
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
  );
};

export default RPGDashboard;
