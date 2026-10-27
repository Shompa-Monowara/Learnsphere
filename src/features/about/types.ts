import type { Cta } from "@/features/platform/types"

export interface AboutData {
  hero: {
    badge: string
    titleLead: string
    titleAccent: string
    body: string
    primaryCta: Cta
    secondaryCta: Cta
    meta: { icon: "pin" | "calendar" | "users"; label: string }[]
    image: { src: string; alt: string }
    floatingBadge: string
    rating: { value: string; label: string }
  }
  mission: { title: string; body: string }
  vision: { title: string; body: string }
  story: {
    badge: string
    title: string
    body: string
    quote: { text: string; author: string; role: string }
    timeline: { year: string; title: string; body: string }[]
  }
}