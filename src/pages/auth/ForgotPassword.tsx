import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Mail, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, getErrorMessage } from "@/services/api"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.")
      return
    }
    setSubmitting(true)
    try {
      await api.post("/auth/forgot-password", { email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
        <KeyRound size={14} /> Account recovery
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Forgot password?</h1>
      <p className="mb-8 mt-2 text-sm text-slate-600 dark:text-slate-400">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      {sent ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
            <MailCheck size={18} className="mt-0.5 shrink-0" />
            <span>
              If an account exists for <b>{email.trim()}</b>, a reset link has been sent. The link is valid for 30
              minutes. Please check your spam folder too.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setSent(false)}
            className="h-12 w-full rounded-xl text-base"
          >
            Use a different email
          </Button>
          <Link
            to="/login"
            className="flex items-center justify-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-700"
          >
            {submitting && <Loader2 className="animate-spin" size={18} />}
            {submitting ? "Sending..." : "Send reset link"}
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400"
          >
            <ArrowLeft size={14} /> Back to login
          </Link>
        </form>
      )}
    </div>
  )
}