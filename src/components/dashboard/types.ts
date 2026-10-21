import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
  badgeKey?: string
}

export type Accent = "teal" | "orange" | "dark"

export interface Promo {
  title: string
  text: string
  to: string
  cta: string
}