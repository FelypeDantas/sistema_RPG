import { usePlayer } from "@/context/PlayerContext";
import {
  calculateGlobalXP,
  calculateLevel,
  calculateLevelProgress,
  getGlobalRank,
} from "@/utils/playerProgression";
import { calculatePlayerClass } from "@/utils/playerClass";

export const PlayerStatusCard = () => {
  const { attributes, prestige } = usePlayer();

  const multiplier = 1 + (prestige ?? 0) * 0.05;

  const totalXP = calculateGlobalXP(attributes) * multiplier;
  const level = calculateLevel(totalXP);
  const levelProgress = calculateLevelProgress(totalXP);
  const rank = getGlobalRank(level);
  const playerClass = calculatePlayerClass(attributes);

  const progressPercent = (levelProgress / 100) * 100;

  return (
    <div className="bg-cyber-card p-6 rounded-xl border border-white/5 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-xl font-semibold">
            Level {level}
          </h2>

          <p className="text-gray-400 text-sm">{rank}</p>

          <p className="text-neon-cyan text-xs mt-1">
            Classe: {playerClass}
          </p>

          {prestige > 0 && (
            <p className="text-xs text-orange-400 mt-1">
              Prestígio {prestige} (+{prestige * 5}% XP)
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="text-white font-mono font-bold">
            {Math.floor(totalXP)} XP
          </p>
        </div>
      </div>

      {/* Barra de Level */}
      <div className="relative h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs text-gray-400">
        {Math.floor(levelProgress)}/100 XP para o próximo nível
      </p>
    </div>
  );
};
