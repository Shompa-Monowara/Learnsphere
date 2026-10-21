import { BarChart3, Briefcase, Cloud, Code2, Megaphone, Palette, ShieldCheck, Smartphone, Tag } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const CATEGORY_ICONS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "tag", label: "Tag", icon: Tag },
  { key: "code", label: "Code", icon: Code2 },
  { key: "chart", label: "Chart", icon: BarChart3 },
  { key: "palette", label: "Design", icon: Palette },
  { key: "cloud", label: "Cloud", icon: Cloud },
  { key: "megaphone", label: "Marketing", icon: Megaphone },
  { key: "smartphone", label: "Mobile", icon: Smartphone },
  { key: "briefcase", label: "Business", icon: Briefcase },
  { key: "shield", label: "Security", icon: ShieldCheck },
]

/* Chena na gele (jemon purono "book-open") Tag icon dekhai */
export const iconFor = (key?: string): LucideIcon => CATEGORY_ICONS.find((i) => i.key === key)?.icon ?? Tag