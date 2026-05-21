import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toneFromDb, toneToDb } from "@/lib/lead-mappers";
import type { UiTone } from "@/lib/lead-mappers";
import type { Niche } from "@/data/lead.types";

export type Profile = {
  id: string;
  fullName: string | null;
  editingSpecialty: string | null;
  portfolioUrl: string | null;
  defaultNiche: string | null;
  messageLanguage: string;
  defaultTone: UiTone;
  plan: "starter" | "pro" | "agency";
  email: string | null;
};

function rowToProfile(row: {
  id: string;
  full_name: string | null;
  editing_specialty: string | null;
  portfolio_url: string | null;
  default_niche: string | null;
  message_language: string;
  default_tone: string;
  plan: "starter" | "pro" | "agency";
}, email: string | null): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    editingSpecialty: row.editing_specialty,
    portfolioUrl: row.portfolio_url,
    defaultNiche: row.default_niche,
    messageLanguage: row.message_language,
    defaultTone: toneFromDb(row.default_tone),
    plan: row.plan,
    email,
  };
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) throw authErr ?? new Error("Not authenticated");

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      return rowToProfile(data, user.email ?? null);
    },
  });
}

export type ProfileUpdate = {
  fullName?: string;
  editingSpecialty?: string;
  portfolioUrl?: string;
  defaultNiche?: Niche | string;
  messageLanguage?: string;
  defaultTone?: UiTone;
};

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: ProfileUpdate) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: patch.fullName,
          editing_specialty: patch.editingSpecialty,
          portfolio_url: patch.portfolioUrl,
          default_niche: patch.defaultNiche,
          message_language: patch.messageLanguage,
          default_tone: patch.defaultTone ? toneToDb(patch.defaultTone) : undefined,
        })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
