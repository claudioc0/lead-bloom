export type Niche =
  | "Tech"
  | "Lifestyle"
  | "Business"
  | "Fitness"
  | "Education"
  | "Gaming"
  | "Finance"
  | "Food";

export type Frequency = "Daily" | "2-3x week" | "Weekly" | "Irregular";
export type Status = "New" | "Contacted" | "Replied" | "Client";

export type Lead = {
  id: string;
  name: string;
  niche: Niche;
  subscribers: number;
  frequency: Frequency;
  monthlyUploads: number;
  score: number;
  status: Status;
  language: "Portuguese" | "English" | "Spanish";
  country: "Brazil" | "USA" | "Mexico" | "Argentina";
  note?: string;
  addedAt: string;
  isSaved?: boolean;
};

export const NICHES: Niche[] = [
  "Tech",
  "Lifestyle",
  "Business",
  "Fitness",
  "Education",
  "Gaming",
  "Finance",
  "Food",
];

export const FREQUENCIES: Frequency[] = ["Daily", "2-3x week", "Weekly", "Irregular"];

export function formatSubs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `${n}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
