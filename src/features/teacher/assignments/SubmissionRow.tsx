import { cn } from "@/lib/utils";
import { fmtDateTime, initials, type SubmissionItem } from "./types";

interface SubmissionRowProps {
  s: SubmissionItem;
  onGrade: () => void;
}

export default function SubmissionRow({ s, onGrade }: SubmissionRowProps) {
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
            {initials(s.studentName)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{s.studentName}</p>
            <p className="text-xs text-slate-500">{s.studentEmail}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-slate-800">{s.assignmentTitle}</p>
        {s.fileName && <p className="text-xs text-slate-400">{s.fileName}</p>}
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{fmtDateTime(s.submittedAt)}</td>
      <td className="px-4 py-3 font-bold text-slate-900">
        {s.score === null ? <span className="font-normal text-slate-300">—</span> : `${s.score}/${s.totalMarks}`}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            s.graded ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600",
          )}
        >
          {s.graded ? "Graded" : "Pending"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={onGrade}
          className={
            s.graded
              ? "rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              : "rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
          }
        >
          {s.graded ? "Edit grade" : "Grade"}
        </button>
      </td>
    </tr>
  );
}