import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { NICHES, type Niche } from "@/data/mockLeads";
import { useLeads } from "@/context/LeadsContext";
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

function SettingsPage() {
  const { leads } = useLeads();
  const [name, setName] = useState("Rafael Moura");
  const [email, setEmail] = useState("rafael@editorleads.app");
  const [specialty, setSpecialty] = useState<Niche>("Business");
  const [portfolio, setPortfolio] = useState("https://rafaeledits.com");
  const [defaultNiche, setDefaultNiche] = useState<Niche>("Business");
  const [language, setLanguage] = useState("Portuguese");
  const [tone, setTone] = useState("Professional");

  const used = leads.length;
  const limit = 50;
  const pct = Math.round((used / limit) * 100);

  return (
    <>
      <TopBar title="Settings" subtitle="Profile, prospecting preferences and plan." />
      <main className="flex-1 p-5 md:p-8">
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
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Leads used this month</span>
                <span>
                  {used} / {limit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
            <button className="mt-5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary">
              Manage subscription
            </button>
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
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => toast.success("Preferences saved")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Save changes
              </button>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
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
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
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