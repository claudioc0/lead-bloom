import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageSquare, Send, Eye, Copy, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/TopBar";
import { LeadAvatar } from "@/components/LeadAvatar";
import { MessagePanel } from "@/components/MessagePanel";
import { useLeads } from "@/context/LeadsContext";
import { formatSubs, type Lead, type Status } from "@/data/mockLeads";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — EditorLeads" },
      { name: "description", content: "AI-generated outreach messages." },
    ],
  }),
  component: MessagesPage,
});

type FilterKey = "All" | "Contacted" | "Replied" | "Client";
const FILTERS: FilterKey[] = ["All", "Contacted", "Replied", "Client"];

function statusBorder(status: Status) {
  if (status === "Contacted") return "border-l-primary";
  if (status === "Replied") return "border-l-[color:var(--teal)]";
  if (status === "Client") return "border-l-emerald-400";
  return "border-l-border";
}

const PREVIEW = (l: Lead) =>
  `Olá! Espero que esteja tudo bem com você. Acompanho o ${l.name} há um tempo e o que vocês estão construindo no nicho de ${l.niche.toLowerCase()} com ${formatSubs(l.subscribers)} inscritos é muito sólido — dá pra ver consistência publicando ${l.frequency.toLowerCase()}. Sou editor de vídeo especializado em canais de ${l.niche.toLowerCase()} e percebi que com pequenos ajustes de ritmo e estrutura dá pra aumentar bastante a retenção sem mudar a essência do canal.`;

function MessagesPage() {
  const { leads } = useLeads();
  const [active, setActive] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<FilterKey>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const all = useMemo(() => leads.filter((l) => l.status !== "New"), [leads]);
  const filtered = filter === "All" ? all : all.filter((l) => l.status === filter);

  const copy = async (l: Lead) => {
    try {
      await navigator.clipboard.writeText(PREVIEW(l));
      setCopiedId(l.id);
      toast.success("Message copied");
      setTimeout(() => setCopiedId((c) => (c === l.id ? null : c)), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <>
      <TopBar title="Messages" subtitle={`${all.length} messages drafted or sent`} />
      <main className="flex-1 p-5 md:p-8">
        <div className="mb-5 inline-flex rounded-lg border border-border bg-card p-1">
          {FILTERS.map((f) => {
            const count = f === "All" ? all.length : all.filter((l) => l.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    filter === f ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {filtered.map((l) => (
              <article
                key={l.id}
                className={`card-lift group relative flex items-start gap-3 rounded-xl border border-l-4 border-border bg-card p-4 ${statusBorder(l.status)}`}
              >
                <LeadAvatar name={l.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate font-display text-base font-semibold">{l.name}</div>
                    <span className="shrink-0 text-xs text-muted-foreground">{l.addedAt}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {l.niche} · {formatSubs(l.subscribers)} subs
                    </span>
                    {l.status === "Replied" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--teal)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--teal)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                        Reply received!
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{PREVIEW(l)}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <ActionBtn
                      icon={Send}
                      label="Send Follow-up"
                      onClick={() => toast.success(`Follow-up queued for ${l.name}`)}
                    />
                    <ActionBtn icon={Eye} label="View Lead" onClick={() => setActive(l)} />
                    <ActionBtn
                      icon={copiedId === l.id ? Check : Copy}
                      label={copiedId === l.id ? "Copied!" : "Copy Message"}
                      onClick={() => copy(l)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <MessagePanel lead={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Send;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MessageSquare className="h-7 w-7" />
      </div>
      <h3 className="font-display text-lg font-semibold">No outreach yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Generate a personalized cold message and it will show up here for follow-ups.
      </p>
      <Link
        to="/find-leads"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Sparkles className="h-3.5 w-3.5" /> Generate your first message
      </Link>
    </div>
  );
}