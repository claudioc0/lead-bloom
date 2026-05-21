import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DashboardStats } from "@/types/database";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const { data, error } = await supabase.rpc("get_dashboard_stats");
      if (error) throw error;
      return data as unknown as DashboardStats;
    },
  });
}

export function useMonthlyUsage() {
  return useQuery({
    queryKey: ["monthly-usage"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_monthly_usage");
      if (error) throw error;
      return data as unknown as {
        leads_used: number;
        messages_used: number;
        leads_limit: number;
      };
    },
  });
}
