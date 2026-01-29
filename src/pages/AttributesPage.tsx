import { AttributesCodex } from "@/components/rpg/AttributesCodex";

const AttributesPage = () => {
    return (
        <div className="min-h-screen bg-cyber-dark p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">
                    📚 Codex de Atributos
                </h1>
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
                >
                    <ArrowLeft />
                    Voltar
                </button>

                <AttributesCodex />
            </div>
        </div>
    );
};

export default AttributesPage;
