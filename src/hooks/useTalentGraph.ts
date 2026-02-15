import { useState, useEffect, useCallback, useMemo } from "react";
import { TALENTS, Talent } from "@/data/talents";
import {  } from "@/hooks/usePlayer";
import { usePlayer } from "@/context/PlayerContext";

export function useTalentGraph() {
  const player = usePlayer(); // assume que já tem level, xp, etc.

  // Estado interno dos talentos
  const [talents, setTalents] = useState<Record<string, Talent>>(() => {
    const map: Record<string, Talent> = {};
    TALENTS.forEach(t => {
      map[t.id] = { ...t, progress: t.progress ?? 0, maxProgress: t.maxProgress ?? 100, collapsed: t.collapsed ?? false };
    });
    return map;
  });

  // Pontos disponíveis (por level ou outra lógica)
  const availablePoints = useMemo(() => {
    const spentPoints = Object.values(talents).filter(t => t.unlocked).reduce((acc, t) => acc + t.cost, 0);
    return Math.max(player.level - 1 - spentPoints, 0);
  }, [player.level, talents]);

  /* =============================
     🔓 DESBLOQUEAR OU EVOLUIR TALENTO
  ============================= */
  const addProgress = useCallback((id: string, amount: number) => {
    setTalents(prev => {
      const talent = prev[id];
      if (!talent) return prev;

      let newProgress = Math.min((talent.progress ?? 0) + amount, talent.maxProgress ?? 100);
      let unlocked = talent.unlocked || newProgress >= (talent.maxProgress ?? 100);

      const updated: Record<string, Talent> = {
        ...prev,
        [id]: { ...talent, progress: newProgress, unlocked }
      };

      // Se desbloqueado, liberar filhos
      if (unlocked && talent.children) {
        talent.children.forEach(childId => {
          const child = updated[childId];
          if (child && child.locked !== false) {
            updated[childId] = { ...child, locked: false };
          }
        });
      }

      return updated;
    });
  }, []);

  /* =============================
     🔄 TOGGLE COLLAPSE (UI)
  ============================= */
  const toggleCollapse = useCallback((id: string) => {
    setTalents(prev => {
      const talent = prev[id];
      if (!talent) return prev;
      return { ...prev, [id]: { ...talent, collapsed: !talent.collapsed } };
    });
  }, []);

  /* =============================
     📊 TALENTOS SUGERIDOS (DASHBOARD)
  ============================= */
  const suggestedTalents = useMemo(() => {
    return Object.values(talents).filter(t => t.locked !== false && t.requires?.every(r => talents[r]?.unlocked));
  }, [talents]);

  /* =============================
     🔍 BUSCA POR ID
  ============================= */
  const getTalentById = useCallback((id: string) => talents[id], [talents]);

  return {
    talents: Object.values(talents),
    talentsMap: talents,
    suggestedTalents,
    availablePoints,
    addProgress,
    toggleCollapse,
    getTalentById
  };
}
