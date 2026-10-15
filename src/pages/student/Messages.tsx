import { ArrowLeft, Search, Send } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import Avatar from "@/features/student/components/Avatar"
import type { ChatMessage, Conversation } from "@/features/student/portal-types"
import PageHeader from "@/features/student/components/PageHeader"
import { useStudent } from "@/features/student/student-context"
import { CARD } from "@/features/student/ui"
import { formatClock, timeAgo } from "@/features/student/utils"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

export default function Messages() {
  const { user } = useAuth()
  const { refresh } = useStudent()
  const [convs, setConvs] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [query, setQuery] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadConvs = useCallback(async () => {
    try {
      const res = await api.get<{ conversations: Conversation[] }>("/messages/conversations")
      setConvs(res.data.conversations)
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const loadThread = useCallback(async (id: string) => {
    try {
      const res = await api.get<{ messages: ChatMessage[] }>(`/messages/${id}`)
      setMessages(res.data.messages)
    } catch {
      /* polling এ error চুপচাপ ignore */
    }
  }, [])

  useEffect(() => {
    void loadConvs()
    const t = setInterval(() => void loadConvs(), 10000)
    return () => clearInterval(t)
  }, [loadConvs])

  useEffect(() => {
    if (!activeId) return
    const t = setInterval(() => void loadThread(activeId), 6000)
    return () => clearInterval(t)
  }, [activeId, loadThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, activeId])

  const open = async (id: string) => {
    setMessages([])
    setActiveId(id)
    await loadThread(id)
    await loadConvs()
    void refresh()
  }

  const send = async () => {
    const value = text.trim()
    if (!value || !activeId || sending) return
    setSending(true)
    try {
      const res = await api.post<{ message: ChatMessage }>(`/messages/${activeId}`, { text: value })
      setMessages((prev) => [...prev, res.data.message])
      setText("")
      void loadConvs()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  const active = convs.find((c) => c.user._id === activeId)
  const filtered = convs.filter((c) => c.user.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="space-y-8">
      <PageHeader crumb="Messages" title="Messages" subtitle="Chat with your instructors." />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className={cn(CARD, "grid h-[calc(100vh-14rem)] min-h-[520px] overflow-hidden md:grid-cols-[320px_minmax(0,1fr)]")}>
        <div className={cn("flex flex-col border-r border-slate-100 dark:border-slate-800", activeId && "hidden md:flex")}>
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-slate-700">
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations"
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-6 text-center text-sm text-slate-500">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">
                No contacts yet. Enroll in a course to message its instructor.
              </p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.user._id}
                  type="button"
                  onClick={() => void open(c.user._id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800",
                    activeId === c.user._id && "bg-teal-50/60 dark:bg-teal-500/10"
                  )}
                >
                  <Avatar name={c.user.name} src={c.user.avatar} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.user.name}</p>
                      {c.lastAt && <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(c.lastAt)}</span>}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-500">{c.lastMessage || c.subtitle}</p>
                      {c.unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-semibold text-white">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={cn("flex min-h-0 flex-col", !activeId && "hidden md:flex")}>
          {!active ? (
            <div className="grid flex-1 place-items-center p-8 text-center text-sm text-slate-500">
              Select a conversation to start chatting.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
                <button type="button" onClick={() => setActiveId(null)} className="md:hidden" aria-label="Back">
                  <ArrowLeft size={18} />
                </button>
                <Avatar name={active.user.name} src={active.user.avatar} size={40} />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{active.user.name}</p>
                  <p className="text-xs text-slate-500">{active.subtitle}</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.length === 0 && (
                  <p className="pt-10 text-center text-sm text-slate-500">No messages yet. Say hello!</p>
                )}
                {messages.map((m) => {
                  const mine = m.sender === user?._id
                  return (
                    <div key={m._id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5",
                          mine ? "bg-teal-600 text-white" : "border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">{m.text}</p>
                        <p className={cn("mt-1 text-[10px]", mine ? "text-teal-100" : "text-slate-400")}>{formatClock(m.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void send()
                }}
                className="flex items-center gap-3 border-t border-slate-100 p-4 dark:border-slate-800"
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a message..."
                  maxLength={2000}
                  className="h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  aria-label="Send"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                >
                  <Send size={17} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}