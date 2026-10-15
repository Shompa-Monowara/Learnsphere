import { ArrowRight, Play, User } from "lucide-react"
import { Link } from "react-router-dom"
import type { ContinueItem } from "../types"
import { formatMinutes } from "../utils"

function Card({ item }: { item: ContinueItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-36 bg-linear-to-br from-teal-500 to-emerald-900">
        {item.thumbnail && (
          <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        )}
        {item.category && (
          <span className="absolute bottom-3 left-3 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
            {item.category}
          </span>
        )}
        <Link
          to={`/student/learn/${item.courseId}`}
          aria-label="Play"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-teal-700 shadow"
        >
          <Play size={14} fill="currentColor" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-900 dark:text-white">
          {item.title}
        </h3>
        {item.instructor && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <User size={12} className="text-teal-600" />
            {item.instructor}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-teal-600" style={{ width: `${item.progress}%` }} />
          </div>
          <span className="text-xs font-medium text-slate-500">{item.progress}%</span>
        </div>

        {item.nextLesson && (
          <p className="mt-3 line-clamp-1 text-xs text-slate-500">
            Next: <span className="font-medium text-slate-700 dark:text-slate-200">{item.nextLesson}</span>
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xs text-slate-400">{formatMinutes(item.minutesLeft)}</span>
          <Link
            to={`/student/learn/${item.courseId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Continue <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ContinueLearning({ items }: { items: ContinueItem[] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Continue learning</h2>
        <Link to="/student/courses" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="font-semibold text-slate-900 dark:text-white">No courses in progress</p>
          <p className="mt-1 text-sm text-slate-500">Enroll in a course to start learning.</p>
          <Link
            to="/courses"
            className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.enrollmentId} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}