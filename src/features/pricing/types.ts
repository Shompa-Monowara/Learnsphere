export type CellValue = string | boolean

export interface Plan {
  slug: string
  name: string
  tagline: string
  monthlyPrice: number
  priceNote: string
  cta: string
  ctaTo: string
  popular: boolean
  features: string[]
  values: Record<string, CellValue>
}

export interface CompareGroup {
  title: string
  rows: { key: string; label: string }[]
}

export interface PricingData {
  plans: Plan[]
  comparison: CompareGroup[]
  yearlyDiscountPercent: number
}