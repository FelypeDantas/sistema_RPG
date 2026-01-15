import { ScrollText, CheckCircle, XCircle } from "lucide-react";
import { useMissions } from "@/hooks/useMissions";

export default function QuestHistory() {
  const { history } = useMissions();

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ScrollText className="text-neon-cyan" />
          Histórico de Quests
        </h1>
        <p className="text-sm text-gray-400">
          Registro de todas as missões já concluídas
        </p>
      </header>

      {/* Lista */}
      <div className="space-y-4">
        {history.length === 0 && (
          <p className="text-gray-400">
            Nenhuma quest finalizada ainda.
          </p>
        )}

        {history
          .slice()
          .reverse()
          .map((quest, index) => (
            <div
              key={quest.id + quest.date + index}
              className="
                bg-cyber-card
                border border-white/10
                rounded-xl
                p-4
                flex justify-between items-center
              "
            >
              <div className="flex items-center gap-3">
                {quest.success ? (
                  <CheckCircle className="text-neon-green" />
                ) : (
                  <XCircle className="text-neon-red" />
                )}

                <div>
                  <p
                    className={`font-medium ${
                      quest.success
                        ? "text-neon-green"
                        : "text-neon-red"
                    }`}
                  >
                    {quest.success ? "Sucesso" : "Falha"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(quest.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <span className="text-sm text-gray-300">
                +{quest.xp} XP
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
