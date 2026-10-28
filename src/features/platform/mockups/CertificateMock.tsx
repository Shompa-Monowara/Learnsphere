import { Award, BadgeCheck, Download, FileText } from "lucide-react"
import MockCard from "./MockCard"
import { label } from "./shared"

export function CertificateMock() {
  return (
    <MockCard className="p-2.5">
      <div className="rounded-2xl border-2 border-teal-200 p-2.5 dark:border-teal-800">
        <div className="rounded-xl border border-teal-200 bg-white px-5 pb-4 pt-5 dark:border-teal-800 dark:bg-slate-900">
          <div className="text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <BadgeCheck size={11} /> Verified
            </span>
            <p className={`${label} mt-4`}>Certificate of completion</p>
            <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">Maya Chen</p>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              has completed <b className="text-slate-900 dark:text-white">Frontend Architecture</b>
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">24 lessons · 18 hours · issued 14 Oct 2026</p>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-dashed border-slate-200 pt-3 dark:border-slate-700">
            <div>
              <p className={label}>Verification ID</p>
              <p className="mt-1 font-mono text-[11px] font-bold text-slate-900 dark:text-white">LS-2026-8841-QK</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-800 dark:bg-teal-950">
              <Award size={18} />
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between px-1 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <FileText size={13} className="text-red-500" /> PDF · 240 KB
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-300">
            <Download size={12} /> Download
          </span>
        </div>
      </div>
    </MockCard>
  )
}