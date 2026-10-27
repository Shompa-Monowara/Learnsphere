import { useState } from "react"
import type { ReactNode } from "react"
import {
  Award,
  BadgeCheck,
  Check,
  Download,
  FileText,
  Flame,
  Maximize,
  Play,
  Presentation,
  ShieldCheck,
  Volume2,
  Zap,
} from "lucide-react"

/* Shob mockup er baire er white card + vitorer halka panel */
function MockCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  )
}

const label = "text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"

/* ---------- Role dashboard (hero + "Role-based dashboards") ---------- */

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
        <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:-left-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950">
            <ShieldCheck size={16} />
          </span>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">WCAG AA contrast</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">on every screen</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- 01 Video lessons ---------- */

const LESSONS = [
  { title: "Component composition", time: "12:04", done: true },
  { title: "State that scales", time: "18:22", done: true },
  { title: "Testing the interface", time: "21:47", done: false },
]

export function VideoMock() {
  return (
    <MockCard>
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 p-3.5 text-white">
        <div className="flex items-start justify-between">
          <span className="rounded-md bg-white/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider">
            Module 2 · Lesson 4
          </span>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold">1080p</span>
        </div>

        <div className="my-7 flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
            <Play size={22} className="ml-0.5 fill-current" />
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <span>12:44</span>
          <div className="h-1 flex-1 rounded-full bg-white/20">
            <div className="h-1 w-[62%] rounded-full bg-teal-400" />
          </div>
          <span>20:30</span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-black/40 px-3 py-2.5">
          <span className="text-[11px] font-semibold">Component composition in practice</span>
          <span className="flex items-center gap-3 text-white/80">
            <Volume2 size={13} />
            <Maximize size={13} />
          </span>
        </div>
      </div>

      <ul className="mt-2.5 space-y-1">
        {LESSONS.map((l, i) => (
          <li
            key={l.title}
            className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${
              !l.done ? "bg-teal-50 dark:bg-teal-950/60" : ""
            }`}
          >
            {l.done ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                <Check size={13} strokeWidth={3} />
              </span>
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold text-slate-500 dark:border-slate-600">
                {i + 1}
              </span>
            )}
            <span className="flex-1 text-xs font-medium text-slate-900 dark:text-slate-100">{l.title}</span>
            <span className="text-[11px] text-slate-400">{l.time}</span>
          </li>
        ))}
      </ul>
    </MockCard>
  )
}

/* ---------- 02 Quiz ---------- */

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

/* ---------- 03 Assignments ---------- */

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

/* ---------- 04 Progress ---------- */

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

/* ---------- 05 Certificate ---------- */

export function CertificateMock() {
  return (
    <MockCard className="p-2.5">
      <div className="rounded-2xl border-2 border-teal-200 p-2.5 dark:border-teal-800">
        <div className="rounded-xl border border-teal-200 bg-white px-5 pb-4 pt-5 dark:border-teal-800 dark:bg-slate-900">
          <div className="text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <BadgeCheck size={11} /> Verified
            </span>
            <p className={`${label} mt-4`}>Certificate of completion</p>
            <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">Maya Chen</p>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              has completed <b className="text-slate-900 dark:text-white">Frontend Architecture</b>
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">24 lessons · 18 hours · issued 14 Oct 2026</p>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-dashed border-slate-200 pt-3 dark:border-slate-700">
            <div>
              <p className={label}>Verification ID</p>
              <p className="mt-1 font-mono text-[11px] font-bold text-slate-900 dark:text-white">LS-2026-8841-QK</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-800 dark:bg-teal-950">
              <Award size={18} />
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between px-1 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <FileText size={13} className="text-red-500" /> PDF · 240 KB
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-300">
            <Download size={12} /> Download
          </span>
        </div>
      </div>
    </MockCard>
  )
}