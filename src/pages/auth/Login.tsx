import { ShieldCheck } from "lucide-react"
import { LoginForm } from "@/features/auth"

export default function Login() {
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
        <ShieldCheck size={14} /> Secure sign in
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mb-8 mt-2 text-sm text-slate-600 dark:text-slate-400">
        Sign in to continue your courses, assignments, and progress.
      </p>
      <LoginForm />
    </div>
  )
}