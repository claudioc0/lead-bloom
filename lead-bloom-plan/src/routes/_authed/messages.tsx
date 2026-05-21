import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageSquare, Send, Eye, Copy, Sparkles, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/TopBar";
import { LeadAvatar } from "@/components/LeadAvatar";
import { MessagePanel } from "@/components/MessagePanel";
import { filterMessagesByStatus, useMessagesQuery } from "@/hooks/useMessages";
import { formatSubs, type Lead, type Status } from "@/data/lead.types";

export const Route = createFileRoute("/_authed/messages")({
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

function MessagesPage() {
  const { data: messages = [], isLoading } = useMessagesQuery();
  const [active, setActive] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<FilterKey>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterMessagesByStatus(messages, filter),
    [messages, filter],
  );

  const copy = async (body: string, id: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedId(id);
      toast.success("Message copied");
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <TopBar title="Messages" subtitle={`${messages.length} messages drafted or sent`} />
      <main className="flex-1 p-5 md:p-8">
        <div className="mb-5 inline-flex rounded-lg border border-border bg-card p-1">
          {FILTERS.map((f) => {
            const count =
              f === "All"
                ? messages.length
                : messages.filter((m) => m.lead.status === f).length;
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
            {filtered.map((m) => (
              <article
                key={m.id}
                className={`card-lift group relative flex items-start gap-3 rounded-xl border border-l-4 border-border bg-card p-4 ${statusBorder(m.lead.status)}`}
              >
                <LeadAvatar name={m.lead.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate font-display text-base font-semibold">{m.lead.name}</div>
                    <span className="shrink-0 text-xs text-muted-foreground">{m.createdAt.slice(0, 10)}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {m.lead.niche} · {formatSubs(m.lead.subscribers)} subs
                    </span>
                    {m.lead.status === "Replied" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--teal)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--teal)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                        Reply received!
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{m.body}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <ActionBtn
                      icon={Send}
                      label="Send Follow-up"
                      onClick={() => toast.info("Follow-up automation coming soon")}
                    />
                    <ActionBtn icon={Eye} label="View Lead" onClick={() => setActive(m.lead)} />
                    <ActionBtn
                      icon={copiedId === m.id ? Check : Copy}
                      label={copiedId === m.id ? "Copied!" : "Copy Message"}
                      onClick={() => copy(m.body, m.id)}
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