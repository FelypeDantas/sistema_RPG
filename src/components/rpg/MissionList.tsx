import { useState, useCallback, useEffect, useRef } from "react";
import { Mission, useMissions } from "../../hooks/useMissions";
import "./MissionModal.css";

export function MissionList() {
  const { missions, completeMission } = useMissions();

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const successButtonRef = useRef<HTMLButtonElement | null>(null);

  const showConfirm = selectedMission !== null;

  // ----------------------------
  // Modal Controls
  // ----------------------------

  const openModal = useCallback((mission: Mission) => {
    setSelectedMission(mission);
  }, []);

  const closeModal = useCallback(() => {
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

  // ----------------------------
  // ESC Key Listener
  // ----------------------------

  useEffect(() => {
    if (!showConfirm) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showConfirm, closeModal]);

  // ----------------------------
  // Prevent Background Scroll
  // ----------------------------

  useEffect(() => {
    if (!showConfirm) return;

    document.body.style.overflow = "hidden";
    successButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

  // ----------------------------
  // Render
  // ----------------------------

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
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title">Concluir Missão</h2>

            <p>
              Tem certeza que deseja concluir a missão
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