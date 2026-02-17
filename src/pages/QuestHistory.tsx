import { ArrowLeft, ScrollText, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMissions } from "@/hooks/useMissions";
import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";

export default function QuestHistory() {
  const { history } = useMissions();
  const navigate = useNavigate();

  const [visibleLines, setVisibleLines] = useState(0);

  const reversedHistory = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  const totalXP = useMemo(() => {
    return history.reduce((acc, q) => acc + q.xp, 0);
  }, [history]);

  const successCount = useMemo(() => {
    return history.filter(q => q.success).length;
  }, [history]);

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
    }, 100);

    return () => clearInterval(interval);
  }, [reversedHistory]);

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="text-right">
          <h1 className="text-2xl font-bold flex items-center gap-2 justify-end">
            <ScrollText className="text-neon-cyan" />
            Histórico de Missões
          </h1>
          <p className="text-xs text-gray-500">
            {history.length} registros
          </p>
        </div>
      </header>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-cyber-card border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400">Missões</p>
          <p className="text-lg font-semibold text-white">
            {history.length}
          </p>
        </div>

        <div className="bg-cyber-card border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400">Vitórias</p>
          <p className="text-lg font-semibold text-neon-green">
            {successCount}
          </p>
        </div>

        <div className="bg-cyber-card border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400">XP Total</p>
          <p className="text-lg font-semibold text-neon-cyan">
            {totalXP}
          </p>
        </div>
      </motion.div>

      {/* Lista */}
      <div className="space-y-4">
        {reversedHistory.length === 0 && (
          <div className="bg-cyber-card border border-white/10 rounded-xl p-6 text-center text-gray-500">
            Nenhum registro encontrado.
          </div>
        )}

        {reversedHistory.slice(0, visibleLines).map((quest, index) => (
          <motion.div
            key={quest.id + quest.date + index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              bg-cyber-card
              border rounded-xl p-4
              transition-all
              ${
                quest.success
                  ? "border-neon-green/30 hover:border-neon-green/60"
                  : "border-red-500/30 hover:border-red-500/60"
              }
            `}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {quest.success ? (
                  <CheckCircle
                    className="text-neon-green"
                    size={18}
                  />
                ) : (
                  <XCircle
                    className="text-red-400"
                    size={18}
                  />
                )}

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      quest.success
                        ? "text-neon-green"
                        : "text-red-400"
                    }`}
                  >
                    {quest.success
                      ? "Missão concluída"
                      : "Missão falhou"}
                  </p>

                  {quest.title && (
                    <p className="text-xs text-gray-400">
                      {quest.title}
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    {new Date(quest.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <span
                className={`text-sm font-semibold ${
                  quest.success
                    ? "text-neon-cyan"
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

      {/* Cursor sutil */}
      {visibleLines < reversedHistory.length && (
        <div className="mt-6 text-neon-cyan animate-pulse text-sm">
          carregando histórico...
        </div>
      )}
    </div>
  );
}
