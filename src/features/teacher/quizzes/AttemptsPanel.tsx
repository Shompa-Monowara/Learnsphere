import { useEffect, useState } from "react"
import { CheckCircle2, ChevronDown, Clock, Loader2 } from "lucide-react"
import { BTN_PRIMARY } from "@/features/student/ui"
import { FIELD } from "@/features/teacher/builder/ui"
import { api, getErrorMessage } from "@/services/api"

interface WrittenEntry {
  index: number
  answer: string
  marks: number
  awarded: number | null
  feedback: string
}

interface Attempt {
  _id: string
  student?: { _id: string; name: string; email?: string } | null
  status: "graded" | "pending"
  score?: number
  total?: number
  percent?: number
  passed?: boolean
  written: WrittenEntry[]
  createdAt: string
}

interface QuizInfo {
  title: string
  passingScore?: number
  questions: { type: string; text: string; marks: number; sampleAnswer: string }[]
}

const CARD = "rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"

function StatusBadge({ attempt }: { attempt: Attempt }) {
  if (attempt.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
        <Clock size={12} /> Needs grading
      </span>
    )
  }
  return attempt.passed ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-600">
      <CheckCircle2 size={12} /> Passed
    </span>
  ) : (
    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">Failed</span>
  )
}

function AttemptRow({
  attempt,
  quiz,
  onSaved,
}: {
  attempt: Attempt
  quiz: QuizInfo
  onSaved: (updated: Attempt) => void
}) {
  const [open, setOpen] = useState(attempt.status === "pending")
  const [grades, setGrades] = useState<Record<number, { awarded: string; feedback: string }>>(() =>
    Object.fromEntries(
      attempt.written.map((w) => [
        w.index,
        {
          awarded: w.awarded === null || w.awarded === undefined ? "" : String(w.awarded),
          feedback: w.feedback ?? "",
        },
      ])
    )
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const setGrade = (index: number, patch: Partial<{ awarded: string; feedback: string }>) =>
    setGrades((g) => ({ ...g, [index]: { ...g[index], ...patch } }))

  const save = async () => {
    const payload: { index: number; awarded: number; feedback: string }[] = []
    for (const w of attempt.written) {
      const g = grades[w.index]
      if (!g || g.awarded.trim() === "") continue
      const n = Number(g.awarded)
      if (!Number.isFinite(n) || n < 0 || n > w.marks) {
        setError(`Marks for question ${w.index + 1} must be between 0 and ${w.marks}.`)
        return
      }
      payload.push({ index: w.index, awarded: n, feedback: g.feedback.trim() })
    }
    if (payload.length === 0) {
      setError("Enter marks for at least one answer.")
      return
    }

    setSaving(true)
    setError("")
    try {
      const res = await api.patch(`/quizzes/attempts/${attempt._id}/grade`, { grades: payload })
      onSaved(res.data.attempt as Attempt)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {attempt.student?.name ?? "Deleted user"}
          </p>
          <p className="text-xs text-slate-500">{new Date(attempt.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {attempt.score ?? 0}/{attempt.total ?? 0} ({attempt.percent ?? 0}%)
          </span>
          <StatusBadge attempt={attempt} />
          <ChevronDown size={16} className={`text-slate-400 transition ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-slate-100 p-4 dark:border-slate-800">
          {attempt.written.length === 0 ? (
            <p className="text-sm text-slate-500">All questions were multiple choice and graded automatically.</p>
          ) : (
            <>
              {attempt.written.map((w) => {
                const q = quiz.questions[w.index]
                const g = grades[w.index] ?? { awarded: "", feedback: "" }
                return (
                  <div key={w.index} className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Q{w.index + 1}. {q?.text ?? "Question removed"}
                    </p>
                    <p className="whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {w.answer || <span className="text-slate-400">No answer submitted</span>}
                    </p>
                    {q?.sampleAnswer && (
                      <p className="text-xs text-slate-500">
                        <b>Sample answer:</b> {q.sampleAnswer}
                      </p>
                    )}
                    <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                          Marks (max {w.marks})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={w.marks}
                          step="0.5"
                          value={g.awarded}
                          onChange={(e) => setGrade(w.index, { awarded: e.target.value })}
                          className={FIELD}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                          Feedback (optional)
                        </label>
                        <input
                          value={g.feedback}
                          maxLength={1000}
                          onChange={(e) => setGrade(w.index, { feedback: e.target.value })}
                          placeholder="Write a short comment for the student"
                          className={FIELD}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              {error && (
                <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button type="button" disabled={saving} onClick={() => void save()} className={BTN_PRIMARY}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Saving..." : "Save grades"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AttemptsPanel({ quizId }: { quizId: string }) {
  const [data, setData] = useState<{ quiz: QuizInfo; attempts: Attempt[] } | null>(null)
  const [error, setError] = useState("")
  const [onlyPending, setOnlyPending] = useState(false)

  useEffect(() => {
    let alive = true
    api
      .get(`/quizzes/${quizId}/attempts`)
      .then((res) => {
        if (alive) setData(res.data)
      })
      .catch((err) => {
        if (alive) setError(getErrorMessage(err))
      })
    return () => {
      alive = false
    }
  }, [quizId])

  const handleSaved = (updated: Attempt) =>
    setData((d) =>
      d
        ? {
            ...d,
            attempts: d.attempts.map((a) =>
              a._id === updated._id ? { ...a, ...updated, student: a.student } : a
            ),
          }
        : d
    )

  const pendingCount = data?.attempts.filter((a) => a.status === "pending").length ?? 0
  const list = data ? (onlyPending ? data.attempts.filter((a) => a.status === "pending") : data.attempts) : []

  return (
    <div className={CARD}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-bold text-slate-900 dark:text-white">Student attempts</p>
          <p className="text-xs text-slate-500">
            {data ? `${data.attempts.length} attempts · ${pendingCount} need grading` : "Loading..."}
          </p>
        </div>
        {pendingCount > 0 && (
          <button
            type="button"
            onClick={() => setOnlyPending((v) => !v)}
            className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            {onlyPending ? "Show all" : "Show only needs grading"}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {!data && !error && <Loader2 size={20} className="animate-spin text-teal-600" />}
        {data && list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500 dark:border-slate-700">
            No attempts yet.
          </p>
        )}
        {data &&
          list.map((a) => <AttemptRow key={a._id} attempt={a} quiz={data.quiz} onSaved={handleSaved} />)}
      </div>
    </div>
  )
}