import { ExternalLink, FileText, CircleHelp, SquarePen } from "lucide-react"
import { Link } from "react-router-dom"
import type { LearnPayload } from "@/features/student/learn-types"

type Course = NonNullable<LearnPayload["course"]>
type Lesson = Course["sections"][number]["lessons"][number]

interface Props {
  lesson: Lesson
  onEnded: () => void
}

const BOX = "w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"

const youtubeId = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}

function Empty({ text }: { text: string }) {
  return (
    <div className={`${BOX} grid aspect-video place-items-center p-8 text-center`}>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  )
}

export default function LessonViewer({ lesson, onEnded }: Props) {
  const url = (lesson.url as string | undefined) ?? ""
  const type = lesson.type as string

  if (type === "quiz") {
    const quizId = (lesson as { quiz?: string }).quiz
    return (
      <div className={`${BOX} grid aspect-video place-items-center p-8 text-center`}>
        <div>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <CircleHelp size={26} />
          </span>
          <p className="mt-4 font-semibold text-slate-900 dark:text-white">This lesson is a quiz</p>
          <p className="mt-1 text-sm text-slate-500">Take the quiz, then mark this lesson as complete.</p>
          <Link
            to={quizId ? `/student/quizzes/${quizId}` : "/student/quizzes"}
            className="mt-5 inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Open quiz
          </Link>
        </div>
      </div>
    )
  }

  if (type === "assignment") {
    return (
      <div className={`${BOX} grid aspect-video place-items-center p-8 text-center`}>
        <div>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <SquarePen size={26} />
          </span>
          <p className="mt-4 font-semibold text-slate-900 dark:text-white">This lesson is an assignment</p>
          <p className="mt-1 text-sm text-slate-500">Submit your work, then mark this lesson as complete.</p>
          <Link
            to="/student/assignments"
            className="mt-5 inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Open assignments
          </Link>
        </div>
      </div>
    )
  }

  if (!url) return <Empty text="This lesson has no content yet." />

  if (type === "pdf") {
    return (
      <div className="space-y-3">
        <div className={BOX}>
          <iframe src={url} title={lesson.title} className="h-[70vh] w-full" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-slate-500">
            <FileText size={15} /> PDF document
          </span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-teal-600 hover:text-teal-700"
          >
            Open in new tab <ExternalLink size={14} />
          </a>
        </div>
      </div>
    )
  }

  // video
  const yt = youtubeId(url)
  if (yt) {
    return (
      <div className={`${BOX} aspect-video`}>
        <iframe
          src={`https://www.youtube.com/embed/${yt}`}
          title={lesson.title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }

  return (
    <video
      src={url}
      controls
      controlsList="nodownload"
      onEnded={onEnded}
      className="aspect-video w-full rounded-2xl bg-black"
    />
  )
}