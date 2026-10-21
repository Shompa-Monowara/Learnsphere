import type { PaymentStatus } from "./types"

export const STATUS_META: Record<PaymentStatus, { label: string; style: string }> = {
  paid: { label: "Completed", style: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
  pending: { label: "Pending", style: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  failed: { label: "Failed", style: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
  refunded: { label: "Refunded", style: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
}

const METHOD_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  paypal: "PayPal",
  apple: "Apple Pay",
  "apple pay": "Apple Pay",
  stripe: "Stripe",
  bank: "Bank transfer",
  "bank transfer": "Bank transfer",
  manual: "Manual",
}

/* Chena na method hole prothom okkhor boro kore dekhai */
export const methodLabel = (m?: string) => {
  const key = (m || "manual").trim().toLowerCase()
  return METHOD_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

export const METHOD_COLORS = ["bg-teal-500", "bg-orange-500", "bg-sky-500", "bg-green-500"]

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

export const fmtMoney = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`