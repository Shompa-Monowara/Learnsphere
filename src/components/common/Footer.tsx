import { Link } from "react-router-dom"
import { GraduationCap } from "lucide-react"

const GROUPS = [
  { title: "Platform", links: [["Courses", "/courses"], ["Instructors", "/instructors"], ["Features", "/features"], ["Pricing", "/pricing"]] },
  { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["Blog", "/blog"]] },
  { title: "Resources", links: [["Help Center", "/faq"], ["Login", "/login"], ["Register", "/register"]] },
  { title: "Legal", links: [["Terms", "/terms"], ["Privacy", "/privacy"]] },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-6">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
              <GraduationCap size={22} />
            </span>
            <span className="text-xl font-bold">
              Learn<span className="text-teal-600">Sphere</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            A simple learning platform for small academies and teachers to share lessons, assignments and quizzes.
          </p>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h4 className="text-sm font-semibold">{g.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {g.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-slate-600 hover:text-teal-600 dark:text-slate-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} LearnSphere. All rights reserved.
      </div>
    </footer>
  )
}