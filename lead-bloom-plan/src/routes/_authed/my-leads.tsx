import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StickyNote, GripVertical, Pencil, Trash2, Inbox, Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { FitScoreBadge } from "@/components/FitScoreBadge";
import { useLeadsQuery, useLeadMutations } from "@/hooks/useLeads";
import { NICHES, type Niche, type Status, type Lead } from "@/data/lead.types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/my-leads")({
  head: () => ({
    meta: [
      { title: "My Leads — EditorLeads" },
      { name: "description", content: "Kanban CRM for your saved leads." },
    ],
  }),
  component: MyLeadsPage,
});

const COLUMNS: { key: Status; title: string; countClass: string }[] = [
  { key: "New", title: "New Leads", countClass: "bg-secondary text-muted-foreground" },
  { key: "Contacted", title: "Contacted", countClass: "bg-primary/15 text-primary" },
  { key: "Replied", title: "Replied", countClass: "bg-[color:var(--teal)]/15 text-[color:var(--teal)]" },
  { key: "Client", title: "Client", countClass: "bg-emerald-500/15 text-emerald-400" },
];

function scoreBorder(score: number) {
  if (score >= 80) return "border-l-[color:var(--teal)]";
  if (score >= 50) return "border-l-[color:var(--amber)]";
  return "border-l-destructive";
}

function MyLeadsPage() {
  const { data: leads = [], isLoading } = useLeadsQuery({ savedOnly: true });
  const { setStatus, setNote, removeFromBoard } = useLeadMutations();
  const [niche, setNiche] = useState<Niche | "All">("All");
  const [minScore, setMinScore] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const visible = useMemo(
    () => leads.filter((l) => (niche === "All" || l.niche === niche) && l.score >= minScore),
    [leads, niche, minScore],
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <TopBar title="My Leads" subtitle="Drag cards across columns to update status." />
      <main className="flex-1 overflow-x-auto p-5 md:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Filter</span>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value as Niche | "All")}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          >
            <option value="All">All niches</option>
            {NICHES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Min score: <span className="font-semibold text-foreground">{minScore}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-40 accent-[color:var(--primary)]"
            />
          </label>
        </div>

        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
            <Inbox className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Save leads from Find Leads to see them here.</p>
            <Link
              to="/find-leads"
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Find leads
            </Link>
          </div>
        ) : (
          <div className="grid min-w-[900px] grid-cols-4 gap-4">
            {COLUMNS.map((col) => {
              const items = visible.filter((l) => l.status === col.key);
              return (
                <div
                  key={col.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragging) {
                      setStatus.mutate(
                        { id: dragging, status: col.key },
                        {
                          onSuccess: () => toast.success(`Moved to ${col.title}`),
                          onError: (err) => toast.error(err.message),
                        },
                      );
                      setDragging(null);
                    }
                  }}
                  className="flex flex-col rounded-xl border border-border bg-card/60 p-3"
                >
                  <header className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-semibold">{col.title}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${col.countClass}`}>
                        {items.length}
                      </span>
                    </div>
                  </header>
                  <div className="flex flex-col gap-2">
                    {items.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                        <Inbox className="h-5 w-5" />
                        Drag leads here
                      </div>
                    )}
                    {items.map((l) => (
                      <KanbanCard
                        key={l.id}
                        lead={l}
                        onDragStart={() => setDragging(l.id)}
                        editingNote={editingNote === l.id}
                        onEditNote={() => setEditingNote((id) => (id === l.id ? null : l.id))}
                        onSaveNote={(v) => {
                          setNote.mutate({ id: l.id, note: v });
                          setEditingNote(null);
                        }}
                        onRemove={() => {
                          removeFromBoard.mutate(l.id, {
                            onSuccess: () => toast.success(`${l.name} removed from board`),
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function KanbanCard({
  lead,
  onDragStart,
  editingNote,
  onEditNote,
  onSaveNote,
  onRemove,
}: {
  lead: Lead;
  onDragStart: () => void;
  editingNote: boolean;
  onEditNote: () => void;
  onSaveNote: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`card-lift group relative cursor-grab rounded-lg border border-l-4 border-border bg-card p-3 pl-2 active:cursor-grabbing ${scoreBorder(lead.score)}`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold">{lead.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{lead.niche}</div>
            </div>
            <FitScoreBadge score={lead.score} size="sm" />
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">Added {lead.addedAt}</div>

          {editingNote ? (
            <textarea
              autoFocus
              defaultValue={lead.note ?? ""}
              onBlur={(e) => onSaveNote(e.target.value)}
              rows={3}
              placeholder="Write a note..."
              className="mt-2 w-full resize-none rounded-md border border-border bg-background p-2 text-xs focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          ) : lead.note ? (
            <p className="mt-2 line-clamp-2 rounded-md bg-background/60 p-2 text-xs italic text-muted-foreground">
              “{lead.note}”
            </p>
          ) : (
            <button
              onClick={onEditNote}
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
            >
              <StickyNote className="h-3 w-3" /> Add note
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        <button
          onClick={onEditNote}
          title="Edit note"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-primary"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRemove}
          title="Remove"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}


