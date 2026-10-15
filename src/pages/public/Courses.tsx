import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, ChevronLeft, ChevronRight, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAllCourses } from "@/features/courses/api"
import CourseCard from "@/features/courses/components/CourseCard"
import FilterSidebar from "@/features/courses/components/FilterSidebar"
import { EMPTY_FILTERS } from "@/features/courses/data"
import type { CatalogCourse, Filters } from "@/features/courses/data"
import { useWishlist } from "@/features/courses/hooks/useWishlist"

const PER_PAGE = 9

const matchDuration = (c: CatalogCourse, key: string) =>
  key === "short" ? c.hours < 20 : key === "medium" ? c.hours >= 20 && c.hours <= 30 : c.hours > 30

const matchPrice = (c: CatalogCourse, key: string) =>
  key === "free" ? c.price === 0 : key === "under" ? c.price > 0 && c.price < 45 : key === "mid" ? c.price >= 45 && c.price <= 60 : c.price > 60

export default function Courses() {
  const [courses, setCourses] = useState<CatalogCourse[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [attempt, setAttempt] = useState(0)

  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState("popular")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const { ids, toggle } = useWishlist()

  useEffect(() => {
    let active = true
    fetchAllCourses()
      .then((data) => {
        if (!active) return
        setCourses(data)
        setStatus("ready")
      })
      .catch(() => {
        if (active) setStatus("error")
      })
    return () => {
      active = false
    }
  }, [attempt])

  const retry = () => {
    setStatus("loading")
    setAttempt((a) => a + 1)
  }

  const categories = useMemo(() => {
    const map = new Map<string, number>()
    courses.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1))
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [courses])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = courses.filter((c) => {
      if (q && !`${c.title} ${c.category} ${c.instructor}`.toLowerCase().includes(q)) return false
      if (filters.categories.length && !filters.categories.includes(c.category)) return false
      if (filters.levels.length && !filters.levels.includes(c.level)) return false
      if (filters.rating && c.rating < filters.rating) return false
      if (filters.durations.length && !filters.durations.some((d) => matchDuration(c, d))) return false
      if (filters.prices.length && !filters.prices.some((p) => matchPrice(c, p))) return false
      return true
    })
    const sorters: Record<string, (a: CatalogCourse, b: CatalogCourse) => number> = {
      popular: (a, b) => b.students - a.students,
      rating: (a, b) => b.rating - a.rating,
      "price-low": (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
    }
    return [...list].sort(sorters[sort])
  }, [courses, query, filters, sort])

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const current = Math.min(page, pages)
  const visible = results.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const updateFilters = (next: Filters) => {
    setFilters(next)
    setPage(1)
  }
  const reset = () => {
    setFilters(EMPTY_FILTERS)
    setQuery("")
    setPage(1)
  }

  return (
    <>
      <section className="bg-linear-to-br from-teal-50 via-white to-orange-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Courses</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Explore our courses</h1>
              <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
                Discover expert-led courses across data, design, development, business, and more. Filter by what matters to you and start learning today.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                placeholder="Search courses, topics, instructors..."
                className="h-12 rounded-xl bg-white pl-10 dark:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <FilterSidebar filters={filters} onChange={updateFilters} categories={categories} />
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {status === "ready" ? <>Showing <b className="text-slate-900 dark:text-white">{results.length}</b> courses</> : "Loading courses..."}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-lg lg:hidden" onClick={() => setShowFilters((v) => !v)}>
                  {showFilters ? <X size={14} /> : <SlidersHorizontal size={14} />} Filters
                </Button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort courses"
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="popular">Most popular</option>
                  <option value="rating">Highest rated</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
                <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
                  {([["grid", LayoutGrid], ["list", List]] as const).map(([v, Icon]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      aria-label={`${v} view`}
                      aria-pressed={view === v}
                      className={`flex h-8 w-8 items-center justify-center rounded-md ${view === v ? "bg-teal-600 text-white" : "text-slate-500"}`}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {status === "loading" && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-8 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {status === "error" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-900 dark:bg-red-950/30">
                <AlertCircle size={32} className="mx-auto text-red-500" />
                <h3 className="mt-4 text-lg font-semibold">Could not load courses</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Check that the server is running, then try again.</p>
                <Button onClick={retry} className="mt-5 rounded-xl bg-teal-600 text-white hover:bg-teal-700">Try again</Button>
              </div>
            )}

            {status === "ready" && visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
                <Search size={32} className="mx-auto text-slate-300" />
                {courses.length === 0 ? (
                  <>
                    <h3 className="mt-4 text-lg font-semibold">No courses published yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Courses appear here after a teacher submits them and an admin approves them.</p>
                  </>
                ) : (
                  <>
                    <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try a different search or clear the filters.</p>
                    <Button onClick={reset} className="mt-5 rounded-xl bg-teal-600 text-white hover:bg-teal-700">Clear all filters</Button>
                  </>
                )}
              </div>
            )}

            {status === "ready" && visible.length > 0 && (
              <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-5"}>
                {visible.map((c) => (
                  <CourseCard key={c.id} course={c} view={view} liked={ids.has(c.id)} onToggleLike={() => toggle(c.id)} />
                ))}
              </div>
            )}

            {status === "ready" && pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)} className="rounded-lg">
                  <ChevronLeft size={14} /> Prev
                </Button>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    aria-current={current === i + 1 ? "page" : undefined}
                    className={`h-9 w-9 rounded-lg text-sm font-medium ${current === i + 1 ? "bg-teal-600 text-white" : "border border-slate-200 hover:bg-slate-50 dark:border-slate-700"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button variant="outline" size="sm" disabled={current === pages} onClick={() => setPage(current + 1)} className="rounded-lg">
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}