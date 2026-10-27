import { Check } from "lucide-react"

interface ContactSuccessProps {
  name: string
  email: string
  onReset: () => void
}

export function ContactSuccess({ name, email, onReset }: ContactSuccessProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
        <Check size={26} strokeWidth={3} />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Message sent</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Thanks, {name.trim().split(" ")[0]}. A member of our team will reply to{" "}
        <b className="text-slate-900 dark:text-white">{email.trim()}</b> within one business day.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        Send another message
      </button>
    </div>
  )
}