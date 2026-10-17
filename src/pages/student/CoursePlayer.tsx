import { ArrowLeft, ArrowRight, Award, CheckCircle2, GraduationCap } from "lucide-react"
import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"


import Notice from "@/features/student/components/Notice"
import PageState from "@/features/student/components/PageState"
import type { LearnEnrollment, LearnPayload } from "@/features/student/learn-types"
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { api, getErrorMessage } from "@/services/api"
import CurriculumList from "@/features/student/components/player/CurriculumList"
import LessonViewer from "@/features/student/components/player/LessonViewer"

export default function CoursePlayer() {
  const { courseId } = useParams()
  const { data, setData, loading, error, reload } = useFetch<LearnPayload>(`/enrollments/${courseId}/learn`)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [closed, setClosed] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState("")
  const [certEarned, setCertEarned] = useState(false)

  const course = data?.course
  const enrollment = data?.enrollment ?? null

  const lessons = useMemo(() => (course ? course.sections.flatMap((s) => s.lessons) : []), [course])
  const done = useMemo(
    () => new Set((enrollment?.completedLessons ?? []).map((l) => String(l.lesson))),
    [enrollment]
  )

 
  const current = lessons.find((l) => l._id === activeId) ?? lessons.find((l) => !done.has(l._id)) ?? lessons[0]
  const index = current ? lessons.indexOf(current) : -1
  const prev = index > 0 ? lessons[index - 1] : undefined
  const next = index >= 0 ? lessons[index + 1] : undefined
  const isDone = current ? done.has(current._id) : false
  const progress = enrollment?.progress ?? 0

  const section = course?.sections.find((s) => s.lessons.some((l) => l._id === current?._id))

  const complete = async (goNext: boolean) => {
    if (!current || !enrollment) return
    setActionError("")

    if (!done.has(current._id)) {
      setBusy(true)
      try {
        const res = await api.patch<{ enrollment: LearnEnrollment; certificate: unknown }>(
          `/enrollments/${courseId}/lessons/${current._id}/complete`
        )
        setData((d) => (d ? { ...d, enrollment: res.data.enrollment } : d))
        if (res.data.certificate) setCertEarned(true)
      } catch (err) {
        setActionError(getErrorMessage(err))
        setBusy(false)
        return
      }
      setBusy(false)
    }

    if (goNext && next) setActiveId(next._id)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link
            to="/student/courses"
            className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300"
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">My courses</span>
          </Link>

          <span className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

          <div className="hidden min-w-0 flex-1 items-center gap-2.5 sm:flex">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
              <GraduationCap size={17} />
            </span>
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{course?.title ?? "Loading..."}</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">{progress}% complete</span>
            <div className="h-2 w-28 rounded-full bg-slate-100 dark:bg-slate-800 sm:w-40">
              <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
          {course && lessons.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-white">This course has no lessons yet</p>
              <p className="mt-1 text-sm text-slate-500">Check back soon, your instructor is still preparing the content.</p>
            </div>
          )}

          {course && current && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-5">
                <LessonViewer key={current._id} lesson={current} onEnded={() => void complete(false)} />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {section?.title} · Lesson {index + 1} of {lessons.length}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{current.title}</h1>
                  {course.instructor?.name && <p className="mt-1 text-sm text-slate-500">By {course.instructor.name}</p>}
                </div>

                {actionError && <Notice type="error">{actionError}</Notice>}

                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => prev && setActiveId(prev._id)} disabled={!prev} className={BTN_OUTLINE}>
                    <ArrowLeft size={15} /> Previous
                  </button>

                  {isDone ? (
                    <span className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-300">
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  ) : (
                    <button type="button" onClick={() => void complete(false)} disabled={busy || !enrollment} className={BTN_OUTLINE}>
                      <CheckCircle2 size={15} /> {busy ? "Saving..." : "Mark as complete"}
                    </button>
                  )}

                  {next && (
                    <button type="button" onClick={() => void complete(true)} disabled={busy || !enrollment} className={`${BTN_PRIMARY} sm:ml-auto`}>
                      {isDone ? "Next lesson" : "Complete & continue"} <ArrowRight size={15} />
                    </button>
                  )}
                </div>

                {course.description && (
                  <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="font-bold text-slate-900 dark:text-white">About this course</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {course.description}
                    </p>
                  </section>
                )}
              </div>

              <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">Course content</h2>
                <CurriculumList
                  sections={course.sections}
                  currentId={current._id}
                  done={done}
                  closed={closed}
                  onToggle={(id) => setClosed((prevState) => ({ ...prevState, [id]: !prevState[id] }))}
                  onSelect={setActiveId}
                />
              </aside>
            </div>
          )}
        </PageState>
      </div>

      {certEarned && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Award size={30} />
            </span>
            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Course completed!</h2>
            <p className="mt-2 text-sm text-slate-500">
              Congratulations, you finished every lesson. Your certificate is ready to download.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link to="/student/certificates" className={BTN_PRIMARY}>
                View certificate
              </Link>
              <button type="button" onClick={() => setCertEarned(false)} className={BTN_OUTLINE}>
                Keep reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}