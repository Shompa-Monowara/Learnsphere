import { Save, Send } from "lucide-react"
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui"
import { FIELD, LABEL } from "@/features/teacher/builder/ui"
import type { BuilderForm } from "@/features/teacher/builder/types"

interface Props {
  form: BuilderForm
  status: string
  lessons: number
  busy: boolean
  onChange: (p: Partial<BuilderForm>) => void
  onSaveDraft: () => void
  onSubmit: () => void
}

const STATUS_NOTE: Record<string, string> = {
  pending: "This course is waiting for admin review.",
  published: "This course is live in the catalog.",
  rejected: "This course was rejected. Update it and submit again.",
  unpublished: "This course is unpublished. Submit it again to publish.",
}

export default function StepPublish({ form, status, lessons, busy, onChange, onSaveDraft, onSubmit }: Props) {
  const sell = Number(form.price || 0)
  const orig = Number(form.originalPrice || 0)
  const hasDiscount = orig > sell && sell >= 0
  const badOriginal = !!form.originalPrice && orig <= sell
  const canSubmit = lessons > 0 && !busy

  return (
    <div>
      <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">Pricing &amp; publish</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Price (USD)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="49"
            className={FIELD}
          />
          <p className="mt-1.5 text-xs text-slate-400">Enter 0 to make this course free.</p>
        </div>

        <div>
          <label className={LABEL}>Original price (optional)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.originalPrice}
            onChange={(e) => onChange({ originalPrice: e.target.value })}
            placeholder="99"
            className={FIELD}
          />
          <p className="mt-1.5 text-xs text-slate-400">
            {hasDiscount
              ? `Students will see $${sell} with $${orig} crossed out.`
              : badOriginal
                ? "Original price should be higher than the price, otherwise it is ignored."
                : "Add a higher price to show a discount."}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Ready to publish?</p>
        <p className="mt-1 text-xs text-slate-500">
          Your course will be submitted for review. You can keep editing it as a draft at any time.
        </p>
        {STATUS_NOTE[status] && <p className="mt-2 text-xs font-medium text-teal-700">{STATUS_NOTE[status]}</p>}
        {lessons === 0 && (
          <p className="mt-2 text-xs font-medium text-amber-600">
            Add at least one lesson in the Curriculum step before submitting for review.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" disabled={busy} onClick={onSaveDraft} className={BTN_OUTLINE}>
          <Save size={16} /> Save draft
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`${BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Send size={16} /> Submit for review
        </button>
      </div>
    </div>
  )
}