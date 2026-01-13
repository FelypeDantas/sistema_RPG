import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useMissions, Mission } from "@/hooks/useMissions";
import { useAchievements } from "@/hooks/useAchievements";

// =====================
// Tipos
// =====================
interface Player {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  attributes: {
    Físico: number;
    Mente: number;
    Social: number;
    Finanças: number;
  };
}

// =====================
// Constantes
// =====================
const PLAYER_STORAGE = "rpg_player_data";

// =====================
// Componente
// =====================
export default function RPGDashboard() {
  // 🧙 Player base
  const [player, setPlayer] = useState<Player>({
    level: 1,
    currentXP: 0,
    nextLevelXP: 100,
    attributes: {
      Físico: 0,
      Mente: 0,
      Social: 0,
      Finanças: 0
    }
  });

  // 🎯 Missões (BLINDADO)
  const missionsHook = useMissions();
  const missions = missionsHook ?? {
    missions: [],
    history: [],
    addMission: () => {},
    completeMission: () => false
  };

  // 🏆 Conquistas
  const achievements = useAchievements(player, missions);

  // =====================
  // Load Player
  // =====================
  useEffect(() => {
    const stored = localStorage.getItem(PLAYER_STORAGE);
    if (stored) {
      setPlayer(JSON.parse(stored));
    }
  }, []);

  // =====================
  // Save Player
  // =====================
  useEffect(() => {
    localStorage.setItem(PLAYER_STORAGE, JSON.stringify(player));
  }, [player]);

  // =====================
  // Funções
  // =====================
  const gainXP = (xp: number) => {
    setPlayer(prev => {
      let currentXP = prev.currentXP + xp;
      let level = prev.level;
      let nextXP = prev.nextLevelXP;

      while (currentXP >= nextXP) {
        currentXP -= nextXP;
        level += 1;
        nextXP = Math.floor(nextXP * 1.25);
      }

      return {
        ...prev,
        level,
        currentXP,
        nextLevelXP: nextXP
      };
    });
  };

  const completeMission = (mission: Mission) => {
    const success = missions.completeMission(mission, 0.8);

    if (success) {
      gainXP(mission.xp);

      setPlayer(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [mission.attribute]:
            prev.attributes[mission.attribute] + 1
        }
      }));
    }
  };

  // =====================
  // Render
  // =====================
  return (
    <div className="p-6 space-y-6">

      {/* PLAYER CARD */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">🧙 Player</h2>

          <div className="flex justify-between text-sm">
            <span>Nível {player.level}</span>
            <span>
              {player.currentXP} / {player.nextLevelXP} XP
            </span>
          </div>

          <Progress
            value={(player.currentXP / player.nextLevelXP) * 100}
          />

          <div className="flex gap-2 flex-wrap">
            {Object.entries(player.attributes).map(([key, value]) => (
              <Badge key={key} variant="secondary">
                {key}: {value}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MISSÕES */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">🎯 Missões</h2>

          {missions.missions.length === 0 && (
            <p className="text-sm opacity-70">
              Nenhuma missão cadastrada
            </p>
          )}

          {missions.missions.map(mission => (
            <div
              key={mission.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-semibold">{mission.title}</p>
                <p className="text-sm opacity-70">
                  +{mission.xp} XP • {mission.attribute}
                </p>
              </div>

              <Button
                disabled={mission.done}
                onClick={() => completeMission(mission)}
              >
                {mission.done ? "Concluída" : "Executar"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* HISTÓRICO */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">📜 Histórico</h2>

          {missions.history.length === 0 && (
            <p className="text-sm opacity-70">
              Nenhuma missão executada
            </p>
          )}

          {missions.history.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm border-b pb-1"
            >
              <span>{item.title}</span>
              <span>
                {item.success ? "✅ Sucesso" : "❌ Falha"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CONQUISTAS */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">🏆 Conquistas</h2>

          {achievements.unlocked.length === 0 && (
            <p className="text-sm opacity-70">
              Nenhuma conquista desbloqueada
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            {achievements.unlocked.map(a => (
              <Badge key={a.id}>{a.title}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
