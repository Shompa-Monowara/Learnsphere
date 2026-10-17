import { BookOpen, Plus, SquarePen, Star, Users } from "lucide-react"
import { Link } from "react-router-dom"
import PageState from "@/features/student/components/PageState"
import StatCard from "@/features/student/components/StatCard"
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui"
import EnrollmentTrend from "@/features/teacher/components/EnrollmentTrend"
import RecentReviews from "@/features/teacher/components/RecentReviews"
import RecentSubmissions from "@/features/teacher/components/RecentSubmissions"
import { useTeacher } from "@/features/teacher/teacher-context"
import { useAuth } from "@/stores/auth-context"

// "Dr. Amara Okafor" থেকে "Amara" বের করে
const firstName = (name = "") =>
  name.split(" ").filter((w) => w && !/^(dr|prof|mr|mrs|ms)\.?$/i.test(w))[0] ?? name

export default function Overview() {
  const { user } = useAuth()
  const { data, loading, error, refresh } = useTeacher()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Teacher <span className="mx-1.5">›</span>
            <span className="text-slate-900 dark:text-white">Overview</span>
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {firstName(user?.name)}
          </h1>
          <p className="mt-1 text-slate-500">Here's how your courses are performing this month.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/teacher/assignments" className={BTN_OUTLINE}>
            <SquarePen size={16} /> Grade submissions
          </Link>
          <Link to="/teacher/builder" className={BTN_PRIMARY}>
            <Plus size={16} /> Create course
          </Link>
        </div>
      </div>

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void refresh()}>
        {data && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total courses"
                value={data.stats.totalCourses}
                icon={BookOpen}
                tone="teal"
                delta={data.trends.courses}
                bars={[4, 5, 6, 7, 8, 9, 10]}
              />
              <StatCard
                label="Total students"
                value={data.stats.totalStudents}
                icon={Users}
                tone="orange"
                delta={data.trends.students}
                bars={data.enrollmentTrend.map((p) => p.enrollments)}
              />
              <StatCard
                label="Pending submissions"
                value={data.stats.pendingSubmissions}
                icon={SquarePen}
                tone="slate"
                bars={[2, 3, 4, 6, 7, 9, 10]}
              />
              <StatCard
                label="Average rating"
                value={data.stats.averageRating}
                icon={Star}
                tone="green"
                bars={[9, 9, 10, 10, 10, 10, 10]}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
              <EnrollmentTrend points={data.enrollmentTrend} growth={data.growth} />
              <RecentReviews reviews={data.recentReviews} />
            </div>

            <RecentSubmissions items={data.recentSubmissions} />
          </>
        )}
      </PageState>
    </div>
  )
}