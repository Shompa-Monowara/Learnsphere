import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Paperclip, X } from "lucide-react";
import { api, getErrorMessage } from "@/services/api";
import { cn } from "@/lib/utils";
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui";
import { FIELD, LABEL } from "@/features/teacher/builder/ui";
import {
  SUBMISSION_TYPE_OPTIONS,
  fileNameFromUrl,
  toDateInput,
  type AssignmentItem,
  type CourseOption,
  type SubmissionType,
} from "./types";

/* Upload route jodi alada hoy, shudhu ei line ta bodlao */
const UPLOAD_PATH = "/upload";
const INVALID = "ring-1 ring-red-400";

interface Props {
  courses: CourseOption[];
  /* thakle Edit mode, na thakle Create mode */
  initial?: AssignmentItem | null;
  onClose: () => void;
  onSaved: () => void;
}

interface Attachment {
  name: string;
  url: string;
}

interface CheckProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  hint: string;
}

function Check({ checked, onChange, title, hint }: CheckProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 px-3 py-2.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-teal-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-slate-900 dark:text-white">{title}</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">{hint}</span>
      </span>
    </label>
  );
}

export default function CreateAssignmentModal({ courses, initial, onClose, onSaved }: Props) {
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [courseId, setCourseId] = useState(initial?.courseId ?? courses[0]?.id ?? "");
  const [deadline, setDeadline] = useState(toDateInput(initial?.deadline ?? null));
  const [totalMarks, setTotalMarks] = useState(String(initial?.totalMarks ?? 100));
  const [files, setFiles] = useState<Attachment[]>(
    (initial?.attachments ?? []).map((url) => ({ name: fileNameFromUrl(url), url })),
  );

  const [submissionType, setSubmissionType] = useState<SubmissionType>(initial?.submissionType ?? "file");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [allowLate, setAllowLate] = useState(initial?.allowLate ?? true);
  const [allowResubmission, setAllowResubmission] = useState(initial?.allowResubmission ?? true);
  const [fileTypes, setFileTypes] = useState((initial?.allowedFileTypes ?? []).join(", "));
  const [maxSize, setMaxSize] = useState(String(initial?.maxFileSizeMB ?? 50));

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState("");

  /* Student submit korar por type bodlano jabe na (backend o block kore) */
  const lockedType = editing && (initial?.total ?? 0) > 0;
  const needsFile = submissionType !== "text";

  const marks = Number(totalMarks);
  const size = Number(maxSize);
  const errs = {
    title: title.trim().length < 3 ? "Enter at least 3 characters" : "",
    course: courseId ? "" : "Select a course",
    deadline: deadline ? "" : "Pick a deadline",
    marks: Number.isFinite(marks) && marks >= 1 && marks <= 1000 ? "" : "1 – 1000",
    size: !needsFile || (Number.isFinite(size) && size >= 1 && size <= 100) ? "" : "1 – 100 MB",
  };
  const invalid = Object.values(errs).some(Boolean);

  const pick = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const added: Attachment[] = [];
      for (const f of Array.from(list)) {
        const fd = new FormData();
        fd.append("file", f);
        const res = await api.post<{ url: string }>(UPLOAD_PATH, fd);
        added.push({ name: f.name, url: res.data.url });
      }
      setFiles((prev) => [...prev, ...added]);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    setShowErrors(true);
    if (invalid) return;
    setSaving(true);
    setError("");
    try {
      const allowedFileTypes = needsFile
        ? fileTypes
            .split(",")
            .map((s) => s.trim().replace(/^\./, "").toLowerCase())
            .filter(Boolean)
        : [];
      const body = {
        courseId,
        title: title.trim(),
        instructions: instructions.trim(),
        deadline,
        totalMarks: marks,
        attachments: files,
        submissionType,
        isPublished,
        allowLate,
        allowResubmission,
        allowedFileTypes,
        maxFileSizeMB: needsFile ? size : 50,
      };
      if (initial) await api.put(`/teacher/assignments/${initial.id}`, body);
      else await api.post("/teacher/assignments", body);
      onSaved();
    } catch (e) {
      setError(getErrorMessage(e));
      setSaving(false);
    }
  };

  const ring = (msg: string) => (showErrors && msg ? INVALID : "");

  /* Teacher er kono course nai: form na dekhiye age course banate bolo */
  if (courses.length === 0 && !editing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create a course first</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Assignments belong to a course. Build your first course, then come back to add assignments.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button onClick={onClose} className={BTN_OUTLINE}>
              Close
            </button>
            <Link to="/teacher/builder" className={BTN_PRIMARY}>
              Go to Course Builder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editing ? "Edit assignment" : "Create assignment"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Set the brief, how students submit, deadline, and total marks.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 border-t border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <label className={LABEL}>Title</label>
            <input
              className={`${FIELD} ${ring(errs.title)}`}
              placeholder="e.g. Build a responsive dashboard layout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {showErrors && errs.title && <p className="mt-1 text-xs text-red-500">{errs.title}</p>}
          </div>

          <div>
            <label className={LABEL}>Course</label>
            <select
              className={`${FIELD} ${ring(errs.course)} disabled:bg-slate-50 disabled:text-slate-500 dark:disabled:bg-slate-800`}
              value={courseId}
              disabled={editing}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {showErrors && errs.course && <p className="mt-1 text-xs text-red-500">{errs.course}</p>}
          </div>

          <div>
            <label className={LABEL}>Instructions</label>
            <textarea
              rows={4}
              className={FIELD}
              placeholder="Describe what students should submit…"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* Submission type */}
          <div>
            <label className={LABEL}>How will students submit?</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SUBMISSION_TYPE_OPTIONS.map((o) => {
                const active = submissionType === o.value;
                return (
                  <button
                    type="button"
                    key={o.value}
                    disabled={lockedType}
                    onClick={() => setSubmissionType(o.value)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
                      active
                        ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500/30 dark:bg-teal-500/10"
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
                    )}
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{o.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{o.hint}</p>
                  </button>
                );
              })}
            </div>
            {lockedType && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Locked because students have already submitted work.
              </p>
            )}
          </div>

          {/* File rules (written-only hole lagbe na) */}
          {needsFile && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
              <div>
                <label className={LABEL}>Allowed file types</label>
                <input
                  className={FIELD}
                  placeholder="pdf, zip, docx  (leave empty for any)"
                  value={fileTypes}
                  onChange={(e) => setFileTypes(e.target.value)}
                />
              </div>
              <div>
                <label className={LABEL}>Max size (MB)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className={`${FIELD} ${ring(errs.size)}`}
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                />
                {showErrors && errs.size && <p className="mt-1 text-xs text-red-500">{errs.size}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={LABEL}>Deadline</label>
              <input
                type="date"
                className={`${FIELD} ${ring(errs.deadline)} dark:[color-scheme:dark]`}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              {showErrors && errs.deadline && (
                <p className="mt-1 text-xs text-red-500">{errs.deadline}</p>
              )}
            </div>
            <div>
              <label className={LABEL}>Total marks</label>
              <input
                type="number"
                min={1}
                max={1000}
                className={`${FIELD} ${ring(errs.marks)}`}
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
              {showErrors && errs.marks && <p className="mt-1 text-xs text-red-500">{errs.marks}</p>}
            </div>
            <div>
              <label className={LABEL}>Attachments</label>
              <label
                className={`${FIELD} flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800`}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Paperclip className="h-4 w-4" />
                )}
                <span className="truncate">{uploading ? "Uploading…" : "Add files"}</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    void pick(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <ul className="space-y-1.5">
              {files.map((f, i) => (
                <li
                  key={f.url}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
                >
                  <span className="truncate text-slate-700 dark:text-slate-200">{f.name}</span>
                  <button
                    onClick={() => setFiles((p) => p.filter((_, x) => x !== i))}
                    className="ml-3 text-slate-400 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Policies */}
          <div className="space-y-2">
            <Check
              checked={allowLate}
              onChange={setAllowLate}
              title="Accept late submissions"
              hint="Late work is flagged for you. Turn off to close submissions at the deadline."
            />
            <Check
              checked={allowResubmission}
              onChange={setAllowResubmission}
              title="Allow resubmission"
              hint="Students can replace their work until you grade it."
            />
            <Check
              checked={isPublished}
              onChange={setIsPublished}
              title="Publish to students"
              hint="Enrolled students are notified. Leave off to save as a draft."
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button onClick={onClose} className={BTN_OUTLINE} disabled={saving}>
            Cancel
          </button>
          <button onClick={() => void submit()} className={BTN_PRIMARY} disabled={saving || uploading}>
            {saving
              ? "Saving…"
              : editing
                ? "Save changes"
                : isPublished
                  ? "Create assignment"
                  : "Save as draft"}
          </button>
        </div>
      </div>
    </div>
  );
}