import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Copy, RefreshCw, Check, Send } from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/context/LeadsContext";
import { formatSubs, type Lead } from "@/data/mockLeads";
import { FitScoreBadge } from "./FitScoreBadge";
import { LeadAvatar } from "./LeadAvatar";

type Tone = "Professional" | "Casual" | "Direct";
type Goal = "Offer editing services" | "Ask for a call" | "Send portfolio";

const OPENINGS: Record<Tone, string> = {
  Professional: "Olá! Espero que esteja tudo bem com você.",
  Casual: "Fala! Tudo certo aí?",
  Direct: "Oi, vou direto ao ponto:",
};

const CLOSINGS: Record<Goal, string> = {
  "Offer editing services":
    "Posso ajudar com a edição dos próximos vídeos — cortes mais dinâmicos, ritmo afinado e thumbnails que convertem.",
  "Ask for a call":
    "Topa uma call rápida de 15 minutos esta semana pra eu te mostrar como posso liberar seu tempo da edição?",
  "Send portfolio":
    "Te mando um portfólio com cases parecidos com o seu canal — me responde aqui que envio agora.",
};

function buildMessage(lead: Lead, tone: Tone, goal: Goal) {
  const subs = formatSubs(lead.subscribers);
  const niche = lead.niche.toLowerCase();
  return `${OPENINGS[tone]} Acompanho o ${lead.name} há um tempo e o que vocês estão construindo no nicho de ${niche} com ${subs} inscritos é muito sólido — dá pra ver consistência publicando ${lead.frequency.toLowerCase()}.

Sou editor de vídeo especializado em canais de ${niche} e percebi que com pequenos ajustes de ritmo e estrutura dá pra aumentar bastante a retenção sem mudar a essência do canal.

${CLOSINGS[goal]}

Abraço,
Rafael`;
}

export function MessagePanel({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { setStatus, bumpMessages } = useLeads();
  const [tone, setTone] = useState<Tone>("Professional");
  const [goal, setGoal] = useState<Goal>("Offer editing services");
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const message = useMemo(
    () => (lead ? buildMessage(lead, tone, goal) : ""),
    // include seed so "Regenerate" can change minor variants in future
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lead?.id, tone, goal, seed],
  );

  useEffect(() => {
    if (open && lead) bumpMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead?.id]);

  if (!lead) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Outreach Message</SheetTitle>
          <SheetDescription>Personalized cold message generated for this lead.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <LeadAvatar name={lead.name} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-semibold">{lead.name}</div>
            <div className="text-xs text-muted-foreground">
              {lead.niche} · {formatSubs(lead.subscribers)} subs · {lead.frequency}
            </div>
          </div>
          <FitScoreBadge score={lead.score} size="sm" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <FieldGroup label="Tone">
            {(["Professional", "Casual", "Direct"] as Tone[]).map((t) => (
              <Pill key={t} active={tone === t} onClick={() => setTone(t)}>
                {t}
              </Pill>
            ))}
          </FieldGroup>
          <FieldGroup label="Goal">
            {(["Offer editing services", "Ask for a call", "Send portfolio"] as Goal[]).map((g) => (
              <Pill key={g} active={goal === g} onClick={() => setGoal(g)}>
                {g}
              </Pill>
            ))}
          </FieldGroup>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Message (Portuguese)
          </label>
          <textarea
            value={message}
            readOnly
            rows={12}
            className="w-full resize-none rounded-md border border-border bg-card p-4 text-sm leading-relaxed focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">{message.length} chars</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" /> Regenerate
          </button>
          <div className="flex gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              {copied ? <Check className="h-4 w-4 text-[color:var(--teal)]" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => {
                setStatus(lead.id, "Contacted");
                toast.success(`${lead.name} marked as Contacted`);
                onOpenChange(false);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" /> Mark as Contacted
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}