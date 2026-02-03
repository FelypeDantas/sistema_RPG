import { useState } from "react";
import { Mission } from "../../hooks/useMissions";
import { useMissions } from "../../hooks/useMissions";
import "./MissionModal.css";

export function MissionList() {
  const { missions, completeMission } = useMissions();

  const [selectedMission, setSelectedMission] =
    useState<Mission | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <ul>
        {missions.map(mission => (
          <li key={mission.id}>
            <h3>{mission.title}</h3>
            <p>{mission.description}</p>
            <p>XP: {mission.xp}</p>

            <button
              onClick={() => {
                setSelectedMission(mission);
                setShowConfirm(true);
              }}
            >
              Finalizar missão
            </button>
          </li>
        ))}
      </ul>

      {showConfirm && selectedMission && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Concluir Missão</h2>

            <p>
              Tem certeza de que deseja concluir a missão
              <strong> "{selectedMission.title}"</strong>?
            </p>

            <div className="actions">
              <button
                className="fail"
                onClick={() => {
                  completeMission(selectedMission, false);
                  setShowConfirm(false);
                  setSelectedMission(null);
                }}
              >
                ❌ Falha
              </button>

              <button
                className="success"
                onClick={() => {
                  completeMission(selectedMission, true);
                  setShowConfirm(false);
                  setSelectedMission(null);
                }}
              >
                ✅ Sucesso
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
