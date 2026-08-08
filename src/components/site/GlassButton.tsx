import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "lg";

const base =
  "relative inline-flex items-center justify-center rounded-full font-medium tracking-[-0.01em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-foreground text-primary-foreground hover:bg-foreground/90 shadow-[0_18px_40px_-22px_oklch(0_0_0/0.9)]",
  ghost: "glass-soft text-foreground hover:border-accent/40 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  lg: "h-12 px-6 text-[14.5px] sm:px-7 sm:text-[15px]",
};

export function GlassButton({
  children,
  variant = "ghost",
  size = "sm",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ willChange: "transform" }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
