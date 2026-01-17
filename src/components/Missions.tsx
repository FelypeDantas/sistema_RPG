import { useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Mission } from "@/types/Mission";
import { v4 as uuid } from "uuid";

const DAILY_KEY = "rpg_daily_mission_date";
const DAILY_DONE_KEY = "rpg_daily_completed";
const ACHIEVEMENTS_KEY = "rpg_daily_achievements";

const DAILY_QUESTS = [
  { title: "Estudar por 25 minutos", attribute: "Mente" },
  { title: "Caminhar por 10 minutos", attribute: "Físico" },
  { title: "Conversar com alguém", attribute: "Social" },
  { title: "Organizar finanças do dia", attribute: "Finanças" },
];

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function streakBonus(streak: number) {
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1;
}

export function Missions() {
  const {
    gainXP,
    loseXP,
    level,
    streak,
    resetStreak,
  } = usePlayer();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [dailyCount, setDailyCount] = useState(
    Number(localStorage.getItem(DAILY_DONE_KEY) ?? 0)
  );

  const [achievements, setAchievements] = useState<string[]>(
    JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) ?? "[]")
  );

  /* ===============================
     🌅 QUEST DIÁRIA + HARDCORE
  =============================== */
  useEffect(() => {
    const today = todayKey();
    const lastDaily = localStorage.getItem(DAILY_KEY);

    if (lastDaily && lastDaily !== today) {
      const unfinishedDaily = missions.find(
        m => m.tag === "Diária" && !m.completed
      );

      if (unfinishedDaily) {
        resetStreak();

        // 💀 Hardcore penalty
        const penalty = Math.round(20 + level * 10);
        loseXP?.(penalty);
      }

      setMissions(prev =>
        prev.filter(m => m.tag !== "Diária")
      );
    }

    if (lastDaily === today) return;

    const random =
      DAILY_QUESTS[Math.floor(Math.random() * DAILY_QUESTS.length)];

    const baseXP = Math.round(50 + level * 15);
    const finalXP = Math.round(
      baseXP * streakBonus(streak)
    );

    setMissions(prev => [
      ...prev,
      {
        id: uuid(),
        title: `Quest diária: ${random.title}`,
        xp: finalXP,
        tag: "Diária",
        attribute: random.attribute,
        completed: false,
      },
    ]);

    localStorage.setItem(DAILY_KEY, today);
  }, [missions, level, streak]);

  /* ===============================
     ✅ CONCLUIR MISSÃO
  =============================== */
  function completeMission(id: string) {
    const mission = missions.find(
      m => m.id === id && !m.completed
    );
    if (!mission) return;

    gainXP(mission.xp);

    if (mission.tag === "Diária") {
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      localStorage.setItem(
        DAILY_DONE_KEY,
        String(newCount)
      );

      unlockAchievements(newCount);
    }

    setMissions(prev =>
      prev.map(m =>
        m.id === id ? { ...m, completed: true } : m
      )
    );
  }

  /* ===============================
     🏆 CONQUISTAS
  =============================== */
  function unlockAchievements(count: number) {
    const unlocks: Record<number, string> = {
      1: "🌅 Primeiro Amanhecer",
      7: "🔥 Ritual da Semana",
      30: "🏆 Disciplina Lendária",
      100: "👁️ Entidade da Rotina",
    };

    if (!unlocks[count]) return;
    if (achievements.includes(unlocks[count])) return;

    const updated = [...achievements, unlocks[count]];
    setAchievements(updated);
    localStorage.setItem(
      ACHIEVEMENTS_KEY,
      JSON.stringify(updated)
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900">
      <h2 className="font-bold mb-2">Missões</h2>

      <ul className="space-y-2">
        {missions.map(m => (
          <li
            key={m.id}
            className={`p-2 rounded border ${
              m.completed
                ? "border-green-600 opacity-60"
                : "border-zinc-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>
                {m.tag === "Diária" && "🌅 "}
                {m.title}
                {m.attribute && (
                  <span className="text-xs ml-2 text-zinc-400">
                    ({m.attribute})
                  </span>
                )}
              </span>

              {!m.completed && (
                <button
                  onClick={() => completeMission(m.id)}
                  className="text-xs bg-green-600 px-2 py-1 rounded"
                >
                  Concluir +{m.xp} XP
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {achievements.length > 0 && (
        <div className="mt-4 text-xs text-zinc-400">
          🏆 {achievements.join(" • ")}
        </div>
      )}
    </div>
  );
}
