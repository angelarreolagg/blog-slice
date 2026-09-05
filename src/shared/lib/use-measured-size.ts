import { useLayoutEffect, useRef, useState } from "react";

export type MeasuredSize = {
  width: number;
  height: number;
};

/**
 * Reports an element's rendered box, remeasuring when it or the window changes.
 * Null until the first measurement, so prerendered markup renders without one.
 */
export function useMeasuredSize<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  size: MeasuredSize | null;
} {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<MeasuredSize | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();

      setSize({ width: Math.round(width), height: Math.round(height) });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
