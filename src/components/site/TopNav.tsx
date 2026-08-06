import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { GlassButton } from "./GlassButton";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";

export function TopNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const nav = usePointerParallax(4);
  const btn = usePointerParallax(2.5);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-30 px-4 pt-4 sm:px-6 sm:pt-6"
    >
      <motion.div
        style={{ x: nav.x, y: nav.y, willChange: "transform" }}
        className="glass-panel mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 sm:px-5"
      >
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 hover:border-accent/40 hover:text-foreground"
        >
          <Menu className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        </button>

        <Logo className="absolute left-1/2 -translate-x-1/2" />

        <motion.div style={{ x: btn.x, y: btn.y }} className="flex items-center gap-2">
          <GlassButton variant="ghost" className="hidden sm:inline-flex">
            Hire RealtyOS
          </GlassButton>
          <GlassButton variant="primary">Start Free</GlassButton>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
