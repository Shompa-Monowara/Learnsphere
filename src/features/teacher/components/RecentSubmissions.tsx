import { Link } from "react-router-dom"
import Avatar from "@/features/student/components/Avatar"
import { timeAgo } from "@/features/student/utils"
import type { TeacherDashboardData } from "../types"

export default function RecentSubmissions({ items }: { items: TeacherDashboardData["recentSubmissions"] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent submissions</h2>
        <Link to="/teacher/assignments" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          View all
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No submissions yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 dark:border-slate-800">
                <th className="px-5 py-4">Student</th>
                <th className="hidden px-5 py-4 md:table-cell">Assignment</th>
                <th className="hidden px-5 py-4 sm:table-cell">Submitted</th>
                <th className="px-5 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((s) => (
                <tr key={s._id}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.studentName} src={s.studentAvatar} size={38} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{s.studentName}</p>
                        <p className="truncate text-xs text-slate-500">{s.courseTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-sm text-slate-700 dark:text-slate-200 md:table-cell">
                    {s.assignmentTitle}
                  </td>
                  <td className="hidden px-5 py-3.5 text-sm text-slate-500 sm:table-cell">{timeAgo(s.submittedAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        s.status === "graded" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {s.status === "graded" ? "Graded" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}