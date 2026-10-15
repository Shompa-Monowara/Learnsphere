import { Link } from "react-router-dom"
import { ArrowRight, BarChart3, Briefcase, Cloud, Code2, Megaphone, Palette, ShieldCheck, Smartphone } from "lucide-react"

const CATEGORIES = [
  { icon: Code2, name: "Web Development", count: "1,820" },
  { icon: BarChart3, name: "Data Science", count: "1,180" },
  { icon: Palette, name: "UI/UX Design", count: "960" },
  { icon: Cloud, name: "Cloud & DevOps", count: "780" },
  { icon: Megaphone, name: "Marketing", count: "1,050" },
  { icon: Smartphone, name: "Mobile Development", count: "640" },
  { icon: Briefcase, name: "Business & Finance", count: "1,240" },
  { icon: ShieldCheck, name: "Cybersecurity", count: "520" },
]

export default function Categories() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-950 dark:text-teal-300">Browse by topic</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">Popular course categories</h2>
            <p className="mt-3 max-w-lg text-slate-600 dark:text-slate-400">From first lines of code to advanced data models, find the track that moves you forward.</p>
          </div>
          <Link to="/courses" className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
            View all courses <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ icon: Icon, name, count }) => (
            <Link key={name} to="/courses" className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-800">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-950">
                <Icon size={22} />
              </span>
              <span>
                <span className="block font-semibold">{name}</span>
                <span className="text-xs text-slate-500">{count} courses</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}