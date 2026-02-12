import { useState, useCallback } from "react";
import { Mission } from "@/hooks/useMissions";

type AttributeType = "Mente" | "Físico" | "Social" | "Finanças";

interface MissionFormProps {
  onAdd: (mission: Mission) => void;
}

const safeXP = (value: number) => {
  if (isNaN(value)) return 1;
  return Math.max(1, value);
};

export const MissionForm = ({ onAdd }: MissionFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xp, setXP] = useState(10);
  const [attribute, setAttribute] =
    useState<AttributeType>("Mente");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setXP(10);
    setAttribute("Mente");
  };

  const handleAdd = useCallback(() => {
    if (!title.trim()) return;

    const finalXP = safeXP(xp);

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      xp: finalXP,
      attribute,
      done: false
    });

    resetForm();
  }, [title, description, xp, attribute, onAdd]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="bg-cyber-card p-4 rounded-xl space-y-3 border border-white/5">
      <input
        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neon-purple/60"
        placeholder="Nova missão"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={80}
      />

      <textarea
        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white resize-none focus:outline-none focus:ring-1 focus:ring-neon-purple/60"
        placeholder="Descrição da missão (visível ao passar o mouse)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxLength={200}
      />

      <div className="flex gap-2">
        <input
          type="number"
          className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neon-purple/60"
          value={xp}
          onChange={(e) =>
            setXP(safeXP(Number(e.target.value)))
          }
          min={1}
        />

        <select
          className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neon-purple/60"
          value={attribute}
          onChange={(e) =>
            setAttribute(e.target.value as AttributeType)
          }
        >
          <option value="Mente">Mente</option>
          <option value="Físico">Físico</option>
          <option value="Social">Social</option>
          <option value="Finanças">Finanças</option>
        </select>
      </div>

      <button
        className="w-full bg-neon-purple/80 hover:bg-neon-purple text-white py-2 rounded transition-colors duration-200 active:scale-[0.98]"
        onClick={handleAdd}
      >
        Criar Missão
      </button>
    </div>
  );
};
