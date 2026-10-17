import { Check, ChevronDown, CircleHelp, FileText, PlayCircle, SquarePen } from "lucide-react"
import type { LearnPayload } from "@/features/student/learn-types"
import { cn } from "@/lib/utils"

type Course = NonNullable<LearnPayload["course"]>
type Section = Course["sections"][number]

interface Props {
  sections: Section[]
  currentId: string
  done: Set<string>
  closed: Record<string, boolean>
  onToggle: (sectionId: string) => void
  onSelect: (lessonId: string) => void
}

const ICONS: Record<string, typeof PlayCircle> = {
  video: PlayCircle,
  pdf: FileText,
  quiz: CircleHelp,
  assignment: SquarePen,
}

const sectionId = (s: Section) => (s as { _id?: string })._id ?? s.title

export default function CurriculumList({ sections, currentId, done, closed, onToggle, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {sections.map((s) => {
        const id = sectionId(s)
        const finished = s.lessons.filter((l) => done.has(l._id)).length
        const isClosed = !!closed[id]

        return (
          <div
            key={id}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => onToggle(id)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{s.title}</span>
                <span className="block text-xs text-slate-500">
                  {finished}/{s.lessons.length} completed
                </span>
              </span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 text-slate-400 transition-transform", isClosed && "-rotate-90")}
              />
            </button>

            {!isClosed && (
              <div className="border-t border-slate-100 dark:border-slate-800">
                {s.lessons.map((l) => {
                  const Icon = ICONS[l.type as string] ?? PlayCircle
                  const active = l._id === currentId
                  const completed = done.has(l._id)
                  const minutes = l.duration as number | undefined

                  return (
                    <button
                      key={l._id}
                      type="button"
                      onClick={() => onSelect(l._id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                        active
                          ? "bg-teal-50 text-teal-800 dark:bg-teal-500/10 dark:text-teal-200"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                          completed ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                        )}
                      >
                        {completed ? <Check size={13} /> : <Icon size={13} />}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{l.title}</span>
                      {!!minutes && <span className="shrink-0 text-xs text-slate-400">{minutes} min</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}