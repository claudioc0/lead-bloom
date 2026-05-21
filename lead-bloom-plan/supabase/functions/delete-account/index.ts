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

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
    } = await userClient.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) {
      return Response.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return Response.json({ ok: true }, { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return Response.json({ error: message }, { status: 500 });
  }
});
