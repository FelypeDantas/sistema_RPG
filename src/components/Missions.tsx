import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Mission } from "@/types/Mission";
import { v4 as uuid } from "uuid";

export function Missions() {
  const { gainXP } = usePlayer();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(50);
  const [tag, setTag] = useState("Geral");

  function addMission() {
    if (!title) return;

    setMissions(prev => [
      ...prev,
      {
        id: uuid(),
        title,
        xp,
        tag,
        completed: false,
      },
    ]);

    setTitle("");
  }

  function completeMission(id: string) {
    setMissions(prev =>
      prev.map(m =>
        m.id === id && !m.completed
          ? (gainXP(m.xp), { ...m, completed: true })
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
              <span>{m.title}</span>
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
