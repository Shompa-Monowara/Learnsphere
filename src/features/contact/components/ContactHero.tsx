import { Link } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import type { ContactInfo } from "../api"

export function ContactHero({ hero }: { hero: ContactInfo["hero"] }) {
  return (
    <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <span>›</span>
          <span className="font-medium text-slate-900 dark:text-white">Contact</span>
        </nav>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-slate-800">
          <MessageCircle size={14} /> {hero.badge}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">{hero.body}</p>
      </div>
    </section>
  )
}