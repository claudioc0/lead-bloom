import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeadAvatar } from "@/components/LeadAvatar";
import { MessagePanel } from "@/components/MessagePanel";
import { useLeads } from "@/context/LeadsContext";
import { formatSubs, type Lead } from "@/data/mockLeads";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — EditorLeads" },
      { name: "description", content: "AI-generated outreach messages." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { leads } = useLeads();
  const [active, setActive] = useState<Lead | null>(null);
  const contacted = leads.filter((l) => l.status !== "New");

  return (
    <>
      <TopBar title="Messages" subtitle="Outreach you've drafted or sent." />
      <main className="flex-1 p-5 md:p-8">
        {contacted.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {contacted.map((l) => (
              <button
                key={l.id}
                onClick={() => setActive(l)}
                className="card-lift flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left"
              >
                <LeadAvatar name={l.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate font-display text-base font-semibold">{l.name}</div>
                    <span className="text-xs text-muted-foreground">{l.addedAt}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {l.niche} · {formatSubs(l.subscribers)} subs · {l.status}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    Olá! Espero que esteja tudo bem. Acompanho o {l.name} há um tempo e o trabalho de vocês no nicho de{" "}
                    {l.niche.toLowerCase()}…
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
      <MessagePanel lead={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </>
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
        Generate a message from any lead card and it will show up here.
      </p>
    </div>
  );
}