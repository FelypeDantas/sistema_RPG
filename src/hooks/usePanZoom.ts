import { useRef, useState, useEffect } from "react";

export function usePanZoom() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // ---------- Mouse Events ----------
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // evita seleção de texto
    isPanning.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setPosition(pos => ({ x: pos.x + dx, y: pos.y + dy }));
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  // ---------- Touch Events ----------
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isPanning.current = true;
      last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isPanning.current || e.touches.length !== 1) return;

    const dx = e.touches[0].clientX - last.current.x;
    const dy = e.touches[0].clientY - last.current.y;

    setPosition(pos => ({ x: pos.x + dx, y: pos.y + dy }));
    last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = () => {
    isPanning.current = false;
  };

  // ---------- Wheel Zoom ----------
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.0015; // zoom mais suave
      setScale(s => Math.min(3, Math.max(0.5, s - e.deltaY * zoomSpeed)));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return {
    containerRef,
    transform: {
      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
    },
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    scale,
    position
  };
}
