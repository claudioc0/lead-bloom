import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Copy, RefreshCw, Check, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGenerateMessage, useLeadMutations } from "@/hooks/useLeads";
import { useProfile } from "@/hooks/useProfile";
import { formatSubs, type Lead } from "@/data/lead.types";
import type { UiGoal, UiTone } from "@/lib/lead-mappers";
import { FitScoreBadge } from "./FitScoreBadge";
import { LeadAvatar } from "./LeadAvatar";

export function MessagePanel({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { data: profile } = useProfile();
  const generate = useGenerateMessage();
  const { setStatus } = useLeadMutations();
  const [tone, setTone] = useState<UiTone>("Professional");
  const [goal, setGoal] = useState<UiGoal>("Offer editing services");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile?.defaultTone) setTone(profile.defaultTone);
  }, [profile?.defaultTone]);

  useEffect(() => {
    if (open && lead) {
      runGenerate();
    } else {
      setMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead?.id]);

  const runGenerate = () => {
    if (!lead) return;
    generate.mutate(
      {
        leadId: lead.id,
        tone,
        goal,
        senderName: profile?.fullName ?? undefined,
      },
      {
        onSuccess: (data) => setMessage(data.body),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (!lead) return null;

  const copy = async () => {
    if (!message) return;
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
            {(["Professional", "Casual", "Direct"] as UiTone[]).map((t) => (
              <Pill key={t} active={tone === t} onClick={() => setTone(t)}>
                {t}
              </Pill>
            ))}
          </FieldGroup>
          <FieldGroup label="Goal">
            {(
              ["Offer editing services", "Ask for a call", "Send portfolio"] as UiGoal[]
            ).map((g) => (
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
            placeholder={generate.isPending ? "Generating…" : ""}
            className="w-full resize-none rounded-md border border-border bg-card p-4 text-sm leading-relaxed focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">{message.length} chars</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={runGenerate}
            disabled={generate.isPending}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-60"
          >
            {generate.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}{" "}
            Regenerate
          </button>
          <div className="flex gap-2">
            <button
              onClick={copy}
              disabled={!message}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-60"
            >
              {copied ? <Check className="h-4 w-4 text-[color:var(--teal)]" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => {
                setStatus.mutate(
                  { id: lead.id, status: "Contacted" },
                  {
                    onSuccess: () => {
                      toast.success(`${lead.name} marked as Contacted`);
                      onOpenChange(false);
                    },
                    onError: (err) => toast.error(err.message),
                  },
                );
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
