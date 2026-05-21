import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Search,
  Users,
  MessageSquare,
  Settings,
  Sparkles,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { initials } from "@/data/lead.types";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/find-leads", label: "Find Leads", icon: Search },
  { to: "/my-leads", label: "My Leads", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const PLAN_LABELS = { starter: "Starter", pro: "Pro", agency: "Agency" } as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { data: profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = profile?.fullName ?? "Editor";
  const planLabel = profile ? PLAN_LABELS[profile.plan] : "Starter";
  const avatar = initials(displayName);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const logout = async () => {
    setOpen(false);
    await signOut();
    toast.success("Logged out");
    navigate({ to: "/login" });
  };

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
                      ? "sidebar-active-glow text-primary"
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

      <div ref={ref} className="relative border-t border-border p-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-display text-sm font-bold text-primary">
            {avatar}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{displayName}</div>
            <div className="truncate text-xs text-muted-foreground">{planLabel} Plan</div>
          </div>
        </button>
        {open && (
          <div className="pop-in absolute bottom-16 left-3 right-3 z-50 rounded-lg border border-border bg-popover p-1 shadow-xl">
            <PopItem icon={User} label="Profile" onClick={() => setOpen(false)} to="/settings" />
            <PopItem icon={CreditCard} label="Billing" onClick={() => setOpen(false)} to="/settings" />
            <div className="my-1 h-px bg-border" />
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function PopItem({
  icon: Icon,
  label,
  to,
  onClick,
}: {
  icon: typeof User;
  label: string;
  to: "/settings";
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-foreground hover:bg-secondary"
    >
      <Icon className="h-4 w-4 text-muted-foreground" /> {label}
    </Link>
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
