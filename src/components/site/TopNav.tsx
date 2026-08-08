import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Logo, Wordmark } from "./Logo";
import { GlassButton } from "./GlassButton";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";

export function TopNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const nav = usePointerParallax(4);
  const btn = usePointerParallax(2.5);
  const navigate = useNavigate();

  const go = (plan: string) => navigate({ to: "/auth", search: { plan, mode: "signup" } });

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-30 px-3 pt-3 sm:px-6 sm:pt-6"
    >
      <motion.div
        style={{ x: nav.x, y: nav.y, willChange: "transform" }}
        className="glass-panel mx-auto grid h-14 max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-full px-2.5 sm:px-5"
      >
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 hover:border-accent/40 hover:text-foreground"
        >
          <Menu className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        </button>

        <div className="flex min-w-0 items-center justify-center">
          <span className="sm:hidden">
            <Wordmark className="font-display text-[15px] tracking-[0.02em]" />
          </span>
          <Logo className="hidden sm:inline-flex" />
        </div>

        <motion.div style={{ x: btn.x, y: btn.y }} className="flex shrink-0 items-center gap-2">
          <GlassButton variant="ghost" className="hidden sm:inline-flex" onClick={() => go("pro")}>
            Hire RealtyOS
          </GlassButton>
          <GlassButton variant="primary" onClick={() => go("trial")}>
            Start Free
          </GlassButton>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
