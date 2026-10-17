import { useState } from "react";
import { Eye, FileArchive, FileText, Save, X } from "lucide-react";
import { api, getErrorMessage } from "@/services/api";
import { BTN_PRIMARY } from "@/features/student/ui";
import { FIELD, LABEL } from "@/features/teacher/builder/ui";
import { fmtDateTime, initials, type SubmissionItem } from "./types";

interface Props {
  sub: SubmissionItem;
  onClose: () => void;
  onSaved: () => void;
}

const isArchive = (name: string) => /\.(zip|rar|7z|tar|gz)$/i.test(name);

export default function GradeDrawer({ sub, onClose, onSaved }: Props) {
  const [score, setScore] = useState(sub.score === null ? "" : String(sub.score));
  const [feedback, setFeedback] = useState(sub.feedback);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const n = Number(score);
  const bad = score === "" || !Number.isFinite(n) || n < 0 || n > sub.totalMarks;

  const save = async () => {
    if (bad) {
      setError(`Enter a score between 0 and ${sub.totalMarks}`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.patch(`/teacher/submissions/${sub.id}/grade`, { score: n, feedback });
      onSaved();
    } catch (e) {
      setError(getErrorMessage(e));
      setSaving(false);
    }
  };

  const meta = [
    fmtDateTime(sub.submittedAt),
    sub.progress !== null ? `student progress ${sub.progress}%` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const FileIcon = isArchive(sub.fileName) ? FileArchive : FileText;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
              {initials(sub.studentName)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900">{sub.studentName}</p>
              <p className="truncate text-xs text-slate-500">{sub.assignmentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <FileIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-slate-900">{sub.fileName || "No file attached"}</p>
              <p className="text-xs text-slate-500">{meta}</p>
            </div>
            {sub.fileUrl && (
              <a
                href={sub.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" /> View
              </a>
            )}
          </div>

          {sub.text && (
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{sub.text}</p>
          )}

          <div>
            <label className={LABEL}>Score (out of {sub.totalMarks})</label>
            <input
              type="number"
              min={0}
              max={sub.totalMarks}
              className={FIELD}
              placeholder={`0 – ${sub.totalMarks}`}
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          <div>
            <label className={LABEL}>Feedback</label>
            <textarea
              rows={6}
              maxLength={500}
              className={FIELD}
              placeholder="Share what worked well and what to improve…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-slate-400">{feedback.length}/500 characters</p>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Cancel
          </button>
          <button onClick={() => void save()} disabled={saving} className={`${BTN_PRIMARY} gap-2`}>
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save grade"}
          </button>
        </div>
      </aside>
    </div>
  );
}