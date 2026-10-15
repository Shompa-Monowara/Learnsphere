import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Notice from "@/features/student/components/Notice"
import PageState from "@/features/student/components/PageState"
import type { PlayQuiz, QuizResult } from "@/features/student/portal-types"
import { useStudent } from "@/features/student/student-context"
import { BTN_OUTLINE, BTN_PRIMARY, CARD } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

export default function QuizPlayer() {
  const { id } = useParams()
  const { refresh } = useStudent()
  const { data, loading, error, reload } = useFetch<{ quiz: PlayQuiz }>(`/quizzes/${id}`)

  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())

  const quiz = data?.quiz
  const running = !!quiz && !result

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [running])

  const remaining = quiz ? Math.max(0, quiz.duration * 60 - Math.floor((now - startedAt) / 1000)) : 0

  const submit = async () => {
    if (!quiz || busy) return
    setBusy(true)
    setSubmitError("")
    try {
      const payload = quiz.questions.map((_, i) => answers[i] ?? null)
      const res = await api.post<{ result: QuizResult }>(`/quizzes/${quiz._id}/attempt`, { answers: payload })
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
    setStartedAt(Date.now())
    setNow(Date.now())
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
              <p className={cn("text-5xl font-bold", result.passed ? "text-green-600" : "text-orange-500")}>{result.percent}%</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {result.passed ? "You passed!" : "Not quite there yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {result.correct} correct · {result.incorrect} incorrect · Passing score {quiz.passingScore}%
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button type="button" onClick={retake} className={BTN_PRIMARY}>Retake quiz</button>
                <Link to="/student/quizzes" className={BTN_OUTLINE}>All quizzes</Link>
              </div>
            </div>

            <div className="space-y-4">
              {result.review.map((r, i) => (
                <div key={i} className={cn(CARD, "p-5")}>
                  <div className="flex items-start gap-3">
                    {r.isCorrect ? <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={18} /> : <XCircle className="mt-0.5 shrink-0 text-red-500" size={18} />}
                    <p className="font-medium text-slate-900 dark:text-white">{i + 1}. {r.question}</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {r.options.map((o, oi) => (
                      <div
                        key={oi}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm",
                          oi === r.correctIndex
                            ? "border-green-300 bg-green-50 text-green-800"
                            : oi === r.selected
                              ? "border-red-300 bg-red-50 text-red-800"
                              : "border-slate-100 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                        )}
                      >
                        {o}
                      </div>
                    ))}
                  </div>
                  {r.explanation && <p className="mt-3 text-sm text-slate-500">{r.explanation}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {quiz && !result && (
          <>
            <div className={cn(CARD, "sticky top-20 z-10 flex items-center justify-between p-4")}>
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white">{quiz.title}</h1>
                <p className="text-xs text-slate-500">
                  {Object.keys(answers).length}/{quiz.questions.length} answered · Pass at {quiz.passingScore}%
                </p>
              </div>
              <span className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold", remaining <= 60 ? "bg-red-50 text-red-600" : "bg-teal-50 text-teal-700")}>
                <Clock size={14} /> {clock(remaining)}
              </span>
            </div>

            {quiz.questions.map((q, qi) => (
              <div key={q._id} className={cn(CARD, "p-5")}>
                <p className="font-medium text-slate-900 dark:text-white">{qi + 1}. {q.text}</p>
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