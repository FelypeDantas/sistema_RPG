import { useState, useCallback, useEffect } from "react";
import { Mission, useMissions } from "../../hooks/useMissions";
import "./MissionModal.css";

export function MissionList() {
  const { missions, completeMission } = useMissions();

  const [selectedMission, setSelectedMission] =
    useState<Mission | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  const closeModal = useCallback(() => {
    setShowConfirm(false);
    setSelectedMission(null);
  }, []);

  const handleComplete = useCallback(
    (success: boolean) => {
      if (!selectedMission) return;
      completeMission(selectedMission, success);
      closeModal();
    },
    [selectedMission, completeMission, closeModal]
  );

  // Fecha modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (showConfirm) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showConfirm, closeModal]);

  return (
    <>
      <ul>
        {missions.map((mission) => (
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
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal">
            <h2>Concluir Missão</h2>

            <p>
              Tem certeza de que deseja concluir a missão
              <strong> "{selectedMission.title}"</strong>?
            </p>

            <div className="actions">
              <button
                className="fail"
                onClick={() => handleComplete(false)}
              >
                ❌ Falha
              </button>

              <button
                className="success"
                onClick={() => handleComplete(true)}
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
