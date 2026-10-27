import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Briefcase, Clock, Globe, GraduationCap, Heart, MapPin, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const APPLY_EMAIL = "hello@learnsphere.com"

interface Role {
  title: string
  department: string
  location: string
  type: string
  summary: string
}

const ROLES: Role[] = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    summary: "Build the course player, grading tools and dashboards that thousands of learners use every day.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "San Francisco or Remote",
    type: "Full-time",
    summary: "Shape how people learn and teach online, from the first sign-up to the final certificate.",
  },
  {
    title: "Customer Support Specialist",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    summary: "Be the real person who answers learners and instructors, usually within hours.",
  },
  {
    title: "Instructor Success Manager",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    summary: "Help new instructors plan, launch and improve their first courses.",
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    summary: "Tell the stories of our learners and instructors and grow the LearnSphere blog.",
  },
]

const VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: GraduationCap,
    title: "Learning is the product",
    text: "We use LearnSphere to teach ourselves too, and we give you time to keep growing.",
  },
  {
    icon: Globe,
    title: "Work from where you work best",
    text: "Most roles are remote-friendly, with flexible hours and a focus on results over screen time.",
  },
  {
    icon: Sparkles,
    title: "Real ownership",
    text: "A small team means your work ships quickly and you see exactly who it helps.",
  },
  {
    icon: Heart,
    title: "Kind and direct",
    text: "We give honest feedback, assume good intent and reply to people like they are people.",
  },
]

const PERKS = [
  "Learning budget for courses, books and conferences",
  "Flexible working hours",
  "Paid time off and public holidays",
  "Equipment budget for your home office",
  "Team meetups once a year",
  "Free access to every course on LearnSphere",
]

export default function Careers() {
  const [department, setDepartment] = useState("All")

  const departments = useMemo(() => ["All", ...Array.from(new Set(ROLES.map((r) => r.department)))], [])
  const roles = ROLES.filter((r) => department === "All" || r.department === department)

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
      active
        ? "border-teal-600 bg-teal-600 text-white"
        : "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    }`

  const applyHref = (title: string) =>
    `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Application: ${title}`)}`

  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Careers</span>
          </nav>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-slate-800">
            <Briefcase size={14} /> We are hiring
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Help us make learning stick
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            We are a small team building tools for people who teach and people who learn. If you care about education
            and like doing careful work, we would love to meet you.
          </p>
          <a
            href="#open-roles"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-teal-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            See open roles <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Why LearnSphere
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50/60 p-6 sm:p-8 dark:border-teal-900 dark:bg-teal-950/30">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Perks and benefits</h3>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {PERKS.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="open-roles" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Open roles</h2>

        <div className="mt-5 flex flex-wrap gap-2">
          {departments.map((d) => (
            <button key={d} type="button" className={chip(department === d)} onClick={() => setDepartment(d)}>
              {d}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {roles.map((r) => (
            <div
              key={r.title}
              className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{r.summary}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={13} className="text-slate-400" /> {r.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" /> {r.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" /> {r.type}
                  </span>
                </div>
              </div>
              <a
                href={applyHref(r.title)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                Apply <ArrowRight size={15} />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Don't see your role?{" "}
            <b className="font-semibold text-slate-900 dark:text-white">
              Tell us what you would build and we will keep you in mind.
            </b>
          </p>
          <a
            href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("General application")}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            Send us a note <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </>
  )
}