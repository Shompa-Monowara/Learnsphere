import { Award, BarChart3, ClipboardCheck, FileText, LayoutDashboard, PlayCircle } from "lucide-react"

const FEATURES = [
  { icon: PlayCircle, color: "bg-teal-50 text-teal-600", title: "Video lessons", desc: "Upload or link high-quality video lessons with chapters, playback speed, and resume-where-you-left-off progress." },
  { icon: ClipboardCheck, color: "bg-orange-50 text-orange-500", title: "Quizzes with auto-grading", desc: "Build multiple-choice, multi-select, and short-answer quizzes. Results are graded instantly with explanations." },
  { icon: FileText, color: "bg-teal-50 text-teal-600", title: "Assignments & grading", desc: "Collect file submissions, set deadlines, leave inline feedback, and return grades from a single review queue." },
  { icon: BarChart3, color: "bg-teal-50 text-teal-600", title: "Progress tracking", desc: "See exactly where each student is, which lessons they struggle with, and how your course is performing in real time." },
  { icon: Award, color: "bg-orange-50 text-orange-500", title: "PDF certificates", desc: "Automatically issue branded, downloadable completion certificates the moment a student finishes a course." },
  { icon: LayoutDashboard, color: "bg-teal-50 text-teal-600", title: "Role-based dashboards", desc: "Dedicated, focused dashboards for admins, teachers, and students, so everyone sees what they need." },
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-950 dark:text-teal-300">Everything in one place</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight">A complete teaching toolkit, minus the busywork</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Stop stitching together five different tools. LearnSphere brings lessons, assessments, grading, progress, and certificates into one connected product.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon size={22} /></span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}