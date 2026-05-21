import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { dbToLead, goalFromDb, toneFromDb } from "@/lib/lead-mappers";
import type { Lead, Status } from "@/data/lead.types";

export type MessageWithLead = {
  id: string;
  body: string;
  tone: ReturnType<typeof toneFromDb>;
  goal: ReturnType<typeof goalFromDb>;
  createdAt: string;
  lead: Lead;
};

export function useMessagesQuery() {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async (): Promise<MessageWithLead[]> => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, leads(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;

      return (data ?? []).flatMap((row) => {
        const leadRow = row.leads as Parameters<typeof dbToLead>[0] | null;
        if (!leadRow || Array.isArray(leadRow)) return [];
        return [{
          id: row.id,
          body: row.body,
          tone: toneFromDb(row.tone),
          goal: goalFromDb(row.goal),
          createdAt: row.created_at,
          lead: dbToLead(leadRow),
        }];
      });
    },
  });
}

export function filterMessagesByStatus(
  messages: MessageWithLead[],
  filter: "All" | Status,
): MessageWithLead[] {
  if (filter === "All") return messages;
  return messages.filter((m) => m.lead.status === filter);
}
