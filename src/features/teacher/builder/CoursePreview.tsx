import { Eye, ImageIcon, Star } from "lucide-react"
import { PANEL } from "./ui"
import type { BuilderForm } from "./types"

interface Props {
  form: BuilderForm
  categoryName: string
  instructor: string
  lessons: number
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default function CoursePreview({ form, categoryName, instructor, lessons }: Props) {
  const sell = Number(form.price || 0)

  return (
    <aside className={`${PANEL} xl:sticky xl:top-24`}>
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
        <Eye size={15} /> Live preview
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="relative aspect-video bg-linear-to-br from-teal-500 to-teal-800">
          {form.thumbnail ? (
            <img src={form.thumbnail} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-white/70">
              <ImageIcon size={34} />
            </div>
          )}
          {categoryName && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
              {categoryName}
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="line-clamp-2 min-h-10 font-bold text-slate-900 dark:text-white">
            {form.title || "Your course title"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {instructor} · {cap(form.level)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
            ))}
            <span className="ml-1">(0)</span>
          </div>
          <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <p className="text-xl font-bold text-slate-900 dark:text-white">{sell > 0 ? `$${sell}` : "Free"}</p>
            <p className="text-xs text-slate-400">
              {lessons} lesson{lessons === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">This is how your course card will appear in the catalog.</p>
    </aside>
  )
}