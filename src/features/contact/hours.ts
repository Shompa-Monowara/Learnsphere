import type { ContactInfo } from "./api"

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

/* Backend er timezone + schedule diye check kore support open ache kina */
export function isSupportOnline(hours: ContactInfo["hours"], now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: hours.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  const minutes = Number(get("hour")) * 60 + Number(get("minute"))
  const row = hours.rows.find((r) => r.days.includes(get("weekday")))
  if (!row?.open || !row.close) return false
  return minutes >= toMinutes(row.open) && minutes < toMinutes(row.close)
}