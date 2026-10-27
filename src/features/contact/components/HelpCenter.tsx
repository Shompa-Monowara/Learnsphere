import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react"
import type { ContactInfo } from "../api"

export function HelpCenter({ help }: { help: ContactInfo["help"] }) {
  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-900 dark:bg-teal-950/30">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-600 shadow-xs dark:bg-slate-900">
          <BookOpen size={17} />
        </span>
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Help Center</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{help.body}</p>
      <ul className="mt-3 space-y-1.5">
        {help.links.map((t) => (
          <li key={t}>
            <Link
              to={help.to}
              className="flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-300"
            >
              <ChevronRight size={12} className="text-slate-400" /> {t}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={help.to}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white text-sm font-semibold text-slate-900 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-teal-900 dark:bg-slate-900 dark:text-white"
      >
        Browse the Help Center <ArrowRight size={15} />
      </Link>
    </div>
  )
}