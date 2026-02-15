// src/components/rpg/AttributesCodex.tsx
import { memo, useMemo, useState } from "react";
import { ALL_ATTRIBUTES } from "@/data/attributes";
import { useUserData } from "@/hooks/useUserData";

type Rank = {
  label: string;
  color: string;
  glow: string;
};

function getRank(value: number): Rank {
  if (value >= 95)
    return {
      label: "Lendário",
      color: "from-orange-500 to-yellow-400",
      glow: "shadow-[0_0_20px_rgba(255,180,0,0.3)]"
    };
  if (value >= 80)
    return {
      label: "Mestre",
      color: "from-purple-500 to-fuchsia-500",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]"
    };
  if (value >= 60)
    return {
      label: "Especialista",
      color: "from-blue-500 to-cyan-400",
      glow: "shadow-[0_0_15px_rgba(0,212,255,0.25)]"
    };
  if (value >= 40)
    return {
      label: "Adep​to",
      color: "from-green-500 to-emerald-400",
      glow: ""
    };
  if (value >= 20)
    return {
      label: "Aprendiz",
      color: "from-gray-400 to-gray-500",
      glow: ""
    };

  return {
    label: "Iniciante",
    color: "from-gray-600 to-gray-700",
    glow: ""
  };
}

export const AttributesCodex = memo(() => {
  const { data, saveData } = useUserData();
  const attributes = data?.attributes ?? {};

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredAttributes = useMemo(() => {
    const term = search.toLowerCase();

    return ALL_ATTRIBUTES.map((attr) => ({
      ...attr,
      segments: attr.segments.filter(
        (segment) =>
          attr.name.toLowerCase().includes(term) ||
          attr.description.toLowerCase().includes(term) ||
          segment.name.toLowerCase().includes(term) ||
          segment.description.toLowerCase().includes(term)
      ),
    })).filter(
      (attr) =>
        attr.segments.length > 0 ||
        attr.name.toLowerCase().includes(term) ||
        attr.description.toLowerCase().includes(term)
    );
  }, [search]);

  // Função para evoluir um segmento
  const evolveSegment = (attrId: string, segmentId: string) => {
    const current = attributes?.[segmentId] ?? 0;
    const updatedAttributes = {
      ...attributes,
      [segmentId]: Math.min(current + 5, 100) // evolui +5 por clique, max 100
    };
    saveData({ ...data, attributes: updatedAttributes });
  };

  return (
    <div className="space-y-8">
      <input
        type="text"
        placeholder="Buscar no Codex..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full p-3 rounded-lg
          bg-cyber-card border border-white/10
          text-white placeholder-gray-500
          focus:outline-none focus:border-neon-cyan/60
        "
      />

      {filteredAttributes.map((attr) => {
        const Icon = attr.icon;
        const isOpen = expanded === attr.id;

        const playerValue =
          attributes?.[attr.id as keyof typeof attributes] ?? 0;

        const safeValue = Math.min(Math.max(playerValue, 0), 100);
        const rank = getRank(safeValue);

        return (
          <section
            key={attr.id}
            className={`
              bg-cyber-card rounded-xl border border-white/5
              transition-all duration-300
              hover:border-white/10
              ${rank.glow}
            `}
          >
            <button
              onClick={() =>
                setExpanded(isOpen ? null : attr.id)
              }
              className="w-full text-left p-6"
              aria-expanded={isOpen}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-neon-cyan" />
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {attr.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {attr.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-mono font-bold">
                    {safeValue}
                  </div>
                  <div className="text-xs text-gray-400">
                    {rank.label}
                  </div>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="mt-4">
                <div className="relative h-2 rounded-full overflow-hidden bg-black/40 border border-white/10">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rank.color} rounded-full transition-all duration-700`}
                    style={{ width: `${safeValue}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Segments */}
            <div
              className={`
                overflow-hidden transition-all duration-500
                ${isOpen ? "max-h-[500px] p-6 pt-0 opacity-100" : "max-h-0 opacity-0"}
              `}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {attr.segments.map((segment) => {
                  const segValue = attributes?.[segment.id] ?? 0;
                  const segSafe = Math.min(Math.max(segValue, 0), 100);
                  const segRank = getRank(segSafe);

                  return (
                    <div
                      key={segment.id}
                      className="
                        bg-black/40 p-3 rounded-lg
                        border border-white/10
                        transition-all duration-200
                        hover:border-neon-cyan/40
                        hover:bg-black/60
                      "
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-white text-sm font-medium">
                          {segment.name}
                        </p>
                        <button
                          onClick={() => evolveSegment(attr.id, segment.id)}
                          className="px-2 py-0.5 text-xs text-black bg-neon-cyan rounded hover:brightness-110 transition"
                        >
                          Evoluir
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 leading-snug">
                        {segment.description}
                      </p>

                      {/* Barra de progresso do segmento */}
                      <div className="mt-2 relative h-2 rounded-full overflow-hidden bg-black/40 border border-white/10">
                        <div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${segRank.color} rounded-full transition-all duration-500`}
                          style={{ width: `${segSafe}%` }}
                        />
                      </div>

                      <div className="text-xs text-gray-400 mt-1 text-right">
                        {segSafe} - {segRank.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
});

AttributesCodex.displayName = "AttributesCodex";
