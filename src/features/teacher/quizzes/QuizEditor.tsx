import { useState } from "react"
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react"
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui"
import { FIELD, LABEL } from "@/features/teacher/builder/ui"
import { newQuestion } from "@/features/teacher/quizzes/types"
import type { QQuestion, QuizDraft } from "@/features/teacher/quizzes/types"

interface Props {
  initial: QuizDraft
  saving: boolean
  error: string
  onSave: (d: QuizDraft) => void
  onDelete?: () => void
  onClose: () => void
}

function validate(d: QuizDraft): string {
  if (!d.title.trim()) return "Quiz title is required."
  if (d.questions.length === 0) return "Add at least one question."
  for (const [i, q] of d.questions.entries()) {
    if (!q.text.trim()) return `Question ${i + 1} needs text.`
    const opts = q.options.map((o) => o.trim())
    if (opts.filter(Boolean).length < 2) return `Question ${i + 1} needs at least two options.`
    if (!opts[q.correctIndex]) return `Question ${i + 1}: choose a correct answer that has text.`
  }
  return ""
}

/** ফাঁকা option বাদ দেয় এবং সঠিক উত্তরের index ঠিক রাখে */
function clean(d: QuizDraft): QuizDraft {
  return {
    ...d,
    title: d.title.trim(),
    questions: d.questions.map((q) => {
      const opts = q.options.map((o) => o.trim())
      const correctIndex = opts.slice(0, q.correctIndex).filter(Boolean).length
      return { ...q, text: q.text.trim(), options: opts.filter(Boolean), correctIndex, explanation: q.explanation.trim() }
    }),
  }
}

interface CardProps {
  q: QQuestion
  index: number
  total: number
  onChange: (p: Partial<QQuestion>) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}

function QuestionCard({ q, index, total, onChange, onMove, onRemove }: CardProps) {
  const setOption = (oi: number, value: string) =>
    onChange({ options: q.options.map((o, i) => (i === oi ? value : o)) })

  return (
    <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Question {index + 1}</span>
        <div className="flex items-center gap-1 text-slate-400">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">
            <ArrowUp size={15} />
          </button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">
            <ArrowDown size={15} />
          </button>
          <button type="button" onClick={onRemove} className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <input
        value={q.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Type the question"
        className={FIELD}
      />

      <p className="mb-2 mt-4 text-xs font-medium text-slate-500">Options (select the correct answer)</p>
      <div className="space-y-2">
        {q.options.map((opt, oi) => (
          <label key={oi} className="flex items-center gap-3">
            <input
              type="radio"
              name={`correct-${q.key}`}
              checked={q.correctIndex === oi}
              onChange={() => onChange({ correctIndex: oi })}
              className="h-4 w-4 accent-teal-600"
            />
            <input
              value={opt}
              onChange={(e) => setOption(oi, e.target.value)}
              placeholder={`Option ${oi + 1}`}
              className={FIELD}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[110px_1fr]">
        <div>
          <label className={LABEL}>Marks</label>
          <input
            type="number"
            min={1}
            value={q.marks}
            onChange={(e) => onChange({ marks: Math.max(1, Number(e.target.value) || 1) })}
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>Explanation (optional)</label>
          <input
            value={q.explanation}
            onChange={(e) => onChange({ explanation: e.target.value })}
            placeholder="Shown to students after they answer"
            className={FIELD}
          />
        </div>
      </div>
    </div>
  )
}

export default function QuizEditor({ initial, saving, error, onSave, onDelete, onClose }: Props) {
  const [draft, setDraft] = useState<QuizDraft>(initial)
  const [localError, setLocalError] = useState("")

  const patch = (p: Partial<QuizDraft>) => setDraft((d) => ({ ...d, ...p }))
  const patchQuestion = (i: number, p: Partial<QQuestion>) =>
    setDraft((d) => ({ ...d, questions: d.questions.map((q, idx) => (idx === i ? { ...q, ...p } : q)) }))
  const move = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const list = [...d.questions]
      const j = i + dir
      if (j < 0 || j >= list.length) return d
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...d, questions: list }
    })
  const remove = (i: number) => setDraft((d) => ({ ...d, questions: d.questions.filter((_, idx) => idx !== i) }))

  const totalMarks = draft.questions.reduce((n, q) => n + q.marks, 0)

  const submit = () => {
    const msg = validate(draft)
    setLocalError(msg)
    if (!msg) onSave(clean(draft))
  }

  const shownError = localError || error

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{draft._id ? "Edit quiz" : "New quiz"}</h2>
        <button type="button" onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-slate-800">
          Close
        </button>
      </div>

      {shownError && (
        <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{shownError}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-[1fr_130px_150px]">
        <div>
          <label className={LABEL}>Quiz title</label>
          <input value={draft.title} onChange={(e) => patch({ title: e.target.value })} placeholder="e.g. Python basics quiz" className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Duration (min)</label>
          <input
            type="number"
            min={1}
            value={draft.duration}
            onChange={(e) => patch({ duration: Math.max(1, Number(e.target.value) || 1) })}
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>Passing score (%)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={draft.passingScore}
            onChange={(e) => patch({ passingScore: Math.min(100, Math.max(1, Number(e.target.value) || 1)) })}
            className={FIELD}
          />
        </div>
      </div>

      <div className="mb-3 mt-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Questions <span className="font-normal text-slate-400">({draft.questions.length} · {totalMarks} marks)</span>
        </p>
        <button type="button" onClick={() => patch({ questions: [...draft.questions, newQuestion()] })} className={BTN_OUTLINE}>
          <Plus size={16} /> Add question
        </button>
      </div>

      <div className="space-y-4">
        {draft.questions.map((q, i) => (
          <QuestionCard
            key={q.key}
            q={q}
            index={i}
            total={draft.questions.length}
            onChange={(p) => patchQuestion(i, p)}
            onMove={(dir) => move(i, dir)}
            onRemove={() => remove(i)}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        {onDelete ? (
          <button type="button" disabled={saving} onClick={onDelete} className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-40">
            <Trash2 size={15} /> Delete quiz
          </button>
        ) : (
          <span />
        )}
        <button type="button" disabled={saving} onClick={submit} className={BTN_PRIMARY}>
          <Save size={16} /> {saving ? "Saving..." : "Save quiz"}
        </button>
      </div>
    </div>
  )
}