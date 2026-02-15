import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { AttributesCodex } from "@/components/rpg/AttributesCodex";

const AttributesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Glow de fundo sutil */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 blur-3xl" />

      <div className="relative p-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition"
            />
            Voltar
          </button>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            📚 Codex de Atributos
          </h1>
        </motion.div>

        <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-6" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AttributesCodex />
        </motion.div>
      </div>
    </div>
  );
};

export default AttributesPage;
