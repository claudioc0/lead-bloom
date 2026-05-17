import { initials } from "@/data/mockLeads";

export function LeadAvatar({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-sm font-semibold text-muted-foreground ring-1 ring-border"
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </div>
  );
}