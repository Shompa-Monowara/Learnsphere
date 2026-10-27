import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Notice from "@/features/student/components/Notice"
import PageState from "@/features/student/components/PageState"
import type { AttemptResult, PlayQuizData } from "@/features/student/quiz-play-types"
import { useStudent } from "@/features/student/student-context"
import { BTN_OUTLINE, BTN_PRIMARY, CARD } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

function StatusIcon({ ok, written }: { ok: boolean | null; written: boolean }) {
  if (ok === true) return <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={18} />
  if (ok === false) return <XCircle className="mt-0.5 shrink-0 text-red-500" size={18} />
  if (written) return <Clock className="mt-0.5 shrink-0 text-amber-500" size={18} />
  return <span className="w-[18px] shrink-0" />
}

export default function QuizPlayer() {
  const { id } = useParams()
  const { refresh } = useStudent()
  const { data, loading, error, reload } = useFetch<{ quiz: PlayQuizData }>(`/quizzes/${id}`)

  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState("")
  // deadline server theke ashe (null = time limit nai ba ekhono start hoy ni)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const quiz = data?.quiz
  const quizId = quiz?._id
  const running = !!quiz && !result && deadline !== null

  const applyStart = useCallback((remaining: number | null) => {
    const t = Date.now()
    setNow(t)
    setDeadline(remaining === null ? null : t + remaining * 1000)
  }, [])

  const begin = useCallback(async () => {
    try {
      const res = await api.post<{ remaining: number | null }>(`/quizzes/${id}/start`)
      applyStart(res.data.remaining)
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    }
  }, [id, applyStart])

  useEffect(() => {
    if (!quizId) return
    let cancelled = false
    api
      .post<{ remaining: number | null }>(`/quizzes/${id}/start`)
      .then((res) => {
        if (!cancelled) applyStart(res.data.remaining)
      })
      .catch((err) => {
        if (!cancelled) setSubmitError(getErrorMessage(err))
      })
    return () => {
      cancelled = true
    }
  }, [quizId, id, applyStart])

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [running])

  const remaining = deadline === null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000))

  const answered = quiz
    ? quiz.questions.filter((_, i) => {
        const a = answers[i]
        return typeof a === "number" || (typeof a === "string" && a.trim() !== "")
      }).length
    : 0

  const submit = async () => {
    if (!quiz || busy) return
    setBusy(true)
    setSubmitError("")
    try {
      const payload = quiz.questions.map((_, i) => answers[i] ?? null)
      const res = await api.post<{ result: AttemptResult }>(`/quizzes/${quiz._id}/attempt`, { answers: payload })
      setResult(res.data.result)
      void refresh()
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const submitRef = useRef(submit)
  useEffect(() => {
    submitRef.current = submit
  })

  useEffect(() => {
    if (running && remaining === 0) void submitRef.current()
  }, [running, remaining])

  const retake = () => {
    setResult(null)
    setAnswers({})
    setDeadline(null)
    void begin()
  }

  const back = (
    <Link to="/student/quizzes" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600">
      <ArrowLeft size={16} /> Back to quizzes
    </Link>
  )

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {back}
      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        {quiz && result && (
          <>
            <div className={cn(CARD, "p-8 text-center")}>
              {result.status === "pending" ? (
                <>
                  <p className="text-5xl font-bold text-amber-500">{result.percent}%</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Waiting for teacher review</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {result.pending} written {result.pending === 1 ? "answer needs" : "answers need"} grading. Score so far: {result.score}/
                    {result.total}. Your final result will update after your teacher grades it.
                  </p>
                </>
              ) : (
                <>
                  <p className={cn("text-5xl font-bold", result.passed ? "text-green-600" : "text-orange-500")}>{result.percent}%</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {result.passed ? "You passed!" : "Not quite there yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {result.correct} correct · {result.incorrect} incorrect · Passing score {quiz.passingScore}%
                  </p>
                </>
              )}
              <div className="mt-6 flex justify-center gap-3">
                <button type="button" onClick={retake} className={BTN_PRIMARY}>Retake quiz</button>
                <Link to="/student/quizzes" className={BTN_OUTLINE}>All quizzes</Link>
              </div>
            </div>

            {!result.reveal && (
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm text-slate-500 dark:bg-slate-800/50">
                Correct answers are not shown for this quiz.
              </p>
            )}

            <div className="space-y-4">
              {result.review.map((r, i) => {
                const written = r.type === "written"
                return (
                  <div key={i} className={cn(CARD, "p-5")}>
                    <div className="flex items-start gap-3">
                      <StatusIcon ok={r.isCorrect} written={written} />
                      <p className="font-medium text-slate-900 dark:text-white">{i + 1}. {r.question}</p>
                    </div>

                    {written ? (
                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your answer</p>
                        <p className="mt-1 whitespace-pre-wrap rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
                          {r.answer || "No answer given"}
                        </p>
                        {r.answer && <p className="mt-2 text-xs text-amber-600">Graded by your teacher.</p>}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {r.options.map((o, oi) => (
                          <div
                            key={oi}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-sm",
                              r.correctIndex !== null && oi === r.correctIndex
                                ? "border-green-300 bg-green-50 text-green-800"
                                : oi === r.selected
                                  ? r.correctIndex !== null
                                    ? "border-red-300 bg-red-50 text-red-800"
                                    : "border-teal-300 bg-teal-50 text-teal-800"
                                  : "border-slate-100 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                            )}
                          >
                            {o}
                          </div>
                        ))}
                      </div>
                    )}

                    {r.explanation && <p className="mt-3 text-sm text-slate-500">{r.explanation}</p>}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {quiz && !result && (
          <>
            <div className={cn(CARD, "sticky top-20 z-10 flex items-center justify-between p-4")}>
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white">{quiz.title}</h1>
                <p className="text-xs text-slate-500">
                  {answered}/{quiz.questions.length} answered · Pass at {quiz.passingScore}%
                </p>
              </div>
              {deadline !== null && (
                <span className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold", remaining <= 60 ? "bg-red-50 text-red-600" : "bg-teal-50 text-teal-700")}>
                  <Clock size={14} /> {clock(remaining)}
                </span>
              )}
            </div>

            {quiz.questions.map((q, qi) => (
              <div key={q._id} className={cn(CARD, "p-5")}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900 dark:text-white">{qi + 1}. {q.text}</p>
                  {q.marks ? <span className="shrink-0 text-xs text-slate-400">{q.marks} {q.marks === 1 ? "mark" : "marks"}</span> : null}
                </div>

                {q.type === "written" ? (
                  <div className="mt-3">
                    <textarea
                      rows={5}
                      maxLength={5000}
                      value={typeof answers[qi] === "string" ? (answers[qi] as string) : ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [qi]: e.target.value }))}
                      placeholder="Write your answer here"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <p className="mt-1 text-xs text-slate-400">Your teacher will grade this answer.</p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {q.options.map((o, oi) => (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                          answers[qi] === oi
                            ? "border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-500/10 dark:text-teal-200"
                            : "border-slate-200 hover:border-teal-300 dark:border-slate-700"
                        )}
                      >
                        <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", answers[qi] === oi ? "border-teal-600 bg-teal-600" : "border-slate-300")}>
                          {answers[qi] === oi && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {submitError && <Notice type="error">{submitError}</Notice>}

            <div className="flex justify-end">
              <button type="button" onClick={() => void submit()} disabled={busy} className={BTN_PRIMARY}>
                {busy ? "Submitting..." : "Submit quiz"}
              </button>
            </div>
          </>
        )}
      </PageState>
    </div>
  )
}