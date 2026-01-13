import { useState } from "react";

export const MissionForm = ({ onAdd }: { onAdd: any }) => {
  const [title, setTitle] = useState("");
  const [xp, setXP] = useState(10);
  const [attribute, setAttribute] = useState("Mente");

  return (
    <div className="bg-cyber-card p-4 rounded-xl space-y-3">
      <input
        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
        placeholder="Nova missão"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          type="number"
          className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
          value={xp}
          onChange={e => setXP(Number(e.target.value))}
        />

        <select
          className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
          value={attribute}
          onChange={e => setAttribute(e.target.value)}
        >
          <option>Mente</option>
          <option>Físico</option>
          <option>Social</option>
          <option>Finanças</option>
        </select>
      </div>

      <button
        className="w-full bg-neon-purple/80 hover:bg-neon-purple text-white py-2 rounded"
        onClick={() => {
          if (!title) return;
          onAdd({ title, xp, attribute });
          setTitle("");
        }}
      >
        Criar Missão
      </button>
    </div>
  );
};
