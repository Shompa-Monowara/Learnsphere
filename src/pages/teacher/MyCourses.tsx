import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, BookOpen, Eye, Pencil, Plus, Search, Star, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import { BTN_PRIMARY } from "@/features/student/ui"
import type { CourseStatus, TeacherCourseRow } from "@/features/teacher/types"
import { useLoad } from "@/features/teacher/useLoad"
import { usd } from "@/features/teacher/utils"
import { api, getErrorMessage } from "@/services/api"

type SortKey = "title" | "status" | "studentsCount" | "ratingAvg" | "revenue"
type SortState = { key: SortKey; dir: 1 | -1 }

const STATUS: Record<CourseStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-600" },
  pending: { label: "In review", cls: "bg-amber-50 text-amber-700" },
  published: { label: "Published", cls: "bg-green-50 text-green-700" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700" },
  unpublished: { label: "Unpublished", cls: "bg-slate-100 text-slate-500" },
}

interface HeadProps {
  k: SortKey
  label: string
  right?: boolean
  sort: SortState
  onSort: (key: SortKey) => void
}

function Head({ k, label, right, sort, onSort }: HeadProps) {
  return (
    <th className={`px-5 py-4 ${right ? "text-right" : ""}`}>
      <button type="button" onClick={() => onSort(k)} className="inline-flex items-center gap-1 font-semibold">
        {label}
        {sort.key === k ? (
          sort.dir === 1 ? (
            <ArrowUp size={13} className="text-teal-600" />
          ) : (
            <ArrowDown size={13} className="text-teal-600" />
          )
        ) : (
          <ArrowUpDown size={13} className="text-slate-300" />
        )}
      </button>
    </th>
  )
}

export default function MyCourses() {
  const { data, setData, loading, error, reload } = useLoad<{ courses: TeacherCourseRow[] }>("/teacher/courses")
  const [q, setQ] = useState("")
  const [sort, setSort] = useState<SortState>({ key: "studentsCount", dir: -1 })
  const [notice, setNotice] = useState("")

  const rows = useMemo(() => {
    const list = (data?.courses ?? []).filter((c) => c.title.toLowerCase().includes(q.trim().toLowerCase()))
    return [...list].sort((a, b) => {
      const x = a[sort.key]
      const y = b[sort.key]
      return (typeof x === "string" ? x.localeCompare(y as string) : (x as number) - (y as number)) * sort.dir
    })
  }, [data, q, sort])

  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === "title" ? 1 : -1 }))

  const remove = async (c: TeacherCourseRow) => {
    if (!window.confirm(`Delete "${c.title}"? This cannot be undone.`)) return
    setNotice("")
    try {
      await api.delete(`/courses/${c._id}`)
      setData((d) => d && { courses: d.courses.filter((x) => x._id !== c._id) })
    } catch (err) {
      setNotice(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="My Courses"
        title="My Courses"
        subtitle="Manage, edit, and track the performance of every course you teach."
        action={
          <Link to="/teacher/builder" className={BTN_PRIMARY}>
            <Plus size={16} /> Create course
          </Link>
        }
      />

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {notice && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{notice}</p>}

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {rows.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              {data?.courses.length ? "No courses match your search." : "You haven't created any courses yet."}
            </div>
          ) : (
            <table className="w-full min-w-[820px] text-left text-xs text-slate-500">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <Head k="title" label="Course" sort={sort} onSort={toggle} />
                  <Head k="status" label="Status" sort={sort} onSort={toggle} />
                  <Head k="studentsCount" label="Students" right sort={sort} onSort={toggle} />
                  <Head k="ratingAvg" label="Rating" sort={sort} onSort={toggle} />
                  <Head k="revenue" label="Revenue" right sort={sort} onSort={toggle} />
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((c) => (
                  <tr key={c._id}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {c.thumbnail ? (
                          <img src={c.thumbnail} alt="" className="h-12 w-20 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <span className="grid h-12 w-20 shrink-0 place-items-center rounded-lg bg-linear-to-br from-teal-500 to-teal-700 text-white/80">
                            <BookOpen size={18} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.title}</p>
                          <p className="text-xs text-slate-500">
                            {c.category} · {c.lessonsCount} lessons
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        title={c.status === "rejected" ? c.rejectionReason : undefined}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS[c.status].cls}`}
                      >
                        {STATUS[c.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900 dark:text-white">
                      {c.studentsCount.toLocaleString("en-US")}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.ratingCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm text-slate-700 dark:text-slate-200">
                          <Star size={13} className="fill-orange-400 text-orange-400" />
                          {c.ratingAvg.toFixed(1)}
                          <span className="text-xs text-slate-400">({c.ratingCount.toLocaleString("en-US")})</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No ratings</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900 dark:text-white">
                      {usd(c.revenue)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/teacher/builder/${c._id}`}
                          title="Edit"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700"
                        >
                          <Pencil size={14} />
                        </Link>
                        <Link
                          to={`/courses/${c._id}`}
                          title="View"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => void remove(c)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </PageState>
    </div>
  )
}