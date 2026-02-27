import { LucideIcon, Crown, Flame, Sparkles } from "lucide-react";
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
  maxDisplay?: number;
  maxRankValue?: number;
}

type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "SS";

/* ================================
   RANK SYSTEM
================================ */

const RANKS: { rank: Rank; min: number }[] = [
  { rank: "SS", min: 140 },
  { rank: "S", min: 120 },
  { rank: "A", min: 100 },
  { rank: "B", min: 75 },
  { rank: "C", min: 50 },
  { rank: "D", min: 25 },
  { rank: "E", min: 0 }
];

const getRank = (value: number): Rank =>
  RANKS.find(r => value >= r.min)?.rank ?? "E";

const RANK_STYLES: Record<Rank, string> = {
  SS: "bg-red-600 text-white shadow-lg shadow-red-500/50 animate-pulse",
  S: "bg-orange-500 text-white",
  A: "bg-green-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-purple-500 text-white",
  D: "bg-gray-500 text-white",
  E: "bg-gray-700 text-gray-300"
};

const RankIcon = ({ rank }: { rank: Rank }) => {
  if (rank === "SS") return <Sparkles className="w-3 h-3 mr-1" />;
  if (rank === "S") return <Flame className="w-3 h-3 mr-1" />;
  if (rank === "A") return <Crown className="w-3 h-3 mr-1" />;
  return null;
};

/* ================================
   COMPONENT
================================ */

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
        `attribute-${attribute.name.replace(/\s+/g, "-").toLowerCase()}`,
      [attribute.name]
    );

    const rawValue = attribute.value;

    const cappedValue = Math.min(Math.max(rawValue, 0), maxDisplay);
    const overflowValue = rawValue > maxDisplay ? rawValue - maxDisplay : 0;

    const overflowPercent =
      (overflowValue / (maxRankValue - maxDisplay)) * 100;

    const rank = getRank(rawValue);

    const isDominant =
      highestValue !== undefined && rawValue === highestValue;

    const [animatedValue, setAnimatedValue] = useState(0);
    const [overdriveFlash, setOverdriveFlash] = useState(false);

    useEffect(() => {
      setAnimatedValue(0);
      const t = setTimeout(() => {
        setAnimatedValue(cappedValue);
      }, 100);

      if (overflowValue > 0) {
        setOverdriveFlash(true);
        setTimeout(() => setOverdriveFlash(false), 600);
      }

      return () => clearTimeout(t);
    }, [cappedValue, overflowValue]);

    return (
      <div
        className={clsx(
          "relative group transition-all duration-300 p-3 rounded-xl overflow-hidden",
          isDominant &&
            "bg-yellow-400/5 border border-yellow-400/40 shadow-[0_0_25px_rgba(255,215,0,0.25)]"
        )}
      >
        {/* Aura dominante */}
        {isDominant && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2 relative z-10">
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

            <span
              className={clsx(
                "flex items-center px-2 py-0.5 rounded text-xs font-bold",
                RANK_STYLES[rank]
              )}
            >
              <RankIcon rank={rank} />
              {rank}
            </span>
          </div>
        </div>

        {/* Barra */}
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
              overdriveFlash && "animate-pulse"
            )}
            style={{ width: `${animatedValue}%` }}
          />

          {/* Shimmer */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer pointer-events-none"
            style={{ width: `${animatedValue}%` }}
          />
        </div>

        {/* OVERDRIVE */}
        {overflowValue > 0 && (
          <div className="mt-2 relative">
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse transition-all duration-500"
                style={{ width: `${Math.min(overflowPercent, 100)}%` }}
              />
            </div>

            <span className="text-xs text-yellow-400 font-semibold mt-1 block">
              🔥 Overdrive +{overflowValue}%
            </span>
          </div>
        )}

        {/* Partículas SS */}
        {rank === "SS" && (
          <div className="absolute inset-0 pointer-events-none animate-pulse opacity-40">
            <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full" />
            <div className="absolute bottom-3 left-6 w-1 h-1 bg-white rounded-full" />
            <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full" />
          </div>
        )}
      </div>
    );
  }
);

AttributeBar.displayName = "AttributeBar";