import { useState, useCallback, useEffect, useRef } from "react";
import { Mission, useMissions } from "../../hooks/useMissions";
import "./MissionModal.css";

export function MissionList() {
  const { missions, completeMission } = useMissions();

  const [selectedMission, setSelectedMission] =
    useState<Mission | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  const successButtonRef = useRef<HTMLButtonElement | null>(null);

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

  // Fecha com ESC
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

  // Impede scroll do fundo
  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = "hidden";
      successButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

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
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title">Concluir Missão</h2>

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
                ref={successButtonRef}
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
