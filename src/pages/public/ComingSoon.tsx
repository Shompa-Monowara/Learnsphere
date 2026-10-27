import { Link } from "react-router-dom"
import { ArrowRight, ChartColumn, Layers, MessagesSquare, Rocket, Route, Smartphone, Video } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Status = "In development" | "In design" | "Planned"

interface Upcoming {
  icon: LucideIcon
  title: string
  text: string
  status: Status
}

const STATUS_STYLE: Record<Status, string> = {
  "In development": "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  "In design": "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  Planned: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
}

const UPCOMING: Upcoming[] = [
  {
    icon: Smartphone,
    title: "Mobile apps",
    text: "Learn on the go with iOS and Android apps that keep your progress in sync.",
    status: "In design",
  },
  {
    icon: Video,
    title: "Live classes",
    text: "Schedule live sessions inside a course, with reminders and recordings for students who miss them.",
    status: "In development",
  },
  {
    icon: MessagesSquare,
    title: "Course discussions",
    text: "A place on every course for students to ask questions and help each other.",
    status: "In design",
  },
  {
    icon: Route,
    title: "Learning paths",
    text: "Group several courses into a guided path with one certificate at the end.",
    status: "Planned",
  },
  {
    icon: ChartColumn,
    title: "Team analytics",
    text: "See how every cohort is progressing, where learners get stuck and who has finished.",
    status: "In development",
  },
  {
    icon: Layers,
    title: "Course bundles",
    text: "Instructors will be able to sell several courses together at a better price.",
    status: "Planned",
  },
]

export default function ComingSoon() {
  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Coming soon</span>
          </nav>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-slate-800">
            <Rocket size={14} /> On the roadmap
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Something new is on its way
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Here is a peek at what we are building next. Plans change as we listen to learners and instructors, so
            nothing here has a fixed date yet.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {UPCOMING.map(({ icon: Icon, title, text, status }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950">
                  <Icon size={22} />
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
                  {status}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Have an idea for LearnSphere?</p>
            <p className="text-sm text-slate-500">Tell us what you would like to see. We read every message.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
            >
              Share your idea <ArrowRight size={15} />
            </Link>
            <Link
              to="/courses"
              className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}