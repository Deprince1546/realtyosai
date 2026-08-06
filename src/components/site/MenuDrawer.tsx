import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { MENU_SECTIONS } from "./menu-data";

export function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("Features");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/45 backdrop-blur-[2px]"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 210, damping: 30, mass: 0.9 }}
            className="glass-panel fixed inset-y-0 left-0 z-50 flex w-full max-w-full flex-col rounded-r-none sm:max-w-[420px] sm:rounded-r-3xl"
            style={{ willChange: "transform" }}
            aria-label="Main menu"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
              <Logo />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-full border border-border/70 p-2 text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-accent/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {MENU_SECTIONS.map((section) => {
                const isOpen = expanded === section.title;
                return (
                  <div key={section.title} className="border-b border-border/40 last:border-0">
                    <button
                      onClick={() => setExpanded(isOpen ? null : section.title)}
                      className="group flex w-full items-center justify-between px-3 py-3.5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-display text-lg transition-colors duration-300 ${
                          isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {section.title}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-accent" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-5">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {section.blurb}
                            </p>
                            <ul className="mt-3 space-y-2">
                              {section.points.map((p) => (
                                <li key={p} className="flex gap-2.5 text-sm text-foreground/80">
                                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-border/60 px-6 py-5">
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                RealtyOS — Always on duty
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
