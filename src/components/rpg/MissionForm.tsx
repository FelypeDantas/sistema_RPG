import { useState, useCallback, FormEvent, useMemo } from "react";
import { Mission } from "@/hooks/useMissions";
import { usePlayerRealtime } from "@/hooks/usePlayer";
import { useSmartMissionGenerator } from "@/hooks/useSmartMissionGenerator";
import { useAuthWithPlayer } from "@/hooks/useAuth";
import clsx from "clsx";

type AttributeType = "Mente" | "Físico" | "Social" | "Finanças";
type DifficultyType = "easy" | "medium" | "hard" | "epic";

interface MissionFormProps {
  onAdd: (mission: Mission) => void;
}

const ATTRIBUTE_OPTIONS: AttributeType[] = [
  "Mente",
  "Físico",
  "Social",
  "Finanças"
];

const ATTRIBUTE_BASE_XP: Record<AttributeType, number> = {
  Mente: 40,
  Físico: 60,
  Social: 50,
  Finanças: 70
};

const ATTRIBUTE_COLORS: Record<AttributeType, string> = {
  Mente: "text-purple-400",
  Físico: "text-red-400",
  Social: "text-blue-400",
  Finanças: "text-green-400"
};

const clampXP = (value: number) => {
  if (isNaN(value)) return 1;
  return Math.max(1, Math.min(500, Math.floor(value)));
};

const { user } = useAuthWithPlayer();
const {attributes} = usePlayerRealtime(user?.uid);
const { generate } = useSmartMissionGenerator(attributes);

const getDifficulty = (xp: number): DifficultyType => {
  if (xp >= 200) return "epic";
  if (xp >= 100) return "hard";
  if (xp >= 50) return "medium";
  return "easy";
};

const getDifficultyMeta = (difficulty: DifficultyType) => {
  const map = {
    easy: { label: "Fácil", color: "text-green-400" },
    medium: { label: "Média", color: "text-yellow-400" },
    hard: { label: "Difícil", color: "text-orange-400" },
    epic: { label: "Épica", color: "text-red-400" }
  };
  return map[difficulty];
};

export const MissionForm = ({ onAdd }: MissionFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xp, setXP] = useState<number>(40);
  const [attribute, setAttribute] =
    useState<AttributeType>("Mente");

  const isValid = title.trim().length >= 3;

  /* ---------------- AUTO XP SUGESTÃO ---------------- */

  const handleAttributeChange = useCallback(
    (newAttr: AttributeType) => {
      setAttribute(newAttr);
      setXP(ATTRIBUTE_BASE_XP[newAttr]);
    },
    []
  );

  const difficulty = useMemo(() => {
    const diff = getDifficulty(xp);
    return {
      type: diff,
      ...getDifficultyMeta(diff)
    };
  }, [xp]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setXP(ATTRIBUTE_BASE_XP["Mente"]);
    setAttribute("Mente");
  }, []);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (!isValid) return;

      const finalXP = clampXP(xp);
      const finalDifficulty = getDifficulty(finalXP);

      onAdd({
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        xp: finalXP,
        attribute,
        difficulty: finalDifficulty,
        done: false,
        completed: false,
        createdAt: Date.now()
      });

      resetForm();
    },
    [title, description, xp, attribute, onAdd, resetForm, isValid]
  );

  /* ---------------- GAME DESIGN FEEDBACK ---------------- */

  const strategicHint = useMemo(() => {
    if (difficulty.type === "epic")
      return "Missão épica detectada. Prepare-se mentalmente.";
    if (difficulty.type === "hard")
      return "Desafio significativo. Recompensa justa.";
    if (difficulty.type === "medium")
      return "Boa missão para progresso consistente.";
    return "Missão leve. Ótima para manter streak.";
  }, [difficulty.type]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cyber-card p-4 rounded-xl space-y-4 border border-white/5"
    >
      <input
        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
        placeholder="Nova missão"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={80}
        required
      />

      <textarea
        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white resize-none"
        placeholder="Descrição da missão"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxLength={200}
      />

      <div className="flex gap-2">
        <input
          type="number"
          className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
          value={xp}
          onChange={(e) => setXP(clampXP(Number(e.target.value)))}
          min={1}
        />

        <select
          className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
          value={attribute}
          onChange={(e) =>
            handleAttributeChange(e.target.value as AttributeType)
          }
        >
          {ATTRIBUTE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* PREVIEW ESTRATÉGICO */}
      <div className="flex justify-between text-xs">
        <span className={ATTRIBUTE_COLORS[attribute]}>
          Atributo: {attribute}
        </span>

        <span className={difficulty.color}>
          Dificuldade: {difficulty.label}
        </span>
      </div>

      <div className="text-[11px] text-gray-400">
        {strategicHint}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={clsx(
          "w-full py-2 rounded text-white transition-all duration-200",
          isValid
            ? "bg-neon-purple/80 hover:bg-neon-purple active:scale-[0.98]"
            : "bg-gray-700 cursor-not-allowed opacity-60"
        )}
      >
        Criar Missão (+{xp} XP)
      </button>

      <button
        type="button"
        onClick={() => onAdd(generate())}
        className="w-full py-2 rounded bg-cyan-500/20 hover:bg-cyan-500/40 transition"
      >
        🎯 Gerar Missão Inteligente
      </button>
    </form>
  );
};