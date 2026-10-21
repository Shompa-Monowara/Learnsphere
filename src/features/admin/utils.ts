import type { Point } from "./types"

export interface MonthSlot {
  key: string
  label: string
}

/* Shesh n mash er list (backend shudhu data thaka mash dey, tai faka mash ami bhore nei) */
export function lastMonths(n = 6): MonthSlot[] {
  const now = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    return { key, label: d.toLocaleDateString("en-US", { month: "short" }) }
  })
}

export function fill(points: Point[] | undefined, slots: MonthSlot[]): number[] {
  const map = new Map((points ?? []).map((p) => [p.month, p.value]))
  return slots.map((s) => map.get(s.key) ?? 0)
}

/* Mashik notun count + ekhon er total theke "mash shesh e total koto chhilo" ber kore */
export function cumulative(monthly: number[], total: number): number[] {
  const out = new Array<number>(monthly.length).fill(0)
  let running = total
  for (let i = monthly.length - 1; i >= 0; i--) {
    out[i] = Math.max(running, 0)
    running -= monthly[i]
  }
  return out
}

export function trend(series: number[]): { label: string; up: boolean } {
  const cur = series[series.length - 1] ?? 0
  const prev = series[series.length - 2] ?? 0
  if (prev === 0) return { label: cur > 0 ? "New" : "0%", up: true }
  const pct = ((cur - prev) / prev) * 100
  const up = pct >= 0
  return { label: `${up ? "+" : ""}${pct.toFixed(1)}%`, up }
}

export const num = (n: number) => n.toLocaleString("en-US")

export const money = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: n % 1 === 0 ? 0 : 2 })}`

export const compactMoney = (n: number) =>
  `$${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n)}`