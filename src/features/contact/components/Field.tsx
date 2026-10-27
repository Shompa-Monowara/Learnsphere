import type { ReactNode } from "react"

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  aside?: ReactNode
  children: ReactNode
}

export function Field({ label, htmlFor, error, aside, children }: FieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900 dark:text-white">
          {label} <span className="text-red-500">*</span>
        </label>
        {aside}
      </div>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}