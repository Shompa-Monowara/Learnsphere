import { useState } from "react"
import type { FormEvent } from "react"
import { Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/services/api"
import { subscribeNewsletter } from "../api"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    const value = email.trim()
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError("Enter a valid email address")
      return
    }
    setError("")
    setLoading(true)
    try {
      await subscribeNewsletter(value)
      setDone(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl border border-teal-100 bg-teal-50 p-10 md:grid-cols-2 dark:border-teal-800/60 dark:bg-teal-900/30">
          <div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-800/60 dark:text-teal-200">Stay in the loop</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Course ideas and teaching tips, twice a month</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Join our community of educators and get practical advice on building courses, running cohorts, and keeping students engaged.</p>
          </div>
          <div>
            {done ? (
              <p className="flex items-center gap-2 rounded-xl bg-white p-4 text-sm font-medium text-teal-700 dark:bg-slate-900 dark:text-teal-300">
                <Check size={18} /> Thanks, you are subscribed.
              </p>
            ) : (
              <form onSubmit={submit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@academy.com" aria-label="Email address" aria-invalid={!!error} disabled={loading} className="h-12 rounded-xl bg-white pl-10 dark:bg-slate-900" />
                </div>
                <Button type="submit" disabled={loading} className="h-12 rounded-xl bg-teal-600 px-6 text-white hover:bg-teal-700">{loading ? "Subscribing…" : "Subscribe"}</Button>
              </form>
            )}
            {error && <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
            <p className="mt-2 text-xs text-slate-500">No spam, ever. Unsubscribe in one click.</p>
          </div>
        </div>
      </div>
    </section>
  )
}