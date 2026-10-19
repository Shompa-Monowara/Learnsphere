import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROLE_HOME } from "@/config/constants"

import { useAuth } from "@/stores/auth-context"
import { OAUTH_ERRORS } from "../oauth"
import SocialButtons from "./SocialButtons"
import { getErrorMessage } from "@/services/api"

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState(() => OAUTH_ERRORS[searchParams.get("error") ?? ""] ?? "")
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next: { email?: string; password?: string } = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address."
    if (password.length < 6) next.password = "Password must be at least 6 characters."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return
    setSubmitting(true)
    try {
      const user = await login(email.trim(), password, remember)
      navigate(from ?? ROLE_HOME[user.role], { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "h-12 rounded-xl pl-10"

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
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
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            className={inputClass}
          />
        </div>
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setRemember(v === true)}
            className="data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600"
          />
          <Label htmlFor="remember" className="font-normal">
            Remember me
          </Label>
        </div>
        <Link to="/forgot-password" className="text-sm font-medium text-teal-600 hover:text-teal-700">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-700"
      >
        {submitting ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
        {submitting ? "Signing in..." : "Login"}
      </Button>

      <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        Or continue with
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <SocialButtons mode="login" />

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
          Create one free
        </Link>
      </p>
    </form>
  )
}