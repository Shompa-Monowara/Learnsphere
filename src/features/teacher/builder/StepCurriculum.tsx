import { useRef, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  ArrowDown,
  ArrowUp,
  CircleHelp,
  FileText,
  FileUp,
  Loader2,
  PlayCircle,
  Plus,
  SquarePen,
  Trash2,
  Video,
  X,
} from "lucide-react"
import { getErrorMessage } from "@/services/api"
import { FIELD } from "./ui"
import { newLesson, newSection } from "./types"
import type { BLesson, BSection, LessonType } from "./types"
import { uploadFile, videoMinutes } from "./upload"

interface Props {
  sections: BSection[]
  setSections: Dispatch<SetStateAction<BSection[]>>
  onError: (msg: string) => void
}

const move = <T,>(arr: T[], i: number, d: number) => {
  const j = i + d
  if (j < 0 || j >= arr.length) return arr
  const copy = [...arr]
  ;[copy[i], copy[j]] = [copy[j], copy[i]]
  return copy
}

const ICONS: Record<LessonType, typeof PlayCircle> = {
  video: PlayCircle,
  pdf: FileText,
  quiz: CircleHelp,
  assignment: SquarePen,
}

const ICON_BTN =
  "rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-800"

export default function StepCurriculum({ sections, setSections, onError }: Props) {
  const picker = useRef<HTMLInputElement>(null)
  const target = useRef<{ key: string; type: "video" | "pdf" } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const patchSection = (key: string, fn: (s: BSection) => BSection) =>
    setSections((prev) => prev.map((s) => (s.key === key ? fn(s) : s)))

  const patchLesson = (sKey: string, lKey: string, patch: Partial<BLesson>) =>
    patchSection(sKey, (s) => ({ ...s, lessons: s.lessons.map((l) => (l.key === lKey ? { ...l, ...patch } : l)) }))

  const openPicker = (key: string, type: "video" | "pdf") => {
    target.current = { key, type }
    if (picker.current) {
      picker.current.accept = type === "video" ? "video/*" : "application/pdf"
      picker.current.click()
    }
  }

  const onFile = async (file?: File) => {
    const t = target.current
    if (!file || !t) return
    setBusy(t.key + t.type)
    try {
      const [url, duration] = await Promise.all([
        uploadFile(file, t.type === "video" ? "videos" : "documents"),
        t.type === "video" ? videoMinutes(file) : Promise.resolve(0),
      ])
      const title = file.name.replace(/\.[^.]+$/, "")
      patchSection(t.key, (s) => ({ ...s, lessons: [...s.lessons, newLesson({ title, type: t.type, url, duration })] }))
    } catch (err) {
      onError(getErrorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <input
        ref={picker}
        type="file"
        hidden
        onChange={(e) => {
          void onFile(e.target.files?.[0])
          e.target.value = ""
        }}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum</h2>
        <button
          type="button"
          onClick={() => setSections((p) => [...p, newSection()])}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Plus size={15} /> Add section
        </button>
      </div>

      {sections.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500 dark:border-slate-700">
          No sections yet. Click "Add section" to start building your course.
        </p>
      )}

      <div className="mt-5 space-y-5">
        {sections.map((s, si) => (
          <div key={s.key} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            {/* Section header */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="shrink-0 text-sm font-semibold text-slate-500">Section {si + 1} ·</span>
              <input
                value={s.title}
                onChange={(e) => patchSection(s.key, (x) => ({ ...x, title: e.target.value }))}
                placeholder="Section title"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal dark:text-white"
              />
              <button type="button" disabled={si === 0} onClick={() => setSections((p) => move(p, si, -1))} className={ICON_BTN}>
                <ArrowUp size={15} />
              </button>
              <button
                type="button"
                disabled={si === sections.length - 1}
                onClick={() => setSections((p) => move(p, si, 1))}
                className={ICON_BTN}
              >
                <ArrowDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => setSections((p) => p.filter((x) => x.key !== s.key))}
                className={`${ICON_BTN} hover:text-red-600`}
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Lessons */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {s.lessons.map((l, li) => {
                const Icon = ICONS[l.type]
                const linked = l.type === "quiz" || l.type === "assignment"
                return (
                  <div key={l.key} className="space-y-2 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                        <Icon size={16} />
                      </span>
                      <input
                        value={l.title}
                        onChange={(e) => patchLesson(s.key, l.key, { title: e.target.value })}
                        placeholder="Lesson title"
                        className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
                      />
                      {l.type === "video" && (
                        <label className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                          <input
                            type="number"
                            min={0}
                            value={l.duration}
                            onChange={(e) => patchLesson(s.key, l.key, { duration: Number(e.target.value) })}
                            className="w-14 rounded-md border border-slate-200 bg-transparent px-1.5 py-1 text-right text-xs text-slate-700 outline-none dark:border-slate-700 dark:text-slate-200"
                          />
                          min
                        </label>
                      )}
                      {!linked && (
                        <label className="flex shrink-0 cursor-pointer items-center gap-1 text-xs text-slate-500">
                          <input
                            type="checkbox"
                            checked={l.isPreview}
                            onChange={(e) => patchLesson(s.key, l.key, { isPreview: e.target.checked })}
                            className="accent-teal-600"
                          />
                          Free preview
                        </label>
                      )}
                      <button
                        type="button"
                        disabled={li === 0}
                        onClick={() => patchSection(s.key, (x) => ({ ...x, lessons: move(x.lessons, li, -1) }))}
                        className={ICON_BTN}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={li === s.lessons.length - 1}
                        onClick={() => patchSection(s.key, (x) => ({ ...x, lessons: move(x.lessons, li, 1) }))}
                        className={ICON_BTN}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => patchSection(s.key, (x) => ({ ...x, lessons: x.lessons.filter((y) => y.key !== l.key) }))}
                        className={`${ICON_BTN} hover:text-red-600`}
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {linked ? (
                      <p className="pl-10 text-xs text-slate-400">
                        {l.type === "quiz" ? "Quiz" : "Assignment"} lesson — linked content is kept as it is.
                      </p>
                    ) : (
                      <input
                        value={l.url}
                        onChange={(e) => patchLesson(s.key, l.key, { url: e.target.value })}
                        placeholder={l.type === "video" ? "Video URL (or use Upload video)" : "PDF URL (or use Upload PDF)"}
                        className={`${FIELD} ml-10 w-[calc(100%-2.5rem)] py-1.5 text-xs`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Add buttons */}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => patchSection(s.key, (x) => ({ ...x, lessons: [...x.lessons, newLesson()] }))}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Plus size={15} /> Add lesson
              </button>
              <button
                type="button"
                disabled={busy === s.key + "video"}
                onClick={() => openPicker(s.key, "video")}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {busy === s.key + "video" ? <Loader2 size={15} className="animate-spin" /> : <Video size={15} />}
                {busy === s.key + "video" ? "Uploading..." : "Upload video"}
              </button>
              <button
                type="button"
                disabled={busy === s.key + "pdf"}
                onClick={() => openPicker(s.key, "pdf")}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {busy === s.key + "pdf" ? <Loader2 size={15} className="animate-spin" /> : <FileUp size={15} />}
                {busy === s.key + "pdf" ? "Uploading..." : "Upload PDF"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}