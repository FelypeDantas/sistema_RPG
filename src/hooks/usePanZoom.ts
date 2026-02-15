import { useRef, useState, useEffect, useCallback } from "react";

export function usePanZoom({ minScale = 0.5, maxScale = 3, zoomSpeed = 0.0015 } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const positionRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const isPanningRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  const [, setTick] = useState(0); // usado para forçar render

  // ==============================
  // Atualiza a renderização via RAF
  // ==============================
  const update = useCallback(() => setTick(t => t + 1), []);

  // ==============================
  // PAN GLOBAL
  // ==============================
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;

      positionRef.current.x += dx;
      positionRef.current.y += dy;
      lastRef.current = { x: e.clientX, y: e.clientY };
      update();
    };

    const handleMouseUp = () => {
      isPanningRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPanningRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastRef.current.x;
      const dy = e.touches[0].clientY - lastRef.current.y;

      positionRef.current.x += dx;
      positionRef.current.y += dy;
      lastRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      update();
    };

    const handleTouchEnd = () => {
      isPanningRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [update]);

  // ==============================
  // WHEEL / ZOOM
  // ==============================
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const prevScale = scaleRef.current;
      let newScale = prevScale - e.deltaY * zoomSpeed;
      newScale = Math.min(maxScale, Math.max(minScale, newScale));

      // Ajusta posição para zoom centrado
      positionRef.current.x -= offsetX * (newScale - prevScale);
      positionRef.current.y -= offsetY * (newScale - prevScale);

      scaleRef.current = newScale;
      update();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [minScale, maxScale, zoomSpeed, update]);

  // ==============================
  // HANDLERS
  // ==============================
  const onMouseDown = (e: React.MouseEvent) => {
    isPanningRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isPanningRef.current = true;
      lastRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  // ==============================
  // RETURN
  // ==============================
  return {
    containerRef,
    style: {
      transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px) scale(${scaleRef.current})`,
      touchAction: "none",
      cursor: isPanningRef.current ? "grabbing" : "grab",
    },
    handlers: { onMouseDown, onTouchStart },
    state: { scale: scaleRef.current, position: positionRef.current },
  };
}
