import { useState } from "react"
import type { FormEvent } from "react"
import { Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (/^\S+@\S+\.\S+$/.test(email)) setDone(true)
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl bg-teal-50 p-10 md:grid-cols-2 dark:bg-teal-950/40">
          <div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-slate-900">Stay in the loop</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Course ideas and teaching tips, twice a month</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Join 22,000 educators getting practical advice on building courses, running cohorts, and keeping students engaged.</p>
          </div>
          <div>
            {done ? (
              <p className="flex items-center gap-2 rounded-xl bg-white p-4 text-sm font-medium text-teal-700 dark:bg-slate-900">
                <Check size={18} /> Thanks, you are subscribed.
              </p>
            ) : (
              <form onSubmit={submit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@academy.com" className="h-12 rounded-xl bg-white pl-10 dark:bg-slate-900" />
                </div>
                <Button type="submit" className="h-12 rounded-xl bg-teal-600 px-6 text-white hover:bg-teal-700">Subscribe</Button>
              </form>
            )}
            <p className="mt-2 text-xs text-slate-500">No spam, ever. Unsubscribe in one click.</p>
          </div>
        </div>
      </div>
    </section>
  )
}