import { useState } from "react";
import { Eye, FileArchive, FileText, Save, X } from "lucide-react";
import { api, getErrorMessage } from "@/services/api";
import { INPUT } from "@/features/student/ui";
import { fmtDateTime, initials, type SubmissionItem } from "./types";

interface Props {
  sub: SubmissionItem;
  onClose: () => void;
  onSaved: () => void;
}

const LABEL = "mb-1.5 block text-sm font-medium text-slate-900 dark:text-white";

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
    sub.isLate ? "Late" : "",
    sub.progress !== null ? `student progress ${sub.progress}%` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const hasFile = Boolean(sub.fileUrl);
  const hasText = Boolean(sub.text);
  const FileIcon = isArchive(sub.fileName) ? FileArchive : FileText;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              {initials(sub.studentName)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900 dark:text-white">{sub.studentName}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{sub.assignmentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* File card: file thakle, ba kichui na thakle */}
          {(hasFile || !hasText) && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <FileIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900 dark:text-white">
                  {sub.fileName || "No file attached"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{meta}</p>
              </div>
              {hasFile && (
                <a
                  href={sub.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Eye className="h-4 w-4" /> View
                </a>
              )}
            </div>
          )}

          {/* Written answer */}
          {hasText && (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Written answer</label>
                {!hasFile && <span className="text-xs text-slate-500 dark:text-slate-400">{meta}</span>}
              </div>
              <div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {sub.text}
              </div>
            </div>
          )}

          <div>
            <label className={LABEL}>Score (out of {sub.totalMarks})</label>
            <input
              type="number"
              min={0}
              max={sub.totalMarks}
              className={INPUT}
              placeholder={`0 – ${sub.totalMarks}`}
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          <div>
            <label className={LABEL}>Feedback</label>
            <textarea
              maxLength={500}
              className={`${INPUT} h-[150px] resize-none`}
              placeholder="Share what worked well and what to improve…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{feedback.length}/500 characters</p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-5 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save grade"}
          </button>
        </div>
      </aside>
    </div>
  );
}