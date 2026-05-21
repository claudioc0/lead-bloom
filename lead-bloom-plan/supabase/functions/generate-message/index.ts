import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const OPENINGS: Record<string, string> = {
  professional: "Olá! Espero que esteja tudo bem com você.",
  casual: "Fala! Tudo certo aí?",
  direct: "Oi, vou direto ao ponto:",
  Professional: "Olá! Espero que esteja tudo bem com você.",
  Casual: "Fala! Tudo certo aí?",
  Direct: "Oi, vou direto ao ponto:",
};

const CLOSINGS: Record<string, string> = {
  offer_services:
    "Posso ajudar com a edição dos próximos vídeos — cortes mais dinâmicos, ritmo afinado e thumbnails que convertem.",
  ask_call:
    "Topa uma call rápida de 15 minutos esta semana pra eu te mostrar como posso liberar seu tempo da edição?",
  send_portfolio:
    "Te mando um portfólio com cases parecidos com o seu canal — me responde aqui que envio agora.",
  "Offer editing services":
    "Posso ajudar com a edição dos próximos vídeos — cortes mais dinâmicos, ritmo afinado e thumbnails que convertem.",
  "Ask for a call":
    "Topa uma call rápida de 15 minutos esta semana pra eu te mostrar como posso liberar seu tempo da edição?",
  "Send portfolio":
    "Te mando um portfólio com cases parecidos com o seu canal — me responde aqui que envio agora.",
};

function formatSubs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `${n}`;
}

function mapTone(tone: string): "professional" | "casual" | "direct" {
  const t = tone.toLowerCase();
  if (t === "casual") return "casual";
  if (t === "direct") return "direct";
  return "professional";
}

function mapGoal(goal: string): "offer_services" | "ask_call" | "send_portfolio" {
  if (goal.includes("call")) return "ask_call";
  if (goal.includes("portfolio")) return "send_portfolio";
  if (goal === "ask_call" || goal === "send_portfolio" || goal === "offer_services") {
    return goal as "offer_services" | "ask_call" | "send_portfolio";
  }
  return "offer_services";
}

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
    } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { leadId, tone: rawTone, goal: rawGoal, senderName } = await req.json();
    if (!leadId) return Response.json({ error: "leadId required" }, { status: 400 });

    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();
    if (leadErr || !lead) return Response.json({ error: "Lead not found" }, { status: 404 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, default_tone")
      .eq("id", user.id)
      .single();

    const toneKey = rawTone ?? profile?.default_tone ?? "professional";
    const toneDb = mapTone(toneKey);
    const goalDb = mapGoal(rawGoal ?? "offer_services");
    const opening = OPENINGS[toneKey] ?? OPENINGS.professional;
    const closing = CLOSINGS[rawGoal ?? "offer_services"] ?? CLOSINGS.offer_services;
    const name = senderName ?? profile?.full_name ?? "Editor";
    const subs = formatSubs(lead.subscribers);
    const niche = lead.niche.toLowerCase();

    const body = `${opening} Acompanho o ${lead.channel_name} há um tempo e o que vocês estão construindo no nicho de ${niche} com ${subs} inscritos é muito sólido — dá pra ver consistência publicando ${lead.upload_frequency.toLowerCase()}.

Sou editor de vídeo especializado em canais de ${niche} e percebi que com pequenos ajustes de ritmo e estrutura dá pra aumentar bastante a retenção sem mudar a essência do canal.

${closing}

Abraço,
${name}`;

    const { data: msg, error: msgErr } = await supabase
      .from("messages")
      .insert({
        user_id: user.id,
        lead_id: leadId,
        body,
        tone: toneDb,
        goal: goalDb,
      })
      .select("id")
      .single();
    if (msgErr) throw msgErr;

    await supabase.from("leads").update({ status: "contacted", is_saved: true }).eq("id", leadId);

    return Response.json(
      { messageId: msg.id, body, charCount: body.length },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
});
