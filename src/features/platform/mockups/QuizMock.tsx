import { Check, Zap } from "lucide-react"
import MockCard from "./MockCard"
import { label } from "./shared"

const OPTIONS = [
  { k: "A", text: "Move all state into a global store", correct: false },
  { k: "B", text: "Keep state as close to where it is used", correct: true },
  { k: "C", text: "Re-render the whole tree on every change", correct: false },
]

export function QuizMock() {
  return (
    <MockCard>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex items-center justify-between gap-2">
          <span className={label}>Question 3 of 10</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <Zap size={11} className="fill-current" /> Auto-graded in 0.4s
          </span>
        </div>
        <p className="mt-3 text-[13px] font-bold leading-snug text-slate-900 dark:text-white">
          What is the most reliable way to keep a component tree predictable?
        </p>

        <div className="mt-3 space-y-2">
          {OPTIONS.map((o) => (
            <div
              key={o.k}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                o.correct
                  ? "border-teal-300 bg-teal-50 dark:border-teal-700 dark:bg-teal-950/60"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              {o.correct ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[9px] font-semibold text-slate-500 dark:border-slate-600">
                  {o.k}
                </span>
              )}
              <span className="text-xs font-medium text-slate-800 dark:text-slate-100">{o.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2.5 dark:bg-slate-900">
          <span className="text-[11px] text-slate-600 dark:text-slate-300">Score this attempt</span>
          <span className="text-sm font-extrabold text-teal-700 dark:text-teal-300">8 / 10</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-3 px-1 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < 3 ? "bg-teal-600" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </span>
        Module quiz · 10 questions · 3 attempts allowed
      </div>
    </MockCard>
  )
}