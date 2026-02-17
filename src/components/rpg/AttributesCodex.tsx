// src/components/rpg/AttributesCodex.tsx
import { memo, useMemo, useState, useCallback } from "react";
import { ALL_ATTRIBUTES } from "@/data/attributes";
import { useUserData } from "@/hooks/useUserData";

type RankType =
  | "legendary"
  | "master"
  | "expert"
  | "adept"
  | "apprentice"
  | "beginner";

type Rank = {
  label: string;
  gradient: string;
  glow: string;
};

const RANK_STYLES: Record<RankType, Rank> = {
  legendary: {
    label: "Lendário",
    gradient: "from-orange-500 to-yellow-400",
    glow: "shadow-[0_0_20px_rgba(255,180,0,0.3)]"
  },
  master: {
    label: "Mestre",
    gradient: "from-purple-500 to-fuchsia-500",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]"
  },
  expert: {
    label: "Especialista",
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-[0_0_15px_rgba(0,212,255,0.25)]"
  },
  adept: {
    label: "Adepto",
    gradient: "from-green-500 to-emerald-400",
    glow: ""
  },
  apprentice: {
    label: "Aprendiz",
    gradient: "from-gray-400 to-gray-500",
    glow: ""
  },
  beginner: {
    label: "Iniciante",
    gradient: "from-gray-600 to-gray-700",
    glow: ""
  }
};

function getRankType(value: number): RankType {
  if (value >= 95) return "legendary";
  if (value >= 80) return "master";
  if (value >= 60) return "expert";
  if (value >= 40) return "adept";
  if (value >= 20) return "apprentice";
  return "beginner";
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

const SegmentCard = memo(
  ({
    segment,
    value,
    onEvolve
  }: {
    segment: any;
    value: number;
    onEvolve: () => void;
  }) => {
    const safe = clamp(value);
    const rankType = getRankType(safe);
    const rank = RANK_STYLES[rankType];

    return (
      <div
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
            onClick={onEvolve}
            className="
              px-2 py-0.5 text-xs text-black
              bg-neon-cyan rounded
              active:scale-95
              hover:brightness-110 transition
            "
          >
            +5
          </button>
        </div>

        <p className="text-xs text-gray-400 leading-snug">
          {segment.description}
        </p>

        <div className="mt-2 relative h-2 rounded-full overflow-hidden bg-black/40 border border-white/10">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rank.gradient} rounded-full transition-all duration-500`}
            style={{ width: `${safe}%` }}
          />
        </div>

        <div className="text-xs text-gray-400 mt-1 text-right">
          {safe}% • {rank.label}
        </div>
      </div>
    );
  }
);

SegmentCard.displayName = "SegmentCard";

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
      )
    })).filter(
      (attr) =>
        attr.segments.length > 0 ||
        attr.name.toLowerCase().includes(term) ||
        attr.description.toLowerCase().includes(term)
    );
  }, [search]);

  const evolveSegment = useCallback(
    (segmentId: string) => {
      saveData((prev: any) => {
        const current = prev?.attributes?.[segmentId] ?? 0;

        return {
          ...prev,
          attributes: {
            ...prev.attributes,
            [segmentId]: clamp(current + 5)
          }
        };
      });
    },
    [saveData]
  );

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

        const average =
          attr.segments.reduce(
            (total, segment) =>
              total + (attributes?.[segment.id] ?? 0),
            0
          ) / (attr.segments.length || 1);

        const safeValue = clamp(Math.round(average));
        const rankType = getRankType(safeValue);
        const rank = RANK_STYLES[rankType];

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
              aria-controls={`section-${attr.id}`}
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
                    {safeValue}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {rank.label}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative h-2 rounded-full overflow-hidden bg-black/40 border border-white/10">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rank.gradient} rounded-full transition-all duration-700`}
                    style={{ width: `${safeValue}%` }}
                  />
                </div>
              </div>
            </button>

            <div
              id={`section-${attr.id}`}
              className={`
                grid transition-all duration-500
                ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
              `}
            >
              <div className="overflow-hidden px-6 pb-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {attr.segments.map((segment) => (
                    <SegmentCard
                      key={segment.id}
                      segment={segment}
                      value={attributes?.[segment.id] ?? 0}
                      onEvolve={() =>
                        evolveSegment(segment.id)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
});

AttributesCodex.displayName = "AttributesCodex";
