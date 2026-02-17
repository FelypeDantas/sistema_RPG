import { useMemo } from "react";
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

  const { totalXP, level, levelProgress, rank, playerClass } = useMemo(() => {
    const baseXP = calculateGlobalXP(attributes);
    const total = baseXP * multiplier;
    const lvl = calculateLevel(total);
    const progress = calculateLevelProgress(total);
    const rk = getGlobalRank(lvl);
    const cls = calculatePlayerClass(attributes);

    return {
      totalXP: total,
      level: lvl,
      levelProgress: progress,
      rank: rk,
      playerClass: cls,
    };
  }, [attributes, multiplier]);

  const progressPercent = Math.min(Math.max(levelProgress, 0), 100);

  return (
    <div className="bg-cyber-card p-6 rounded-xl border border-white/5 space-y-4 relative overflow-hidden">

      {/* Glow sutil animado */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-500/5 to-purple-500/5 animate-pulse" />

      <div className="flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-white text-xl font-semibold tracking-wide">
            Level <span className="text-neon-cyan drop-shadow-md">{level}</span>
          </h2>

          <p className="text-gray-400 text-sm">{rank}</p>

          <p className="text-neon-cyan text-xs mt-1 uppercase tracking-wider">
            Classe: {playerClass}
          </p>

          {prestige > 0 && (
            <p className="text-xs text-orange-400 mt-1">
              Prestígio {prestige} (+{prestige * 5}% XP)
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="text-white font-mono font-bold text-lg">
            {Math.floor(totalXP)} XP
          </p>
        </div>
      </div>

      {/* Barra de Level */}
      <div className="relative h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-cyan-300 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs text-gray-400">
        {Math.floor(levelProgress)}/100 XP para o próximo nível
      </p>
    </div>
  );
};
