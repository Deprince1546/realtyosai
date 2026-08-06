export type MenuSection = {
  title: string;
  blurb: string;
  points: string[];
};

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Home",
    blurb: "One AI employee running the daily operations of your brokerage.",
    points: ["Always on, 24/7/365", "No onboarding backlog", "Works inside your existing stack"],
  },
  {
    title: "About",
    blurb: "Built for brokerages that want capacity without headcount.",
    points: ["Founded on operator experience", "Enterprise-grade by default", "Human in command"],
  },
  {
    title: "Features",
    blurb: "Everything a top-performing operations hire would do — continuously.",
    points: ["Lead capture and instant response", "Buyer and seller qualification", "Showing scheduling and reminders", "CRM hygiene and enrichment"],
  },
  {
    title: "Solutions",
    blurb: "Configured for the way your team actually sells.",
    points: ["Independent realtors", "Growing teams", "Multi-office brokerages", "Property management"],
  },
  {
    title: "How It Works",
    blurb: "Hire it, connect it, let it run.",
    points: ["Connect your channels and CRM", "Set your rules and tone", "Review the daily operating brief"],
  },
  {
    title: "Dashboard",
    blurb: "A live operating view of every conversation and deal.",
    points: ["Pipeline by stage", "Response and conversion timing", "Task and follow-up ledger"],
  },
  {
    title: "Integrations",
    blurb: "Fits the systems your business already runs on.",
    points: ["MLS and listing feeds", "CRM platforms", "Calendar, email and SMS", "E-signature and docs"],
  },
  {
    title: "Pricing",
    blurb: "Priced like a hire, not a seat licence.",
    points: ["Start Free — one active workflow", "Professional — full operations", "Enterprise — custom governance"],
  },
  {
    title: "Customers",
    blurb: "Brokerages operating with permanent coverage.",
    points: ["Faster first response", "More showings booked", "Cleaner pipeline data"],
  },
  {
    title: "Enterprise",
    blurb: "Governance, control and scale for large organisations.",
    points: ["SSO and role-based access", "Regional data residency", "Dedicated success engineering"],
  },
  {
    title: "Developers",
    blurb: "Extend RealtyOS into your own systems.",
    points: ["Webhooks and event streams", "Custom workflow actions", "Sandbox environments"],
  },
  {
    title: "API",
    blurb: "A clean, versioned interface for every operation.",
    points: ["REST endpoints", "Scoped API keys", "Predictable rate limits"],
  },
  {
    title: "Documentation",
    blurb: "Precise guides for operators and engineers.",
    points: ["Quick start", "Workflow reference", "Deployment patterns"],
  },
  {
    title: "Security",
    blurb: "Enterprise controls from the first day.",
    points: ["Encryption in transit and at rest", "Audit logging", "Least-privilege access"],
  },
  {
    title: "FAQ",
    blurb: "The questions brokerages ask first.",
    points: ["Does it replace my team? No — it removes the backlog.", "How fast is setup? Same day.", "Can I supervise everything? Always."],
  },
  {
    title: "Contact",
    blurb: "Talk to the team building the operating system.",
    points: ["hello@realtyos.com", "Enterprise: enterprise@realtyos.com", "Response within one business day"],
  },
];
