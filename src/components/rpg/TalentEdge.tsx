import { Talent } from "@/hooks/useTalents";

interface TalentEdgeProps {
  from: Talent;
  to: Talent;
}

export function TalentEdge({ from, to }: TalentEdgeProps) {
  if (!from.node || !to.node) return null;

  const x1 = from.node.x + 104; // centro do nó
  const y1 = from.node.y + 80;
  const x2 = to.node.x + 104;
  const y2 = to.node.y;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(168,85,247,0.5)"
      strokeWidth={2}
    />
  );
}
