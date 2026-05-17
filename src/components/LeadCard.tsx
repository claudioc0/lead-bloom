import { Bookmark, MessageSquarePlus, Youtube, Check } from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/context/LeadsContext";
import { formatSubs, type Lead } from "@/data/mockLeads";
import { FitScoreBadge } from "./FitScoreBadge";
import { LeadAvatar } from "./LeadAvatar";

export function LeadCard({ lead, onGenerate }: { lead: Lead; onGenerate: (l: Lead) => void }) {
  const { saveLead, savedIds } = useLeads();
  const isSaved = savedIds.has(lead.id);

  return (
    <div className="card-lift flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <LeadAvatar name={lead.name} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-display text-base font-semibold">{lead.name}</div>
            <span
              title="YouTube channel"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-destructive/15 text-destructive"
            >
              <Youtube className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-1 inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {lead.niche}
          </div>
        </div>
        <FitScoreBadge score={lead.score} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <Stat label="Subscribers" value={formatSubs(lead.subscribers)} />
        <Stat label="Uploads/mo" value={`${lead.monthlyUploads}`} />
        <Stat label="Frequency" value={lead.frequency} />
        <Stat label="Country" value={lead.country} />
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onGenerate(lead)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <MessageSquarePlus className="h-4 w-4" /> Generate Message
        </button>
        <button
          onClick={() => {
            if (isSaved) return;
            saveLead(lead.id);
            toast.success(`${lead.name} saved to My Leads`);
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium ${
            isSaved
              ? "border-transparent bg-[color:var(--teal)] text-[color:var(--background)]"
              : "border-border bg-card text-foreground hover:bg-secondary"
          }`}
        >
          {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}