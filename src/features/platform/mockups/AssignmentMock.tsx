import MockCard from "./MockCard"
import { label } from "./shared"

const RUBRIC = ["Layout 25/25", "States 22/25", "Accessibility 25/25"]

export function AssignmentMock() {
  return (
    <MockCard className="p-0">
      <div className="p-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className={label}>Submission</span>
              <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Project 2 · Checkout flow</p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Maya Chen · submitted 2 hours ago</p>
            </div>
            <div className="shrink-0 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-center dark:border-teal-800 dark:bg-teal-950">
              <p className="text-xl font-extrabold leading-none text-teal-700 dark:text-teal-300">92</p>
              <p className="mt-1 text-[9px] text-slate-500 dark:text-slate-400">/100</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {RUBRIC.map((r) => (
              <span
                key={r}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">AO</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Amara Okafor</span>
              <span className="text-[10px] text-slate-400">instructor feedback</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              “The empty and error states are handled well. Tighten the field spacing on mobile and this is
              portfolio-ready.”
            </p>
            <div className="mt-2 flex items-center gap-2 text-[10px]">
              <span className="rounded bg-teal-50 px-1.5 py-0.5 font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">Returned</span>
              <span className="text-slate-400">Rubric attached</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-3 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">Review queue · 3 left</span>
        <span className="font-semibold text-teal-700 dark:text-teal-300">Next submission →</span>
      </div>
    </MockCard>
  )
}