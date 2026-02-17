import { useState, useCallback, useEffect, useRef } from "react";
import { Mission, useMissions } from "../../hooks/useMissions";
import "./MissionModal.css";

export function MissionList() {
  const { missions, completeMission } = useMissions();

  const [selectedMission, setSelectedMission] =
    useState<Mission | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeModal = useCallback(() => {
    setShowConfirm(false);
    setSelectedMission(null);
  }, []);

  const openModal = useCallback((mission: Mission) => {
    setSelectedMission(mission);
    setShowConfirm(true);
  }, []);

  const handleComplete = useCallback(
    (success: boolean) => {
      if (!selectedMission) return;
      completeMission(selectedMission, success);
      closeModal();
    },
    [selectedMission, completeMission, closeModal]
  );

  // ESC + bloquear scroll
  useEffect(() => {
    if (!showConfirm) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showConfirm, closeModal]);

  // Foco automático ao abrir
  useEffect(() => {
    if (showConfirm && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showConfirm]);

  // Clique fora fecha
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  return (
    <>
      <ul>
        {missions.map((mission) => (
          <li key={mission.id}>
            <h3>{mission.title}</h3>
            <p>{mission.description}</p>
            <p>XP: {mission.xp}</p>

            <button onClick={() => openModal(mission)}>
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
          aria-labelledby="mission-dialog-title"
          onClick={handleOverlayClick}
        >
          <div
            className="modal"
            ref={modalRef}
            tabIndex={-1}
          >
            <h2 id="mission-dialog-title">
              Concluir Missão
            </h2>

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
