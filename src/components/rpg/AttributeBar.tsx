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
}

export const AttributeBar = memo(({ attribute }: AttributeBarProps) => {
  const Icon = attribute.icon;

  // 🔐 Normaliza ID (evita espaço quebrando aria)
  const attributeId = useMemo(
    () => `attribute-${attribute.name.replace(/\s+/g, "-").toLowerCase()}`,
    [attribute.name]
  );

  // 🧠 Permite expansão futura além de 100
  const safeValue = useMemo(
    () => Math.min(Math.max(attribute.value, 0), 100),
    [attribute.value]
  );

  // ✨ animação real de crescimento
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimatedValue(safeValue);
    });
    return () => cancelAnimationFrame(frame);
  }, [safeValue]);

  // 💎 glow dinâmico baseado no nível
  const intensityGlow =
    safeValue >= 80
      ? "shadow-[0_0_12px_rgba(255,255,255,0.3)]"
      : safeValue >= 50
      ? "shadow-[0_0_8px_rgba(255,255,255,0.15)]"
      : "";

  const barClasses = clsx(
    "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
    "bg-gradient-to-r",
    attribute.color,
    intensityGlow
  );

  return (
    <div className="group">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "p-1.5 rounded-lg transition-all duration-300",
              attribute.bgColor,
              "group-hover:scale-110"
            )}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="relative">
            <span
              id={attributeId}
              className="text-white font-medium text-sm"
            >
              {attribute.name}
            </span>

            {/* Tooltip elegante */}
            <div className="absolute left-0 top-full mt-1 w-56 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
              <div className="bg-cyber-darker text-gray-400 text-xs p-2 rounded-lg border border-white/5 shadow-lg">
                {attribute.description}
              </div>
            </div>
          </div>
        </div>

        <span className="text-white font-bold font-mono text-lg tabular-nums">
          {animatedValue}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="relative h-2.5 bg-cyber-darker rounded-full overflow-hidden border border-white/5"
        role="progressbar"
        aria-labelledby={attributeId}
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={barClasses}
          style={{ width: `${animatedValue}%` }}
        />

        {/* Shimmer mais refinado */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer pointer-events-none"
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  );
});

AttributeBar.displayName = "AttributeBar";