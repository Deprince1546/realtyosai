import { motion } from "framer-motion";
import {
  Sparkles,
  UserCheck,
  Search,
  CalendarCheck,
  Database,
  FileSignature,
  KeyRound,
} from "lucide-react";

const STAGES = [
  { label: "Lead", Icon: Sparkles },
  { label: "Qualification", Icon: UserCheck },
  { label: "Property Search", Icon: Search },
  { label: "Showing", Icon: CalendarCheck },
  { label: "CRM", Icon: Database },
  { label: "Transaction", Icon: FileSignature },
  { label: "Closing", Icon: KeyRound },
];

function Connector({ index }: { index: number }) {
  return (
    <div className="relative hidden h-px w-8 shrink-0 overflow-hidden bg-border md:block lg:w-12">
      <motion.span
        className="absolute inset-y-0 left-0 w-4 bg-accent"
        animate={{ x: ["-100%", "300%"], opacity: [0, 1, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.28,
        }}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}

export function WorkflowRail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
      className="flex flex-wrap items-center justify-center gap-2 md:flex-nowrap md:gap-0"
    >
      {STAGES.map((stage, i) => (
        <div key={stage.label} className="flex items-center">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.35,
            }}
            className="glass-soft group flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors duration-300 hover:border-accent/40"
            style={{ willChange: "transform" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                className="absolute inset-0 rounded-full bg-accent"
                animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.5, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
              />
            </span>
            <stage.Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
            <span className="text-[12.5px] whitespace-nowrap text-foreground/85">
              {stage.label}
            </span>
          </motion.div>
          {i < STAGES.length - 1 && <Connector index={i} />}
        </div>
      ))}
    </motion.div>
  );
}
