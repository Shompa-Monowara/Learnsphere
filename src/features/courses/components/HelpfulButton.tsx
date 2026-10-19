import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { useAuth } from "@/stores/auth-context"
import { toggleHelpful } from "../api"

interface Props {
  reviewId: string
  authorId?: string
  helpful: number
  markedByMe: boolean
}

/* Student ra onno der review "helpful" mark/unmark korte pare. Baki sobar jonno shudhu count. */
export function HelpfulButton({ reviewId, authorId, helpful, markedByMe }: Props) {
  const { user } = useAuth()
  const [count, setCount] = useState(helpful)
  const [marked, setMarked] = useState(markedByMe)
  const [busy, setBusy] = useState(false)

  const canVote = user?.role === "student" && user._id !== authorId
  const label = `${count.toLocaleString("en-US")} found helpful`

  if (!canVote) {
    if (count === 0) return null
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        <ThumbsUp size={13} /> {label}
      </span>
    )
  }

  const onClick = async () => {
    if (busy) return
    setBusy(true)
    try {
      const res = await toggleHelpful(reviewId)
      setCount(res.helpful)
      setMarked(res.markedByMe)
    } catch {
      /* fail hole ager obostha-i thake */
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={marked}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
        marked
          ? "border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
          : "border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-400"
      }`}
    >
      <ThumbsUp size={13} className={marked ? "fill-teal-600" : ""} />
      {count > 0 ? label : "Helpful?"}
    </button>
  )
}