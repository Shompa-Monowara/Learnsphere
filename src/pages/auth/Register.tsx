import { Sparkles } from "lucide-react"
import { RegisterForm } from "@/features/auth"

export default function Register() {
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
        <Sparkles size={14} /> Free to join
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mb-8 mt-2 text-sm text-slate-600 dark:text-slate-400">
        Start learning or teaching on LearnSphere in a minute.
      </p>
      <RegisterForm />
    </div>
  )
}