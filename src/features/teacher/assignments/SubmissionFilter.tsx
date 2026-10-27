import { cn } from "@/lib/utils";
import type { SubFilter } from "./types";

const FILTERS: { key: SubFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "graded", label: "Graded" },
];

interface SubmissionFilterProps {
  value: SubFilter;
  onChange: (f: SubFilter) => void;
}

export default function SubmissionFilter({ value, onChange }: SubmissionFilterProps) {
  return (
    <div className="inline-flex rounded-xl bg-white p-0.5 text-[13px] shadow-sm ring-1 ring-slate-100">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            "rounded-lg px-3 py-1 font-medium",
            value === f.key ? "bg-teal-50 text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700",
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}