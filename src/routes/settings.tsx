import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, Download, Trash2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { NICHES, type Niche } from "@/data/mockLeads";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EditorLeads" },
      { name: "description", content: "Profile, preferences and plan." },
    ],
  }),
  component: SettingsPage,
});

const PLAN_FEATURES = [
  "50 leads/month",
  "YouTube scraping",
  "AI message generation",
  "Kanban CRM board",
  "Multi-language outreach",
];

const UPGRADE_BENEFITS = [
  "Unlimited leads & teams",
  "White-label outreach",
  "Priority AI tone training",
];

function SettingsPage() {
  const [name, setName] = useState("Rafael Moura");
  const [email, setEmail] = useState("rafael@editorleads.app");
  const [specialty, setSpecialty] = useState<Niche>("Business");
  const [portfolio, setPortfolio] = useState("https://rafaeledits.com");
  const [defaultNiche, setDefaultNiche] = useState<Niche>("Business");
  const [language, setLanguage] = useState("Portuguese");
  const [tone, setTone] = useState("Professional");

  // Demo: scenario where the user is near plan cap so warning state is visible.
  const used = 45;
  const limit = 50;
  const pct = Math.round((used / limit) * 100);
  const warn = pct >= 80;

  return (
    <>
      <TopBar title="Settings" subtitle="Profile, prospecting preferences and plan." />
      <main className="flex-1 p-5 pb-32 md:p-8 md:pb-32">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Profile" className="lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name">
                <Input value={name} onChange={setName} />
              </Field>
              <Field label="Email">
                <Input value={email} onChange={setEmail} />
              </Field>
              <Field label="Editing niche specialty">
                <Select value={specialty} onChange={(v) => setSpecialty(v as Niche)} options={NICHES} />
              </Field>
              <Field label="Portfolio URL">
                <Input value={portfolio} onChange={setPortfolio} />
              </Field>
            </div>
          </Card>

          <Card title="Plan">
            <div className="flex items-center justify-between">
              <span className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Pro
              </span>
              <span className="text-xs text-muted-foreground">Renews May 28</span>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Leads used this month</span>
                <span className={warn ? "font-semibold text-[color:var(--amber)]" : "text-muted-foreground"}>
                  {used} / {limit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all ${
                    warn ? "bg-[color:var(--amber)]" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              {warn && (
                <p className="mt-1.5 text-[11px] text-[color:var(--amber)]">
                  You're close to your plan limit — consider upgrading.
                </p>
              )}
            </div>

            <ul className="mt-5 space-y-2 text-sm">
              {PLAN_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--teal)]/20 text-[color:var(--teal)]">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold">Upgrade to Agency</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {UPGRADE_BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-1.5">
                    <span className="mt-0.5 text-primary">✦</span> {b}
                  </li>
                ))}
              </ul>
              <button className="mt-3 w-full rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                See Agency plan
              </button>
            </div>
          </Card>

          <Card title="Prospecting preferences" className="lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Default niche">
                <Select value={defaultNiche} onChange={(v) => setDefaultNiche(v as Niche)} options={NICHES} />
              </Field>
              <Field label="Message language">
                <Select value={language} onChange={setLanguage} options={["Portuguese", "English", "Spanish"]} />
              </Field>
              <Field label="Tone preference">
                <Select value={tone} onChange={setTone} options={["Professional", "Casual", "Direct"]} />
              </Field>
            </div>
          </Card>

          <Card title="Danger Zone" className="lg:col-span-3 border-destructive/30">
            <p className="mb-4 text-sm text-muted-foreground">
              These actions are permanent. Export your data first if you might need it later.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toast.success("Export started — we'll email you the file")}
                className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <Download className="h-4 w-4" /> Export my data
              </button>
              <button
                onClick={() => toast.error("Account deletion requires confirmation by email")}
                className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" /> Delete account
              </button>
            </div>
          </Card>
        </div>
      </main>

      <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-background/90 px-5 py-3 backdrop-blur md:px-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Changes are saved to your account.</span>
          <button
            onClick={() => toast.success("Preferences saved")}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
    />
  );
}
function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}