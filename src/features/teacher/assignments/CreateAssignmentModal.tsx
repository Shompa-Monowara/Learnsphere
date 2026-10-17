import { useState } from "react";
import { Loader2, Paperclip, X } from "lucide-react";
import { api, getErrorMessage } from "@/services/api";
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui";
import { FIELD, LABEL } from "@/features/teacher/builder/ui";
import { fileNameFromUrl, toDateInput, type AssignmentItem, type CourseOption } from "./types";

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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState("");

  const marks = Number(totalMarks);
  const errs = {
    title: title.trim().length < 3 ? "Enter at least 3 characters" : "",
    course: courseId ? "" : "Select a course",
    deadline: deadline ? "" : "Pick a deadline",
    marks: Number.isFinite(marks) && marks >= 1 && marks <= 1000 ? "" : "1 – 1000",
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
      const body = {
        courseId,
        title: title.trim(),
        instructions: instructions.trim(),
        deadline,
        totalMarks: marks,
        attachments: files,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? "Edit assignment" : "Create assignment"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Set the brief, deadline, and total marks.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 border-t border-slate-100 px-6 py-5">
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
              className={`${FIELD} ${ring(errs.course)} disabled:bg-slate-50 disabled:text-slate-500`}
              value={courseId}
              disabled={editing}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.length === 0 && <option value="">No courses yet</option>}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={LABEL}>Deadline</label>
              <input
                type="date"
                className={`${FIELD} ${ring(errs.deadline)}`}
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
                className={`${FIELD} flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:bg-slate-50`}
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
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="truncate text-slate-700">{f.name}</span>
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

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className={BTN_OUTLINE} disabled={saving}>
            Cancel
          </button>
          <button onClick={() => void submit()} className={BTN_PRIMARY} disabled={saving || uploading}>
            {saving ? "Saving…" : editing ? "Save changes" : "Create assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}