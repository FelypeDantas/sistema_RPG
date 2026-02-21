import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
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

    if (!open) return null;

    const handleSubmit = () => {
        if (!title || !parentId) return;

        onCreate(parentId, title, description, cost);

        setTitle("");
        setDescription("");
        setCost(1);
        setParentId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-40"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-[420px] bg-cyber-card border border-purple-500/40 rounded-xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.25)] relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
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
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/30 focus:border-neon-cyan rounded px-3 py-2 text-sm outline-none transition"
                    />

                    <textarea
                        placeholder="Descrição"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/30 focus:border-neon-cyan rounded px-3 py-2 text-sm outline-none transition"
                    />

                    <input
                        type="number"
                        min={1}
                        value={cost}
                        onChange={e => setCost(Number(e.target.value))}
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

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-purple-600 to-neon-cyan py-2 rounded font-semibold text-black hover:opacity-90 transition shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    >
                        Criar Talento
                    </button>

                </div>
            </motion.div>
        </div>
    );
}