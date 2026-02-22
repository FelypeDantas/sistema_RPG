import { motion } from "framer-motion";
import { useMemo } from "react";

interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface TalentEdgeProps {
  from?: Position;
  to?: Position;
  active?: boolean;
  curvature?: number;
}

export default function TalentEdge({
  from,
  to,
  active = true,
  curvature = 0.4
}: TalentEdgeProps) {

  if (!from || !to) return null;

  const fromWidth = from.width ?? 192;
  const fromHeight = from.height ?? 96;
  const toWidth = to.width ?? 192;
  const toHeight = to.height ?? 96;

  const x1 = from.x + fromWidth / 2;
  const y1 = from.y + fromHeight / 2;
  const x2 = to.x + toWidth / 2;
  const y2 = to.y + toHeight / 2;

  const pathD = useMemo(() => {
    const dx = x2 - x1;

    const offsetX = dx * curvature;

    const c1x = x1 + offsetX;
    const c1y = y1;

    const c2x = x2 - offsetX;
    const c2y = y2;

    return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  }, [x1, y1, x2, y2, curvature]);

  return (
    <>
      <motion.path
        d={pathD}
        stroke={active ? "#22d3ee" : "#555"}
        strokeWidth={active ? 3 : 2}
        strokeDasharray={active ? "0" : "6 8"}
        strokeLinecap="round"
        fill="transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.9 : 0.4 }}
        transition={{ duration: 0.4 }}
      />

      {active && (
        <motion.path
          d={pathD}
          stroke="#ffffff"
          strokeWidth={1.8}
          strokeDasharray="10 16"
          strokeLinecap="round"
          fill="transparent"
          animate={{ strokeDashoffset: [0, -50] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear"
          }}
          style={{ opacity: 0.4 }}
        />
      )}
    </>
  );
}