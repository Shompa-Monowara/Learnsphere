import { CalendarDays, CloudUpload, Download, FileText, Send, X } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import EmptyState from "@/features/student/components/EmptyState"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import Tabs from "@/features/student/components/Tabs"
import type { AssignmentItem } from "@/features/student/portal-types"
import { useStudent } from "@/features/student/student-context"
import { BTN_PRIMARY, CARD, INPUT } from "@/features/student/ui"
import { fileNameFromUrl, formatBytes, formatDate, formatDateTime } from "@/features/student/utils"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

type Filter = "all" | "pending" | "submitted" | "graded"
type Display = "pending" | "overdue" | "submitted" | "graded"

const PILL: Record<Display, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-amber-50 text-amber-700" },
  overdue: { label: "Overdue", style: "bg-red-50 text-red-700" },
  submitted: { label: "Submitted", style: "bg-blue-50 text-blue-700" },
  graded: { label: "Graded", style: "bg-green-50 text-green-700" },
}

const MAX_FILE_MB = 25

const displayStatus = (a: AssignmentItem): Display =>
  a.status === "pending" && new Date(a.dueDate) < new Date() ? "overdue" : a.status

function Detail({ item, onDone }: { item: AssignmentItem; onDone: () => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState(item.submission?.text ?? "")
  const [note, setNote] = useState("")
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const status = displayStatus(item)
  const graded = item.status === "graded"

  const type = item.submissionType ?? "file"
  const needsFile = type === "file" || type === "both"
  const needsText = type === "text" || type === "both"
  const allowedTypes = (item.allowedFileTypes ?? []).map((t) => t.replace(/^\./, "").toLowerCase())
  const maxMB = Math.min(item.maxFileSizeMB ?? MAX_FILE_MB, MAX_FILE_MB)

  const pastDue = new Date(item.dueDate) < new Date()
  const lateBlocked = pastDue && item.allowLate === false
  const resubmitBlocked = !!item.submission && item.allowResubmission === false
  const locked = lateBlocked || resubmitBlocked

  const hasFile = !!file || !!item.submission?.fileUrl
  const ready = (!needsFile || hasFile) && (!needsText || text.trim().length > 0)

  const pick = (f?: File | null) => {
    if (!f) return
    const ext = (f.name.split(".").pop() || "").toLowerCase()
    if (allowedTypes.length > 0 && !allowedTypes.includes(ext)) {
      setMsg({ type: "error", text: `Only these file types are accepted: ${allowedTypes.join(", ")}` })
      return
    }
    if (f.size > maxMB * 1024 * 1024) {
      setMsg({ type: "error", text: `File must be ${maxMB} MB or smaller` })
      return
    }
    setMsg(null)
    setFile(f)
  }

  const submit = async () => {
    if (!ready) return
    setBusy(true)
    setMsg(null)
    try {
      const fd = new FormData()
      if (needsFile && file) fd.append("file", file)
      if (needsText) fd.append("text", text.trim())
      fd.append("note", note)
      await api.post(`/assignments/${item._id}/submit`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      setFile(null)
      setNote("")
      setMsg({ type: "success", text: "Assignment submitted successfully." })
      await onDone()
    } catch (err) {
      setMsg({ type: "error", text: getErrorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn(CARD, "p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", PILL[status].style)}>{PILL[status].label}</span>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.totalMarks} points</p>
          <p className="text-xs text-slate-500">Due {formatDateTime(item.dueDate)}</p>
        </div>
      </div>

      <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h2>
      <p className="text-sm text-slate-500">{item.course?.title}</p>

      <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Instructions</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {item.instructions || "No instructions provided."}
        </p>
      </div>

      {item.attachments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attachments</h3>
          <div className="mt-2 space-y-2">
            {item.attachments.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <FileText size={16} />
                </span>
                <span className="flex-1 truncate text-sm font-medium text-slate-900 dark:text-white">{fileNameFromUrl(url)}</span>
                <Download size={16} className="text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your submission</h3>

        {item.submission && (
          <div className="mt-2 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
            {item.submission.fileUrl && (
              <a href={item.submission.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:underline">
                <FileText size={16} /> {item.submission.fileName || fileNameFromUrl(item.submission.fileUrl)}
              </a>
            )}
            {item.submission.text && (
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">{item.submission.text}</p>
            )}
            {item.submission.isLate && <p className="mt-1 text-xs text-red-600">Submitted late</p>}
            {item.submission.note && <p className="mt-2 text-sm text-slate-500">Note: {item.submission.note}</p>}
          </div>
        )}

        {graded && item.submission ? (
          <div className="mt-3 rounded-xl bg-green-50 p-4 dark:bg-green-500/10">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Score: {item.submission.score ?? 0}/{item.totalMarks}
            </p>
            {item.submission.feedback && (
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.submission.feedback}</p>
            )}
          </div>
        ) : locked ? (
          <div className="mt-3">
            <Notice type="error">
              {lateBlocked
                ? "The deadline has passed and this assignment no longer accepts late submissions."
                : "Resubmission is not allowed for this assignment."}
            </Notice>
          </div>
        ) : (
          <>
            {pastDue && <div className="mt-3"><Notice type="error">The deadline has passed. Your submission will be marked as late.</Notice></div>}

            {needsFile && (
              <>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDrag(true)
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDrag(false)
                    pick(e.dataTransfer.files?.[0])
                  }}
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    "mt-3 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
                    drag ? "border-teal-500 bg-teal-50 dark:bg-teal-500/10" : "border-slate-200 hover:border-teal-400 dark:border-slate-700"
                  )}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <CloudUpload size={22} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {item.submission?.fileUrl ? "Drop a new file to resubmit, or click to browse" : "Drag & drop your file, or click to browse"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {allowedTypes.length > 0 ? allowedTypes.join(", ").toUpperCase() : "PDF, ZIP, DOC, PPT, XLS, TXT or image"} · up to {maxMB} MB
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept={allowedTypes.length > 0 ? allowedTypes.map((t) => `.${t}`).join(",") : undefined}
                    onChange={(e) => {
                      pick(e.target.files?.[0])
                      e.target.value = ""
                    }}
                  />
                </div>

                {file && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <FileText size={18} className="text-teal-600" />
                    <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
                    <button type="button" onClick={() => setFile(null)} aria-label="Remove file" className="text-slate-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </>
            )}

            {needsText && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                maxLength={10000}
                placeholder="Write your answer here"
                aria-label="Your answer"
                className={`${INPUT} mt-3`}
              />
            )}

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Add a note for your instructor (optional)"
              className={`${INPUT} mt-3`}
            />

            {msg && <div className="mt-3"><Notice type={msg.type}>{msg.text}</Notice></div>}

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {item.submission
                  ? item.allowResubmission === false
                    ? "Submitted"
                    : "Submitted — you can resubmit until it's graded"
                  : needsFile && needsText
                    ? "A file and a written answer are both required"
                    : needsText
                      ? "Written answer required"
                      : "Not submitted yet"}
              </span>
              <button type="button" onClick={() => void submit()} disabled={!ready || busy} className={BTN_PRIMARY}>
                <Send size={15} /> {busy ? "Submitting..." : item.submission ? "Resubmit" : "Submit assignment"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Assignments() {
  const { refresh } = useStudent()
  const { data, loading, error, reload } = useFetch<{ assignments: AssignmentItem[] }>("/assignments/mine")
  const [filter, setFilter] = useState<Filter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const all = useMemo(() => data?.assignments ?? [], [data])
  const filtered = all.filter((a) => filter === "all" || a.status === filter)
  const selected = filtered.find((a) => a._id === selectedId) ?? filtered[0]

  const onDone = async () => {
    await reload()
    await refresh()
  }

  return (
    <div className="space-y-8">
      <PageHeader crumb="Assignments" title="Assignments" subtitle="Submit your work, track grades, and read teacher feedback." />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "submitted", label: "Submitted" },
            { value: "graded", label: "Graded" },
          ]}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No assignments here" text="Assignments from your enrolled courses will appear in this list." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
            <div className="space-y-3">
              {filtered.map((a) => {
                const status = displayStatus(a)
                return (
                  <button
                    key={a._id}
                    type="button"
                    onClick={() => setSelectedId(a._id)}
                    className={cn(
                      CARD,
                      "w-full p-4 text-left transition-colors",
                      selected?._id === a._id && "border-teal-300 bg-teal-50/40 dark:border-teal-500/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</p>
                      <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", PILL[status].style)}>{PILL[status].label}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{a.course?.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><CalendarDays size={12} /> {formatDate(a.dueDate)}</span>
                      {a.status === "graded" && a.submission && (
                        <span className="font-semibold text-green-600">{a.submission.score ?? 0}/{a.totalMarks}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {selected && <Detail key={selected._id} item={selected} onDone={onDone} />}
          </div>
        )}
      </PageState>
    </div>
  )
}