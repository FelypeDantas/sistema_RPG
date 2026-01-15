import { Lock, ChevronDown } from "lucide-react";

type Props = {
  title: string;
  x: number;
  y: number;
  progress: number;
  locked?: boolean;
  hasChildren?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function TalentNode({
  title,
  x,
  y,
  progress,
  locked,
  hasChildren,
  collapsed,
  onToggle
}: Props) {
  return (
    <div
      className="absolute transition-transform duration-300"
      style={{ left: x, top: y }}
    >
      <div
        className={`
          w-48 rounded-xl border
          bg-cyber-card p-4 text-center
          ${locked ? "opacity-50" : "border-purple-500"}
        `}
      >
        {locked && <Lock className="mx-auto mb-2 text-gray-400" />}

        <h3 className="font-semibold text-sm">{title}</h3>

        <div className="mt-2 text-xs text-gray-400">
          Treinado {progress}%
        </div>

        <div className="mt-2 h-1 w-full bg-gray-700 rounded">
          <div
            className="h-full bg-purple-500 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {hasChildren && (
          <button
            onClick={onToggle}
            className="mt-2 text-xs text-purple-400 flex items-center justify-center gap-1"
          >
            <ChevronDown
              className={`transition-transform ${
                collapsed ? "-rotate-90" : ""
              }`}
              size={14}
            />
            Sub-habilidades
          </button>
        )}
      </div>
    </div>
  );
}
