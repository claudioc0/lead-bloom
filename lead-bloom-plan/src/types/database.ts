export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      leads: {
        Row: {
          channel_name: string;
          country: string;
          discovered_at: string;
          fit_score: number;
          id: string;
          is_saved: boolean;
          language: string;
          monthly_uploads: number;
          niche: string;
          note: string | null;
          status: Database["public"]["Enums"]["lead_status"];
          subscribers: number;
          updated_at: string;
          upload_frequency: string;
          user_id: string;
          youtube_channel_id: string | null;
        };
        Insert: {
          channel_name: string;
          country?: string;
          discovered_at?: string;
          fit_score?: number;
          id?: string;
          is_saved?: boolean;
          language?: string;
          monthly_uploads?: number;
          niche: string;
          note?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          subscribers?: number;
          updated_at?: string;
          upload_frequency: string;
          user_id: string;
          youtube_channel_id?: string | null;
        };
        Update: {
          channel_name?: string;
          country?: string;
          discovered_at?: string;
          fit_score?: number;
          id?: string;
          is_saved?: boolean;
          language?: string;
          monthly_uploads?: number;
          niche?: string;
          note?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          subscribers?: number;
          updated_at?: string;
          upload_frequency?: string;
          user_id?: string;
          youtube_channel_id?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          body: string;
          created_at: string;
          goal: Database["public"]["Enums"]["message_goal"];
          id: string;
          lead_id: string;
          tone: Database["public"]["Enums"]["message_tone"];
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          goal: Database["public"]["Enums"]["message_goal"];
          id?: string;
          lead_id: string;
          tone: Database["public"]["Enums"]["message_tone"];
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          goal?: Database["public"]["Enums"]["message_goal"];
          id?: string;
          lead_id?: string;
          tone?: Database["public"]["Enums"]["message_tone"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          default_niche: string | null;
          default_tone: Database["public"]["Enums"]["message_tone"];
          editing_specialty: string | null;
          full_name: string | null;
          id: string;
          message_language: string;
          plan: Database["public"]["Enums"]["plan_tier"];
          portfolio_url: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          default_niche?: string | null;
          default_tone?: Database["public"]["Enums"]["message_tone"];
          editing_specialty?: string | null;
          full_name?: string | null;
          id: string;
          message_language?: string;
          plan?: Database["public"]["Enums"]["plan_tier"];
          portfolio_url?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          default_niche?: string | null;
          default_tone?: Database["public"]["Enums"]["message_tone"];
          editing_specialty?: string | null;
          full_name?: string | null;
          id?: string;
          message_language?: string;
          plan?: Database["public"]["Enums"]["plan_tier"];
          portfolio_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_dashboard_stats: { Args: { p_user_id?: string }; Returns: Json };
      get_monthly_usage: { Args: { p_user_id?: string }; Returns: Json };
      plan_lead_limit: {
        Args: { p_plan: Database["public"]["Enums"]["plan_tier"] };
        Returns: number;
      };
    };
    Enums: {
      lead_status: "new" | "contacted" | "replied" | "client";
      message_goal: "offer_services" | "ask_call" | "send_portfolio";
      message_tone: "professional" | "casual" | "direct";
      plan_tier: "starter" | "pro" | "agency";
    };
    CompositeTypes: Record<string, never>;
  };
};

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Update"];

export type MonthlyUsage = {
  leads_used: number;
  messages_used: number;
  leads_limit: number;
};

export type DashboardStats = {
  leads_month: number;
  leads_prev: number;
  messages_month: number;
  messages_prev: number;
  contacted: number;
  response_rate: number;
};
