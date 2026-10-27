export interface Cta {
  label: string
  to: string
}

export type SectionKey = "video" | "quiz" | "assignments" | "progress" | "certificates" | "dashboards"

export interface FeatureSection {
  key: SectionKey
  eyebrow: string
  title: string
  body: string
  bullets: string[]
}

export interface Audience {
  id: string
  label: string
  note: string
  items: string[]
  stat: { value: string; label: string }
}

export type DetailIcon = "shield" | "phone" | "moon" | "users" | "plug" | "headset"

export interface FeaturesPlan {
  name: string
  tagline: string
  price: string
  note: string
  features: string[]
  cta: string
  to: string
  popular: boolean
}

export interface FeaturesData {
  hero: {
    badge: string
    titleLead: string
    titleAccent: string
    body: string
    primaryCta: Cta
    secondaryCta: Cta
    notes: string[]
  }
  sections: FeatureSection[]
  bothSides: { badge: string; title: string; body: string; audiences: Audience[] }
  howItWorks: { badge: string; title: string; body: string; steps: { title: string; body: string }[] }
  details: {
    badge: string
    title: string
    body: string
    items: { icon: DetailIcon; title: string; body: string }[]
  }
  pricing: { badge: string; title: string; body: string; plans: FeaturesPlan[] }
  faq: { badge: string; title: string; body: string; cta: Cta; items: { q: string; a: string }[] }
  cta: { title: string; body: string; primary: Cta; secondary: Cta }
}