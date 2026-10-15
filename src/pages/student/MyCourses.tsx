import { LayoutGrid, List, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import EmptyState from "@/features/student/components/EmptyState"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import Tabs from "@/features/student/components/Tabs"
import type { EnrollmentItem } from "@/features/student/portal-types"
import { BTN_PRIMARY, CARD } from "@/features/student/ui"
import { formatHours } from "@/features/student/utils"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"

type Filter = "all" | "in-progress" | "completed" | "not-started"

const STATUS = {
  "in-progress": { label: "In Progress", style: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" },
  completed: { label: "Completed", style: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" },
  "not-started": { label: "Not Started", style: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
}

function CourseCard({ item, view }: { item: EnrollmentItem; view: "grid" | "list" }) {
  const c = item.course!
  const list = view === "list"
  return (
    <Link
      to={`/student/learn/${c._id}`}
      className={cn(CARD, "overflow-hidden transition-shadow hover:shadow-md", list ? "flex flex-col sm:flex-row" : "flex flex-col")}
    >
      <div className={cn("relative shrink-0 bg-linear-to-br from-teal-500 to-emerald-900", list ? "h-40 sm:h-auto sm:w-64" : "h-40")}>
        {c.thumbnail && <img src={c.thumbnail} alt={c.title} loading="lazy" className="h-full w-full object-cover" />}
        {c.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
            {c.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS[item.status].style)}>
            {STATUS[item.status].label}
          </span>
          <span className="text-xs text-slate-400">{formatHours(c.totalDuration)}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">{c.title}</h3>
        <p className="mt-2 text-xs text-slate-500">{c.instructor?.name}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{item.progress}% complete</span>
            <span>{c.lessonsCount} lessons</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={cn("h-full rounded-full", item.progress >= 100 ? "bg-green-500" : "bg-teal-600")}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function MyCourses() {
  const { data, loading, error, reload } = useFetch<{ enrollments: EnrollmentItem[] }>("/enrollments/mine")
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  const items = useMemo(() => (data?.enrollments ?? []).filter((e) => e.course), [data])
  const count = (s: Filter) => (s === "all" ? items.length : items.filter((e) => e.status === s).length)

  const visible = items.filter(
    (e) =>
      (filter === "all" || e.status === filter) &&
      e.course!.title.toLowerCase().includes(query.trim().toLowerCase())
  )

  const viewBtn = (v: "grid" | "list") =>
    cn(
      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
      view === v ? "bg-teal-50 text-teal-700" : "text-slate-400 hover:text-slate-700"
    )

  return (
    <div className="space-y-8">
      <PageHeader crumb="My Courses" title="My Courses" subtitle="Every course you're enrolled in, with live progress tracking." />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs
            value={filter}
            onChange={setFilter}
            tabs={[
              { value: "all", label: "All", count: count("all") },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
              { value: "not-started", label: "Not Started" },
            ]}
          />
          <div className="flex items-center gap-2">
            <div className={cn(CARD, "flex items-center gap-2 px-3")}>
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search my courses..."
                className="h-10 w-48 bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-64"
              />
            </div>
            <div className={cn(CARD, "flex p-1")}>
              <button type="button" onClick={() => setView("grid")} className={viewBtn("grid")} aria-label="Grid view">
                <LayoutGrid size={16} />
              </button>
              <button type="button" onClick={() => setView("list")} className={viewBtn("list")} aria-label="List view">
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="You haven't enrolled in any course yet"
            text="Browse the catalog and start learning today."
            action={<Link to="/courses" className={BTN_PRIMARY}>Browse courses</Link>}
          />
        ) : visible.length === 0 ? (
          <EmptyState title="No courses found" text="Try a different filter or search term." />
        ) : (
          <div className={cn("grid gap-5", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1")}>
            {visible.map((item) => (
              <CourseCard key={item._id} item={item} view={view} />
            ))}
          </div>
        )}
      </PageState>
    </div>
  )
}