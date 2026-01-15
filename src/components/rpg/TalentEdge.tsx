import { Talent } from "@/hooks/useTalents";

interface TalentEdgeProps {
  from: Talent;
  to: Talent;
}

export function TalentEdge({ from, to }: TalentEdgeProps) {
  if (!from.node || !to.node) return null;

  return (
    <line
      x1={from.node.x + 96}
      y1={from.node.y + 24}
      x2={to.node.x + 96}
      y2={to.node.y}
      stroke="rgba(168,85,247,0.4)"
      strokeWidth={2}
    />
  );
}
