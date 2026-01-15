import { Talent } from "@/hooks/useTalents";

interface Props {
  from: Talent;
  to: Talent;
}

export function TalentEdge({ from, to }: Props) {
  if (!from.node || !to.node) return null;

  return (
    <line
      x1={from.node.x + 104}
      y1={from.node.y + 40}
      x2={to.node.x + 104}
      y2={to.node.y + 40}
      stroke="rgba(168,85,247,0.45)"
      strokeWidth={2}
    />
  );
}
