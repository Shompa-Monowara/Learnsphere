import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "@/services/api";
import { BTN_PRIMARY } from "@/features/student/ui";
import PageHeader from "@/features/student/components/PageHeader";
import { cn } from "@/lib/utils";
import CreateAssignmentModal from "@/features/teacher/assignments/CreateAssignmentModal";
import {
  AssignmentViewModal,
  DeleteAssignmentDialog,
} from "@/features/teacher/assignments/AssignmentDialogs";
import GradeDrawer from "@/features/teacher/assignments/GradeDrawer";
import {
  STATUS_CLASS,
  STATUS_LABEL,
  SUBMISSION_TYPE_LABEL,
  assignmentStatus,
  fmtDate,
  fmtDateTime,
  initials,
  type AssignmentItem,
  type CourseOption,
  type SubFilter,
  type SubmissionItem,
} from "@/features/teacher/assignments/types";

interface Loaded {
  assignments: AssignmentItem[];
  courses: CourseOption[];
  subs: SubmissionItem[];
}

const FILTERS: { key: SubFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "graded", label: "Graded" },
];

/* Design er square-pen icon. Inline SVG, tai lucide version e nirbhor kore na */
function CardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
  );
}

export default function TeacherAssignments() {
  const [data, setData] = useState<Loaded>({ assignments: [], courses: [], subs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  const [filter, setFilter] = useState<SubFilter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AssignmentItem | null>(null);
  const [viewing, setViewing] = useState<AssignmentItem | null>(null);
  const [deleting, setDeleting] = useState<AssignmentItem | null>(null);
  const [grading, setGrading] = useState<SubmissionItem | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.get<{ assignments: AssignmentItem[]; courses: CourseOption[] }>("/teacher/assignments"),
      api.get<{ submissions: SubmissionItem[] }>("/teacher/submissions"),
    ])
      .then(([a, s]) => {
        if (!alive) return;
        setData({
          assignments: a.data.assignments ?? [],
          courses: a.data.courses ?? [],
          subs: s.data.submissions ?? [],
        });
        setError("");
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(getErrorMessage(e));
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };
  const reload = () => setTick((t) => t + 1);

  const rows = useMemo(
    () =>
      data.subs.filter((s) => {
        if (selected && s.assignmentId !== selected) return false;
        if (filter === "pending") return !s.graded;
        if (filter === "graded") return s.graded;
        return true;
      }),
    [data.subs, filter, selected],
  );

  const selectedTitle = data.assignments.find((a) => a.id === selected)?.title;

  return (
    <div className="space-y-6">
      <PageHeader
        crumb={["Assignments"]}
        title="Assignments"
        subtitle="Create assignments, review submissions, and return grades with feedback."
        action={
          <button className={cn(BTN_PRIMARY, "gap-2")} onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Create assignment
          </button>
        }
      />

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {/* Course nai: age course banate bolo */}
      {!loading && !error && data.courses.length === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>You need a course before you can create assignments.</p>
          <Link to="/teacher/builder" className="font-semibold underline">
            Go to Course Builder
          </Link>
        </div>
      )}

      {/* Assignment cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : data.assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="font-semibold text-slate-900">No assignments yet</p>
          <p className="mt-1 text-sm text-slate-500">Create your first assignment to start collecting work.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.assignments.map((a) => {
            const on = selected === a.id;
            const st = assignmentStatus(a);
            return (
              <div
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(on ? null : a.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelected(on ? null : a.id);
                }}
                className={cn(
                  "group cursor-pointer rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md",
                  on && "ring-2 ring-teal-500",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <CardIcon />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* hover e dekhay (mobile e sobsomoy) */}
                    <div className="flex items-center gap-0.5 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                      <IconBtn label="View" onClick={() => setViewing(a)} icon={<Eye className="h-3.5 w-3.5" />} />
                      <IconBtn label="Edit" onClick={() => setEditing(a)} icon={<Pencil className="h-3.5 w-3.5" />} />
                      <IconBtn
                        label="Delete"
                        danger
                        onClick={() => setDeleting(a)}
                        icon={<Trash2 className="h-3.5 w-3.5" />}
                      />
                    </div>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLASS[st])}>
                      {STATUS_LABEL[st]}
                    </span>
                  </div>
                </div>

                <p className="mt-3 line-clamp-1 text-sm font-bold text-slate-900">{a.title}</p>
                <p className="line-clamp-1 text-xs text-slate-500">{a.courseTitle}</p>
                <p className="mt-1 text-[11px] font-medium text-teal-700">
                  {SUBMISSION_TYPE_LABEL[a.submissionType ?? "file"]}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>
                    {a.graded}/{a.total} graded
                  </span>
                  <span>Due {fmtDate(a.deadline)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submissions */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Submissions to grade</h2>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700"
              >
                {selectedTitle} ✕
              </button>
            )}
          </div>
          <div className="inline-flex rounded-xl bg-white p-0.5 text-[13px] shadow-sm ring-1 ring-slate-100">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-lg px-3 py-1 font-medium",
                  filter === f.key
                    ? "bg-teal-50 text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

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
                    {filter === "pending"
                      ? "Nothing waiting for a grade."
                      : filter === "graded"
                        ? "No graded submissions yet."
                        : "No submissions found."}
                  </td>
                </tr>
              )}
              {rows.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
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
                    {!s.fileName && s.text && <p className="text-xs text-slate-400">Written answer</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {fmtDateTime(s.submittedAt)}
                    {s.isLate && (
                      <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
                        Late
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {s.score === null ? (
                      <span className="font-normal text-slate-300">—</span>
                    ) : (
                      `${s.score}/${s.totalMarks}`
                    )}
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
                      onClick={() => setGrading(s)}
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(creating || editing) && (
        <CreateAssignmentModal
          key={editing?.id ?? "new"}
          courses={data.courses}
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            flash(editing ? "Assignment updated" : "Assignment created");
            setCreating(false);
            setEditing(null);
            reload();
          }}
        />
      )}

      {viewing && (
        <AssignmentViewModal
          a={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
        />
      )}

      {deleting && (
        <DeleteAssignmentDialog
          a={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            if (selected === deleting.id) setSelected(null);
            setDeleting(null);
            flash("Assignment deleted");
            reload();
          }}
        />
      )}

      {grading && (
        <GradeDrawer
          sub={grading}
          onClose={() => setGrading(null)}
          onSaved={() => {
            setGrading(null);
            flash("Grade saved");
            reload();
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

interface IconBtnProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

function IconBtn({ label, icon, onClick, danger }: IconBtnProps) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "rounded-md p-1.5 transition",
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
      )}
    >
      {icon}
    </button>
  );
}