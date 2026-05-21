import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const [profile, leads, messages] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("leads").select("*").eq("user_id", user.id),
      supabase.from("messages").select("*").eq("user_id", user.id),
    ]);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile: profile.data,
      leads: leads.data ?? [],
      messages: messages.data ?? [],
    };

    return Response.json(exportPayload, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Disposition": 'attachment; filename="editorleads-export.json"',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Export failed";
    return Response.json({ error: message }, { status: 500 });
  }
});
