type Props = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export default function TalentEdge({ from, to }: Props) {
  return (
    <line
      x1={from.x + 96}
      y1={from.y + 48}
      x2={to.x + 96}
      y2={to.y + 48}
      stroke="rgba(168,85,247,0.6)"
      strokeWidth={2}
    />
  );
}
