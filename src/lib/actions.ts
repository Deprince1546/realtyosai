import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  UserCheck,
  CalendarCheck,
  Database,
  FileSignature,
  Globe,
  MessageSquare,
  BarChart3,
} from "lucide-react";

export type AgentAction = {
  key: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

export const AGENT_ACTIONS: AgentAction[] = [
  {
    key: "capture_leads",
    title: "Capture new leads",
    description: "Sweep inbound channels and register every new enquiry.",
    Icon: Sparkles,
  },
  {
    key: "qualify_buyers",
    title: "Qualify buyers",
    description: "Score intent, budget and timeline for open leads.",
    Icon: UserCheck,
  },
  {
    key: "book_showings",
    title: "Book showings",
    description: "Match availability and confirm viewings automatically.",
    Icon: CalendarCheck,
  },
  {
    key: "sync_crm",
    title: "Sync CRM",
    description: "Push the latest activity into the connected CRM.",
    Icon: Database,
  },
  {
    key: "advance_transactions",
    title: "Advance transactions",
    description: "Chase documents and move deals toward closing.",
    Icon: FileSignature,
  },
  {
    key: "manage_website",
    title: "Operate website",
    description: "Navigate the company site and keep listings current.",
    Icon: Globe,
  },
  {
    key: "follow_up",
    title: "Run follow-ups",
    description: "Send the next best message to every waiting contact.",
    Icon: MessageSquare,
  },
  {
    key: "daily_briefing",
    title: "Daily briefing",
    description: "Compile a pipeline report for the brokerage.",
    Icon: BarChart3,
  },
];

export const PLANS = [
  {
    id: "trial",
    name: "Free trial",
    price: "$0",
    cadence: "for 7 days",
    blurb: "One week of the full AI employee. No card required.",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$150",
    cadence: "per month",
    blurb: "Unlimited autonomous execution for a growing brokerage.",
  },
  {
    id: "business",
    name: "Business",
    price: "$2,000",
    cadence: "per year",
    blurb: "Best value for full teams, with priority execution.",
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

export const WORKFLOW_TOOLS = [
  "Salesforce",
  "HubSpot",
  "Follow Up Boss",
  "kvCORE",
  "Zillow Premier Agent",
  "MLS / IDX",
  "DocuSign",
  "Google Workspace",
  "Outlook / Microsoft 365",
  "Slack",
  "WhatsApp Business",
  "Calendly",
];
