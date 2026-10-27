import { api } from "@/services/api"

export const CONTACT_SUBJECTS = [
  "General question",
  "Course or enrollment",
  "Instructor enquiry",
  "Become an instructor",
  "Billing & payments",
  "Team plans",
  "Report a problem",
] as const

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  instructor?: string
}

export async function sendContactMessage(payload: ContactPayload) {
  const { data } = await api.post<{ message: string }>("/contact", payload)
  return data
}

export interface ContactInfo {
  hero: { badge: string; title: string; body: string }
  email: { value: string; note: string }
  phone: { value: string; note: string }
  address: { street: string; city: string; note: string }
  hours: {
    timezone: string
    rows: { label: string; time: string; days: string[]; open?: string; close?: string }[]
  }
  response: { average: string; note: string }
  help: { body: string; links: string[]; to: string }
  teamBanner: { text: string; strong: string; cta: string; to: string }
}

export async function getContactInfo() {
  const { data } = await api.get<ContactInfo>("/contact/info")
  return data
}