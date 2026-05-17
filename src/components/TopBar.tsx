import { Bell, Search } from "lucide-react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
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
            placeholder="Search leads, niches..."
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}