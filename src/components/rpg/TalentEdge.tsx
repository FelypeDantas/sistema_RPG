interface TalentEdgeProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active?: boolean;
}

export function TalentEdge({
  from,
  to,
  active = false
}: TalentEdgeProps) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={active ? "#22c55e" : "rgba(255,255,255,0.2)"}
      strokeWidth={2}
    />
  );
}

