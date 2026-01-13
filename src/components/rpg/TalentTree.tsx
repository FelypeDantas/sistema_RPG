export const TalentTree = ({ talents, points, onUnlock }: any) => {
  return (
    <div className="bg-cyber-card p-5 rounded-xl space-y-4">
      <h3 className="text-white font-semibold">
        🗺️ Árvore de Talentos
      </h3>

      <p className="text-sm text-gray-400">
        Pontos disponíveis: {points}
      </p>

      <div className="space-y-3">
        {talents.map((talent: any) => (
          <div
            key={talent.id}
            className={`p-3 rounded border ${
              talent.unlocked
                ? "border-neon-green/50 bg-neon-green/10"
                : "border-white/10"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">
                  {talent.title}
                </p>
                <p className="text-xs text-gray-400">
                  {talent.description}
                </p>
              </div>

              {!talent.unlocked && (
                <button
                  className="text-xs bg-neon-purple px-3 py-1 rounded"
                  onClick={() => onUnlock(talent.id)}
                >
                  {talent.cost} TP
                </button>
              )}

              {talent.unlocked && (
                <span className="text-xs text-neon-green">
                  Desbloqueado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
