import { ArrowRight, Award } from "lucide-react"
import { Link } from "react-router-dom"

export default function CertificatesBanner({ count }: { count: number }) {
  return (
    <section className="rounded-2xl bg-linear-to-br from-teal-600 to-emerald-900 p-6 text-white shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
        <Award size={22} />
      </span>
      <h3 className="mt-4 text-lg font-bold">
        {count > 0 ? `${count} certificate${count > 1 ? "s" : ""} earned` : "Earn your first certificate"}
      </h3>
      <p className="mt-1 text-sm text-teal-50/90">
        {count > 0
          ? "Download and share your achievements, or keep going to unlock your next one."
          : "Complete all lessons of a course and your certificate is issued automatically."}
      </p>
      <Link
        to="/student/certificates"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-teal-700"
      >
        View certificates <ArrowRight size={14} />
      </Link>
    </section>
  )
}