import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ListVideo, Mail, Send, Star, Users, X } from "lucide-react"
import type { InstructorItem } from "@/features/instructors/api"
import { sendChatMessage } from "@/features/student/chat"
import { getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

interface Props {
  instructor: InstructorItem
  onClose: () => void
}

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n)

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, k) => (
        <Star
          key={k}
          size={14}
          className={k < Math.round(rating) ? "fill-[#f97316] text-[#f97316]" : "text-slate-300"}
        />
      ))}
    </div>
  )
}

export default function InstructorModal({ instructor: i, onClose }: Props) {
  const { user } = useAuth()
  const [composing, setComposing] = useState(false)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const firstName = i.name.split(" ")[0]
  const canMessage = !i.profileOnly && (!user || (user.role !== "admin" && user._id !== i._id))
  const messagesPath = user?.role === "teacher" ? "/teacher/messages" : "/student/messages"
  const bio =
    i.bio?.trim() ||
    (i.profileOnly
      ? `${firstName} is part of the LearnSphere instructor team.`
      : `${firstName} teaches ${i.coursesCount} course${i.coursesCount === 1 ? "" : "s"} on LearnSphere.`)

  const send = async () => {
    const value = text.trim()
    if (!value || sending) return
    setSending(true)
    setError("")
    try {
      await sendChatMessage(i._id, value, null)
      setSent(true)
      setText("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  const primaryBtn =
    "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
  const outlineBtn =
    "inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white"

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructor-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92vh] w-full max-w-[768px] overflow-y-auto rounded-2xl bg-white shadow-2xl md:grid-cols-[260px_minmax(0,1fr)] dark:bg-slate-900"
      >
        {/* Photo */}
        <div className="relative h-64 w-full bg-teal-50 md:h-auto md:min-h-[420px]">
          {i.avatar ? (
            <img src={i.avatar} alt={i.name} className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-teal-500 to-teal-800 text-6xl font-bold text-white">
              {initials(i.name)}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="relative p-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <X size={16} />
          </button>

          <div className="pr-12">
            {i.category && (
              <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {i.category}
              </span>
            )}
            <h2
              id="instructor-modal-title"
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              {i.name}
            </h2>
            <p className="mt-1 text-[15px] text-slate-500 dark:text-slate-400">
              {i.headline || "LearnSphere instructor"}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Stars rating={i.rating} />
              <b className="text-slate-900 dark:text-white">{i.rating.toFixed(1)}</b>
            </span>
            <span className="flex items-center gap-1.5">
              <ListVideo size={15} className="text-slate-400" /> {i.coursesCount} course
              {i.coursesCount === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={15} className="text-slate-400" /> {compact(i.studentsCount)} students
            </span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{bio}</p>

          {i.skills.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Expertise</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {i.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-[13px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
            {composing && canMessage && user ? (
              sent ? (
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200">
                  Your message to {firstName} was sent.{" "}
                  <Link to={messagesPath} className="font-semibold underline underline-offset-2">
                    Open messages
                  </Link>
                </div>
              ) : (
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    autoFocus
                    placeholder={`Write a message to ${firstName}...`}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => void send()}
                      disabled={sending || !text.trim()}
                      className={primaryBtn}
                    >
                      {sending ? "Sending..." : "Send message"} <Send size={15} />
                    </button>
                    <button type="button" onClick={() => setComposing(false)} className={outlineBtn}>
                      Cancel
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-wrap gap-3">
                {canMessage &&
                  (user ? (
                    <button type="button" onClick={() => setComposing(true)} className={primaryBtn}>
                      Message {firstName} <Mail size={16} />
                    </button>
                  ) : (
                    <Link to="/login" className={primaryBtn}>
                      Message {firstName} <Mail size={16} />
                    </Link>
                  ))}
                <button type="button" onClick={onClose} className={outlineBtn}>
                  Browse other instructors
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}