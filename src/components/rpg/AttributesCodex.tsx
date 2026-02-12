// src/components/rpg/AttributesCodex.tsx
import { memo } from "react";
import { ALL_ATTRIBUTES } from "@/data/attributes";

export const AttributesCodex = memo(() => {
  return (
    <div className="space-y-6">
      {ALL_ATTRIBUTES.map((attr) => {
        const Icon = attr.icon;

        return (
          <section
            key={attr.id}
            className="bg-cyber-card p-5 rounded-xl border border-white/5 transition-all duration-300 hover:border-white/10"
            aria-labelledby={`attribute-${attr.id}`}
          >
            {/* Título */}
            <h3
              id={`attribute-${attr.id}`}
              className="text-white flex items-center gap-2 mb-2"
            >
              <Icon className="w-5 h-5 text-neon-cyan" />
              {attr.name}
            </h3>

            {/* Descrição */}
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {attr.description}
            </p>

            {/* Segmentos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attr.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="bg-black/40 p-3 rounded-lg border border-white/10 transition-all duration-200 hover:border-neon-cyan/40 hover:bg-black/60"
                >
                  <p className="text-white text-sm font-medium">
                    {segment.name}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 leading-snug">
                    {segment.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
});

AttributesCodex.displayName = "AttributesCodex";
