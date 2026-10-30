import { Link } from "react-router-dom"
import { ArrowRight, Award, BookOpen, PlusCircle } from "lucide-react"

const STEPS = [
  {
    icon: PlusCircle,
    step: "01",
    title: "Create or enroll",
    desc: "Teachers build a course with sections, video lessons, PDFs, quizzes, and assignments. Students browse the catalog and enroll in seconds.",
  },
  {
    icon: BookOpen,
    step: "02",
    title: "Learn and practice",
    desc: "Students work through lessons at their own pace, take auto-graded quizzes, and submit assignments for personalised teacher feedback.",
  },
  {
    icon: Award,
    step: "03",
    title: "Get certified",
    desc: "Complete every requirement and LearnSphere issues a verifiable PDF certificate you can download, print, and share with employers.",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#dcfce7]/60 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0d9488] dark:bg-teal-500/10 dark:text-teal-300">
            How it works
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[42px]">
            From idea to certificate in three steps
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            Whether you are launching your first course or running a full academy, the workflow stays refreshingly simple.
          </p>
        </div>

        {/* Steps Grid with Continuous Connecting Line */}
        <div className="relative mt-20">
          {/* Solid Connecting Line */}
          <div className="absolute left-[16%] right-[16%] top-9 hidden h-[1.5px] bg-[#99f6e4] dark:bg-teal-800 md:block" />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map(({ icon: Icon, step, title, desc }) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                {/* Rounded Square Card with Number Badge */}
                <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
                  <Icon size={26} className="text-[#0d9488] stroke-[1.8] dark:text-teal-400" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f97316] text-[10px] font-bold text-white shadow-xs">
                    {step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-8 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-3 max-w-[280px] text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[13px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d9488] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f766e]"
          >
            Create your first course <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}