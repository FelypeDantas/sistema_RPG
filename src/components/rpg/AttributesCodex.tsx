// src/components/rpg/AttributesCodex.tsx
import { ALL_ATTRIBUTES } from "@/data/attributes";

export const AttributesCodex = () => {
  return (
    <div className="space-y-6">
      {ALL_ATTRIBUTES.map(attr => (
        <div
          key={attr.id}
          className="bg-cyber-card p-5 rounded-xl"
        >
          <h3 className="text-white flex items-center gap-2 mb-2">
            <attr.icon className="w-5 h-5 text-neon-cyan" />
            {attr.name}
          </h3>

          <p className="text-sm text-gray-400 mb-4">
            {attr.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attr.segments.map(segment => (
              <div
                key={segment.id}
                className="bg-black/40 p-3 rounded-lg border border-white/10"
              >
                <p className="text-white text-sm font-medium">
                  {segment.name}
                </p>
                <p className="text-xs text-gray-400">
                  {segment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
