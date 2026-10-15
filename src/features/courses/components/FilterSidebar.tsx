import { useState } from "react"
import type { ReactNode } from "react"
import { ChevronUp, SlidersHorizontal, Star } from "lucide-react"
import type { Filters } from "../data"

const LEVELS = ["Beginner", "Intermediate", "Advanced"]
const DURATIONS = [["short", "0 – 20 hours"], ["medium", "20 – 30 hours"], ["long", "30+ hours"]]
const PRICES = [["free", "Free"], ["under", "Under $45"], ["mid", "$45 – $60"], ["over", "Over $60"]]
const RATINGS = [[0, "Any rating"], [4.5, "4.5 & up"], [4, "4.0 & up"], [3.5, "3.5 & up"]] as const

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-t border-slate-100 py-5 dark:border-slate-800">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-sm font-semibold">
        {title}
        <ChevronUp size={16} className={`text-slate-400 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  )
}

interface Props {
  filters: Filters
  onChange: (next: Filters) => void
  categories: [string, number][]
}

export default function FilterSidebar({ filters, onChange, categories }: Props) {
  const toggle = (key: "categories" | "levels" | "durations" | "prices", value: string) => {
    const list = filters[key]
    onChange({ ...filters, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] })
  }

  const check = (key: "categories" | "levels" | "durations" | "prices", value: string, label: string, count?: number) => (
    <label key={value} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
      <input type="checkbox" checked={filters[key].includes(value)} onChange={() => toggle(key, value)} className="h-4 w-4 rounded accent-teal-600" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-slate-400">{count}</span>}
    </label>
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 pb-5 font-semibold">
        <SlidersHorizontal size={16} className="text-teal-600" /> Filters
      </div>

      <Section title="Category">{categories.map(([name, n]) => check("categories", name, name, n))}</Section>
      <Section title="Level">{LEVELS.map((l) => check("levels", l, l))}</Section>
      <Section title="Rating">
        {RATINGS.map(([value, label]) => (
          <label key={label} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
            <input type="radio" name="rating" checked={filters.rating === value} onChange={() => onChange({ ...filters, rating: value })} className="h-4 w-4 accent-teal-600" />
            {value > 0 && <Star size={14} className="fill-orange-400 text-orange-400" />}
            {label}
          </label>
        ))}
      </Section>
      <Section title="Duration">{DURATIONS.map(([v, l]) => check("durations", v, l))}</Section>
      <Section title="Price">{PRICES.map(([v, l]) => check("prices", v, l))}</Section>
    </div>
  )
}