import { CircleHelp, Clock, Layers, Repeat } from "lucide-react"
import { Link } from "react-router-dom"
import EmptyState from "@/features/student/components/EmptyState"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import type { QuizItem } from "@/features/student/portal-types"
import { BTN_OUTLINE, BTN_PRIMARY, CARD } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"

export default function Quizzes() {
  const { data, loading, error, reload } = useFetch<{ quizzes: QuizItem[] }>("/quizzes/mine")
  const quizzes = data?.quizzes ?? []

  return (
    <div className="space-y-8">
      <PageHeader
        crumb="Quizzes"
        title="Quizzes"
        subtitle="Auto-graded knowledge checks across all your courses. Retake any quiz to improve your score."
      />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        {quizzes.length === 0 ? (
          <EmptyState title="No quizzes yet" text="Quizzes from your enrolled courses will show up here." />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {quizzes.map((q) => {
              const attemptsCount = q.attempts ?? 0
              const hasAttempted = attemptsCount > 0

              return (
                <div key={q._id} className={cn(CARD, "flex flex-col p-5")}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <CircleHelp size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{q.title}</h3>
                      <p className="text-xs text-slate-500">{q.courseTitle}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        q.passed
                          ? "bg-green-50 text-green-700"
                          : hasAttempted
                          ? "bg-amber-50 text-amber-700"
                          : "bg-teal-50 text-teal-700"
                      )}
                    >
                      {q.passed ? "Completed" : hasAttempted ? "Try Again" : "Available"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Layers size={13} className="text-teal-600" /> {q.questionsCount} questions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-orange-500" /> {q.duration} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Repeat size={13} className="text-teal-600" /> {attemptsCount} attempt{attemptsCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-4 min-h-10">
                    {typeof q.bestScore === "number" && (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Best score</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{q.bestScore}%</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={cn("h-full rounded-full transition-all", q.passed ? "bg-green-500" : "bg-orange-400")}
                            style={{ width: `${Math.min(100, Math.max(0, q.bestScore))}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-xs text-slate-400">
                      {!hasAttempted ? "Not attempted yet" : `Passing score: ${q.passingScore}%`}
                    </span>
                    <Link to={`/student/quizzes/${q._id}`} className={hasAttempted ? BTN_OUTLINE : BTN_PRIMARY}>
                      {hasAttempted ? "Retake quiz" : "Start quiz"}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </PageState>
    </div>
  )
}