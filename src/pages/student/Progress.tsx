import { CheckCircle2, Clock, HelpCircle, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import EmptyState from "@/features/student/components/EmptyState"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import type { ProgressData } from "@/features/student/portal-types"
import { CARD } from "@/features/student/ui"
import { formatHours } from "@/features/student/utils"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"

const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })

function MiniStat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: LucideIcon; tone: string }) {
  return (
    <div className={cn(CARD, "p-5")}>
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone)}>
        <Icon size={20} />
      </span>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}

function TrendChart({ points }: { points: ProgressData["quizTrend"] }) {
  const known = points.filter((p) => p.score !== null)
  if (known.length === 0) {
    return <p className="py-20 text-center text-sm text-slate-500">No quiz attempts in the last 7 weeks.</p>
  }

  /* Score nai emon week e ager week er value dhore line ta continuous rakhi */
  const filled: { label: string; value: number; real: boolean }[] = []
  let last = known[0].score as number
  for (const p of points) {
    if (p.score !== null) last = p.score
    filled.push({ label: p.label, value: last, real: p.score !== null })
  }

  const n = filled.length
  const xs = filled.map((_, i) => (i / (n - 1)) * 100)
  const ys = filled.map((p) => 100 - p.value)
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ")

  return (
    <div>
      <div className="relative mx-2 h-56">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L100,100 L0,100 Z`} fill="url(#trendFill)" />
          <path d={line} fill="none" stroke="#0d9488" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {filled.map(
          (p, i) =>
            p.real && (
              <span
                key={i}
                title={`${p.label}: ${p.value}%`}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-600 ring-2 ring-white dark:ring-slate-900"
                style={{ left: `${xs[i]}%`, top: `${ys[i]}%` }}
              />
            )
        )}
      </div>
      <div className="mt-3 flex justify-between px-2 text-xs text-slate-400">
        {filled.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </div>
  )
}

function Donut({ percent }: { percent: number }) {
  const R = 70
  const C = 2 * Math.PI * R
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={R} fill="none" stroke="#f1f5f9" strokeWidth="16" className="dark:stroke-slate-800" />
        <circle
          cx="90"
          cy="90"
          r={R}
          fill="none"
          stroke="#0d9488"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - percent / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{percent}%</span>
        <span className="text-xs text-slate-500">complete</span>
      </div>
    </div>
  )
}

const BAR_COLORS = ["bg-teal-600", "bg-orange-500", "bg-blue-500", "bg-green-500"]

export default function Progress() {
  const { data, loading, error, reload } = useFetch<ProgressData>("/dashboard/student/progress")

  return (
    <div className="space-y-8">
      <PageHeader crumb="Progress" title="Progress & analytics" subtitle="See how your learning is tracking over time across every course." />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        {data && data.stats.enrolled === 0 ? (
          <EmptyState title="Nothing to track yet" text="Enroll in a course and complete a few lessons to see your analytics." />
        ) : (
          data && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <MiniStat label="Average completion" value={`${data.stats.avgCompletion}%`} icon={TrendingUp} tone="bg-teal-50 text-teal-600" />
                <MiniStat label="Time spent learning" value={formatHours(data.stats.timeSpentMinutes)} icon={Clock} tone="bg-orange-50 text-orange-500" />
                <MiniStat label="Average quiz score" value={`${data.stats.avgQuizScore}%`} icon={HelpCircle} tone="bg-green-50 text-green-600" />
                <MiniStat label="Courses completed" value={String(data.stats.coursesCompleted)} icon={CheckCircle2} tone="bg-slate-100 text-slate-600" />
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section className={cn(CARD, "p-6")}>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quiz score trend</h2>
                  <p className="mb-6 text-sm text-slate-500">Your average quiz score over the last 7 weeks</p>
                  <TrendChart points={data.quizTrend} />
                </section>

                <section className={cn(CARD, "p-6 text-center")}>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overall progress</h2>
                  <p className="mb-5 text-sm text-slate-500">Across all enrolled courses</p>
                  <Donut percent={data.stats.avgCompletion} />
                  <div className="mt-6 grid grid-cols-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{data.stats.enrolled}</p>
                      <p className="text-xs text-slate-500">Enrolled</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-600">{data.stats.coursesCompleted}</p>
                      <p className="text-xs text-slate-500">Completed</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section className={cn(CARD, "p-6")}>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course completion</h2>
                  <p className="mb-5 text-sm text-slate-500">Progress in each of your courses</p>
                  <div className="space-y-5">
                    {data.courseCompletion.map((c) => (
                      <div key={c.courseId}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-slate-900 dark:text-white">{c.title}</span>
                          <span className="shrink-0 text-xs text-slate-400">{c.lessonsDone} / {c.lessonsTotal} lessons</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={cn("h-full rounded-full", c.progress >= 100 ? "bg-green-500" : "bg-teal-600")}
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-right text-xs font-medium text-slate-500">{c.progress}%</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="space-y-6">
                  <section className={cn(CARD, "p-6")}>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Time spent this week</h2>
                    <div className="mt-4 flex h-36 items-end gap-2 border-b border-slate-100 dark:border-slate-800">
                      {(() => {
                        const max = Math.max(...data.timeByDay.map((d) => d.minutes), 1)
                        return data.timeByDay.map((d) => (
                          <div key={d.date} className="flex h-full flex-1 items-end" title={`${d.minutes} min`}>
                            <div
                              className="w-full rounded-t-md bg-teal-500"
                              style={{ height: `${d.minutes ? Math.max((d.minutes / max) * 100, 6) : 2}%` }}
                            />
                          </div>
                        ))
                      })()}
                    </div>
                    <div className="mt-2 flex gap-2">
                      {data.timeByDay.map((d) => (
                        <span key={d.date} className="flex-1 text-center text-[11px] text-slate-400">{dayLabel(d.date)}</span>
                      ))}
                    </div>
                  </section>

                  <section className={cn(CARD, "p-6")}>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Where your time goes</h2>
                    <div className="mt-4 space-y-3">
                      {data.timeBreakdown.map((t, i) => (
                        <div key={t.label} className="flex items-center gap-3 text-xs">
                          <span className="w-14 text-slate-500">{t.label}</span>
                          <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className={cn("h-full rounded-full", BAR_COLORS[i])} style={{ width: `${t.percent}%` }} />
                          </div>
                          <span className="w-9 text-right font-medium text-slate-700 dark:text-slate-300">{t.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </>
          )
        )}
      </PageState>
    </div>
  )
}