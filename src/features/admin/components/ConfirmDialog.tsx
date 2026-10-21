import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface Props {
  title: string
  text: string
  confirmLabel: string
  tone?: "danger" | "primary"
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, text, confirmLabel, tone = "primary", busy, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [busy, onCancel])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50" onClick={() => !busy && onCancel()} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60",
              tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-700"
            )}
          >
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}