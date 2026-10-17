import { useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { api, getErrorMessage } from "@/services/api"
import { BTN_OUTLINE, BTN_PRIMARY, INPUT } from "@/features/student/ui"
import { usd } from "../utils"

interface Props {
  available: number
  onClose: () => void
  onDone: () => void
}

export default function PayoutDialog({ available, onClose, onDone }: Props) {
  const [amount, setAmount] = useState(String(Math.floor(available)))
  const [method, setMethod] = useState<"bank" | "paypal">("bank")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      await api.post("/teacher/payouts", { amount: Number(amount), method })
      onDone()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request payout</h2>
            <p className="text-sm text-slate-500">Available: {usd(available, 2)} (minimum $10)</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-200">Amount (USD)</label>
        <input
          type="number"
          min={10}
          max={available}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`${INPUT} mt-1.5`}
          required
        />

        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as "bank" | "paypal")}
          className={`${INPUT} mt-1.5`}
        >
          <option value="bank">Bank transfer</option>
          <option value="paypal">PayPal</option>
        </select>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={BTN_PRIMARY}>
            {saving ? "Sending..." : "Request payout"}
          </button>
        </div>
      </form>
    </div>
  )
}