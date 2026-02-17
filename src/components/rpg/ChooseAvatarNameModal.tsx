import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  onConfirm: (name: string) => void;
};

export default function ChooseAvatarNameModal({ onConfirm }: Props) {
  const [name, setName] = useState("");

  const isValid = name.trim().length >= 3;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-cyber-card border border-neon-cyan/30 rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">
            Escolha seu Nome
          </h2>
          <p className="text-sm text-gray-400">
            Você evoluiu além do nível inicial.  
            Agora o sistema reconhece sua identidade.
          </p>
        </div>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Digite seu nome de avatar"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={!isValid}
          onClick={() => onConfirm(name.trim())}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isValid
              ? "bg-neon-cyan text-black"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmar Identidade
        </motion.button>
      </motion.div>
    </div>
  );
}
