import { Flame } from "lucide-react"
import MockCard from "./MockCard"
import { label } from "./shared"

const WEEK = [
  { d: "M", h: 28 },
  { d: "T", h: 42 },
  { d: "W", h: 22 },
  { d: "T", h: 56 },
  { d: "F", h: 46 },
  { d: "S", h: 34 },
  { d: "S", h: 14 },
]

export function ProgressMock() {
  const pct = 74
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <MockCard>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex items-center gap-4">
          <div className="relative h-[100px] w-[100px] shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-slate-200 dark:stroke-slate-700" />
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={c * (1 - pct / 100)}
                className="stroke-teal-600"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-slate-900 dark:text-white">
              {pct}%
            </span>
          </div>
          <div className="min-w-0">
            <span className={label}>Current course</span>
            <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">Frontend Architecture</p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">18 of 24 lessons · 2 assignments left</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600 dark:bg-orange-950/50 dark:text-orange-300">
              <Flame size={11} /> 9-day streak
            </span>
          </div>
        </div>

        <div className="mt-4 flex h-[76px] items-end gap-2">
          {WEEK.map((w, i) => (
            <div key={i} className="flex-1 rounded-md bg-teal-600/85" style={{ height: `${w.h + 12}px` }} />
          ))}
        </div>
        <div className="mt-1.5 flex gap-2">
          {WEEK.map((w, i) => (
            <span key={i} className="flex-1 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {w.d}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2.5 text-[11px] dark:bg-slate-900">
          <span className="text-slate-600 dark:text-slate-300">This week</span>
          <span className="font-bold text-slate-900 dark:text-white">4h 20m learned</span>
        </div>
      </div>
    </MockCard>
  )
}