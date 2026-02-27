import {
  LucideIcon,
  Crown,
  Flame,
  Sparkles,
  Infinity
} from "lucide-react";
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import clsx from "clsx";

interface Attribute {
  name: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  prestigeLevel?: number;
}

interface Props {
  attribute: Attribute;
  highestValue?: number;
  maxDisplay?: number;
  maxRankValue?: number;
}

type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "SS";

/* =========================
   Rank System
========================= */

const RANKS: { rank: Rank; min: number }[] = [
  { rank: "SS", min: 140 },
  { rank: "S", min: 120 },
  { rank: "A", min: 100 },
  { rank: "B", min: 75 },
  { rank: "C", min: 50 },
  { rank: "D", min: 25 },
  { rank: "E", min: 0 }
];

const getRank = (value: number): Rank =>
  RANKS.find(r => value >= r.min)?.rank ?? "E";

/* =========================
   Component
========================= */

export const AttributeBar = memo(
  ({
    attribute,
    highestValue,
    maxDisplay = 100,
    maxRankValue = 150
  }: Props) => {
    const Icon = attribute.icon;
    const prestige = attribute.prestigeLevel ?? 0;

    const attributeId = useMemo(
      () =>
        `attribute-${attribute.name
          .replace(/\s+/g, "-")
          .toLowerCase()}`,
      [attribute.name]
    );

    const rawValue = attribute.value;
    const prevValue = useRef(rawValue);

    const capped = Math.min(rawValue, maxDisplay);
    const overflow =
      rawValue > maxDisplay ? rawValue - maxDisplay : 0;

    const overflowPercent =
      (overflow / (maxRankValue - maxDisplay)) * 100;

    const rank = getRank(rawValue);

    const isDominant =
      highestValue !== undefined &&
      rawValue === highestValue;

    const [animated, setAnimated] = useState(0);
    const [glitch, setGlitch] = useState(false);

    /* =========================
       Física elástica
    ========================= */

    useEffect(() => {
      let frame: number;
      let velocity = 0;
      let current = animated;

      const stiffness = 0.15;
      const damping = 0.8;

      const animate = () => {
        const force = (capped - current) * stiffness;
        velocity = velocity * damping + force;
        current += velocity;

        if (Math.abs(velocity) > 0.1) {
          setAnimated(current);
          frame = requestAnimationFrame(animate);
        } else {
          setAnimated(capped);
        }
      };

      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, [capped]);

    /* =========================
       Glitch se cair
    ========================= */

    useEffect(() => {
      if (rawValue < prevValue.current) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 500);
      }
      prevValue.current = rawValue;
    }, [rawValue]);

    /* =========================
       Canvas Particles SS
    ========================= */

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (rank !== "SS") return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const particles = Array.from({ length: 25 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 1
      }));

      let frame: number;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        frame = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(frame);
    }, [rank]);

    return (
      <div
        className={clsx(
          "relative p-3 rounded-xl overflow-hidden transition-all duration-300",
          isDominant &&
            "border border-yellow-400/40 shadow-[0_0_25px_rgba(255,215,0,0.25)]",
          glitch && "animate-pulse"
        )}
      >
        {/* Prestige Mutation */}
        {prestige >= 3 && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-indigo-500/10 to-purple-500/10 animate-pulse pointer-events-none" />
        )}

        {/* SS Particles */}
        {rank === "SS" && (
          <canvas
            ref={canvasRef}
            width={400}
            height={80}
            className="absolute inset-0 pointer-events-none opacity-40"
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className={clsx("p-1.5 rounded-lg", attribute.bgColor)}>
              <Icon className="w-4 h-4 text-white" />
            </div>

            <span id={attributeId} className="text-white text-sm">
              {attribute.name}
            </span>

            {prestige > 0 && (
              <span className="text-xs text-indigo-400 flex items-center">
                <Infinity className="w-3 h-3 mr-1" />
                {prestige}
              </span>
            )}
          </div>

          <span className="text-white font-mono font-bold">
            {rawValue}%
          </span>
        </div>

        {/* Barra */}
        <div className="relative h-3 bg-cyber-darker rounded-full overflow-visible">
          <div
            className={clsx(
              "absolute inset-y-0 left-0 rounded-full",
              "bg-gradient-to-r",
              attribute.color
            )}
            style={{ width: `${animated}%` }}
          />

          {overflow > 0 && (
            <div
              className="absolute top-0 h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-r-full animate-pulse"
              style={{
                left: "100%",
                width: `${Math.min(overflowPercent, 100)}%`
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

AttributeBar.displayName = "AttributeBar";