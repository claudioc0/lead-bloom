import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StickyNote } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { FitScoreBadge } from "@/components/FitScoreBadge";
import { useLeads } from "@/context/LeadsContext";
import { NICHES, type Niche, type Status, type Lead } from "@/data/mockLeads";
import { toast } from "sonner";

export const Route = createFileRoute("/my-leads")({
  head: () => ({
    meta: [
      { title: "My Leads — EditorLeads" },
      { name: "description", content: "Kanban CRM for your saved leads." },
    ],
  }),
  component: MyLeadsPage,
});

const COLUMNS: { key: Status; title: string }[] = [
  { key: "New", title: "New Leads" },
  { key: "Contacted", title: "Contacted" },
  { key: "Replied", title: "Replied" },
  { key: "Client", title: "Client" },
];

function MyLeadsPage() {
  const { leads, savedIds, setStatus, setNote } = useLeads();
  const [niche, setNiche] = useState<Niche | "All">("All");
  const [minScore, setMinScore] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      leads.filter(
        (l) => savedIds.has(l.id) && (niche === "All" || l.niche === niche) && l.score >= minScore,
      ),
    [leads, savedIds, niche, minScore],
  );

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

        <div className="grid min-w-[900px] grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const items = visible.filter((l) => l.status === col.key);
            return (
              <div
                key={col.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging) {
                    setStatus(dragging, col.key);
                    toast.success(`Moved to ${col.title}`);
                    setDragging(null);
                  }
                }}
                className="flex flex-col rounded-xl border border-border bg-card/60 p-3"
              >
                <header className="mb-3 flex items-center justify-between px-1">
                  <h3 className="font-display text-sm font-semibold">{col.title}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    {items.length}
                  </span>
                </header>
                <div className="flex flex-col gap-2">
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Drop leads here
                    </div>
                  )}
                  {items.map((l) => (
                    <KanbanCard
                      key={l.id}
                      lead={l}
                      onDragStart={() => setDragging(l.id)}
                      editingNote={editingNote === l.id}
                      onEditNote={() => setEditingNote(l.id)}
                      onSaveNote={(v) => {
                        setNote(l.id, v);
                        setEditingNote(null);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
}: {
  lead: Lead;
  onDragStart: () => void;
  editingNote: boolean;
  onEditNote: () => void;
  onSaveNote: (v: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="card-lift cursor-grab rounded-lg border border-border bg-card p-3 active:cursor-grabbing"
    >
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
          className="mt-2 w-full resize-none rounded-md border border-border bg-background p-2 text-xs"
        />
      ) : lead.note ? (
        <p className="mt-2 line-clamp-2 rounded-md bg-background/60 p-2 text-xs italic text-muted-foreground">
          “{lead.note}”
        </p>
      ) : null}

      <button
        onClick={onEditNote}
        className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
      >
        <StickyNote className="h-3 w-3" /> {lead.note ? "Edit note" : "Add note"}
      </button>
    </div>
  );
}