import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/services/api"
import { CONTACT_SUBJECTS, sendContactMessage } from "../api"
import { MAX, validate } from "../form"
import type { Errors, FormState } from "../form"
import { CARD, fieldCls, selectCls, textareaCls } from "../styles"
import { ContactSuccess } from "./ContactSuccess"
import { Field } from "./Field"

export function ContactForm({ instructor }: { instructor: string }) {
  const [form, setForm] = useState<FormState>(() => ({
    name: "",
    email: "",
    subject: instructor ? "Instructor enquiry" : "",
    message: instructor ? `Hi, I'd like to get in touch with ${instructor}.\n\n` : "",
  }))
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState("")

  const update = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)
    setServerError("")
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
        instructor: instructor || undefined,
      })
      setSent(true)
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setForm({ name: "", email: "", subject: "", message: "" })
    setErrors({})
    setSent(false)
  }

  return (
    <div className={`${CARD} p-6 sm:p-8`}>
      {sent ? (
        <ContactSuccess name={form.name} email={form.email} onReset={reset} />
      ) : (
        <form onSubmit={(e) => void onSubmit(e)} noValidate>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Send us a message</h2>
          <p className="mt-1 text-sm text-slate-500">Fields marked with an asterisk are required.</p>

          <div className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" error={errors.name}>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Jordan Ellis"
                  autoComplete="name"
                  className={`${fieldCls} ${errors.name ? "border-red-400" : ""}`}
                />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className={`${fieldCls} ${errors.email ? "border-red-400" : ""}`}
                />
              </Field>
            </div>

            <Field label="Subject" htmlFor="subject" error={errors.subject}>
              <div className="relative">
                <select
                  id="subject"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className={`${selectCls} ${form.subject ? "text-slate-900 dark:text-white" : "text-slate-500"} ${
                    errors.subject ? "border-red-400" : ""
                  }`}
                >
                  <option value="">Choose a topic</option>
                  {CONTACT_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </Field>

            <Field
              label="Message"
              htmlFor="message"
              error={errors.message}
              aside={<span className="text-xs text-slate-500">{form.message.length}/{MAX}</span>}
            >
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={6}
                maxLength={MAX}
                placeholder="Tell us a little about what you need — the course, the team size, or the problem you're trying to solve."
                className={`${textareaCls} ${errors.message ? "border-red-400" : ""}`}
              />
              <p className="mt-2 text-xs text-slate-500">
                Up to {MAX} characters. Screenshots and files can follow by email.
              </p>
            </Field>
          </div>

          {serverError && <p className="mt-4 text-sm text-red-600">{serverError}</p>}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
            <p className="max-w-xs text-xs text-slate-500">
              By sending this you agree to our{" "}
              <Link to="/privacy" className="text-teal-700 hover:underline">privacy policy</Link>. We never sell your
              details.
            </p>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(13,148,136,0.7)] transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              <Send size={16} /> {sending ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}