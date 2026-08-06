import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  MessagesSquare,
  ShieldCheck,
  Workflow,
  Clock,
  Building2,
  LineChart,
} from "lucide-react";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";

const ease = [0.22, 1, 0.36, 1] as const;

function GlassCard({
  Icon,
  title,
  body,
  index,
}: {
  Icon: LucideIcon;
  title: string;
  body: string;
  index: number;
}) {
  const p = usePointerParallax(10);
  return (
    <motion.article
      style={{ x: p.x, y: p.y, willChange: "transform" }}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease, delay: index * 0.08 }}
      className="glass-panel group rounded-2xl p-6 transition-colors duration-500 hover:border-accent/35"
    >
      <Icon className="h-5 w-5 text-accent transition-transform duration-500 group-hover:scale-110" />
      <h3 className="font-display mt-5 text-xl text-foreground">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </motion.article>
  );
}

function SectionShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-24">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease }}
        className="text-[11px] tracking-[0.34em] text-muted-foreground uppercase"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.06 }}
        className="font-display mt-5 max-w-3xl text-[clamp(2.1rem,5vw,3.9rem)] leading-[1.02] text-foreground text-balance-tight"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.14 }}
        className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        {lede}
      </motion.p>
      {children}
    </section>
  );
}

export function StorySections() {
  return (
    <>
      <SectionShell
        eyebrow="The Hire"
        title="An employee that never closes the office."
        lede="RealtyOS answers every enquiry the moment it arrives, qualifies intent, and moves the deal forward while your team sleeps."
      >
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <GlassCard
            index={0}
            Icon={MessagesSquare}
            title="Instant response"
            body="Every lead is greeted in seconds across web, email, and text — in your brand's voice."
          />
          <GlassCard
            index={1}
            Icon={Workflow}
            title="Qualified pipeline"
            body="Budget, timeline, financing and motivation captured before an agent spends a minute."
          />
          <GlassCard
            index={2}
            Icon={Clock}
            title="Relentless follow-up"
            body="Sequences that continue for months, adapting to each buyer's pace and behaviour."
          />
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Operations"
        title="The whole transaction, held together."
        lede="From first message to closing table, RealtyOS keeps records clean, deadlines met, and every party informed."
      >
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <GlassCard
            index={0}
            Icon={LineChart}
            title="Live operating brief"
            body="A single view of pipeline, response time, showings booked, and revenue in motion."
          />
          <GlassCard
            index={1}
            Icon={Building2}
            title="Brokerage scale"
            body="Deploy across offices and teams with per-market rules, routing, and compliance."
          />
          <GlassCard
            index={2}
            Icon={ShieldCheck}
            title="Enterprise trust"
            body="SSO, granular permissions, audit trails, and encryption on every record."
          />
        </div>
      </SectionShell>
    </>
  );
}
