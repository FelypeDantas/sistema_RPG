import { useRef, useState } from "react";

export function usePanZoom() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setPosition(pos => ({
      x: pos.x + dx,
      y: pos.y + dy
    }));

    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    setScale(s =>
      Math.min(2, Math.max(0.4, s - e.deltaY * 0.001))
    );
  };

  return {
    containerRef,
    transform: {
      transform: `
        translate(${position.x}px, ${position.y}px)
        scale(${scale})
      `
    },
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onWheel
    }
  };
}
