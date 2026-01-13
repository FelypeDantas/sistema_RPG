import { useEffect, useState } from "react";
import {
  Flame,
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
import { AchievementCard } from "@/components/rpg/AchievementCard";
import { StatsCard } from "@/components/rpg/StatsCard";
import { StreakCard } from "@/components/rpg/StreakCard";

const STORAGE_KEY = "life_rpg_save";

const RPGDashboard = () => {
  /* ==========================
     PLAYER STATE
  ========================== */
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

  const nextLevelXP = 100 + xp * 0.9;
  const xpProgress = (xp / nextLevelXP) * 100;

  /* ==========================
     ATTRIBUTES
  ========================== */
  const [attributes, setAttributes] = useState({
    Físico: 10,
    Mente: 10,
    Social: 10,
    Finanças: 10
  });

  /* ==========================
     MISSIONS
  ========================== */
  const [missions, setMissions] = useState([
    { id: 1, title: "Treinar", xp: 50, attribute: "Físico", done: false },
    { id: 2, title: "Estudar 30 min", xp: 40, attribute: "Mente", done: false }
  ]);

  const [history, setHistory] = useState<any[]>([]);

  /* ==========================
     LOAD / SAVE
  ========================== */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);
    setLevel(data.level);
    setXP(data.xp);
    setAttributes(data.attributes);
    setHistory(data.history || []);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        level,
        xp,
        attributes,
        history
      })
    );
  }, [level, xp, attributes, history]);

  /* ==========================
     COMPLETE MISSION
  ========================== */
  const completeMission = (missionId: number) => {
    setMissions(prev =>
      prev.map(m =>
        m.id === missionId ? { ...m, done: true } : m
      )
    );

    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.done) return;

    setXP(prev => {
      const newXP = prev + mission.xp;
      if (newXP >= nextLevelXP) {
        setLevel(l => l + 1);
        return newXP - nextLevelXP;
      }
      return newXP;
    });

    setAttributes(prev => ({
      ...prev,
      [mission.attribute]: prev[mission.attribute] + 1
    }));

    setHistory(prev => [
      {
        title: mission.title,
        xp: mission.xp,
        attribute: mission.attribute,
        date: new Date().toISOString()
      },
      ...prev
    ]);
  };

  /* ==========================
     UI DATA
  ========================== */
  const attributeBars = [
    {
      name: "Físico",
      value: attributes.Físico,
      icon: Dumbbell,
      color: "from-neon-red to-neon-orange"
    },
    {
      name: "Mente",
      value: attributes.Mente,
      icon: Brain,
      color: "from-neon-blue to-neon-cyan"
    },
    {
      name: "Social",
      value: attributes.Social,
      icon: Users,
      color: "from-neon-purple to-neon-pink"
    },
    {
      name: "Finanças",
      value: attributes.Finanças,
      icon: Wallet,
      color: "from-neon-green to-neon-cyan"
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <AvatarCard
            player={{
              name: "Player One",
              title: "Cyber Warrior",
              level,
              currentXP: xp,
              nextLevelXP,
              rank: "Bronze",
              avatar: "🧑‍💻"
            }}
            xpProgress={xpProgress}
          />

          <div className="bg-cyber-card p-5 rounded-xl">
            <h3 className="text-white flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-neon-cyan" />
              Atributos
            </h3>

            {attributeBars.map(attr => (
              <AttributeBar key={attr.name} attribute={attr} />
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="space-y-6">
          <StatsCard
            stats={{
              questsToday: missions.filter(m => m.done).length,
              totalQuests: missions.length,
              xpToday: history.reduce((a, h) => a + h.xp, 0),
              streak: history.length,
              weeklyXP: []
            }}
          />

          <div className="bg-cyber-card p-5 rounded-xl">
            <h3 className="text-white flex items-center gap-2 mb-4">
              <Swords className="w-5 h-5 text-neon-purple" />
              Missões
            </h3>

            {missions.map(mission => (
              <QuestCard
                key={mission.id}
                quest={mission}
                onComplete={() => completeMission(mission.id)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <StreakCard weeklyXP={[]} currentStreak={history.length} />

          <div className="bg-cyber-card p-5 rounded-xl">
            <h3 className="text-white flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-neon-orange" />
              Histórico
            </h3>

            <ul className="space-y-2 text-sm text-gray-300">
              {history.slice(0, 10).map((h, i) => (
                <li key={i}>
                  ✔ {h.title} (+{h.xp} XP)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPGDashboard;
