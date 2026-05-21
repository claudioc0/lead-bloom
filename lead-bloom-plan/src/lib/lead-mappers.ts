import type { Tables } from "@/types/database";
import type { Frequency, Lead, Niche, Status } from "@/data/lead.types";

type DbLead = Tables<"leads">;

const STATUS_TO_UI: Record<DbLead["status"], Status> = {
  new: "New",
  contacted: "Contacted",
  replied: "Replied",
  client: "Client",
};

const STATUS_TO_DB: Record<Status, DbLead["status"]> = {
  New: "new",
  Contacted: "contacted",
  Replied: "replied",
  Client: "client",
};

export function dbToLead(row: DbLead): Lead {
  return {
    id: row.id,
    name: row.channel_name,
    niche: row.niche as Niche,
    subscribers: row.subscribers,
    frequency: row.upload_frequency as Frequency,
    monthlyUploads: row.monthly_uploads,
    score: row.fit_score,
    status: STATUS_TO_UI[row.status],
    language: row.language as Lead["language"],
    country: row.country as Lead["country"],
    note: row.note ?? undefined,
    addedAt: row.discovered_at.slice(0, 10),
    isSaved: row.is_saved,
  };
}

export function statusToDb(status: Status): DbLead["status"] {
  return STATUS_TO_DB[status];
}

export type UiTone = "Professional" | "Casual" | "Direct";
export type UiGoal = "Offer editing services" | "Ask for a call" | "Send portfolio";

export function toneToDb(tone: UiTone): "professional" | "casual" | "direct" {
  const map = { Professional: "professional", Casual: "casual", Direct: "direct" } as const;
  return map[tone];
}

export function toneFromDb(tone: string): UiTone {
  const map: Record<string, UiTone> = {
    professional: "Professional",
    casual: "Casual",
    direct: "Direct",
  };
  return map[tone] ?? "Professional";
}

export function goalToDb(goal: UiGoal): "offer_services" | "ask_call" | "send_portfolio" {
  const map = {
    "Offer editing services": "offer_services",
    "Ask for a call": "ask_call",
    "Send portfolio": "send_portfolio",
  } as const;
  return map[goal];
}

export function goalFromDb(goal: string): UiGoal {
  const map: Record<string, UiGoal> = {
    offer_services: "Offer editing services",
    ask_call: "Ask for a call",
    send_portfolio: "Send portfolio",
  };
  return map[goal] ?? "Offer editing services";
}

export function trendPct(current: number, previous: number): { dir: "up" | "down"; pct: number } {
  if (previous === 0) return { dir: "up", pct: current > 0 ? 100 : 0 };
  const pct = Math.round(Math.abs(((current - previous) / previous) * 100));
  return { dir: current >= previous ? "up" : "down", pct };
}
