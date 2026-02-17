import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const isBrowser = typeof window !== "undefined";
  const [isMobile, setIsMobile] = useState<boolean>(
    isBrowser ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    if (!isBrowser) return;

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Adiciona listener moderno
    mediaQuery.addEventListener("change", handleChange);

    // Garante que o estado inicial está correto
    setIsMobile(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [isBrowser]);

  return isMobile;
}
