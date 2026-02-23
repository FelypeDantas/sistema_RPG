import { LucideIcon } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";

interface Attribute {
  name: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

interface AttributeBarProps {
  attribute: Attribute;
  highestValue?: number; // 🔥 valor do atributo dominante
}

type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "SS";

const getRank = (value: number): Rank => {
  if (value >= 140) return "SS";
  if (value >= 120) return "S";
  if (value >= 100) return "A";
  if (value >= 75) return "B";
  if (value >= 50) return "C";
  if (value >= 25) return "D";
  return "E";
};

export const AttributeBar = memo(
  ({ attribute, highestValue }: AttributeBarProps) => {
    const Icon = attribute.icon;

    const attributeId = useMemo(
      () => `attribute-${attribute.name.replace(/\s+/g, "-").toLowerCase()}`,
      [attribute.name]
    );

    const rawValue = attribute.value;
    const cappedValue = Math.min(Math.max(rawValue, 0), 100);
    const overflowValue = rawValue > 100 ? rawValue - 100 : 0;

    const rank = getRank(rawValue);

    const isDominant =
      highestValue !== undefined && rawValue === highestValue;

    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
      const frame = requestAnimationFrame(() => {
        setAnimatedValue(cappedValue);
      });
      return () => cancelAnimationFrame(frame);
    }, [cappedValue]);

    const barClasses = clsx(
      "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
      "bg-gradient-to-r",
      attribute.color,
      isDominant && "ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.6)]"
    );

    const rankColor = clsx(
      "px-2 py-0.5 rounded text-xs font-bold",
      rank === "SS" && "bg-red-600 text-white animate-pulse",
      rank === "S" && "bg-orange-500 text-white",
      rank === "A" && "bg-green-500 text-white",
      rank === "B" && "bg-blue-500 text-white",
      rank === "C" && "bg-purple-500 text-white",
      rank === "D" && "bg-gray-500 text-white",
      rank === "E" && "bg-gray-700 text-gray-300"
    );

    return (
      <div
        className={clsx(
          "group transition-all duration-300 p-3 rounded-xl",
          isDominant && "bg-yellow-400/5 border border-yellow-400/30"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                "p-1.5 rounded-lg transition-all duration-300",
                attribute.bgColor,
                isDominant && "scale-110"
              )}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>

            <div>
              <span
                id={attributeId}
                className="text-white font-medium text-sm"
              >
                {attribute.name}
              </span>

              <span className="text-gray-500 text-xs ml-2 hidden group-hover:inline">
                {attribute.description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-bold font-mono text-lg">
              {rawValue}%
            </span>

            {/* 🌟 Rank Badge */}
            <span className={rankColor}>{rank}</span>
          </div>
        </div>

        {/* Barra principal */}
        <div
          className="relative h-2.5 bg-cyber-darker rounded-full overflow-hidden border border-white/5"
          role="progressbar"
          aria-labelledby={attributeId}
          aria-valuenow={rawValue}
          aria-valuemin={0}
          aria-valuemax={150}
        >
          <div
            className={barClasses}
            style={{ width: `${animatedValue}%` }}
          />

          {/* shimmer */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer pointer-events-none"
            style={{ width: `${animatedValue}%` }}
          />
        </div>

        {/* 🏆 Overflow power acima de 100 */}
        {overflowValue > 0 && (
          <div className="mt-2 relative">
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse"
                style={{ width: `${Math.min(overflowValue, 50) * 2}%` }}
              />
            </div>

            <span className="text-xs text-yellow-400 font-semibold mt-1 block">
              Overdrive +{overflowValue}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

AttributeBar.displayName = "AttributeBar";