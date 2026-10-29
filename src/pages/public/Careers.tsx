import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, ChevronLeft, ChevronRight, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchCategoryOptions, fetchCoursesPage } from "@/features/courses/api"
import type { CategoryOption } from "@/features/courses/api"
import CourseCard from "@/features/courses/components/CourseCard"
import FilterSidebar from "@/features/courses/components/FilterSidebar"
import { EMPTY_FILTERS } from "@/features/courses/data"
import type { CatalogCourse, Filters } from "@/features/courses/data"
import { useWishlist } from "@/features/courses/hooks/useWishlist"

const PER_PAGE = 9

export default function Courses() {
  const [result, setResult] = useState<{ key: string; courses: CatalogCourse[]; total: number; pages: number; error: boolean } | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [attempt, setAttempt] = useState(0)

  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState("popular")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const { ids, toggle } = useWishlist()

  /* Search: user type korar 400ms por server e request jabe */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  /* Category list (admin ja banay) — ekbar load hobe */
  useEffect(() => {
    fetchCategoryOptions().then(setCategories).catch(() => setCategories([]))
  }, [])

  /* Filter / sort / page / search bodlale key bodlay, tokhon result purono hoye "loading" dekhay */
  const key = JSON.stringify([debouncedQuery, filters, sort, page, attempt])
  const status: "loading" | "ready" | "error" = !result || result.key !== key ? "loading" : result.error ? "error" : "ready"
  const courses = result?.courses ?? []
  const total = result?.total ?? 0
  const pages = result?.pages ?? 1

  useEffect(() => {
    const controller = new AbortController()
    fetchCoursesPage(
      {
        q: debouncedQuery,
        categories: filters.categories,
        levels: filters.levels,
        rating: filters.rating,
        durations: filters.durations,
        prices: filters.prices,
        sort,
        page,
        limit: PER_PAGE,
      },
      controller.signal
    )
      .then((data) => setResult({ key, courses: data.courses, total: data.total, pages: data.pages, error: false }))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return
        setResult({ key, courses: [], total: 0, pages: 1, error: true })
      })
    return () => controller.abort()
  }, [key, debouncedQuery, filters, sort, page])

  const retry = () => setAttempt((a) => a + 1)
  const noFilters =
    !debouncedQuery.trim() &&
    !filters.categories.length &&
    !filters.levels.length &&
    !filters.rating &&
    !filters.durations.length &&
    !filters.prices.length

  const current = Math.min(page, pages)

  const updateFilters = (next: Filters) => {
    setFilters(next)
    setPage(1)
  }
  const reset = () => {
    setFilters(EMPTY_FILTERS)
    setQuery("")
    setDebouncedQuery("")
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
                onChange={(e) => setQuery(e.target.value)}
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
                {status === "ready" ? <>Showing <b className="text-slate-900 dark:text-white">{total}</b> courses</> : "Loading courses..."}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-lg lg:hidden" onClick={() => setShowFilters((v) => !v)}>
                  {showFilters ? <X size={14} /> : <SlidersHorizontal size={14} />} Filters
                </Button>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1) }}
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

            {status === "ready" && courses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
                <Search size={32} className="mx-auto text-slate-300" />
                {noFilters ? (
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

            {status === "ready" && courses.length > 0 && (
              <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-5"}>
                {courses.map((c) => (
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