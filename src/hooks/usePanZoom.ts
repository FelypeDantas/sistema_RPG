import { useRef, useState, useEffect } from "react";

export function usePanZoom() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  /* ============================= */
  /* ---------- MOUSE ---------- */
  /* ============================= */

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isPanning.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      setPosition(pos => ({ x: pos.x + dx, y: pos.y + dy }));
      last.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /* ============================= */
  /* ---------- TOUCH ---------- */
  /* ============================= */

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isPanning.current = true;
      last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isPanning.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - last.current.x;
      const dy = e.touches[0].clientY - last.current.y;
      setPosition(pos => ({ x: pos.x + dx, y: pos.y + dy }));
      last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isPanning.current = false;
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const onTouchMove = (e: React.TouchEvent) => e.preventDefault();
  const onTouchEnd = () => { isPanning.current = false; };

  /* ============================= */
  /* ---------- WHEEL / ZOOM ---------- */
  /* ============================= */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.0015;
      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      setScale(prevScale => {
        const newScale = Math.min(3, Math.max(0.5, prevScale - e.deltaY * zoomSpeed));

        // Ajusta posição para zoom centrado no cursor
        setPosition(pos => ({
          x: pos.x - offsetX * (newScale - prevScale),
          y: pos.y - offsetY * (newScale - prevScale)
        }));

        return newScale;
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  /* ============================= */
  /* ---------- RETURN ---------- */
  /* ============================= */

  return {
    containerRef,
    transform: {
      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
    },
    handlers: {
      onMouseDown,
      onMouseMove: (e: React.MouseEvent) => e.preventDefault(), // move é global
      onMouseUp: () => { isPanning.current = false; },
      onMouseLeave: () => { isPanning.current = false; },
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    scale,
    position
  };
}
