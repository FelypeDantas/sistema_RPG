import { LucideIcon } from "lucide-react";
import { memo } from "react";
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

  const safeValue = Math.min(Math.max(attribute.value, 0), 100);

  const barClasses = clsx(
    "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
    "bg-gradient-to-r",
    attribute.color
  );

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={clsx("p-1.5 rounded-lg", attribute.bgColor)}>
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div>
            <span
              id={`attribute-${attribute.name}`}
              className="text-white font-medium text-sm"
            >
              {attribute.name}
            </span>

            <span className="text-gray-500 text-xs ml-2 hidden group-hover:inline transition-opacity duration-200">
              {attribute.description}
            </span>
          </div>
        </div>

        <span className="text-white font-bold font-mono text-lg">
          {safeValue}%
        </span>
      </div>

      <div
        className="relative h-2.5 bg-cyber-darker rounded-full overflow-hidden border border-white/5"
        role="progressbar"
        aria-labelledby={`attribute-${attribute.name}`}
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={barClasses}
          style={{ width: `${safeValue}%` }}
        />

        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer pointer-events-none"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
});

AttributeBar.displayName = "AttributeBar";
