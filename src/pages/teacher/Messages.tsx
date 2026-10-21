import { ArrowLeft, MoreVertical, Search } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import Avatar from "@/features/student/components/Avatar"
import ChatComposer from "@/features/student/components/ChatComposer"
import MessageAttachment from "@/features/student/components/MessageAttachment"
import PageHeader from "@/features/student/components/PageHeader"
import { sendChatMessage } from "@/features/student/chat"
import type { ChatMessage, Conversation } from "@/features/student/portal-types"
import { CARD } from "@/features/student/ui"
import { formatClock } from "@/features/student/utils"
import { useTeacher } from "@/features/teacher/teacher-context"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

function shortAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export default function TeacherMessages() {
  const { user } = useAuth()
  const { refresh } = useTeacher()
  const [convs, setConvs] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [query, setQuery] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const autoOpened = useRef(false)

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
      /* polling error ignore */
    }
  }, [])

  useEffect(() => {
    if (!activeId) return
    const t = setInterval(() => void loadThread(activeId), 6000)
    return () => clearInterval(t)
  }, [activeId, loadThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, activeId])

  const open = useCallback(
    async (id: string) => {
      setMessages([])
      setFile(null)
      setActiveId(id)
      await loadThread(id)
      await loadConvs()
      void refresh()
    },
    [loadThread, loadConvs, refresh]
  )

  /* mount: first load + desktop e first conversation auto open + polling */
  useEffect(() => {
    let alive = true
    api
      .get<{ conversations: Conversation[] }>("/messages/conversations")
      .then((res) => {
        if (!alive) return
        const list = res.data.conversations
        setConvs(list)
        setError("")
        if (!autoOpened.current && list.length > 0 && window.matchMedia("(min-width: 768px)").matches) {
          autoOpened.current = true
          void open(list[0].user._id)
        }
      })
      .catch((err) => {
        if (alive) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    const t = setInterval(() => void loadConvs(), 10000)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [loadConvs, open])

  const send = async () => {
    const value = text.trim()
    if ((!value && !file) || !activeId || sending) return
    setSending(true)
    try {
      const message = await sendChatMessage(activeId, value, file)
      setMessages((prev) => [...prev, message])
      setText("")
      setFile(null)
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
    <div className="space-y-6">
      <PageHeader
        crumb="Messages"
        title="Messages"
        subtitle="Answer student questions and coordinate with your academy."
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div
        className={cn(
          CARD,
          "grid h-[calc(100vh-15rem)] min-h-[520px] overflow-hidden md:grid-cols-[320px_minmax(0,1fr)]"
        )}
      >
        {/* conversation list */}
        <div className={cn("flex flex-col border-r border-slate-100 dark:border-slate-800", activeId && "hidden md:flex")}>
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
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
                No conversations yet. Students enrolled in your courses will appear here.
              </p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.user._id}
                  type="button"
                  onClick={() => void open(c.user._id)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800",
                    activeId === c.user._id && "bg-teal-50/70 dark:bg-teal-500/10"
                  )}
                >
                  <Avatar name={c.user.name} src={c.user.avatar} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.user.name}</p>
                      {c.lastAt && <span className="shrink-0 text-[11px] text-slate-400">{shortAgo(c.lastAt)}</span>}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
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

        {/* chat panel */}
        <div className={cn("flex min-h-0 flex-col", !activeId && "hidden md:flex")}>
          {!active ? (
            <div className="grid flex-1 place-items-center p-8 text-center text-sm text-slate-500">
              Select a conversation to start chatting.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <button type="button" onClick={() => setActiveId(null)} className="md:hidden" aria-label="Back">
                  <ArrowLeft size={18} />
                </button>
                <Avatar name={active.user.name} src={active.user.avatar} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{active.user.name}</p>
                  <p className="truncate text-xs text-slate-500">{active.subtitle}</p>
                </div>
                <button
                  type="button"
                  aria-label="More"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/40 p-6 dark:bg-transparent">
                {messages.length === 0 && (
                  <p className="pt-10 text-center text-sm text-slate-500">No messages yet. Say hello!</p>
                )}
                {messages.map((m) => {
                  const mine = m.sender === user?._id
                  return (
                    <div key={m._id} className={cn("flex items-end gap-2.5", mine ? "justify-end" : "justify-start")}>
                      {!mine && <Avatar name={active.user.name} src={active.user.avatar} size={28} />}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-3",
                          mine
                            ? "bg-teal-600 text-white"
                            : "border border-slate-100 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        )}
                      >
                        {m.attachment && (
                          <div className={cn(m.text && "mb-2")}>
                            <MessageAttachment attachment={m.attachment} mine={mine} />
                          </div>
                        )}
                        {m.text && <p className="whitespace-pre-wrap break-words text-sm">{m.text}</p>}
                        <p className={cn("mt-1.5 text-[10px]", mine ? "text-teal-100" : "text-slate-400")}>
                          {formatClock(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <ChatComposer
                text={text}
                onTextChange={setText}
                file={file}
                onFileChange={setFile}
                onSend={() => void send()}
                onError={setError}
                sending={sending}
                className="px-5 py-4"
                inputClassName="border-slate-100"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}