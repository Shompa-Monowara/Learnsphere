import { api } from "@/services/api"
import type { ChatMessage } from "./portal-types"

export const CHAT_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,application/pdf"
export const CHAT_MAX_BYTES = 10 * 1024 * 1024

/* File ঠিক আছে কিনা check করে; ঠিক থাকলে null, নাহলে error message */
export function checkChatFile(file: File): string | null {
  if (!CHAT_ACCEPT.split(",").includes(file.type)) {
    return "Only images (JPG, PNG, WEBP, GIF) and PDF files are allowed"
  }
  if (file.size > CHAT_MAX_BYTES) return "File is too large (max 10 MB)"
  return null
}

export async function sendChatMessage(userId: string, text: string, file: File | null) {
  if (!file) {
    const res = await api.post<{ message: ChatMessage }>(`/messages/${userId}`, { text })
    return res.data.message
  }
  const form = new FormData()
  form.append("text", text)
  form.append("file", file)
  const res = await api.post<{ message: ChatMessage }>(`/messages/${userId}`, form)
  return res.data.message
}