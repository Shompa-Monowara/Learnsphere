import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListVideo,
  Mic,
  Search,
  SlidersHorizontal,
  Star,
  UserCheck,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { fetchInstructors } from "@/features/instructors/api"
import type { InstructorItem, InstructorsResponse } from "@/features/instructors/api"
import InstructorModal from "@/features/instructors/InstructorModal"

const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 4.5, label: "4.5 & up" },
  { value: 4, label: "4.0 & up" },
  { value: 3.5, label: "3.5 & up" },
]

const SORT_OPTIONS = [
  { value: "top", label: "Top rated" },
  { value: "students", label: "Most students" },
  { value: "courses", label: "Most courses" },
  { value: "name", label: "Name (A–Z)" },
]

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n)

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < Math.round(rating) ? "fill-[#f97316] text-[#f97316]" : "text-slate-300"}
        />
      ))}
    </div>
  )
}

function InstructorCard({ i, onView }: { i: InstructorItem; onView: (i: InstructorItem) => void }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.12)] dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[4/4.4] w-full overflow-hidden bg-teal-50">
        {i.avatar ? (
          <img src={i.avatar} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-teal-500 to-teal-800 text-5xl font-bold text-white">
            {initials(i.name)}
          </div>
        )}
        {i.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-xs">
            {i.category}
          </span>
        )}
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-bold text-white">
          <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" /> {i.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{i.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
          {i.headline || "LearnSphere instructor"}
        </p>

        <div className="mt-3 flex min-h-[52px] flex-wrap content-start gap-1.5">
          {i.skills.map((s) => (
            <span
              key={s}
              className="max-w-full truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Stars rating={i.rating} />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{i.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-slate-500">{compact(i.studentsCount)} students</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <ListVideo size={14} className="text-slate-400" /> {i.coursesCount} course{i.coursesCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={() => onView(i)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-slate-900 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            View profile <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[4/4.4] bg-slate-100 dark:bg-slate-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-9 w-full rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )
}

export default function Instructors() {
  const [search, setSearch] = useState("")
  const [q, setQ] = useState("")
  const [category, setCategory] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [sort, setSort] = useState("top")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<InstructorItem | null>(null)

  const [data, setData] = useState<InstructorsResponse | null>(null)
  const [done, setDone] = useState<{ key: string; error: boolean } | null>(null)
  const [attempt, setAttempt] = useState(0)

  const closeModal = useCallback(() => setSelected(null), [])

  /* Search debounce */
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  /* Ei request ta ke unique chinte key; key bodlale status auto "loading" hoye jay */
  const key = JSON.stringify([q, category, minRating, sort, page, attempt])
  const status: "loading" | "ready" | "error" =
    done?.key === key ? (done.error ? "error" : "ready") : "loading"

  useEffect(() => {
    let active = true
    fetchInstructors({ q, category, minRating, sort, page })
      .then((res) => {
        if (!active) return
        setData(res)
        setDone({ key, error: false })
      })
      .catch(() => {
        if (active) setDone({ key, error: true })
      })
    return () => {
      active = false
    }
  }, [key, q, category, minRating, sort, page])

  const summary = data?.summary
  const total = data?.total ?? 0
  const limit = data?.limit ?? 8
  const pages = data?.pages ?? 1
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const resetFilters = () => {
    setSearch("")
    setQ("")
    setCategory("")
    setMinRating(0)
    setSort("top")
    setPage(1)
  }

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
      active
        ? "border-teal-600 bg-teal-600 text-white"
        : "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    }`

  const selectCls =
    "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium text-slate-800 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200/70 bg-linear-to-br from-teal-50 via-white to-orange-50/40 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Instructors</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-slate-800">
                <UserCheck size={14} /> Vetted practitioners
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Meet our instructors
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Every LearnSphere instructor is reviewed for subject depth and teaching track record. Browse
                practitioners who still work in the fields they teach — then pick the one who fits your goal.
              </p>
            </div>

            <div className="grid min-w-[280px] grid-cols-2 gap-x-8 gap-y-5 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900">
              {[
                [summary ? `${summary.instructors}` : "—", "Expert instructors"],
                [summary ? summary.students.toLocaleString() : "—", "Students taught"],
                [summary ? `${summary.avgRating.toFixed(1)} / 5` : "—", "Average rating"],
                [summary ? `${summary.disciplines}` : "—", "Disciplines"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-teal-600">{value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-[1fr_190px_200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill or topic..."
                className="h-11 rounded-xl bg-slate-50 pl-10 dark:bg-slate-800"
              />
            </div>

            <div className="relative">
              <Star size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={minRating}
                onChange={(e) => { setMinRating(Number(e.target.value)); setPage(1) }}
                className={selectCls}
              >
                {RATING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <SlidersHorizontal size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1) }}
                className={selectCls}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex flex-wrap gap-2">
              <button type="button" className={chip(category === "")} onClick={() => { setCategory(""); setPage(1) }}>
                All
              </button>
              {data?.categories.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={chip(category === c.name)}
                  onClick={() => { setCategory(c.name); setPage(1) }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {status === "ready" ? `${total} instructor${total === 1 ? "" : "s"} match your filters` : "Loading..."}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {status === "error" ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-16 text-center">
              <AlertCircle className="text-slate-400" size={28} />
              <p className="mt-3 font-semibold text-slate-900 dark:text-white">Couldn't load instructors</p>
              <button
                onClick={() => setAttempt((a) => a + 1)}
                className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Try again
              </button>
            </div>
          ) : status === "loading" && !data ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, k) => <CardSkeleton key={k} />)}
            </div>
          ) : total === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-16 text-center">
              <p className="font-semibold text-slate-900 dark:text-white">No instructors match your filters</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${
                status === "loading" ? "opacity-60" : "opacity-100"
              }`}
            >
              {data?.instructors.map((i) => <InstructorCard key={i._id} i={i} onView={setSelected} />)}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/70 pt-6 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              Showing <b className="text-slate-900 dark:text-white">{from}–{to}</b> of{" "}
              <b className="text-slate-900 dark:text-white">{total}</b> instructors
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-teal-300 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pages }).map((_, k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPage(k + 1)}
                  className={`h-9 w-9 rounded-lg border text-sm font-semibold transition-colors ${
                    page === k + 1
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:border-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  {k + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-teal-300 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Become an instructor */}
        <div className="relative mt-14 overflow-hidden rounded-3xl bg-linear-to-br from-teal-700 via-teal-600 to-teal-500 p-8 shadow-[0_20px_50px_-15px_rgba(13,148,136,0.5)] sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                <Mic size={13} /> Teach on LearnSphere
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Become an instructor
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-teal-50">
                Share the work you already do. We handle hosting, quizzes, grading tools and verifiable
                certificates — you keep 80% of every enrollment and own your content.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white">
                {["Launch in 4–6 weeks", "Production support included", "Paid monthly"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check size={15} strokeWidth={3} /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[250px]">
              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:bg-teal-50"
              >
                Register as an instructor <ArrowRight size={16} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                See teaching tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {selected && <InstructorModal instructor={selected} onClose={closeModal} />}
    </>
  )
}