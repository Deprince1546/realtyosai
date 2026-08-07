import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollScene } from "@/components/site/ScrollScene";
import { TopNav } from "@/components/site/TopNav";
import { MenuDrawer } from "@/components/site/MenuDrawer";
import { Hero } from "@/components/site/Hero";
import { StorySections } from "@/components/site/StorySections";
import { GlassButton } from "@/components/site/GlassButton";
import { Logo } from "@/components/site/Logo";
import { getRequestOrigin } from "@/lib/origin.functions";

const TITLE = "RealtyOS — The AI Operating System for Modern Real Estate";
const DESC =
  "Hire one AI employee that captures leads, qualifies buyers, books showings, manages transactions, and keeps your brokerage running 24/7.";

export const Route = createFileRoute("/")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    const image = origin ? `${origin}/og-image.jpg` : undefined;
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: "/" }],
    };
  },
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative">
      <ScrollScene />
      <TopNav onOpenMenu={() => setMenuOpen(true)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Hero />
      <StorySections />

      <section className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-5 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.4rem,6.5vw,5rem)] leading-[1.02] text-foreground text-balance-tight"
        >
          Hire your first AI employee.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground"
        >
          Operating on day one. No headcount, no onboarding queue, no downtime.
        </motion.p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <GlassButton variant="primary" size="lg">
            Hire RealtyOS
          </GlassButton>
          <GlassButton variant="ghost" size="lg">
            Start Free
          </GlassButton>
        </div>
      </section>

      <footer className="relative border-t border-border/40">
        <div className="glass-soft mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            © {new Date().getFullYear()} RealtyOS
          </p>
        </div>
      </footer>
    </main>
  );
}
