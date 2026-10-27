import { BadgeCheck, GraduationCap, Search, ShieldAlert } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { api } from "@/services/api"

interface VerifiedCertificate {
  verificationId: string
  createdAt: string
  course?: { title: string }
  student?: { name: string }
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; certificate: VerifiedCertificate }
  | { status: "invalid" }
  | { status: "error" }

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

export default function VerifyCertificate() {
  const { verificationId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState(verificationId ?? "")
  const [result, setResult] = useState<{ id: string; state: State } | null>(null)

  useEffect(() => {
    if (!verificationId) return
    let cancelled = false
    api
      .get<{ valid: boolean; certificate: VerifiedCertificate }>(
        `/certificates/verify/${encodeURIComponent(verificationId)}`
      )
      .then((res) => {
        if (!cancelled) setResult({ id: verificationId, state: { status: "valid", certificate: res.data.certificate } })
      })
      .catch((err) => {
        if (cancelled) return
        setResult({ id: verificationId, state: { status: err?.response?.status === 404 ? "invalid" : "error" } })
      })
    return () => {
      cancelled = true
    }
  }, [verificationId])

  const state: State = !verificationId
    ? { status: "idle" }
    : result?.id === verificationId
      ? result.state
      : { status: "loading" }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const id = input.trim()
    if (id) navigate(`/verify/${encodeURIComponent(id)}`)
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300">
          <GraduationCap size={26} />
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Verify a certificate</h1>
        <p className="mt-2 text-slate-500">
          Enter the Verification ID printed on a LearnSphere certificate to check that it is genuine.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Verification ID"
          aria-label="Verification ID"
          className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 font-mono text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || state.status === "loading"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          <Search size={16} /> Verify
        </button>
      </form>

      <div className="mt-8" aria-live="polite">
        {state.status === "loading" && <p className="text-center text-sm text-slate-500">Checking...</p>}

        {state.status === "valid" && (
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-500/30 dark:bg-teal-500/10">
            <div className="flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-300">
              <BadgeCheck size={20} /> This certificate is valid
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Awarded to</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{state.certificate.student?.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Course</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{state.certificate.course?.title}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Issued on</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{formatDate(state.certificate.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Verification ID</dt>
                <dd className="font-mono text-slate-900 dark:text-white">{state.certificate.verificationId}</dd>
              </div>
            </dl>
          </div>
        )}

        {state.status === "invalid" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-500/30 dark:bg-red-500/10">
            <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300">
              <ShieldAlert size={20} /> Certificate not found
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              We couldn't find a certificate with that ID. Check for typos and try again.
            </p>
          </div>
        )}

        {state.status === "error" && (
          <p className="text-center text-sm text-red-600">Could not reach the server. Please try again.</p>
        )}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        Earned a certificate?{" "}
        <Link to="/student/certificates" className="font-medium text-teal-600 hover:underline">
          View your certificates
        </Link>
      </p>
    </section>
  )
}