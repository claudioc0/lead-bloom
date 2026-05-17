import { Bell, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NOTIFICATIONS = [
  { icon: "🔥", text: "New lead match: Canal Tech BR (Score 91)", time: "2m" },
  { icon: "💬", text: "Follow-up reminder: Tech Simplificado", time: "1h" },
  { icon: "⚡", text: "3 new channels in your niche today", time: "4h" },
];

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="flex flex-col gap-3 border-b border-border bg-background/80 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search leads, niches... (⌘K)"
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-block">
            ⌘K
          </kbd>
        </div>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          {open && (
            <div className="pop-in absolute right-0 top-11 z-50 w-80 rounded-lg border border-border bg-popover shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-sm font-semibold">Notifications</span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {NOTIFICATIONS.length} new
                </span>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map((n, i) => (
                  <li
                    key={i}
                    className="flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-secondary"
                  >
                    <span className="text-lg leading-none">{n.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{n.text}</p>
                      <span className="text-[11px] text-muted-foreground">{n.time} ago</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="block w-full rounded-b-lg px-4 py-2 text-center text-xs font-medium text-primary hover:bg-secondary">
                View all notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}