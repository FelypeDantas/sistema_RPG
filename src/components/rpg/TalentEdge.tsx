import { motion } from "framer-motion";
import { useId, useMemo } from "react";

type Props = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export default function TalentEdge({ from, to }: Props) {
  const id = useId();
  const gradientId = `edge-gradient-${id}`;

  const x1 = from.x + 96;
  const y1 = from.y + 48;
  const x2 = to.x + 96;
  const y2 = to.y + 48;

  // Curva Bézier suave
  const pathD = useMemo(() => {
    const controlX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;
  }, [x1, y1, x2, y2]);

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
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Linha principal com glow */}
      <motion.path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth={3}
        strokeLinecap="round"
        fill="transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.6 }}
        style={{
          filter: "drop-shadow(0 0 10px rgba(168,85,247,0.6)) drop-shadow(0 0 18px rgba(34,211,238,0.3))"
        }}
      />

      {/* Fluxo energético animado */}
      <motion.path
        d={pathD}
        stroke="#ffffff"
        strokeWidth={2}
        strokeDasharray="10 14"
        strokeLinecap="round"
        fill="transparent"
        animate={{
          strokeDashoffset: [0, -48]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.2,
          ease: "linear"
        }}
        style={{
          opacity: 0.35
        }}
      />
    </>
  );
}
