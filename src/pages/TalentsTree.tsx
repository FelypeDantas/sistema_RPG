import { ArrowLeft, GitBranch, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TalentsTree() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="text-purple-400" />
            Árvore de Habilidades
          </h1>
          <p className="text-sm text-gray-400">
            Evolução estratégica do personagem
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
        >
          <ArrowLeft />
          Voltar
        </button>
      </header>

      {/* Placeholder da árvore */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Foco", "Disciplina", "Carisma"].map(skill => (
          <div
            key={skill}
            className="
              bg-cyber-card border border-white/10
              rounded-xl p-6 text-center
            "
          >
            <Lock className="mx-auto mb-3 text-gray-500" />
            <h3 className="font-semibold">{skill}</h3>
            <p className="text-xs text-gray-400 mt-2">
              Habilidade bloqueada
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
