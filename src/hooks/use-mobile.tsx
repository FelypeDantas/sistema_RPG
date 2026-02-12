import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const listener = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    // Compatibilidade com navegadores antigos
    if (mql.addEventListener) {
      mql.addEventListener("change", listener);
    } else {
      mql.addListener(listener);
    }

    // Inicializa o estado
    setIsMobile(mql.matches);

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", listener);
      } else {
        mql.removeListener(listener);
      }
    };
  }, []);

  return isMobile;
}
