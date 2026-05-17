import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Send,
  Target,
  ArrowRight,
  Sparkles,
  Search,
  Users,
  ArrowUpDown,
  Inbox,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { FitScoreBadge } from "@/components/FitScoreBadge";
import { LeadAvatar } from "@/components/LeadAvatar";
import { MessagePanel } from "@/components/MessagePanel";
import { useLeads } from "@/context/LeadsContext";
import { formatSubs, type Lead } from "@/data/mockLeads";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — EditorLeads" },
      { name: "description", content: "Find clients, generate outreach, track replies." },
    ],
  }),
  component: Index,
});

function Index() {
  const { leads, messagesGenerated } = useLeads();
  const [active, setActive] = useState<Lead | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const contacted = leads.filter((l) => l.status !== "New").length;
  const replied = leads.filter((l) => l.status === "Replied" || l.status === "Client").length;
  const responseRate = contacted > 0 ? Math.round((replied / contacted) * 100) : 0;

  const usedLeads = leads.length;
  const planLimit = 50;

  const stats = [
    {
      label: "Leads This Month",
      value: usedLeads.toString(),
      icon: Target,
      accent: "text-primary",
      trend: { dir: "up" as const, pct: 18 },
      progress: { used: usedLeads, limit: planLimit },
    },
    {
      label: "Messages Generated",
      value: messagesGenerated.toString(),
      icon: MessageSquare,
      accent: "text-[color:var(--teal)]",
      trend: { dir: "up" as const, pct: 32 },
    },
    {
      label: "Leads Contacted",
      value: contacted.toString(),
      icon: Send,
      accent: "text-[color:var(--amber)]",
      trend: { dir: "down" as const, pct: 4 },
    },
    {
      label: "Est. Response Rate",
      value: `${responseRate}%`,
      icon: TrendingUp,
      accent: "text-primary",
      trend: { dir: "up" as const, pct: 6 },
    },
  ];

  const sorted = useMemo(
    () => [...leads].sort((a, b) => (sortAsc ? a.score - b.score : b.score - a.score)).slice(0, 8),
    [leads, sortAsc],
  );

  return (
    <>
      <TopBar title="Dashboard" subtitle="Your prospecting at a glance" />
      <main className="flex-1 p-5 md:p-8">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-lift rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                {s.trend.dir === "up" ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[color:var(--teal)]/15 px-1.5 py-0.5 font-medium text-[color:var(--teal)]">
                    <TrendingUp className="h-3 w-3" /> {s.trend.pct}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/15 px-1.5 py-0.5 font-medium text-destructive">
                    <TrendingDown className="h-3 w-3" /> {s.trend.pct}%
                  </span>
                )}
                <span className="text-muted-foreground">vs last month</span>
              </div>
              {s.progress && (
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>Plan usage</span>
                    <span>
                      {s.progress.used}/{s.progress.limit}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min((s.progress.used / s.progress.limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <QuickAction to="/find-leads" icon={Search} label="Find New Leads" tone="primary" />
          <QuickAction to="/messages" icon={MessageSquare} label="Generate Message" tone="teal" />
          <QuickAction to="/my-leads" icon={Users} label="View Pipeline" tone="amber" />
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Recent leads</h2>
              <p className="text-xs text-muted-foreground">Latest matches from your last search.</p>
            </div>
            <Link
              to="/find-leads"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="h-3.5 w-3.5" /> Find more leads
            </Link>
          </header>

          {sorted.length === 0 ? (
            <EmptyTable />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Channel</th>
                    <th className="px-3 py-3 font-medium">Niche</th>
                    <th className="px-3 py-3 font-medium">Subs</th>
                    <th className="px-3 py-3 font-medium">Frequency</th>
                    <th className="px-3 py-3 font-medium">
                      <button
                        onClick={() => setSortAsc((v) => !v)}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        Score
                        <ArrowUpDown className={`h-3 w-3 transition-transform ${sortAsc ? "rotate-180" : ""}`} />
                      </button>
                    </th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((l) => (
                    <tr key={l.id} className="border-t border-border hover:bg-secondary/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <LeadAvatar name={l.name} size={36} />
                          <span className="font-medium">{l.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{l.niche}</td>
                      <td className="px-3 py-3">{formatSubs(l.subscribers)}</td>
                      <td className="px-3 py-3 text-muted-foreground">{l.frequency}</td>
                      <td className="px-3 py-3">
                        <FitScoreBadge score={l.score} size="sm" />
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={l.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setActive(l)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary"
                        >
                          Generate <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <MessagePanel lead={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
  tone,
}: {
  to: "/find-leads" | "/messages" | "/my-leads";
  icon: typeof Search;
  label: string;
  tone: "primary" | "teal" | "amber";
}) {
  const color =
    tone === "primary"
      ? "text-primary bg-primary/10 group-hover:bg-primary/20"
      : tone === "teal"
        ? "text-[color:var(--teal)] bg-[color:var(--teal)]/10 group-hover:bg-[color:var(--teal)]/20"
        : "text-[color:var(--amber)] bg-[color:var(--amber)]/10 group-hover:bg-[color:var(--amber)]/20";
  return (
    <Link
      to={to}
      className="card-lift group flex items-center justify-between rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-display text-sm font-semibold">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function StatusPill({ status }: { status: Lead["status"] }) {
  const map: Record<Lead["status"], string> = {
    New: "bg-secondary text-muted-foreground",
    Contacted: "bg-[color:var(--amber)]/15 text-[color:var(--amber)]",
    Replied: "bg-[color:var(--teal)]/15 text-[color:var(--teal)]",
    Client: "bg-primary/15 text-primary",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>{status}</span>;
}

function EmptyTable() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="font-display text-base font-semibold">No recent leads yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Run a search and your most promising matches will show up here.
      </p>
      <Link
        to="/find-leads"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Sparkles className="h-3.5 w-3.5" /> Find leads
      </Link>
    </div>
  );
}