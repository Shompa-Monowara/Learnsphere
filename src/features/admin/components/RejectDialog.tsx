import { useState } from "react"
import { INPUT } from "@/features/student/ui"

interface Props {
  title: string
  busy?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export default function RejectDialog({ title, busy, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState("")
  const valid = reason.trim().length >= 5

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50" onClick={() => !busy && onCancel()} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reject "{title}"?</h3>
        <p className="mt-2 text-sm text-slate-500">The teacher will be notified with your reason so they can fix and resubmit.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          autoFocus
          placeholder="e.g. Video quality is too low in section 2..."
          className={`${INPUT} mt-4 resize-none`}
        />
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason.trim())}
            disabled={busy || !valid}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? "Please wait..." : "Reject course"}
          </button>
        </div>
      </div>
    </div>
  )
}