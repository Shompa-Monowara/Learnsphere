import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, Briefcase, Clock, Globe, Heart, Laptop, MapPin, Rocket, Sparkles, Users, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Role {
  title: string
  department: "Engineering" | "Design" | "Teaching" | "Support"
  location: string
  type: "Full-time" | "Part-time" | "Contract"
  summary: string
}

interface Perk {
  icon: LucideIcon
  title: string
  text: string
}

const PERKS: Perk[] = [
  { icon: Globe, title: "Remote friendly", text: "Work from wherever you do your best thinking. We plan around outcomes, not office hours." },
  { icon: BookOpen, title: "Learning budget", text: "Every teammate gets a yearly budget for courses, books and conferences, and yes, LearnSphere courses are free." },
  { icon: Wallet, title: "Fair, transparent pay", text: "Clear salary bands for every role, reviewed twice a year, so nobody has to negotiate in the dark." },
  { icon: Laptop, title: "Good equipment", text: "Pick the laptop and setup you need. We would rather you have the right tools than a loud office." },
  { icon: Heart, title: "Time to recharge", text: "Generous paid leave, local holidays off, and a team that actually encourages you to log off." },
  { icon: Users, title: "Small, kind team", text: "Direct access to everyone, short feedback loops and no room for ego. Your work ships fast." },
]

const VALUES = [
  { title: "Learners first", text: "Every decision starts with what helps a student finish a course and feel proud of it." },
  { title: "Calm software", text: "We build clear, quiet tools that get out of the way of teaching and learning." },
  { title: "Own it", text: "Small team, real responsibility. You see your work reach people within days, not quarters." },
]

/* Role gulo ekhane thake. Notun role add korte hole ei array te ekta object jog koro. */
const ROLES: Role[] = [
  {
    title: "Full Stack Engineer (MERN)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    summary: "Build features across our React frontend and Node/Express/MongoDB backend, from course tools to payments.",
  },
  {
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    summary: "Own the learner and instructor interfaces. React, TypeScript and Tailwind, with a strong eye for detail.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    summary: "Design clear, accessible flows for course creation, learning and progress tracking.",
  },
  {
    title: "Instructor Success Lead",
    department: "Teaching",
    location: "Remote",
    type: "Full-time",
    summary: "Help new instructors plan, record and launch great courses, and learn what tools they need next.",
  },
  {
    title: "Course Reviewer",
    department: "Teaching",
    location: "Remote",
    type: "Contract",
    summary: "Review submitted courses for quality and clarity, and give instructors kind, useful feedback.",
  },
  {
    title: "Support Specialist",
    department: "Support",
    location: "Remote",
    type: "Part-time",
    summary: "Answer learner and instructor questions with care, and turn common questions into better help articles.",
  },
]

const DEPARTMENTS = ["All", "Engineering", "Design", "Teaching", "Support"] as const

export default function Careers() {
  const [department, setDepartment] = useState<(typeof DEPARTMENTS)[number]>("All")

  const roles = useMemo(
    () => (department === "All" ? ROLES : ROLES.filter((r) => r.department === department)),
    [department]
  )

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "border-teal-600 bg-teal-600 text-white"
        : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    }`

  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-300 px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Careers</span>
          </nav>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-slate-800">
            <Rocket size={14} /> We are hiring
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Help us make learning feel calm
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            LearnSphere is a small team building the tools that let academies and teachers share lessons, run quizzes
            and issue certificates. Join us and see your work help real learners every day.
          </p>
          <a
            href="#open-roles"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            See open roles <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What we care about</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950">
                <Sparkles size={18} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-300 px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Perks and benefits</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="open-roles" className="mx-auto max-w-300 scroll-mt-24 px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Open roles</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {DEPARTMENTS.map((d) => (
            <button key={d} type="button" className={chip(department === d)} onClick={() => setDepartment(d)}>
              {d}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {roles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-14 text-center dark:border-slate-700">
              <p className="font-semibold text-slate-900 dark:text-white">No open roles in this team right now</p>
              <p className="mt-1 text-sm text-slate-500">Check back soon, or send us a note below.</p>
            </div>
          ) : (
            roles.map((r) => (
              <div
                key={r.title}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 transition-colors hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{r.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{r.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-teal-600" />{r.department}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-teal-600" />{r.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} className="text-teal-600" />{r.type}</span>
                  </div>
                </div>
                <a
                  href={`mailto:hello@learnsphere.com?subject=${encodeURIComponent(`Application: ${r.title}`)}`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-teal-200 px-4 text-sm font-semibold text-teal-700 hover:bg-teal-50 dark:border-teal-900 dark:text-teal-300 dark:hover:bg-teal-950"
                >
                  Apply <ArrowRight size={15} />
                </a>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Do not see a role that fits?</p>
            <p className="text-sm text-slate-500">Tell us how you would like to help. We read every message.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}