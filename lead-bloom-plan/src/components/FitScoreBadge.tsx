import { cn } from "@/lib/utils";

export function FitScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const color =
    score >= 80
      ? "bg-[color:var(--teal)]/15 text-[color:var(--teal)] ring-[color:var(--teal)]/40"
      : score >= 50
        ? "bg-[color:var(--amber)]/15 text-[color:var(--amber)] ring-[color:var(--amber)]/40"
        : "bg-destructive/15 text-destructive ring-destructive/40";

  const dim = size === "lg" ? "h-14 w-14 text-lg" : size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";

  return (
    <div
      className={cn(
        "pulse-ring inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold ring-1",
        color,
        dim,
      )}
      aria-label={`Fit score ${score}`}
    >
      {score}
    </div>
  );
}