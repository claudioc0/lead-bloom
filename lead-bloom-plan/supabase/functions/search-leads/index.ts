import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const MOCK_POOL = [
  { channel_name: "Canal do Empreendedor", niche: "Business", subscribers: 45000, upload_frequency: "2-3x week", monthly_uploads: 12, fit_score: 92 },
  { channel_name: "Fit com Propósito", niche: "Fitness", subscribers: 28000, upload_frequency: "Daily", monthly_uploads: 30, fit_score: 87 },
  { channel_name: "Tech Simplificado", niche: "Tech", subscribers: 67000, upload_frequency: "2-3x week", monthly_uploads: 10, fit_score: 78 },
  { channel_name: "Cozinha da Vó Maria", niche: "Food", subscribers: 12000, upload_frequency: "Weekly", monthly_uploads: 4, fit_score: 65 },
  { channel_name: "Finanças que Funcionam", niche: "Finance", subscribers: 89000, upload_frequency: "2-3x week", monthly_uploads: 12, fit_score: 94 },
  { channel_name: "Gamer BR Oficial", niche: "Gaming", subscribers: 34000, upload_frequency: "Daily", monthly_uploads: 28, fit_score: 71 },
  { channel_name: "Viagem e Liberdade", niche: "Lifestyle", subscribers: 19000, upload_frequency: "Weekly", monthly_uploads: 4, fit_score: 58 },
  { channel_name: "Dev na Prática", niche: "Tech", subscribers: 52000, upload_frequency: "2-3x week", monthly_uploads: 10, fit_score: 83 },
  { channel_name: "Mente Equilibrada", niche: "Education", subscribers: 8000, upload_frequency: "Weekly", monthly_uploads: 4, fit_score: 61 },
  { channel_name: "Startup do Zero", niche: "Business", subscribers: 41000, upload_frequency: "2-3x week", monthly_uploads: 12, fit_score: 89 },
  { channel_name: "CrossFit Brasil", niche: "Fitness", subscribers: 23000, upload_frequency: "Daily", monthly_uploads: 26, fit_score: 76 },
  { channel_name: "Inglês Acelerado", niche: "Education", subscribers: 156000, upload_frequency: "2-3x week", monthly_uploads: 10, fit_score: 88 },
  { channel_name: "Marketing Digital BR", niche: "Business", subscribers: 31000, upload_frequency: "2-3x week", monthly_uploads: 8, fit_score: 74 },
  { channel_name: "Receitas Rápidas", niche: "Food", subscribers: 22000, upload_frequency: "Daily", monthly_uploads: 20, fit_score: 69 },
  { channel_name: "Investidor Iniciante", niche: "Finance", subscribers: 54000, upload_frequency: "Weekly", monthly_uploads: 4, fit_score: 81 },
  { channel_name: "Lifestyle Premium", niche: "Lifestyle", subscribers: 15000, upload_frequency: "2-3x week", monthly_uploads: 9, fit_score: 63 },
  { channel_name: "Code Academy BR", niche: "Tech", subscribers: 98000, upload_frequency: "2-3x week", monthly_uploads: 11, fit_score: 90 },
  { channel_name: "Yoga em Casa", niche: "Fitness", subscribers: 17000, upload_frequency: "Weekly", monthly_uploads: 4, fit_score: 55 },
];

const PAGE_SIZE = 12;

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
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const niche = body.niche as string | undefined;
    const subMin = Number(body.subMin ?? 1) * 1000;
    const subMax = Number(body.subMax ?? 500) * 1000;
    const frequency = body.frequency as string | undefined;
    const language = (body.language as string) ?? "Portuguese";
    const country = (body.country as string) ?? "Brazil";
    const page = Math.max(1, Number(body.page ?? 1));

    await new Promise((r) => setTimeout(r, 1200));

    const filtered = MOCK_POOL.filter((c) => {
      if (niche && niche !== "All" && c.niche !== niche) return false;
      if (frequency && frequency !== "All" && c.upload_frequency !== frequency) return false;
      if (c.subscribers < subMin || c.subscribers > subMax) return false;
      return true;
    }).map((c, i) => ({
      ...c,
      youtube_channel_id: `mock-${page}-${i}-${c.channel_name.replace(/\s/g, "-").toLowerCase()}`,
    }));

    const total = Math.max(filtered.length * 3, filtered.length);
    const start = (page - 1) * PAGE_SIZE;
    const slice = filtered.slice(start, start + PAGE_SIZE);

    const rows = slice.map((c) => ({
      user_id: user.id,
      youtube_channel_id: c.youtube_channel_id,
      channel_name: c.channel_name,
      niche: c.niche,
      subscribers: c.subscribers,
      upload_frequency: c.upload_frequency,
      monthly_uploads: c.monthly_uploads,
      fit_score: c.fit_score + (page % 2 === 0 ? 1 : 0),
      status: "new" as const,
      language,
      country,
      is_saved: false,
    }));

    if (rows.length > 0) {
      const { error: insertError } = await supabase.from("leads").upsert(rows, {
        onConflict: "user_id,youtube_channel_id",
        ignoreDuplicates: false,
      });
      if (insertError) {
        if (insertError.message.includes("limit")) {
          return Response.json({ error: insertError.message }, { status: 402 });
        }
        throw insertError;
      }
    }

    const { data: inserted } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .in(
        "youtube_channel_id",
        rows.map((r) => r.youtube_channel_id),
      );

    const items = (inserted ?? []).map((row) => ({
      id: row.id,
      name: row.channel_name,
      niche: row.niche,
      subscribers: row.subscribers,
      frequency: row.upload_frequency,
      monthlyUploads: row.monthly_uploads,
      score: row.fit_score,
      status: "New",
      language: row.language,
      country: row.country,
      addedAt: row.discovered_at.slice(0, 10),
      isSaved: row.is_saved,
    }));

    return Response.json(
      { items, total, page, pageSize: PAGE_SIZE },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Search failed";
    return Response.json({ error: message }, { status: 500 });
  }
});
