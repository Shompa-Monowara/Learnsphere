import { X } from "lucide-react"
import { useEffect } from "react"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import type { AdminCourseRow } from "../types"

interface Lesson {
  _id: string
  title: string
  type: string
  duration?: number
}
interface Section {
  _id: string
  title: string
  lessons: Lesson[]
}
interface Detail {
  course: {
    description?: string
    shortDescription?: string
    level?: string
    language?: string
    outcomes?: string[]
    requirements?: string[]
    sections: Section[]
  }
}

interface Props {
  course: AdminCourseRow
  onClose: () => void
  actions?: React.ReactNode
}

export default function CourseReviewModal({ course, onClose, actions }: Props) {
  const { data, loading, error } = useFetch<Detail>(`/courses/${course._id}`)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  const c = data?.course

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {course.instructor?.name ?? "Unknown"} · {course.category?.name ?? "Uncategorised"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-6 text-sm">
          {loading && <p className="text-slate-500">Loading course...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {c && (
            <>
              <div className="flex flex-wrap gap-2 text-xs">
                {[c.level, c.language].filter(Boolean).map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
              {(c.description || c.shortDescription) && (
                <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">{c.description || c.shortDescription}</p>
              )}
              {!!c.outcomes?.length && (
                <div>
                  <p className="mb-1.5 font-semibold text-slate-900 dark:text-white">What students learn</p>
                  <ul className="list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
                    {c.outcomes.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="mb-1.5 font-semibold text-slate-900 dark:text-white">Curriculum</p>
                {c.sections.length === 0 && <p className="text-slate-500">No sections added yet.</p>}
                <div className="space-y-2">
                  {c.sections.map((s) => (
                    <div key={s._id} className="rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="border-b border-slate-100 px-4 py-2.5 font-medium text-slate-800 dark:border-slate-800 dark:text-slate-100">
                        {s.title} <span className="text-slate-400">· {s.lessons.length} lessons</span>
                      </p>
                      <ul className="divide-y divide-slate-50 dark:divide-slate-800">
                        {s.lessons.map((l) => (
                          <li key={l._id} className="flex items-center justify-between px-4 py-2 text-slate-600 dark:text-slate-300">
                            <span className="truncate">{l.title}</span>
                            <span className={cn("ml-3 shrink-0 text-xs capitalize text-slate-400")}>{l.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {actions && <div className="flex justify-end gap-3 border-t border-slate-100 p-4 dark:border-slate-800">{actions}</div>}
      </div>
    </div>
  )
}