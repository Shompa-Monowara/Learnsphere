import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import type { ContactInfo } from "../api"
import { CARD } from "../styles"

export function TeamPlansBanner({ banner }: { banner: ContactInfo["teamBanner"] }) {
  return (
    <div className={`${CARD} mt-8 flex flex-wrap items-center justify-between gap-4 px-6 py-5`}>
      <p className="text-sm text-slate-500">
        {banner.text} <b className="font-semibold text-slate-900 dark:text-white">{banner.strong}</b>
      </p>
      <Link
        to={banner.to}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800"
      >
        {banner.cta} <ArrowRight size={15} />
      </Link>
    </div>
  )
}