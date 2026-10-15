import { useEffect } from "react"
import { X } from "lucide-react"
import CourseThumb from "./CourseThumb"

interface Props {
  // unknown ব্যবহারের মাধ্যমে TS এরর দূর হবে এবং ESLint-এর any এররও আসবে না
  course: unknown
  open: boolean
  onClose: () => void
}

export default function PreviewModal({ course, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !course) return null

  const courseObj = course as Record<string, unknown>
  const videoSrc = (courseObj.previewUrl || courseObj.videoUrl || null) as string | null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[672px] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="flex items-start justify-between px-6 pb-4 pt-6">
          <div>
            <h2 id="preview-title" className="text-xl font-bold text-slate-900 dark:text-white">
              Course preview
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              A short look inside the first lessons.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-t border-slate-100 px-6 pb-6 pt-5 dark:border-slate-800">
          <div className="aspect-video overflow-hidden rounded-xl bg-slate-900">
            {videoSrc ? (
              <video
                src={videoSrc}
                controls
                autoPlay
                className="h-full w-full bg-black object-contain"
              />
            ) : (
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <CourseThumb course={course as any} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-full bg-slate-900/80 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
                    No preview video uploaded
                  </span>
                </div>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {videoSrc
              ? "Lesson previews stream in full once you enroll. Every preview lesson is marked with a small badge in the curriculum below."
              : "The instructor has not uploaded a preview video for this course yet."}
          </p>
        </div>
      </div>
    </div>
  )
}