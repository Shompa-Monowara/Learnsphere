import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROLE_HOME } from "@/config/constants"
import { getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"
import { GithubIcon, GoogleIcon } from "./SocialIcons"

type SignupRole = "student" | "teacher"

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirm?: string
  terms?: string
}

const ROLE_OPTIONS: {
  value: SignupRole
  title: string
  desc: string
  icon: typeof GraduationCap
}[] = [
  { value: "student", title: "Student", desc: "Learn from courses", icon: GraduationCap },
  { value: "teacher", title: "Teacher", desc: "Create and sell courses", icon: BookOpen },
]

function getStrength(password: string) {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"]
  const colors = ["bg-slate-300", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-600"]
  const index = password ? score : 0
  return { score: index, label: password ? labels[index] : "", color: colors[index] }
}

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<SignupRole>("student")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [terms, setTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const strength = useMemo(() => getStrength(password), [password])

  const validate = () => {
    const next: FormErrors = {}
    if (name.trim().length < 2) next.name = "Name must be at least 2 characters."
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address."
    if (password.length < 6) next.password = "Password must be at least 6 characters."
    if (confirm !== password) next.confirm = "Passwords do not match."
    if (!terms) next.terms = "You must accept the terms to continue."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return
    setSubmitting(true)
    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      })
      navigate(ROLE_HOME[user.role], { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "h-12 rounded-xl pl-10"
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"

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
        <Label>I want to join as</Label>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map(({ value, title, desc, icon: Icon }) => {
            const active = role === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                aria-pressed={active}
                className={`rounded-xl border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  active
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                }`}
              >
                <Icon size={22} className={active ? "text-teal-600" : "text-slate-400"} />
                <p className="mt-2 text-sm font-semibold">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <UserIcon size={18} className={iconClass} />
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            className={inputClass}
          />
        </div>
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail size={18} className={iconClass} />
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
          <Lock size={18} className={iconClass} />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
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
        {password && (
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= strength.score ? strength.color : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">{strength.label}</span>
          </div>
        )}
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <div className="relative">
          <Lock size={18} className={iconClass} />
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={!!errors.confirm}
            className={inputClass}
          />
        </div>
        {errors.confirm && <p className="text-sm text-red-600">{errors.confirm}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(v) => setTerms(v === true)}
            className="mt-0.5 data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600"
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-snug">
            I agree to the{" "}
            <Link to="/terms" className="font-medium text-teal-600 hover:text-teal-700">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-medium text-teal-600 hover:text-teal-700">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-700"
      >
        {submitting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
        {submitting ? "Creating account..." : "Create account"}
      </Button>

      <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        Or sign up with
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" className="h-12 rounded-xl">
          <GoogleIcon /> Google
        </Button>
        <Button type="button" variant="outline" className="h-12 rounded-xl">
          <GithubIcon /> GitHub
        </Button>
      </div>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
          Login
        </Link>
      </p>
    </form>
  )
}