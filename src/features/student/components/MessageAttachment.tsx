import { FileText } from "lucide-react"
import type { ChatAttachment } from "@/features/student/portal-types"
import { formatBytes } from "@/features/student/utils"
import { cn } from "@/lib/utils"

interface Props {
  attachment: ChatAttachment
  mine: boolean
}

export default function MessageAttachment({ attachment, mine }: Props) {
  if (attachment.kind === "image") {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        className="block w-60 overflow-hidden rounded-xl sm:w-72"
      >
        <img src={attachment.url} alt={attachment.name} loading="lazy" className="max-h-72 w-full object-cover" />
      </a>
    )
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "flex w-60 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors sm:w-72",
        mine ? "bg-white/15 hover:bg-white/25" : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/60 dark:hover:bg-slate-700"
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
        <FileText size={20} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{attachment.name}</span>
        <span className={cn("block text-[11px]", mine ? "text-teal-100" : "text-slate-400")}>
          PDF · {formatBytes(attachment.size)}
        </span>
      </span>
    </a>
  )
}