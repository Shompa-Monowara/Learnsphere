import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Presentation, ShieldCheck } from "lucide-react"
import MockCard from "./MockCard"

type Role = "Admin" | "Teacher" | "Student"

const ROLE_DATA: Record<
  Role,
  { view: string; stats: [string, string][]; rows: { name: string; meta: string; badge: string }[] }
> = {
  Admin: {
    view: "Admin view",
    stats: [
      ["1,284", "Active learners"],
      ["$12.4k", "Monthly revenue"],
    ],
    rows: [
      { name: "Frontend Architecture", meta: "Course · 342 enrolled", badge: "Live" },
      { name: "Data Foundations", meta: "Course · awaiting review", badge: "Review" },
      { name: "Spring cohort", meta: "Cohort · 48 learners", badge: "48" },
    ],
  },
  Teacher: {
    view: "Teacher view",
    stats: [
      ["12", "Submissions to grade"],
      ["4.9", "Course rating"],
    ],
    rows: [
      { name: "Maya Chen", meta: "Project 2 · 2h ago", badge: "92" },
      { name: "Ade Balogun", meta: "Project 2 · 4h ago", badge: "86" },
      { name: "Nina Patel", meta: "Quiz 3 · yesterday", badge: "10/10" },
    ],
  },
  Student: {
    view: "Student view",
    stats: [
      ["74%", "Course progress"],
      ["3", "Due this week"],
    ],
    rows: [
      { name: "Testing the interface", meta: "Lesson 3 · 21 min", badge: "Next" },
      { name: "Project 2 · Checkout flow", meta: "Assignment · due Fri", badge: "Due" },
      { name: "Module quiz", meta: "Quiz · 10 questions", badge: "10" },
    ],
  },
}

export function RoleDashboardMock({ floating }: { floating?: boolean }) {
  const reduce = useReducedMotion()
  const [role, setRole] = useState<Role>("Teacher")
  const d = ROLE_DATA[role]

  return (
    <div className="relative">
      <MockCard>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex items-center justify-between gap-3">
            <div role="tablist" className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              {(Object.keys(ROLE_DATA) as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={role === r}
                  onClick={() => setRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    role === r
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="hidden items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:inline-flex">
              <Presentation size={13} /> {d.view}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {d.stats.map(([v, l]) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">{v}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2.5">
            {d.rows.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{r.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{r.meta}</p>
                </div>
                <span className="shrink-0 rounded-md bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  {r.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </MockCard>

      {floating && (
        <motion.div
          animate={reduce ? undefined : { y: [-5, 5, -5] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          style={{ willChange: "transform", transform: "translateZ(0)" }}
          className="absolute -bottom-5 -left-4 z-20 inline-flex w-fit items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:-left-8"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950">
            <ShieldCheck size={16} />
          </span>
          <div className="shrink-0 whitespace-nowrap">
            <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">WCAG AA contrast</p>
            <p className="mt-1 text-[10px] leading-none text-slate-500 dark:text-slate-400">on every screen</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}