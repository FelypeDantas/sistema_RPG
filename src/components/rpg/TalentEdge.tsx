import { motion } from "framer-motion";
import { useId, useMemo } from "react";

interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface TalentEdgeProps {
  from: Position;
  to: Position;
  active?: boolean;
}

export default function TalentEdge({
  from,
  to,
  active = true
}: TalentEdgeProps) {

  const id = useId();
  const gradientId = `edge-gradient-${id}`;

  const fromWidth = from.width ?? 192;
  const fromHeight = from.height ?? 96;
  const toWidth = to.width ?? 192;
  const toHeight = to.height ?? 96;

  const x1 = from.x + fromWidth / 2;
  const y1 = from.y + fromHeight / 2;
  const x2 = to.x + toWidth / 2;
  const y2 = to.y + toHeight / 2;

  const pathD = useMemo(() => {
    const deltaX = Math.abs(x2 - x1);
    const controlOffset = deltaX * 0.5;

    const c1x = x1 + controlOffset;
    const c2x = x2 - controlOffset;

    return `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
  }, [x1, y1, x2, y2]);

  const glowStyle = active
    ? "drop-shadow(0 0 10px rgba(168,85,247,0.6)) drop-shadow(0 0 18px rgba(34,211,238,0.3))"
    : "drop-shadow(0 0 6px rgba(100,100,100,0.3))";

  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        >
          <stop offset="0%" stopColor={active ? "#a855f7" : "#555"} />
          <stop offset="50%" stopColor={active ? "#22d3ee" : "#777"} />
          <stop offset="100%" stopColor={active ? "#a855f7" : "#555"} />
        </linearGradient>
      </defs>

      {/* Linha base */}
      <motion.path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth={3}
        strokeLinecap="round"
        fill="transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.9 : 0.4 }}
        transition={{ duration: 0.5 }}
        style={{ filter: glowStyle }}
      />

      {/* Fluxo energético apenas se ativo */}
      {active && (
        <motion.path
          d={pathD}
          stroke="#ffffff"
          strokeWidth={2}
          strokeDasharray="10 14"
          strokeLinecap="round"
          fill="transparent"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear"
          }}
          style={{ opacity: 0.35 }}
        />
      )}
    </>
  );
}