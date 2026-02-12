import { motion } from "framer-motion";

type Props = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export default function TalentEdge({ from, to }: Props) {
  const x1 = from.x + 96;
  const y1 = from.y + 48;
  const x2 = to.x + 96;
  const y2 = to.y + 48;

  const gradientId = `edge-gradient-${x1}-${y1}-${x2}-${y2}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Linha base glow */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={`url(#${gradientId})`}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.6 }}
        style={{
          filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))"
        }}
      />

      {/* Fluxo animado */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#ffffff"
        strokeWidth={2}
        strokeDasharray="6 10"
        strokeLinecap="round"
        animate={{
          strokeDashoffset: [0, -20]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear"
        }}
        style={{
          opacity: 0.4
        }}
      />
    </>
  );
}
