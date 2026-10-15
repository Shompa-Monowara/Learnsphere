import { Award, BookOpen, CheckCircle2, Play, SquarePen } from "lucide-react"
import { Link } from "react-router-dom"
import CertificatesBanner from "@/features/student/components/CertificatesBanner"
import ContinueLearning from "@/features/student/components/ContinueLearning"
import StatCard from "@/features/student/components/StatCard"
import UpcomingDeadlines from "@/features/student/components/UpcomingDeadlines"
import WeeklyActivity from "@/features/student/components/WeeklyActivity"
import { useStudent } from "@/features/student/student-context"
import { useAuth } from "@/stores/auth-context"

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-16 w-1/2 rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

export default function Overview() {
  const { user } = useAuth()
  const { data, loading, error, refresh } = useStudent()

  if (loading) return <Skeleton />

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">{error || "Could not load your dashboard"}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Try again
        </button>
      </div>
    )
  }

  const { stats, trends, continueLearning, upcomingDeadlines, weeklyActivity, streak } = data
  const firstName = user?.name.split(" ")[0] ?? "there"
  const resumeTo = continueLearning[0] ? `/student/learn/${continueLearning[0].courseId}` : "/courses"
  const lessonBars = weeklyActivity.map((d) => d.lessons)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Student <span className="mx-1.5">›</span>
            <span className="text-slate-900 dark:text-white">Overview</span>
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {firstName}</h1>
          <p className="mt-1 text-slate-500">You're making steady progress. Here's what's waiting for you today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <BookOpen size={16} /> My courses
          </Link>
          <Link
            to={resumeTo}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Play size={14} fill="currentColor" /> Resume learning
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Enrolled courses"
          value={stats.enrolledCourses}
          icon={BookOpen}
          tone="teal"
          delta={trends.enrolledCourses}
          bars={[4, 5, 6, 8, 9, 11, 12]}
        />
        <StatCard
          label="Lessons completed"
          value={stats.completedLessons}
          icon={CheckCircle2}
          tone="green"
          delta={trends.completedLessons}
          bars={lessonBars}
        />
        <StatCard
          label="Pending assignments"
          value={stats.pendingAssignments}
          icon={SquarePen}
          tone="orange"
          bars={[9, 8, 7, 6, 5, 4, 3]}
        />
        <StatCard
          label="Certificates earned"
          value={stats.certificates}
          icon={Award}
          tone="slate"
          delta={trends.certificates}
          bars={[1, 1, 2, 2, 3, 4, 5]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <ContinueLearning items={continueLearning} />
          <WeeklyActivity days={weeklyActivity} streak={streak} />
        </div>
        <div className="space-y-6">
          <UpcomingDeadlines items={upcomingDeadlines} />
          <CertificatesBanner count={stats.certificates} />
        </div>
      </div>
    </div>
  )
}