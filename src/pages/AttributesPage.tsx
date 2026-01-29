import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { AttributesCodex } from "@/components/rpg/AttributesCodex";

const AttributesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <h1 className="text-2xl font-bold text-white">
            📚 Codex de Atributos
          </h1>
        </div>

        <AttributesCodex />
      </div>
    </div>
  );
};

export default AttributesPage;
