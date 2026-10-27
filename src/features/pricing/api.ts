import { api } from "@/services/api"

export interface MySubscription {
  plan: string // "free" | "pro" | "academy"
  subscription: {
    plan: string
    interval: "month" | "year"
    status: string
    amount: number
    currentPeriodEnd?: string
    cancelAtPeriodEnd: boolean
    active: boolean
  } | null
}

export const startCheckout = (plan: string, interval: "month" | "year") =>
  api.post<{ url: string }>("/subscriptions/checkout", { plan, interval }).then((r) => r.data.url)

export const getMySubscription = () => api.get<MySubscription>("/subscriptions/me").then((r) => r.data)

export const confirmSubscription = (sessionId: string) =>
  api
    .post<MySubscription & { planName: string }>("/subscriptions/confirm", { sessionId })
    .then((r) => r.data)

export const cancelSubscription = () => api.post<MySubscription>("/subscriptions/cancel").then((r) => r.data)