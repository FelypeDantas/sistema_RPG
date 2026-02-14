import { ArrowLeft, ScrollText, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMissions } from "@/hooks/useMissions";
import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";

export default function QuestHistory() {
  const { history } = useMissions();
  const navigate = useNavigate();

  const [visibleLines, setVisibleLines] = useState(0);

  // Ordena histórico
  const reversedHistory = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  // Estatísticas
  const totalXP = useMemo(() => {
    return history.reduce((acc, q) => acc + q.xp, 0);
  }, [history]);

  const successCount = useMemo(() => {
    return history.filter((q) => q.success).length;
  }, [history]);

  // Animação estilo digitação
  useEffect(() => {
    if (reversedHistory.length === 0) return;

    setVisibleLines(0);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= reversedHistory.length) {
        clearInterval(interval);
      }
    }, 120); // velocidade da "digitação"

    return () => clearInterval(interval);
  }, [reversedHistory]);

  return (
    <div className="min-h-screen p-6 bg-black text-green-400 font-mono">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between border-b border-green-500/30 pb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm hover:text-white transition"
        >
          <ArrowLeft size={18} />
          voltar.exe
        </button>

        <div className="text-right">
          <h1 className="text-2xl font-bold flex items-center gap-2 justify-end">
            <ScrollText className="text-green-400" />
            quest_log.sys
          </h1>
          <p className="text-xs text-green-500">
            {history.length} registros encontrados
          </p>
        </div>
      </header>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 text-sm space-y-1"
      >
        <p>⚔ missões_concluidas: {history.length}</p>
        <p>✔ vitorias: {successCount}</p>
        <p>✦ xp_total: {totalXP}</p>
      </motion.div>

      {/* Terminal Output */}
      <div className="space-y-3">
        {reversedHistory.length === 0 && (
          <p className="text-green-600">
            nenhum_registro_encontrado...
          </p>
        )}

        {reversedHistory.slice(0, visibleLines).map((quest, index) => (
          <motion.div
            key={quest.id + quest.date + index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              border border-green-500/20
              rounded-lg p-4
              bg-green-500/5
              hover:bg-green-500/10
              transition-all
            "
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {quest.success ? (
                  <CheckCircle className="text-green-400" size={18} />
                ) : (
                  <XCircle className="text-red-400" size={18} />
                )}

                <div>
                  <p
                    className={`text-sm font-bold ${
                      quest.success
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    [{quest.success ? "SUCCESS" : "FAILED"}]
                  </p>

                  {quest.title && (
                    <p className="text-xs text-green-300">
                      missão: {quest.title}
                    </p>
                  )}

                  <p className="text-xs text-green-600">
                    {new Date(quest.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <span
                className={`text-sm font-semibold ${
                  quest.success
                    ? "text-green-300"
                    : "text-red-400"
                }`}
              >
                {quest.success ? "+" : ""}
                {quest.xp} XP
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cursor piscando */}
      {visibleLines < reversedHistory.length && (
        <div className="mt-4 text-green-400 animate-pulse">
          ▌
        </div>
      )}
    </div>
  );
}
