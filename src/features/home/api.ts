import { api } from "@/services/api"

export interface PublicStats {
  students: number
  courses: number
  instructors: number
  certificates: number
}

export async function fetchPublicStats() {
  const { data } = await api.get<PublicStats>("/stats/public")
  return data
}

export async function subscribeNewsletter(email: string) {
  const { data } = await api.post<{ message: string }>("/newsletter/subscribe", { email })
  return data
}

export async function unsubscribeNewsletter(token: string) {
  const { data } = await api.post<{ message: string }>(`/newsletter/unsubscribe/${token}`)
  return data
}