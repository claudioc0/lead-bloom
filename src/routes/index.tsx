import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { TrendingUp, MessageSquare, Send, Target, ArrowRight, Sparkles } from "lucide-react";
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

  const contacted = leads.filter((l) => l.status !== "New").length;
  const replied = leads.filter((l) => l.status === "Replied" || l.status === "Client").length;
  const responseRate = contacted > 0 ? Math.round((replied / contacted) * 100) : 0;

  const stats = [
    { label: "Leads this month", value: leads.length.toString(), icon: Target, accent: "text-primary" },
    { label: "Messages generated", value: messagesGenerated.toString(), icon: MessageSquare, accent: "text-[color:var(--teal)]" },
    { label: "Leads contacted", value: contacted.toString(), icon: Send, accent: "text-[color:var(--amber)]" },
    { label: "Est. response rate", value: `${responseRate}%`, icon: TrendingUp, accent: "text-primary" },
  ];

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
            </div>
          ))}
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Channel</th>
                  <th className="px-3 py-3 font-medium">Niche</th>
                  <th className="px-3 py-3 font-medium">Subs</th>
                  <th className="px-3 py-3 font-medium">Frequency</th>
                  <th className="px-3 py-3 font-medium">Fit</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 8).map((l) => (
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
                    <td className="px-3 py-3"><FitScoreBadge score={l.score} size="sm" /></td>
                    <td className="px-3 py-3"><StatusPill status={l.status} /></td>
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
        </section>
      </main>

      <MessagePanel lead={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </>
  );
}

function StatusPill({ status }: { status: Lead["status"] }) {
  const map: Record<Lead["status"], string> = {
    New: "bg-secondary text-muted-foreground",
    Contacted: "bg-[color:var(--amber)]/15 text-[color:var(--amber)]",
    Replied: "bg-[color:var(--teal)]/15 text-[color:var(--teal)]",
    Client: "bg-primary/15 text-primary",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>{status}</span>
  );
}
