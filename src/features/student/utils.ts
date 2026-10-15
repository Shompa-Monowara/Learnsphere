export function formatMinutes(minutes: number) {
  if (minutes <= 0) return "Completed"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`
}

export function formatHours(minutes: number) {
  return minutes < 60 ? `${minutes}m` : `${Math.round(minutes / 60)}h`
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

export function formatDue(iso: string) {
  const due = new Date(iso)
  const days = Math.round((startOfDay(due) - startOfDay(new Date())) / 86400000)
  const time = due.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  if (days <= 0) return { label: `Due today, ${time}`, tone: "text-red-600 dark:text-red-400" }
  if (days === 1) return { label: `Due tomorrow, ${time}`, tone: "text-red-600 dark:text-red-400" }
  if (days <= 3) return { label: `Due in ${days} days`, tone: "text-orange-600 dark:text-orange-400" }
  return { label: `Due in ${days} days`, tone: "text-slate-500 dark:text-slate-400" }
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  return `${formatDate(iso)} · ${time}`
}

export function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  return formatDate(iso)
}

export function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString()
}

export function fileNameFromUrl(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop()?.split("?")[0] || "file")
  } catch {
    return "file"
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}