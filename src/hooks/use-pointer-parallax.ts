import { useEffect } from "react";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Pointer parallax. `depth` = max pixel travel of the element.
 */
export function usePointerParallax(depth: number): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const sx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 });

  return {
    x: useTransform(sx, (v) => v * depth),
    y: useTransform(sy, (v) => v * depth),
  };
}
