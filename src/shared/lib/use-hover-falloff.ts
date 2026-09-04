import { useCallback, useRef } from "react";

const LIFT_FALLBACK = -4;
const FALLOFF_FALLBACK = 0.45;
const SCALE_FALLBACK = 1.05;
const EASE_IN_FALLBACK = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_OUT_FALLBACK = "cubic-bezier(0.34, 3.85, 0.64, 1)";

function readNumber(
  styles: CSSStyleDeclaration,
  name: string,
  fallback: number,
) {
  const value = Number.parseFloat(styles.getPropertyValue(name));

  return Number.isFinite(value) ? value : fallback;
}

function readEase(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}

/**
 * Lifts a row of `.t-avatar` items around the hovered one, the lift falling off
 * with distance. Returns the handlers the row container must carry.
 */
export function useHoverFalloff(): {
  onPointerOver: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: (event: React.PointerEvent<HTMLElement>) => void;
} {
  const items = useRef<Array<HTMLElement>>([]);

  const apply = useCallback((row: HTMLElement, activeIndex: number | null) => {
    items.current = Array.from(row.querySelectorAll<HTMLElement>(".t-avatar"));
    const styles = getComputedStyle(document.documentElement);
    const lift = readNumber(styles, "--avatar-lift", LIFT_FALLBACK);
    const falloff = readNumber(styles, "--avatar-falloff", FALLOFF_FALLBACK);
    const scale = readNumber(styles, "--avatar-scale", SCALE_FALLBACK);
    const ease =
      activeIndex === null
        ? readEase(styles, "--avatar-ease-out", EASE_OUT_FALLBACK)
        : readEase(styles, "--avatar-ease-in", EASE_IN_FALLBACK);

    for (const [index, item] of items.current.entries()) {
      // The browser uses whatever timing function is current when a property
      // changes, so this has to be written before the variables.
      item.style.transitionTimingFunction = ease;

      if (activeIndex === null) {
        item.style.setProperty("--shift", "0px");
        item.style.setProperty("--scale-active", "1");
        continue;
      }

      const distance = Math.abs(index - activeIndex);
      const shift = lift * falloff ** distance;

      item.style.setProperty("--shift", `${shift.toFixed(3)}px`);
      item.style.setProperty(
        "--scale-active",
        index === activeIndex ? String(scale) : "1",
      );
    }
  }, []);

  const onPointerOver = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const row = event.currentTarget;
      const item = (event.target as HTMLElement).closest<HTMLElement>(
        ".t-avatar",
      );
      if (!item) return;

      apply(row, Array.from(row.querySelectorAll(".t-avatar")).indexOf(item));
    },
    [apply],
  );

  const onPointerLeave = useCallback(
    (event: React.PointerEvent<HTMLElement>) =>
      apply(event.currentTarget, null),
    [apply],
  );

  return { onPointerOver, onPointerLeave };
}
