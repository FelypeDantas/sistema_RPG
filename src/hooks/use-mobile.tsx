import { useEffect, useState, useCallback } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const isBrowser = typeof window !== "undefined";

  // Função estável para checar mobile
  const checkIsMobile = useCallback(() => {
    return isBrowser ? window.innerWidth < MOBILE_BREAKPOINT : false;
  }, [isBrowser]);

  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile);

  useEffect(() => {
    if (!isBrowser) return;

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Listener moderno ou fallback
    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    // Garante que o estado inicial está correto
    setIsMobile(mediaQuery.matches);

    return () => {
      if ("removeEventListener" in mediaQuery) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [isBrowser]);

  return isMobile;
}
