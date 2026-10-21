import { FileText, Paperclip, Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { CHAT_ACCEPT, checkChatFile } from "@/features/student/chat"
import { formatBytes } from "@/features/student/utils"
import { cn } from "@/lib/utils"

interface Props {
  text: string
  onTextChange: (value: string) => void
  file: File | null
  onFileChange: (file: File | null) => void
  onSend: () => void
  onError: (message: string) => void
  sending: boolean
  className?: string
  inputClassName?: string
}

function PendingFile({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/")
  const [preview, setPreview] = useState("")

  useEffect(() => {
    if (!isImage) return
    let alive = true
    const reader = new FileReader()
    reader.onload = () => {
      if (alive) setPreview(String(reader.result))
    }
    reader.readAsDataURL(file)
    return () => {
      alive = false
    }
  }, [file, isImage])

  return (
    <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800">
      {isImage ? (
        preview ? (
          <img src={preview} alt={file.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="h-12 w-12 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700" />
        )
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
          <FileText size={22} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
        <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove attachment"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default function ChatComposer({
  text,
  onTextChange,
  file,
  onFileChange,
  onSend,
  onError,
  sending,
  className,
  inputClassName,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    e.target.value = "" /* same file abar select korte parbe */
    if (!picked) return
    const problem = checkChatFile(picked)
    if (problem) {
      onError(problem)
      return
    }
    onError("")
    onFileChange(picked)
  }

  const canSend = (text.trim().length > 0 || !!file) && !sending

  return (
    <div className={cn("border-t border-slate-100 dark:border-slate-800", className)}>
      {file && (
        <PendingFile
          key={`${file.name}-${file.size}-${file.lastModified}`}
          file={file}
          onRemove={() => onFileChange(null)}
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canSend) onSend()
        }}
        className="flex items-center gap-3"
      >
        <input ref={fileRef} type="file" accept={CHAT_ACCEPT} onChange={pick} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={sending}
          aria-label="Attach image or PDF"
          title="Attach image or PDF"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-teal-600 disabled:opacity-50 dark:hover:bg-slate-800"
        >
          <Paperclip size={18} />
        </button>
        <input
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Write a message..."
          maxLength={2000}
          className={cn(
            "h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800",
            inputClassName
          )}
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  )
}