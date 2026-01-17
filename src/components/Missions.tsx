import { useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Mission } from "@/types/Mission";
import { v4 as uuid } from "uuid";

const DAILY_KEY = "rpg_daily_mission_date";

const DAILY_QUESTS = [
  "Estudar por 25 minutos",
  "Caminhar por 10 minutos",
  "Organizar algo pequeno",
  "Ler 5 páginas",
  "Beber água conscientemente",
];

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

export function Missions() {
  const { gainXP } = usePlayer();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(50);
  const [tag, setTag] = useState("Geral");

  /* ===============================
     🌅 QUEST DIÁRIA AUTOMÁTICA
  =============================== */
  useEffect(() => {
    const today = todayKey();
    const lastDaily = localStorage.getItem(DAILY_KEY);

    if (lastDaily === today) return;

    const alreadyExists = missions.some(
      m => m.tag === "Diária" && !m.completed
    );

    if (alreadyExists) return;

    const randomQuest =
      DAILY_QUESTS[Math.floor(Math.random() * DAILY_QUESTS.length)];

    const dailyMission: Mission = {
      id: uuid(),
      title: `Quest diária: ${randomQuest}`,
      xp: 100,
      tag: "Diária",
      completed: false,
    };

    setMissions(prev => [...prev, dailyMission]);
    localStorage.setItem(DAILY_KEY, today);
  }, [missions]);

  /* ===============================
     ➕ ADD MISSÃO NORMAL
  =============================== */
  function addMission() {
    if (!title.trim()) return;

    setMissions(prev => [
      ...prev,
      {
        id: uuid(),
        title: title.trim(),
        xp,
        tag,
        completed: false,
      },
    ]);

    setTitle("");
  }

  /* ===============================
     ✅ CONCLUIR MISSÃO
  =============================== */
  function completeMission(id: string) {
    const mission = missions.find(
      m => m.id === id && !m.completed
    );

    if (!mission) return;

    gainXP(mission.xp);

    setMissions(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, completed: true }
          : m
      )
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900">
      <h2 className="font-bold mb-2">Missões</h2>

      <div className="flex gap-2 mb-3">
        <input
          className="bg-zinc-800 px-2 py-1 rounded"
          placeholder="Missão"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="bg-zinc-800 px-2 py-1 rounded w-20"
          value={xp}
          min={1}
          onChange={e => setXp(Number(e.target.value))}
        />

        <button
          onClick={addMission}
          className="bg-purple-600 px-3 rounded"
        >
          +
        </button>
      </div>

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
    </div>
  );
}
