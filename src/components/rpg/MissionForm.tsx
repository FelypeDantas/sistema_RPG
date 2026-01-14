import { useState } from "react";
import { Mission } from "@/hooks/useMissions";

interface MissionFormProps {
  onAdd: (mission: Mission) => void;
}

export const MissionForm = ({ onAdd }: MissionFormProps) => {
  const [title, setTitle] = useState("");
  const [xp, setXP] = useState(10);
  const [attribute, setAttribute] =
    useState<"Mente" | "Físico" | "Social" | "Finanças">("Mente");

  const handleAdd = () => {
    if (!title.trim()) return;

    onAdd({
      id: crypto.randomUUID(), // 🔑 ID ÚNICO (ESSENCIAL)
      title,
      xp,
      attribute,
      done: false
    });

    setTitle("");
    setXP(10);
    setAttribute("Mente");
  };

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
          min={1}
        />

        <select
          className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
          value={attribute}
          onChange={e =>
            setAttribute(e.target.value as any)
          }
        >
          <option value="Mente">Mente</option>
          <option value="Físico">Físico</option>
          <option value="Social">Social</option>
          <option value="Finanças">Finanças</option>
        </select>
      </div>

      <button
        className="w-full bg-neon-purple/80 hover:bg-neon-purple text-white py-2 rounded transition"
        onClick={handleAdd}
      >
        Criar Missão
      </button>
    </div>
  );
};
