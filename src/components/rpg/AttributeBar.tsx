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
  highestValue?: number;
  maxDisplay?: number; // padrão 100
  maxRankValue?: number; // teto de rank (ex: 150)
}

type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "SS";

/* ===============================
   Rank System Escalável
================================= */

const RANK_THRESHOLDS: { rank: Rank; min: number }[] = [
  { rank: "SS", min: 140 },
  { rank: "S", min: 120 },
  { rank: "A", min: 100 },
  { rank: "B", min: 75 },
  { rank: "C", min: 50 },
  { rank: "D", min: 25 },
  { rank: "E", min: 0 }
];

const getRank = (value: number): Rank => {
  return (
    RANK_THRESHOLDS.find(r => value >= r.min)?.rank ?? "E"
  );
};

const RANK_STYLES: Record<Rank, string> = {
  SS: "bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/40",
  S: "bg-orange-500 text-white",
  A: "bg-green-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-purple-500 text-white",
  D: "bg-gray-500 text-white",
  E: "bg-gray-700 text-gray-300"
};

/* ===============================
   Component
================================= */

export const AttributeBar = memo(
  ({
    attribute,
    highestValue,
    maxDisplay = 100,
    maxRankValue = 150
  }: AttributeBarProps) => {
    const Icon = attribute.icon;

    const attributeId = useMemo(
      () =>
        `attribute-${attribute.name
          .replace(/\s+/g, "-")
          .toLowerCase()}`,
      [attribute.name]
    );

    const rawValue = attribute.value;

    const cappedValue = Math.min(
      Math.max(rawValue, 0),
      maxDisplay
    );

    const overflowValue =
      rawValue > maxDisplay ? rawValue - maxDisplay : 0;

    const overflowPercent =
      (overflowValue / (maxRankValue - maxDisplay)) * 100;

    const rank = getRank(rawValue);

    const isDominant =
      highestValue !== undefined &&
      rawValue === highestValue;

    const [animatedValue, setAnimatedValue] = useState(0);

    /* 🔥 animação suave quando valor muda */
    useEffect(() => {
      setAnimatedValue(0);
      const timeout = setTimeout(() => {
        setAnimatedValue(cappedValue);
      }, 100);

      return () => clearTimeout(timeout);
    }, [cappedValue]);

    return (
      <div
        className={clsx(
          "group transition-all duration-300 p-3 rounded-xl",
          isDominant &&
            "bg-yellow-400/5 border border-yellow-400/30"
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

              <span className="text-gray-500 text-xs ml-2 hidden group-hover:inline transition-opacity">
                {attribute.description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-bold font-mono text-lg">
              {rawValue}%
            </span>

            <span
              className={clsx(
                "px-2 py-0.5 rounded text-xs font-bold",
                RANK_STYLES[rank]
              )}
            >
              {rank}
            </span>
          </div>
        </div>

        {/* Barra principal */}
        <div
          className="relative h-2.5 bg-cyber-darker rounded-full overflow-hidden border border-white/5"
          role="progressbar"
          aria-labelledby={attributeId}
          aria-valuenow={rawValue}
          aria-valuemin={0}
          aria-valuemax={maxRankValue}
        >
          <div
            className={clsx(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
              "bg-gradient-to-r",
              attribute.color,
              isDominant &&
                "ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.6)]"
            )}
            style={{ width: `${animatedValue}%` }}
          />

          {/* Shimmer */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer pointer-events-none"
            style={{ width: `${animatedValue}%` }}
          />
        </div>

        {/* 🔥 OVERDRIVE SYSTEM */}
        {overflowValue > 0 && (
          <div className="mt-2 relative">
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse transition-all duration-500"
                style={{
                  width: `${Math.min(
                    overflowPercent,
                    100
                  )}%`
                }}
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