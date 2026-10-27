import AssignmentCard from "./AssignmentCard";
import type { AssignmentItem } from "./types";

interface AssignmentGridProps {
  assignments: AssignmentItem[];
  loading: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onView: (a: AssignmentItem) => void;
  onEdit: (a: AssignmentItem) => void;
  onDelete: (a: AssignmentItem) => void;
}

const GRID = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

export default function AssignmentGrid({
  assignments,
  loading,
  selected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: AssignmentGridProps) {
  if (loading) {
    return (
      <div className={GRID}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <p className="font-semibold text-slate-900">No assignments yet</p>
        <p className="mt-1 text-sm text-slate-500">Create your first assignment to start collecting work.</p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {assignments.map((a) => (
        <AssignmentCard
          key={a.id}
          a={a}
          selected={selected === a.id}
          onToggle={() => onSelect(selected === a.id ? null : a.id)}
          onView={() => onView(a)}
          onEdit={() => onEdit(a)}
          onDelete={() => onDelete(a)}
        />
      ))}
    </div>
  );
}