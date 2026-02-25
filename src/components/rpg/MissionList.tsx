import { useState, useCallback, useEffect, useRef } from "react";
import { Mission, useMissions } from "../../hooks/useMissions";
import "./MissionModal.css";

const difficultyMap = {
  easy: {
    label: "Fácil",
    className: "badge-easy",
  },
  medium: {
    label: "Médio",
    className: "badge-medium",
  },
  hard: {
    label: "Difícil",
    className: "badge-hard",
  },
  epic: {
    label: "Épico",
    className: "badge-epic",
  },
};

export function MissionList() {
  const { missions, completeMission } = useMissions();

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const successButtonRef = useRef<HTMLButtonElement | null>(null);

  const showConfirm = selectedMission !== null;

  /* ---------------- Modal Controls ---------------- */

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

  /* ---------------- ESC Listener ---------------- */

  useEffect(() => {
    if (!showConfirm) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showConfirm, closeModal]);

  /* ---------------- Scroll Lock ---------------- */

  useEffect(() => {
    if (!showConfirm) return;

    document.body.style.overflow = "hidden";
    successButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

  /* ---------------- Render ---------------- */

  return (
    <>
      <ul className="mission-list">
        {missions.map((mission) => {
          const difficulty = difficultyMap[mission.difficulty];

          return (
            <li
              key={mission.id}
              className={`mission-card ${
                mission.difficulty === "epic" ? "epic-glow" : ""
              }`}
            >
              <div className="mission-header">
                <h3>{mission.title}</h3>

                <span className={`difficulty-badge ${difficulty.className}`}>
                  {difficulty.label}
                </span>
              </div>

              <p className="mission-description">
                {mission.description}
              </p>

              <div className="mission-footer">
                <span className="xp">XP: {mission.xp}</span>

                <button
                  className="complete-btn"
                  onClick={() => openModal(mission)}
                >
                  Finalizar missão
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {showConfirm && selectedMission && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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