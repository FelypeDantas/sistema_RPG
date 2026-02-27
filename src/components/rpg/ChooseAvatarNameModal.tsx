import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onConfirm: (name: string) => void;
  onClose?: () => void;
};

const nameRegex = /^[a-zA-Z0-9_ ]+$/;

export default function ChooseAvatarNameModal({
  onConfirm,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedName = name.trim();

  const validation = useMemo(() => {
    if (!touched) return { valid: false, message: "" };

    if (trimmedName.length < 3)
      return { valid: false, message: "Mínimo de 3 caracteres" };

    if (trimmedName.length > 20)
      return { valid: false, message: "Máximo de 20 caracteres" };

    if (!nameRegex.test(trimmedName))
      return { valid: false, message: "Use apenas letras, números ou _" };

    return { valid: true, message: "Identidade válida ✨" };
  }, [trimmedName, touched]);

  const isValid = validation.valid;

  const handleConfirm = useCallback(() => {
    if (!isValid) return;
    onConfirm(trimmedName);
  }, [isValid, trimmedName, onConfirm]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleConfirm();
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleConfirm, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="relative bg-cyber-card border border-neon-cyan/30 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-[0_0_40px_rgba(0,255,255,0.15)]"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <h2 className="text-xl font-bold text-white">
              Escolha seu Nome
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Você evoluiu além do nível inicial.
              <br />
              Agora o sistema reconhece sua identidade.
            </p>
          </div>

          <div className="relative z-10 space-y-2">
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!touched) setTouched(true);
              }}
              placeholder="Digite seu nome de avatar"
              maxLength={20}
              aria-invalid={!isValid && touched}
              className={`w-full px-4 py-2 rounded-lg bg-white/5 border text-white focus:outline-none transition
                ${
                  isValid
                    ? "border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                    : touched
                    ? "border-red-500"
                    : "border-white/10"
                }`}
            />

            {touched && (
              <p
                className={`text-xs transition ${
                  isValid ? "text-neon-cyan" : "text-red-400"
                }`}
              >
                {validation.message}
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={!isValid}
            onClick={handleConfirm}
            className={`relative z-10 w-full py-2 rounded-lg font-semibold transition
              ${
                isValid
                  ? "bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
          >
            Confirmar Identidade
          </motion.button>

          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs text-neon-cyan relative z-10"
              >
                Pronto para iniciar sua jornada ⚡
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}