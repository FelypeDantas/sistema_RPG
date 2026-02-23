import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TalentNodeData } from "../../hooks/useTalents";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (
    parentId: string,
    title: string,
    description: string,
    cost: number
  ) => void;
  talents: TalentNodeData[];
}

export default function CreateTalentModal({
  open,
  onClose,
  onCreate,
  talents
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(1);
  const [parentId, setParentId] = useState("");

  // 🔐 Reset automático ao abrir
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setCost(1);
      setParentId("");
    }
  }, [open]);

  const trimmedTitle = title.trim();

  const validation = useMemo(() => {
    if (trimmedTitle.length < 3)
      return { valid: false, message: "Título mínimo de 3 caracteres" };

    if (!parentId)
      return { valid: false, message: "Selecione um talento pai" };

    if (cost <= 0 || isNaN(cost))
      return { valid: false, message: "Custo inválido" };

    return { valid: true, message: "Pronto para forjar ⚡" };
  }, [trimmedTitle, parentId, cost]);

  const isValid = validation.valid;

  const handleSubmit = () => {
    if (!isValid) return;

    onCreate(parentId, trimmedTitle, description.trim(), cost);
    onClose();
  };

  // ⌨️ Enter + ESC
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSubmit();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, isValid, trimmedTitle, parentId, cost]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

        {/* 🌌 Partículas mais leves e seguras */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-30"
              initial={{
                x: Math.random() * 100 + "%",
                y: "100%",
                opacity: 0
              }}
              animate={{
                y: "-10%",
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="w-[420px] bg-cyber-card border border-purple-500/40 rounded-xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.25)] relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </button>

          <h2 className="text-lg font-bold mb-4 text-white">
            Criar Nova Habilidade
          </h2>

          <div className="space-y-4">

            <input
              placeholder="Título"
              value={title}
              maxLength={30}
              onChange={e => setTitle(e.target.value)}
              className={`w-full bg-black/40 border rounded px-3 py-2 text-sm outline-none transition
                ${
                  trimmedTitle.length >= 3
                    ? "border-neon-cyan"
                    : "border-purple-500/30"
                }`}
            />

            <textarea
              placeholder="Descrição"
              value={description}
              maxLength={120}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-purple-500/30 focus:border-neon-cyan rounded px-3 py-2 text-sm outline-none transition"
            />

            <input
              type="number"
              min={1}
              value={cost}
              onChange={e =>
                setCost(Math.max(1, Number(e.target.value)))
              }
              className="w-full bg-black/40 border border-purple-500/30 focus:border-neon-cyan rounded px-3 py-2 text-sm outline-none transition"
            />

            <select
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              className="w-full bg-black/40 border border-purple-500/30 focus:border-neon-cyan rounded px-3 py-2 text-sm outline-none transition"
            >
              <option value="">Selecionar talento pai</option>
              {talents.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>

            {/* 🧠 Feedback */}
            <p className={`text-xs ${isValid ? "text-neon-cyan" : "text-gray-500"}`}>
              {validation.message}
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!isValid}
              onClick={handleSubmit}
              className={`w-full py-2 rounded font-semibold transition
                ${
                  isValid
                    ? "bg-gradient-to-r from-purple-600 to-neon-cyan text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
              Criar Talento
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}