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

import { usePlayer } from "@/hooks/usePlayer";
import { useMissions } from "@/hooks/useMissions";
import { useAchievements } from "@/hooks/useAchievements";
import { usePlayerClass } from "@/hooks/usePlayerClass";

const RPGDashboard = () => {
  const player = usePlayer();
  const missions = useMissions();
  const achievements = useAchievements(player, missions);
  const playerClass = usePlayerClass(player);

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
              totalXP: missions.history.reduce((a, h) => a + h.xp, 0),
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

            <AttributeBar attribute={{
              name: "Físico",
              value: player.attributes.Físico,
              icon: Dumbbell,
              color: "from-neon-red to-neon-orange"
            }} />

            <AttributeBar attribute={{
              name: "Mente",
              value: player.attributes.Mente,
              icon: Brain,
              color: "from-neon-blue to-neon-cyan"
            }} />

            <AttributeBar attribute={{
              name: "Social",
              value: player.attributes.Social,
              icon: Users,
              color: "from-neon-purple to-neon-pink"
            }} />

            <AttributeBar attribute={{
              name: "Finanças",
              value: player.attributes.Finanças,
              icon: Wallet,
              color: "from-neon-green to-neon-cyan"
            }} />
          </div>
        </div>

        {/* CENTER */}
        <div className="space-y-6">
          <StatsCard
            stats={{
              questsToday: missions.missions.filter(m => m.done).length,
              totalQuests: missions.missions.length,
              xpToday: missions.history.reduce((a, h) => a + h.xp, 0),
              streak: missions.history.length,
              weeklyXP: []
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
                onComplete={() => {
                  missions.completeMission(mission);
                  player.gainXP(mission.xp, mission.attribute);
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <StreakCard weeklyXP={[]} currentStreak={missions.history.length} />

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
