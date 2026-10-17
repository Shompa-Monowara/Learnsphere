import { api } from "@/services/api"


export async function uploadFile(file: File, folder: string): Promise<string> {
  const form = new FormData()
  form.append("file", file)
  form.append("folder", folder)
  const res = await api.post(`/upload?folder=${encodeURIComponent(folder)}`, form)
  const d = res.data
  const url = d?.url ?? d?.secure_url ?? d?.file?.url ?? d?.file?.secure_url
  if (!url) throw new Error("Upload finished but no file URL was returned.")
  return url as string
}


export function videoMinutes(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video")
    const src = URL.createObjectURL(file)
    const done = (n: number) => {
      URL.revokeObjectURL(src)
      resolve(n)
    }
    const timer = window.setTimeout(() => done(0), 8000)
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      window.clearTimeout(timer)
      done(Math.max(1, Math.round(video.duration / 60)))
    }
    video.onerror = () => {
      window.clearTimeout(timer)
      done(0)
    }
    video.src = src
  })
}