import { AttributesCodex } from "@/components/rpg/AttributesCodex";

const AttributesPage = () => {
  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          📚 Codex de Atributos
        </h1>

        <AttributesCodex />
      </div>
    </div>
  );
};

export default AttributesPage;
