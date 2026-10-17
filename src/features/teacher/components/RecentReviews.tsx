import { Star } from "lucide-react"
import { Link } from "react-router-dom"
import Avatar from "@/features/student/components/Avatar"
import { timeAgo } from "@/features/student/utils"
import type { TeacherDashboardData } from "../types"

export default function RecentReviews({ reviews }: { reviews: TeacherDashboardData["recentReviews"] }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent reviews</h2>

      {reviews.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {reviews.map((r) => (
            <div key={r._id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Avatar name={r.studentName} src={r.studentAvatar} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{r.studentName}</p>
                  <p className="truncate text-xs text-slate-500">{r.courseTitle}</p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.rating ? "fill-orange-400 text-orange-400" : "text-slate-300"}
                    />
                  ))}
                </div>
              </div>

              {r.comment && <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{r.comment}</p>}

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">{timeAgo(r.createdAt)}</span>
                {r.reply ? (
                  <span className="font-semibold text-green-600">Replied</span>
                ) : (
                  <Link to="/teacher/reviews" className="font-semibold text-teal-600 hover:text-teal-700">
                    Reply
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}