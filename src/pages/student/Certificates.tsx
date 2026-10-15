import { Award, Download, Eye, GraduationCap } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import EmptyState from "@/features/student/components/EmptyState"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import type { CertificateItem } from "@/features/student/portal-types"
import { BTN_OUTLINE, BTN_PRIMARY, CARD } from "@/features/student/ui"
import { formatDate, formatHours } from "@/features/student/utils"
import { useFetch } from "@/hooks/useFetch"
import { api, getErrorMessage } from "@/services/api"

export default function Certificates() {
  const { data, loading, error, reload } = useFetch<{ certificates: CertificateItem[] }>("/certificates/mine")
  const [busy, setBusy] = useState("")
  const [actionError, setActionError] = useState("")

  const certificates = data?.certificates ?? []

  const openPdf = async (c: CertificateItem, mode: "preview" | "download") => {
    setBusy(`${c._id}-${mode}`)
    setActionError("")
    // popup blocker এড়াতে ক্লিকের সাথে সাথেই ট্যাব খুলে রাখি
    const win = mode === "preview" ? window.open("", "_blank") : null
    try {
      const res = await api.get(`/certificates/${c._id}/download`, { responseType: "blob" })
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      if (mode === "preview") {
        if (win) win.location.href = url
      } else {
        const a = document.createElement("a")
        a.href = url
        a.download = `certificate-${c.verificationId}.pdf`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 10000)
      }
    } catch (err) {
      win?.close()
      setActionError(getErrorMessage(err))
    } finally {
      setBusy("")
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        crumb="Certificates"
        title="Certificates"
        subtitle="Download, print, and share the certificates you've earned on LearnSphere."
      />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        {actionError && <Notice type="error">{actionError}</Notice>}

        {certificates.length === 0 ? (
          <EmptyState
            title="No certificates yet"
            text="Finish all lessons of a course and your certificate is issued automatically."
            action={<Link to="/student/courses" className={BTN_PRIMARY}>Go to my courses</Link>}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {certificates.map((c) => (
              <div key={c._id} className={`${CARD} overflow-hidden`}>
                <div className="relative flex aspect-[1.6/1] flex-col justify-between bg-linear-to-br from-teal-700 via-teal-800 to-emerald-950 p-6 text-white">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />
                  <div className="relative flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                      <GraduationCap size={18} />
                    </span>
                    <span className="font-semibold">LearnSphere</span>
                  </div>

                  <div className="relative">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-300">Certificate of completion</p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug">{c.course?.title}</h3>
                    <p className="mt-1 text-sm text-teal-100">
                      Awarded to <span className="font-semibold text-white">{c.student?.name}</span>
                    </p>
                  </div>

                  <div className="relative flex items-end justify-between text-xs text-teal-100">
                    <span>Issued {formatDate(c.createdAt)}</span>
                    <span className="font-mono">{c.verificationId}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Award size={14} className="text-teal-600" />
                    {c.course ? formatHours(c.course.totalDuration) : ""}
                    {c.course?.instructor?.name && ` · ${c.course.instructor.name}`}
                  </span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => void openPdf(c, "preview")} disabled={busy !== ""} className={BTN_OUTLINE}>
                      <Eye size={15} /> {busy === `${c._id}-preview` ? "Opening..." : "Preview"}
                    </button>
                    <button type="button" onClick={() => void openPdf(c, "download")} disabled={busy !== ""} className={BTN_PRIMARY}>
                      <Download size={15} /> {busy === `${c._id}-download` ? "Preparing..." : "PDF"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Award size={22} />
              </span>
              <p className="mt-3 font-semibold text-slate-900 dark:text-white">Unlock your next certificate</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">Finish all lessons of a course to earn its certificate.</p>
              <Link to="/student/courses" className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700">
                Continue learning
              </Link>
            </div>
          </div>
        )}
      </PageState>
    </div>
  )
}