import { GitBranch } from "lucide-react";

export default function TalentsTree() {
  return (
    <div className="min-h-screen p-6 bg-cyber-dark text-white">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GitBranch className="text-purple-400" />
          Árvore de Habilidades
        </h1>

        <p className="text-sm text-gray-400">
          Evolua seu personagem desbloqueando novos poderes
        </p>
      </header>

      {/* Placeholder */}
      <div
        className="
          border border-dashed border-white/20
          rounded-xl
          p-10
          text-center
          bg-cyber-card
        "
      >
        <p className="text-gray-300 mb-2">
          🌱 Sistema de habilidades em desenvolvimento
        </p>

        <p className="text-xs text-gray-500">
          Aqui futuramente entrará a visualização da árvore,
          nós desbloqueáveis, custos de XP e especializações.
        </p>
      </div>
    </div>
  );
}
