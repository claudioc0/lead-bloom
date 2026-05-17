import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Search, Users, MessageSquare, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/find-leads", label: "Find Leads", icon: Search },
  { to: "/my-leads", label: "My Leads", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">EditorLeads</span>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-display text-sm font-bold text-primary">
            RM
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">Rafael Moura</div>
            <div className="truncate text-xs text-muted-foreground">Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="md:hidden border-b border-border bg-sidebar">
      <ul className="flex overflow-x-auto px-2 py-2">
        {NAV.map((item) => {
          const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-xs whitespace-nowrap",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}