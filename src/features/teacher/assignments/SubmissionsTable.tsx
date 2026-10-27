import SubmissionRow from "./SubmissionRow";
import type { SubFilter, SubmissionItem } from "./types";

interface SubmissionsTableProps {
  rows: SubmissionItem[];
  loading: boolean;
  filter: SubFilter;
  onGrade: (s: SubmissionItem) => void;
}

const emptyText = (filter: SubFilter) =>
  filter === "pending"
    ? "Nothing waiting for a grade."
    : filter === "graded"
      ? "No graded submissions yet."
      : "No submissions found.";

export default function SubmissionsTable({ rows, loading, filter, onGrade }: SubmissionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3.5 font-semibold">Student</th>
            <th className="px-4 py-3.5 font-semibold">Assignment</th>
            <th className="px-4 py-3.5 font-semibold">Submitted</th>
            <th className="px-4 py-3.5 font-semibold">Score</th>
            <th className="px-4 py-3.5 font-semibold">Status</th>
            <th className="px-4 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                Loading…
              </td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                {emptyText(filter)}
              </td>
            </tr>
          )}
          {rows.map((s) => (
            <SubmissionRow key={s.id} s={s} onGrade={() => onGrade(s)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}