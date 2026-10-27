import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle, CheckCircle2, Globe, Heart, Info, Loader2, PlayCircle, RefreshCw, ShoppingCart, Star, Users, Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { enrollInCourse, fetchCourse, fetchReviews, startCheckout } from "@/features/courses/api"
import type { CourseDetail, ReviewData } from "@/features/courses/api"
import CourseTabs from "@/features/courses/components/CourseTabs"
import CourseThumb from "@/features/courses/components/CourseThumb"
import PreviewModal from "@/features/courses/components/PreviewModal"
import { discount, initials } from "@/features/courses/data"
import { buildIncludes } from "@/features/courses/includes"
import { useWishlist } from "@/features/courses/hooks/useWishlist"
import { getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

export default function CourseDetails() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { ids, toggle } = useWishlist()

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [reviews, setReviews] = useState<ReviewData>({ reviews: [], breakdown: [] })
  const [enrolled, setEnrolled] = useState(false)
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading")
  const [reload, setReload] = useState(0)

  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState("")
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (!id || authLoading) return
    let active = true
    Promise.all([fetchCourse(id), fetchReviews(id)])
      .then(([c, r]) => {
        if (!active) return
        setCourse(c.course)
        setEnrolled(c.enrolled)
        setReviews(r)
        setStatus("ready")
      })
      .catch((err) => {
        if (!active) return
        const code = isAxiosError(err) ? err.response?.status : undefined
        setStatus(code === 404 || code === 400 ? "notfound" : "error")
      })
    return () => {
      active = false
    }
  }, [id, authLoading, user?._id, reload])

  const handleEnroll = async () => {
    if (!course) return
    if (!user) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    if (user.role !== "student") {
      setEnrollError("Only student accounts can enroll in courses.")
      return
    }
    setEnrolling(true)
    setEnrollError("")
    try {
      if (course.price > 0) {
        /* Paid course: Stripe checkout page e pathai */
        window.location.href = await startCheckout(course.id)
        return
      }
      await enrollInCourse(course.id)
      setEnrolled(true)
      setReload((n) => n + 1)
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) setEnrolled(true)
      else setEnrollError(getErrorMessage(err))
    } finally {
      setEnrolling(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <AlertCircle size={36} className="mx-auto text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">Could not load this course</h1>
        <p className="mt-2 text-slate-600">Check that the server is running, then try again.</p>
        <Button onClick={() => { setStatus("loading"); setReload((n) => n + 1) }} className="mt-6 rounded-xl bg-teal-600 text-white hover:bg-teal-700">Try again</Button>
      </div>
    )
  }

  if (status === "notfound" || !course) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Course not found</h1>
        <p className="mt-3 text-slate-600">The course you are looking for does not exist or is not published.</p>
        <Button asChild className="mt-6 rounded-xl bg-teal-600 text-white hover:bg-teal-700">
          <Link to="/courses">Browse all courses</Link>
        </Button>
      </div>
    )
  }

  const off = discount(course)
  const wished = ids.has(course.id)
  const includes = buildIncludes(course)

  return (
    <>
      {course.status !== "published" && (
        <div className="flex items-center justify-center gap-2 bg-orange-100 px-4 py-2 text-sm text-orange-800">
          <Info size={15} /> This course is <b>{course.status}</b> and is only visible to you, not to students.
        </div>
      )}

      <section className="bg-linear-to-br from-teal-50 via-white to-orange-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link><span>›</span>
            <Link to="/courses" className="hover:text-teal-600">Courses</Link><span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">{course.title}</span>
          </nav>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800">{course.category}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{course.level}</span>
            {course.bestseller && <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">Bestseller</span>}
          </div>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight">{course.title}</h1>
          {course.summary && <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{course.summary}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(course.rating) ? "fill-orange-400 text-orange-400" : "text-slate-300"} />
                ))}
              </span>
              <b className="text-slate-900 dark:text-white">{course.rating.toFixed(1)}</b> ({course.reviews.toLocaleString()})
            </span>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-teal-600" />{course.students.toLocaleString()} students</span>
            <span className="flex items-center gap-1.5">
              <RefreshCw size={14} className="text-teal-600" />
              Updated {new Date(course.updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5"><Globe size={14} className="text-teal-600" />{course.language}</span>
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm">
            {course.instructorAvatar ? (
              <img src={course.instructorAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">{initials(course.instructor)}</span>
            )}
            <span className="text-slate-600 dark:text-slate-400">Created by <b className="text-slate-900 dark:text-white">{course.instructor}</b></span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] items-start gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-8">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            aria-label="Preview this course"
            className="group relative block aspect-video w-full overflow-hidden rounded-2xl text-left"
          >
            <CourseThumb course={course} className="transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-teal-700 shadow-lg transition-transform group-hover:scale-110">
                <PlayCircle size={32} />
              </span>
            </span>
            <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white">
              <PlayCircle size={14} /> Preview this course
            </span>
          </button>

          <CourseTabs course={course} reviews={reviews} enrolled={enrolled} onReviewed={() => setReload((n) => n + 1)} />
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="aspect-video overflow-hidden rounded-xl">
              <CourseThumb course={course} />
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-4xl font-bold">{course.price === 0 ? "Free" : `$${course.price}`}</span>
              {off > 0 && (
                <>
                  <span className="text-slate-400 line-through">${course.oldPrice}</span>
                  <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">-{off}%</span>
                </>
              )}
            </div>
            {off > 0 && (
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600">
                <Zap size={13} /> Limited-time discounted price
              </p>
            )}

            {enrolled ? (
              <div className="mt-5 space-y-3">
                <p className="flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700 dark:bg-teal-950">
                  <CheckCircle2 size={18} /> You are enrolled in this course.
                </p>
                <Button asChild className="h-11 w-full rounded-xl bg-teal-600 text-white hover:bg-teal-700">
                  <Link to="/student">Go to my dashboard</Link>
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={enrolling}
                className="mt-5 h-12 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-700"
              >
                {enrolling ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
                {enrolling ? (course.price > 0 ? "Redirecting to checkout..." : "Enrolling...") : course.price === 0 ? "Enroll for free" : "Buy now"}
              </Button>
            )}
            {new URLSearchParams(location.search).get("payment") === "cancelled" && !enrolled && (
              <p className="mt-2 text-sm text-amber-600">Payment was cancelled. You have not been charged.</p>
            )}
            {enrollError && <p role="alert" className="mt-2 text-sm text-red-600">{enrollError}</p>}

            <Button variant="outline" onClick={() => toggle(course.id)} aria-pressed={wished} className="mt-3 h-11 w-full rounded-xl">
              <Heart size={16} className={wished ? "fill-red-500 text-red-500" : ""} />
              {wished ? "Saved to wishlist" : "Add to wishlist"}
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">30-day money-back guarantee</p>

            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">This course includes</p>
              <ul className="mt-4 space-y-3">
                {includes.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <Icon size={16} className="text-teal-600" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <PreviewModal course={course} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  )
}