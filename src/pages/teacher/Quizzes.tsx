import { useEffect, useState } from "react"
import { ClipboardList, Loader2, Plus, Save, Search } from "lucide-react"
import { Link } from "react-router-dom"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui"
import { FIELD, LABEL } from "@/features/teacher/builder/ui"
import QuestionCard from "@/features/teacher/quizzes/QuestionCard"
import {
  FEEDBACK_OPTIONS,
  cleanQuiz,
  emptyQuiz,
  getErrors,
  listFrom,
  newQuestion,
  toDraft,
} from "@/features/teacher/quizzes/types"
import type {
  CourseOption,
  FeedbackTiming,
  QQuestion,
  QuestionType,
  QuizDraft,
  QuizItem,
  ServerQuiz,
} from "@/features/teacher/quizzes/types"
import { ConfirmDialog, FieldError, INVALID, NumberField, SelectField } from "@/features/teacher/quizzes/ui"
import { api, getErrorMessage } from "@/services/api"

interface LoadState {
  courses: CourseOption[]
  items: QuizItem[]
  error: string
}

type Dialog = { kind: "discard"; run: () => void } | { kind: "delete" } | null

const CARD = "rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"

function StatusToggle({ published, onChange }: { published: boolean; onChange: (v: boolean) => void }) {
  const base = "rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Quiz status">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`${base} ${!published ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500"}`}
      >
        Draft
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`${base} ${published ? "bg-green-600 text-white shadow-sm" : "text-slate-500"}`}
      >
        Published
      </button>
    </div>
  )
}

export default function Quizzes() {
  const [state, setState] = useState<LoadState | null>(null)
  const [tick, setTick] = useState(0)
  const [draft, setDraft] = useState<QuizDraft | null>(null)
  const [baseline, setBaseline] = useState("")
  const [showErrors, setShowErrors] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState("")
  const [dialog, setDialog] = useState<Dialog>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await api.get("/courses/mine/list")
        const courses = listFrom<CourseOption>(res.data, "courses")
        const groups = await Promise.all(
          courses.map(async (c): Promise<QuizItem[]> => {
            try {
              const r = await api.get(`/courses/${c._id}/quizzes`)
              return listFrom<ServerQuiz>(r.data, "quizzes").map((q) => ({
                ...q,
                courseId: c._id,
                courseTitle: c.title,
              }))
            } catch {
              return []
            }
          })
        )
        if (alive) setState({ courses, items: groups.flat(), error: "" })
      } catch (err) {
        if (alive) setState({ courses: [], items: [], error: getErrorMessage(err) })
      }
    })()
    return () => {
      alive = false
    }
  }, [tick])

  const dirty = !!draft && JSON.stringify(draft) !== baseline
  const errors = draft ? getErrors(draft) : null
  const shown = showErrors ? errors : null

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(""), 3500)
  }

  const guard = (run: () => void) => {
    if (dirty) setDialog({ kind: "discard", run })
    else run()
  }

  const load = (d: QuizDraft | null) => {
    setDraft(d)
    setBaseline(d ? JSON.stringify(d) : "")
    setShowErrors(false)
    setError("")
  }

  const openQuiz = (q: QuizItem) => guard(() => load(toDraft(q)))

  const startNew = () =>
    guard(() => {
      const first = state?.courses[0]
      if (!first) {
        setError("Create a course first. Quizzes belong to a course.")
        return
      }
      load(emptyQuiz(first._id))
    })

  const patch = (p: Partial<QuizDraft>) => setDraft((d) => (d ? { ...d, ...p } : d))
  const patchQuestion = (i: number, p: Partial<QQuestion>) =>
    setDraft((d) =>
      d ? { ...d, questions: d.questions.map((q, idx) => (idx === i ? { ...q, ...p } : q)) } : d
    )
  const moveQuestion = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      if (!d) return d
      const list = [...d.questions]
      const j = i + dir
      if (j < 0 || j >= list.length) return d
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...d, questions: list }
    })
  const duplicateQuestion = (i: number) =>
    setDraft((d) => {
      if (!d) return d
      const copy: QQuestion = { ...d.questions[i], key: newQuestion().key, options: [...d.questions[i].options] }
      const list = [...d.questions]
      list.splice(i + 1, 0, copy)
      return { ...d, questions: list }
    })
  const removeQuestion = (i: number) =>
    setDraft((d) => (d ? { ...d, questions: d.questions.filter((_, idx) => idx !== i) } : d))
  const addQuestion = (type: QuestionType) =>
    setDraft((d) => (d ? { ...d, questions: [...d.questions, newQuestion(type)] } : d))

  const save = async () => {
    if (!draft || !errors) return
    if (errors.any) {
      setShowErrors(true)
      setError("Please fix the highlighted fields before saving.")
      return
    }
    const d = cleanQuiz(draft)
    setSaving(true)
    setError("")
    try {
      const body = {
        title: d.title,
        duration: d.duration,
        passingScore: d.passingScore,
        feedbackTiming: d.feedbackTiming,
        isPublished: d.isPublished,
        questions: d.questions.map((q) => ({
          type: q.type,
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          sampleAnswer: q.sampleAnswer,
          marks: q.marks,
          explanation: q.explanation,
        })),
      }
      if (d._id) await api.put(`/quizzes/${d._id}`, body)
      else await api.post(`/courses/${d.courseId}/quizzes`, body)
      load(null)
      flash("Quiz saved successfully.")
      setTick((t) => t + 1)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const removeQuiz = async () => {
    if (!draft?._id) return
    setSaving(true)
    try {
      await api.delete(`/quizzes/${draft._id}`)
      setDialog(null)
      load(null)
      flash("Quiz deleted.")
      setTick((t) => t + 1)
    } catch (err) {
      setDialog(null)
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (state === null) {
    return (
      <div className="grid place-items-center py-32 text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const term = query.trim().toLowerCase()
  const items = state.items.filter(
    (i) => !term || i.title.toLowerCase().includes(term) || i.courseTitle.toLowerCase().includes(term)
  )
  const totalMarks = draft?.questions.reduce((n, q) => n + q.marks, 0) ?? 0
  const courseName = state.courses.find((c) => c._id === draft?.courseId)?.title ?? ""

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Quizzes"
        title="Quiz Builder"
        subtitle="Create auto-graded quizzes with explanations, marks, and timing."
        action={
          <div className="flex items-center gap-3">
            {dirty && <span className="text-xs font-medium text-amber-600">Unsaved changes</span>}
            {draft && (
              <button type="button" disabled={saving} onClick={() => guard(() => load(null))} className={BTN_OUTLINE}>
                Close
              </button>
            )}
            <button type="button" disabled={!draft || saving} onClick={() => void save()} className={BTN_PRIMARY}>
              <Save size={16} /> {saving ? "Saving..." : "Save quiz"}
            </button>
          </div>
        }
      />

      {state.error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* ---------- বাঁ পাশ ---------- */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your quizzes ({state.items.length})
          </p>

          {state.items.length > 3 && (
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search quizzes"
                className={`${FIELD} w-full pl-10`}
              />
            </div>
          )}

          {items.map((q) => {
            const active = draft?._id === q._id
            const published = q.isPublished !== false
            return (
              <button
                key={q._id}
                type="button"
                onClick={() => openQuiz(q)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-teal-400 bg-teal-50/60 dark:border-teal-700 dark:bg-teal-500/10"
                    : "border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{q.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      published ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}
                  >
                    {published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{q.courseTitle}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {q.questions?.length ?? 0} questions · {q.duration ?? 0} min
                </p>
              </button>
            )
          })}

          {items.length === 0 && !state.error && (
            <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
              {state.courses.length === 0 ? (
                <>
                  You have no courses yet.{" "}
                  <Link to="/teacher/builder" className="font-semibold text-teal-700">
                    Create one
                  </Link>
                </>
              ) : term ? (
                "No quizzes match your search."
              ) : (
                "No quizzes yet."
              )}
            </p>
          )}

          <button type="button" onClick={startNew} className={`${BTN_OUTLINE} w-full justify-center`}>
            <Plus size={16} /> New quiz
          </button>
        </div>

        {/* ---------- right sidebar ---------- */}
        {draft && errors ? (
          <div className="space-y-5">
            <div className={CARD}>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={LABEL}>Duration (minutes)</label>
                  <NumberField
                    value={draft.duration}
                    min={1}
                    max={600}
                    suffix="min"
                    invalid={!!shown?.duration}
                    onChange={(n) => patch({ duration: n })}
                  />
                  <FieldError message={shown?.duration} />
                </div>
                <div>
                  <label className={LABEL}>Passing score (%)</label>
                  <NumberField
                    value={draft.passingScore}
                    min={1}
                    max={100}
                    suffix="%"
                    invalid={!!shown?.passingScore}
                    onChange={(n) => patch({ passingScore: n })}
                  />
                  <FieldError message={shown?.passingScore} />
                </div>
                <div>
                  <label className={LABEL}>Feedback timing</label>
                  <SelectField
                    value={draft.feedbackTiming}
                    options={FEEDBACK_OPTIONS}
                    onChange={(v) => patch({ feedbackTiming: v as FeedbackTiming })}
                  />
                </div>
              </div>
            </div>

            <div className={CARD}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">Quiz details</p>
                  <p className="text-xs text-slate-500">
                    {draft.questions.length} {draft.questions.length === 1 ? "question" : "questions"} · {totalMarks} total marks
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusToggle published={draft.isPublished} onChange={(v) => patch({ isPublished: v })} />
                  <button type="button" onClick={() => addQuestion("mcq")} className={BTN_OUTLINE}>
                    <Plus size={16} /> MCQ
                  </button>
                  <button type="button" onClick={() => addQuestion("written")} className={BTN_OUTLINE}>
                    <Plus size={16} /> Written
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_280px]">
                <div>
                  <label className={LABEL}>
                    Quiz title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={draft.title}
                    maxLength={120}
                    onChange={(e) => patch({ title: e.target.value })}
                    placeholder="e.g. React hooks & state"
                    className={`${FIELD} w-full font-semibold ${shown?.title ? INVALID : ""}`}
                  />
                  <FieldError message={shown?.title} />
                </div>
                <div>
                  <label className={LABEL}>
                    Course <span className="text-red-500">*</span>
                  </label>
                  {draft._id ? (
                    <input disabled value={courseName} className={`${FIELD} w-full cursor-not-allowed opacity-70`} />
                  ) : (
                    <SelectField
                      value={draft.courseId}
                      invalid={!!shown?.course}
                      options={state.courses.map((c) => ({ value: c._id, label: c.title }))}
                      onChange={(v) => patch({ courseId: v })}
                    />
                  )}
                  <FieldError message={shown?.course} />
                </div>
              </div>
              <FieldError message={shown?.general} />
            </div>

            {draft.questions.map((q, i) => (
              <QuestionCard
                key={q.key}
                q={q}
                index={i}
                total={draft.questions.length}
                errors={shown?.questions[i]}
                onChange={(p) => patchQuestion(i, p)}
                onMove={(dir) => moveQuestion(i, dir)}
                onDuplicate={() => duplicateQuestion(i)}
                onRemove={() => removeQuestion(i)}
              />
            ))}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => addQuestion("mcq")}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900"
              >
                <Plus size={16} /> Add multiple-choice question
              </button>
              <button
                type="button"
                onClick={() => addQuestion("written")}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900"
              >
                <Plus size={16} /> Add written question
              </button>
            </div>

            {draft._id && (
              <button
                type="button"
                disabled={saving}
                onClick={() => setDialog({ kind: "delete" })}
                className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-40"
              >
                Delete this quiz
              </button>
            )}
          </div>
        ) : (
          <div className="grid place-items-center rounded-3xl border border-dashed border-slate-200 px-6 py-20 text-center dark:border-slate-700">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10">
              <ClipboardList size={22} />
            </span>
            <p className="font-semibold text-slate-900 dark:text-white">No quiz selected</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Pick a quiz from the list to edit it, or start a new one for any of your courses.
            </p>
            <button type="button" onClick={startNew} className={`${BTN_PRIMARY} mt-5`}>
              <Plus size={16} /> New quiz
            </button>
          </div>
        )}
      </div>

      {dialog?.kind === "discard" && (
        <ConfirmDialog
          title="Discard unsaved changes?"
          message="You have changes that haven't been saved. If you continue, they will be lost."
          confirmLabel="Discard changes"
          danger
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            const run = dialog.run
            setDialog(null)
            run()
          }}
        />
      )}
      {dialog?.kind === "delete" && (
        <ConfirmDialog
          title="Delete this quiz?"
          message="This permanently removes the quiz, its questions and all student attempts. This action cannot be undone."
          confirmLabel="Delete quiz"
          danger
          busy={saving}
          onCancel={() => setDialog(null)}
          onConfirm={() => void removeQuiz()}
        />
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}