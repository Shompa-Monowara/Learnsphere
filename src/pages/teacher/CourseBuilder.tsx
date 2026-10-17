import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui"
import CoursePreview from "@/features/teacher/builder/CoursePreview"
import Stepper from "@/features/teacher/builder/Stepper"
import StepBasics from "@/features/teacher/builder/StepBasics"
import StepCurriculum from "@/features/teacher/builder/StepCurriculum"
import StepPublish from "@/features/teacher/builder/StepPublish"
import { EMPTY_FORM, toBSections } from "@/features/teacher/builder/types"
import type { BSection, BuilderForm, CategoryOption } from "@/features/teacher/builder/types"
import { PANEL } from "@/features/teacher/builder/ui"
import { api, getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

export default function CourseBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [courseId, setCourseId] = useState<string | null>(id ?? null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BuilderForm>(EMPTY_FORM)
  const [sections, setSections] = useState<BSection[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [status, setStatus] = useState("draft")
  const [loading, setLoading] = useState(!!id)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const cats = await api.get("/categories")
        const list = Array.isArray(cats.data) ? cats.data : cats.data?.categories ?? []
        if (alive) setCategories(list)
      } catch {
        /* category list is optional for the form to render */
      }

      if (!id) return
      try {
        const res = await api.get(`/courses/${id}`)
        const c = res.data.course
        const discounted = typeof c.discountPrice === "number" && c.discountPrice < c.price
        if (!alive) return
        setForm({
          title: c.title || "",
          category: c.category?._id ?? c.category ?? "",
          level: c.level || "beginner",
          description: c.description || "",
          thumbnail: c.thumbnail || "",
          price: String(discounted ? c.discountPrice : c.price ?? ""),
          originalPrice: discounted ? String(c.price) : "",
        })
        setSections(toBSections(c.sections))
        setStatus(c.status)
      } catch (err) {
        if (alive) setError(getErrorMessage(err))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  const patch = (p: Partial<BuilderForm>) => setForm((f) => ({ ...f, ...p }))
  const lessons = useMemo(() => sections.reduce((n, s) => n + s.lessons.length, 0), [sections])
  const categoryName = categories.find((c) => c._id === form.category)?.name ?? ""

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setError("")
    setInfo("")
    try {
      await fn()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  /* ---------- Step 1---------- */
  const saveBasics = async () => {
    if (!form.title.trim()) throw new Error("Course title is required.")
    const payload = {
      title: form.title.trim(),
      category: form.category || undefined,
      level: form.level,
      description: form.description.trim(),
      shortDescription: form.description.trim().slice(0, 140),
      thumbnail: form.thumbnail,
    }
    if (courseId) {
      await api.put(`/courses/${courseId}`, payload)
    } else {
      const res = await api.post<{ course: { _id: string } }>("/courses", payload)
      setCourseId(res.data.course._id)
    }
  }

  /* ---------- Step 2---------- */
  const saveCurriculum = async () => {
    for (const [si, s] of sections.entries()) {
      if (!s.title.trim()) throw new Error(`Section ${si + 1} needs a title.`)
      for (const l of s.lessons) {
        if (!l.title.trim()) throw new Error(`A lesson in "${s.title}" needs a title.`)
      }
    }
    const body = {
      sections: sections.map((s) => ({
        ...(s._id && { _id: s._id }),
        title: s.title.trim(),
        lessons: s.lessons.map((l) => ({
          ...(l._id && { _id: l._id }),
          title: l.title.trim(),
          type: l.type,
          url: l.url.trim(),
          duration: Number(l.duration) || 0,
          isPreview: l.isPreview,
          ...(l.quiz && { quiz: l.quiz }),
          ...(l.assignment && { assignment: l.assignment }),
        })),
      })),
    }
    const res = await api.put(`/courses/${courseId}/curriculum`, body)
    
    setSections(toBSections(res.data.course.sections))


    const previewLesson = sections
      .flatMap((s) => s.lessons)
      .find((l) => l.type === "video" && l.isPreview && l.url.trim())
    await api.put(`/courses/${courseId}`, { previewVideo: previewLesson ? previewLesson.url.trim() : "" })
  }

  /* ---------- Step 3---------- */
  const savePrice = async () => {
    const sell = Number(form.price || 0)
    const orig = form.originalPrice ? Number(form.originalPrice) : 0
    if (!Number.isFinite(sell) || sell < 0 || !Number.isFinite(orig) || orig < 0) {
      throw new Error("Prices must be zero or more.")
    }
    const body = orig > sell ? { price: orig, discountPrice: sell } : { price: sell, discountPrice: null }
    await api.put(`/courses/${courseId}`, body)
  }

  const onContinue = () =>
    run(async () => {
      if (step === 0) await saveBasics()
      if (step === 1) await saveCurriculum()
      setStep((s) => s + 1)
    })

  const onSaveDraft = () =>
    run(async () => {
      await savePrice()
      setInfo("Draft saved.")
    })

  const onSubmit = () =>
    run(async () => {
      await savePrice()
      await api.patch(`/courses/${courseId}/submit`)
      navigate("/teacher/courses")
    })

  const onFinish = () =>
    run(async () => {
      await savePrice()
      navigate("/teacher/courses")
    })

  if (loading) {
    return (
      <div className="grid place-items-center py-32 text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumb={["My Courses", "Course Builder"]}
        title="Course Builder"
        subtitle="Create a polished course in three simple steps."
        action={
          <Link to="/teacher/courses" className={BTN_OUTLINE}>
            <ArrowLeft size={16} /> Back to courses
          </Link>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Stepper step={step} maxStep={courseId ? 2 : 0} onGo={setStep} />

          <div className={PANEL}>
            {error && (
              <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
            {info && (
              <p className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                {info}
              </p>
            )}

            {step === 0 && <StepBasics form={form} categories={categories} onChange={patch} onError={setError} />}
            {step === 1 && <StepCurriculum sections={sections} setSections={setSections} onError={setError} />}
            {step === 2 && (
              <StepPublish
                form={form}
                status={status}
                lessons={lessons}
                busy={busy}
                onChange={patch}
                onSaveDraft={() => void onSaveDraft()}
                onSubmit={() => void onSubmit()}
              />
            )}

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="button"
                disabled={step === 0 || busy}
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-40"
              >
                <ArrowLeft size={16} /> Back
              </button>

              {step < 2 ? (
                <button type="button" disabled={busy} onClick={() => void onContinue()} className={BTN_PRIMARY}>
                  {busy ? "Saving..." : "Continue"} <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" disabled={busy} onClick={() => void onFinish()} className={BTN_PRIMARY}>
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>

        <CoursePreview form={form} categoryName={categoryName} instructor={user?.name ?? "You"} lessons={lessons} />
      </div>
    </div>
  )
}