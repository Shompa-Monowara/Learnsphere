import { X } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { fmtDate, fmtMoney, methodLabel, STATUS_META } from "../payment-utils"
import type { AdminPayment } from "../types"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-slate-100 py-3 text-sm last:border-0 dark:border-slate-800">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900 dark:text-white">{children}</span>
    </div>
  )
}

export default function PaymentModal({ payment: p, onClose }: { payment: AdminPayment; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  const s = STATUS_META[p.status] ?? STATUS_META.pending

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaction details</h3>
            <p className="font-mono text-xs text-slate-500">{p.transactionId}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-3">
          <Row label="Amount">
            <span className="text-lg font-bold">{fmtMoney(p.amount)}</span>
          </Row>
          <Row label="Status">
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", s.style)}>{s.label}</span>
          </Row>
          <Row label="Customer">
            {p.customer?.name ?? "Deleted user"}
            {p.customer?.email && <span className="block text-xs font-normal text-slate-500">{p.customer.email}</span>}
          </Row>
          <Row label="Course">{p.course?.title ?? "Deleted course"}</Row>
          <Row label="Instructor">{p.instructor?.name ?? "Unknown"}</Row>
          <Row label="Method">{methodLabel(p.method)}</Row>
          <Row label="Date">{fmtDate(p.createdAt)}</Row>
        </div>
      </div>
    </div>
  )
}