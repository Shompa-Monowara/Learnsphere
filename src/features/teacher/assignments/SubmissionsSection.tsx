import SubmissionFilter from "./SubmissionFilter";
import SubmissionsTable from "./SubmissionsTable";
import type { SubFilter, SubmissionItem } from "./types";

interface SubmissionsSectionProps {
  rows: SubmissionItem[];
  loading: boolean;
  filter: SubFilter;
  onFilterChange: (f: SubFilter) => void;
  selectedTitle?: string;
  onClearSelected: () => void;
  onGrade: (s: SubmissionItem) => void;
}

export default function SubmissionsSection({
  rows,
  loading,
  filter,
  onFilterChange,
  selectedTitle,
  onClearSelected,
  onGrade,
}: SubmissionsSectionProps) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">Submissions to grade</h2>
          {selectedTitle && (
            <button
              onClick={onClearSelected}
              className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700"
            >
              {selectedTitle} ✕
            </button>
          )}
        </div>
        <SubmissionFilter value={filter} onChange={onFilterChange} />
      </div>

      <SubmissionsTable rows={rows} loading={loading} filter={filter} onGrade={onGrade} />
    </section>
  );
}