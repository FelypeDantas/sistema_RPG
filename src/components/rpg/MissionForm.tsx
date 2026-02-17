import { useState, useCallback, FormEvent } from "react";
import { Mission } from "@/hooks/useMissions";

type AttributeType = "Mente" | "Físico" | "Social" | "Finanças";

interface MissionFormProps {
  onAdd: (mission: Mission) => void;
}

const ATTRIBUTE_OPTIONS: AttributeType[] = [
  "Mente",
  "Físico",
  "Social",
  "Finanças"
];

const clampXP = (value: number) => {
  if (isNaN(value)) return 1;
  return Math.max(1, Math.floor(value));
};

export const MissionForm = ({ onAdd }: MissionFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xp, setXP] = useState<number>(10);
  const [attribute, setAttribute] =
    useState<AttributeType>("Mente");

  const isValid = title.trim().length > 0;

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setXP(10);
    setAttribute("Mente");
  }, []);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (!isValid) return;

      const finalXP = clampXP(xp);

      onAdd({
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        xp: finalXP,
        attribute,
        done: false
      });

      resetForm();
    },
    [title, description, xp, attribute, onAdd, resetForm, isValid]
  );

  const handleXPChange = useCallback(
    (value: string) => {
      setXP(clampXP(Number(value)));
    },
    []
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cyber-card p-4 rounded-xl space-y-3 border border-white/5"
    >
      <input
        className="
          w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white
          focus:outline-none focus:ring-1 focus:ring-neon-purple/60
        "
        placeholder="Nova missão"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={80}
        required
        aria-label="Título da missão"
      />

      <textarea
        className="
          w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white
          resize-none focus:outline-none focus:ring-1 focus:ring-neon-purple/60
        "
        placeholder="Descrição da missão"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxLength={200}
        aria-label="Descrição da missão"
      />

      <div className="flex gap-2">
        <input
          type="number"
          className="
            flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-white
            focus:outline-none focus:ring-1 focus:ring-neon-purple/60
          "
          value={xp}
          onChange={(e) => handleXPChange(e.target.value)}
          min={1}
          aria-label="Quantidade de XP"
        />

        <select
          className="
            bg-black/40 border border-white/10 rounded px-3 py-2 text-white
            focus:outline-none focus:ring-1 focus:ring-neon-purple/60
          "
          value={attribute}
          onChange={(e) =>
            setAttribute(e.target.value as AttributeType)
          }
          aria-label="Atributo relacionado"
        >
          {ATTRIBUTE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`
          w-full py-2 rounded text-white transition-all duration-200
          ${
            isValid
              ? "bg-neon-purple/80 hover:bg-neon-purple active:scale-[0.98]"
              : "bg-gray-700 cursor-not-allowed opacity-60"
          }
        `}
      >
        Criar Missão
      </button>
    </form>
  );
};
