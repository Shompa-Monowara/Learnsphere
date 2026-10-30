import { useState } from "react";
import { ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { api, getErrorMessage } from "@/services/api";
import { BTN_OUTLINE } from "@/features/student/ui";
import { cn } from "@/lib/utils";
import {
  STATUS_CLASS,
  STATUS_LABEL,
  SUBMISSION_TYPE_LABEL,
  assignmentStatus,
  fileNameFromUrl,
  fmtDate,
  type AssignmentItem,
} from "./types";

/* ---------- View ---------- */
interface ViewProps {
  a: AssignmentItem;
  onClose: () => void;
  onEdit: () => void;
}

export function AssignmentViewModal({ a, onClose, onEdit }: ViewProps) {
  const status = assignmentStatus(a);
  const type = a.submissionType ?? "file";
  const showFileRules = type !== "text";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="pr-4">
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLASS[status])}>
              {STATUS_LABEL[status]}
            </span>
            <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{a.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{a.courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5 border-t border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Deadline" value={fmtDate(a.deadline)} />
            <Stat label="Total marks" value={String(a.totalMarks)} />
            <Stat label="Graded" value={`${a.graded}/${a.total}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Submission type" value={SUBMISSION_TYPE_LABEL[type]} />
            <Stat label="Late submissions" value={a.allowLate ? "Accepted" : "Not accepted"} />
            <Stat label="Resubmission" value={a.allowResubmission ? "Until graded" : "Not allowed"} />
            {showFileRules && (
              <Stat
                label="File rules"
                value={`${
                  a.allowedFileTypes.length > 0 ? a.allowedFileTypes.join(", ").toUpperCase() : "Any file"
                } · ${a.maxFileSizeMB} MB`}
              />
            )}
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-900 dark:text-white">Instructions</p>
            {a.instructions ? (
              <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{a.instructions}</p>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">No instructions provided.</p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-900 dark:text-white">Attachments</p>
            {a.attachments.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">No attachments.</p>
            ) : (
              <ul className="space-y-1.5">
                {a.attachments.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-teal-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-slate-700"
                    >
                      <span className="truncate">{fileNameFromUrl(url)}</span>
                      <ExternalLink className="ml-3 h-3.5 w-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button onClick={onClose} className={BTN_OUTLINE}>
            Close
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

/* ---------- Delete ---------- */
interface DeleteProps {
  a: AssignmentItem;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteAssignmentDialog({ a, onClose, onDeleted }: DeleteProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const remove = async () => {
    setBusy(true);
    setError("");
    try {
      await api.delete(`/teacher/assignments/${a.id}`);
      onDeleted();
    } catch (e) {
      setError(getErrorMessage(e));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
          <Trash2 className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Delete this assignment?</h2>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
          “{a.title}” will be permanently removed
          {a.total > 0 ? `, along with its ${a.total} submission${a.total > 1 ? "s" : ""} and grades` : ""}.
          This can’t be undone.
        </p>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className={BTN_OUTLINE} disabled={busy}>
            Cancel
          </button>
          <button
            onClick={() => void remove()}
            disabled={busy}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}