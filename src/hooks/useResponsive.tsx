import { useEffect, useState, useCallback } from "react";

// Defina seus breakpoints
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

type Orientation = "portrait" | "landscape";

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: Orientation;
  width: number;
  height: number;
}

export function useResponsive(debounceTime = 100): ResponsiveState {
  const isBrowser = typeof window !== "undefined";

  const getOrientation = useCallback((): Orientation => {
    if (!isBrowser) return "portrait";
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  }, [isBrowser]);

  const getResponsiveState = useCallback((): ResponsiveState => {
    if (!isBrowser) {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        orientation: "portrait",
        width: 0,
        height: 0,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < BREAKPOINTS.mobile;
    const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
    const isDesktop = width >= BREAKPOINTS.tablet;

    return {
      isMobile,
      isTablet,
      isDesktop,
      orientation: getOrientation(),
      width,
      height,
    };
  }, [isBrowser, getOrientation]);

  const [state, setState] = useState<ResponsiveState>(getResponsiveState);

  useEffect(() => {
    if (!isBrowser) return;

    let timeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setState(getResponsiveState());
      }, debounceTime);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [getResponsiveState, debounceTime, isBrowser]);

  return state;
}
