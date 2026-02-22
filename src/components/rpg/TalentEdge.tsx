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
  const glowId = `edge-glow-${id}`;

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
    const deltaY = Math.abs(y2 - y1);

    const controlOffsetX = deltaX * 0.5;
    const controlOffsetY = deltaY * 0.15;

    const c1x = x1 + controlOffsetX;
    const c1y = y1 + controlOffsetY;

    const c2x = x2 - controlOffsetX;
    const c2y = y2 - controlOffsetY;

    return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  }, [x1, y1, x2, y2]);

  return (
    <>
      <defs>
        {/* Gradiente principal */}
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

        {/* Glow blur */}
        <filter id={glowId}>
          <feGaussianBlur stdDeviation={active ? 4 : 2} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Aura externa */}
      {active && (
        <motion.path
          d={pathD}
          stroke={`url(#${gradientId})`}
          strokeWidth={8}
          strokeLinecap="round"
          fill="transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Linha base */}
      <motion.path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth={active ? 3.5 : 2}
        strokeDasharray={active ? "0" : "6 8"}
        strokeLinecap="round"
        fill="transparent"
        initial={{ opacity: 0 }}
        animate={{
          opacity: active ? 0.95 : 0.4,
          filter: active ? `url(#${glowId})` : "none"
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Fluxo energético animado */}
      {active && (
        <motion.path
          d={pathD}
          stroke="#ffffff"
          strokeWidth={2}
          strokeDasharray="12 18"
          strokeLinecap="round"
          fill="transparent"
          animate={{ strokeDashoffset: [0, -60] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear"
          }}
          style={{ opacity: 0.35 }}
        />
      )}

      {/* Pulso suave */}
      {active && (
        <motion.path
          d={pathD}
          stroke="#22d3ee"
          strokeWidth={4}
          strokeLinecap="round"
          fill="transparent"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        />
      )}
    </>
  );
}