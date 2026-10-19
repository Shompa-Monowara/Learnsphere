import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getErrorMessage } from "@/services/api"

interface Props {
  email: string
  initialCooldown: number
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<number>
  onBack: () => void
}

export default function OtpStep({ email, initialCooldown, onVerify, onResend, onBack }: Props) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(initialCooldown)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code.")
      return
    }
    setVerifying(true)
    try {
      await onVerify(otp)
    } catch (err) {
      setError(getErrorMessage(err))
      setVerifying(false)
    }
  }

  const resend = async () => {
    setError("")
    setInfo("")
    setResending(true)
    try {
      setCooldown(await onResend())
      setOtp("")
      setInfo("A new code has been sent.")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
        <MailCheck size={18} className="mt-0.5 shrink-0" />
        <span>
          We sent a 6-digit code to <b>{email}</b>. It expires in 10 minutes.
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {info && !error && <p className="text-sm text-teal-700 dark:text-teal-300">{info}</p>}

      <div className="space-y-2">
        <Label htmlFor="otp">Verification code</Label>
        <Input
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="h-14 rounded-xl text-center text-2xl tracking-[0.5em]"
        />
      </div>

      <Button
        type="submit"
        disabled={verifying}
        className="h-12 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-700"
      >
        {verifying && <Loader2 className="animate-spin" size={18} />}
        {verifying ? "Verifying..." : "Verify & create account"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400"
        >
          <ArrowLeft size={14} /> Change details
        </button>
        <button
          type="button"
          onClick={() => void resend()}
          disabled={cooldown > 0 || resending}
          className="font-semibold text-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : resending ? "Sending..." : "Resend code"}
        </button>
      </div>
    </form>
  )
}