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
      {/* ===============================
         🌫️ GLOW BASE (blur forte)
      =============================== */}
      {active && (
        <motion.path
          d={pathD}
          stroke="url(#edgeGradient)"
          strokeWidth={8}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: "blur(6px)",
            opacity: 0.4
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* ===============================
         🎨 MAIN LINE
      =============================== */}
      <motion.path
        d={pathD}
        stroke={active ? "url(#edgeGradient)" : "#555"}
        strokeWidth={active ? 3.5 : 2}
        strokeDasharray={active ? "0" : "6 8"}
        strokeLinecap="round"
        fill="transparent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          opacity: active ? 0.95 : 0.35
        }}
      />

      {/* ===============================
         ⚡ ENERGY FLOW
      =============================== */}
      {active && (
        <motion.path
          d={pathD}
          stroke="#ffffff"
          strokeWidth={2}
          strokeDasharray="14 18"
          strokeLinecap="round"
          fill="transparent"
          animate={{ strokeDashoffset: [0, -60] }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "linear"
          }}
          style={{
            opacity: 0.45
          }}
        />
      )}

      {/* ===============================
         ✨ ENERGY PULSE
      =============================== */}
      {active && (
        <motion.path
          d={pathD}
          stroke="url(#edgeGradient)"
          strokeWidth={4}
          strokeLinecap="round"
          fill="transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          style={{
            filter: "blur(3px)"
          }}
        />
      )}
    </>
  );
}