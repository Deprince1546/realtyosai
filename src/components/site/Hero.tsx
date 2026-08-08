import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { GlassButton } from "./GlassButton";
import { WorkflowRail } from "./WorkflowRail";
import { Wordmark } from "./Logo";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const head = usePointerParallax(5);
  const cta = usePointerParallax(3);
  const navigate = useNavigate();
  const go = (plan: string) => navigate({ to: "/auth", search: { plan, mode: "signup" } });

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-28 pb-16 text-center">

      <motion.div style={{ x: head.x, y: head.y, willChange: "transform" }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.35 }}
          className="text-[11px] tracking-[0.34em] text-muted-foreground uppercase"
        >
          Autonomous AI Employee
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, ease, delay: 0.5 }}
          className="font-display mt-6 text-[clamp(3.6rem,13vw,10rem)] leading-[0.92] text-foreground"
        >
          <Wordmark />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.68 }}
          className="font-display mx-auto mt-7 max-w-2xl text-[clamp(1.15rem,2.6vw,1.9rem)] leading-snug text-foreground/90 text-balance-tight"
        >
          The AI Operating System for Modern Real Estate.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.82 }}
          className="mx-auto mt-6 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground text-balance-tight"
        >
          Hire one AI employee that captures leads, qualifies buyers, books showings, manages
          transactions, updates CRMs, follows up automatically, and keeps your brokerage running
          every day.
        </motion.p>
      </motion.div>

      <motion.div
        style={{ x: cta.x, y: cta.y, willChange: "transform" }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.98 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <GlassButton variant="primary" size="lg">
          Hire RealtyOS
        </GlassButton>
        <GlassButton variant="ghost" size="lg">
          Start Free
        </GlassButton>
      </motion.div>

      <div className="mt-14 w-full max-w-5xl">
        <WorkflowRail />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-px bg-linear-to-b from-transparent via-foreground/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
