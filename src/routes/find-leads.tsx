import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeadCard } from "@/components/LeadCard";
import { MessagePanel } from "@/components/MessagePanel";
import { useLeads } from "@/context/LeadsContext";
import { FREQUENCIES, NICHES, type Frequency, type Lead, type Niche } from "@/data/mockLeads";

export const Route = createFileRoute("/find-leads")({
  head: () => ({
    meta: [
      { title: "Find Leads — EditorLeads" },
      { name: "description", content: "Discover YouTube channels that need a video editor." },
    ],
  }),
  component: FindLeadsPage,
});

type Language = "Portuguese" | "English" | "Spanish";
type Country = "Brazil" | "USA" | "Mexico" | "Argentina";

function FindLeadsPage() {
  const { leads } = useLeads();
  const [niche, setNiche] = useState<Niche | "All">("All");
  const [subMax, setSubMax] = useState(500);
  const [subMin, setSubMin] = useState(1);
  const [freq, setFreq] = useState<Frequency | "All">("All");
  const [language, setLanguage] = useState<Language>("Portuguese");
  const [country, setCountry] = useState<Country>("Brazil");
  const [active, setActive] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (niche !== "All" && l.niche !== niche) return false;
      if (freq !== "All" && l.frequency !== freq) return false;
      if (l.language !== language) return false;
      if (l.country !== country) return false;
      const k = l.subscribers / 1000;
      if (k < subMin || k > subMax) return false;
      return true;
    });
  }, [leads, niche, freq, subMin, subMax, language, country]);

  return (
    <>
      <TopBar title="Find Leads" subtitle="Filter, score, and reach out." />
      <main className="flex-1 p-5 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl border border-border bg-card p-4">
            <button className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Search className="h-4 w-4" /> Search Leads
            </button>

            <FilterBlock label="Niche">
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value as Niche | "All")}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="All">All niches</option>
                {NICHES.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock label={`Subscribers: ${subMin}k – ${subMax}k`}>
              <div className="space-y-2">
                <input
                  type="range"
                  min={1}
                  max={500}
                  value={subMin}
                  onChange={(e) => setSubMin(Math.min(Number(e.target.value), subMax))}
                  className="w-full accent-[color:var(--primary)]"
                />
                <input
                  type="range"
                  min={1}
                  max={500}
                  value={subMax}
                  onChange={(e) => setSubMax(Math.max(Number(e.target.value), subMin))}
                  className="w-full accent-[color:var(--primary)]"
                />
              </div>
            </FilterBlock>

            <FilterBlock label="Upload Frequency">
              <div className="flex flex-wrap gap-1.5">
                {(["All", ...FREQUENCIES] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f as Frequency | "All")}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      freq === f ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </FilterBlock>

            <FilterBlock label="Language">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option>Portuguese</option>
                <option>English</option>
                <option>Spanish</option>
              </select>
            </FilterBlock>

            <FilterBlock label="Country">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as Country)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option>Brazil</option>
                <option>USA</option>
                <option>Mexico</option>
                <option>Argentina</option>
              </select>
            </FilterBlock>
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> channels match your filters
              </p>
            </div>

            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((l) => (
                  <LeadCard key={l.id} lead={l} onGenerate={setActive} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <MessagePanel lead={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Search className="h-7 w-7" />
      </div>
      <h3 className="font-display text-lg font-semibold">No leads match these filters</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try loosening the subscriber range or switching to a broader niche to see more channels.
      </p>
    </div>
  );
}