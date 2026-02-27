import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Mission, useMissions } from "../../hooks/useMissions";
import "./MissionModal.css";

type Difficulty = "all" | "easy" | "medium" | "hard" | "epic";

const difficultyMap: Record<
  Exclude<Difficulty, "all">,
  { label: string; className: string }
> = {
  easy: { label: "Fácil", className: "badge-easy" },
  medium: { label: "Médio", className: "badge-medium" },
  hard: { label: "Difícil", className: "badge-hard" },
  epic: { label: "Épico", className: "badge-epic" },
};

export function MissionList() {
  const { missions, completeMission } = useMissions();

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [filter, setFilter] = useState<Difficulty>("all");
  const [sortDesc, setSortDesc] = useState(true);

  const successButtonRef = useRef<HTMLButtonElement | null>(null);

  const showConfirm = Boolean(selectedMission);

  /* ---------------- FILTER + SORT ---------------- */

  const processedMissions = useMemo(() => {
    return missions
      .filter((m) => (filter === "all" ? true : m.difficulty === filter))
      .sort((a, b) => (sortDesc ? b.xp - a.xp : a.xp - b.xp));
  }, [missions, filter, sortDesc]);

  /* ---------------- MODAL ACTIONS ---------------- */

  const openModal = useCallback((mission: Mission) => {
    setSelectedMission(mission);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMission(null);
  }, []);

  const handleComplete = useCallback(
    (success: boolean) => {
      if (!selectedMission) return;

      completeMission(selectedMission.id, success);
      closeModal();
    },
    [selectedMission, completeMission, closeModal]
  );

  /* ---------------- ESC + SCROLL LOCK ---------------- */

  useEffect(() => {
    if (!showConfirm) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    successButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [showConfirm, closeModal]);

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <div className="mission-controls">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Difficulty)}
        >
          <option value="all">Todas</option>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
          <option value="epic">Épico</option>
        </select>

        <button onClick={() => setSortDesc((prev) => !prev)}>
          Ordenar XP {sortDesc ? "↓" : "↑"}
        </button>
      </div>

      <ul className="mission-list">
        {processedMissions.map((mission) => {
          const difficulty = difficultyMap[mission.difficulty];
          const progress = Math.min(mission.xp, 100);

          return (
            <li
              key={mission.id}
              className={`mission-card ${
                mission.difficulty === "epic"
                  ? "epic-glow epic-animate"
                  : ""
              }`}
            >
              <div className="mission-header">
                <h3>{mission.title}</h3>
                <span className={`difficulty-badge ${difficulty.className}`}>
                  {difficulty.label}
                </span>
              </div>

              <p className="mission-description">{mission.description}</p>

              <div className="xp-bar">
                <div
                  className="xp-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

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
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title">Concluir Missão</h2>

            <p>
              Deseja concluir <strong>"{selectedMission.title}"</strong>?
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