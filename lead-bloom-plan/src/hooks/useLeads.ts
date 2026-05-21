import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { dbToLead, statusToDb } from "@/lib/lead-mappers";
import type { Lead, Status } from "@/data/lead.types";

type LeadsFilter = {
  savedOnly?: boolean;
  limit?: number;
  orderBy?: "discovered_at" | "fit_score";
};

export function useLeadsQuery(filter: LeadsFilter = {}) {
  return useQuery({
    queryKey: ["leads", filter],
    queryFn: async (): Promise<Lead[]> => {
      let q = supabase.from("leads").select("*");
      if (filter.savedOnly) q = q.eq("is_saved", true);
      q = q.order(filter.orderBy ?? "discovered_at", { ascending: false });
      if (filter.limit) q = q.limit(filter.limit);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(dbToLead);
    },
  });
}

export function useLeadMutations() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["leads"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    qc.invalidateQueries({ queryKey: ["monthly-usage"] });
  };

  const saveLead = useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase.from("leads").update({ is_saved: true }).eq("id", leadId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase
        .from("leads")
        .update({ status: statusToDb(status), is_saved: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const setNote = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase.from("leads").update({ note }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const removeFromBoard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("leads")
        .update({ is_saved: false, status: "new" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { saveLead, setStatus, setNote, removeFromBoard, deleteLead };
}

export function useSearchLeads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      niche: string;
      subMin: number;
      subMax: number;
      frequency: string;
      language: string;
      country: string;
      page?: number;
    }) => {
      const { data, error } = await supabase.functions.invoke("search-leads", {
        body: params,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as {
        items: Lead[];
        total: number;
        page: number;
        pageSize: number;
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["monthly-usage"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useGenerateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      leadId: string;
      tone: string;
      goal: string;
      senderName?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("generate-message", {
        body: params,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as { messageId: string; body: string; charCount: number };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["monthly-usage"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
