import { ArrowDown, ArrowUp, Check, Move, Trash2 } from "lucide-react"
import { FIELD, LABEL } from "@/features/teacher/builder/ui"
import type { QQuestion } from "@/features/teacher/quizzes/types"

const LETTERS = "ABCDEFGH"

interface Props {
  q: QQuestion
  index: number
  total: number
  onChange: (p: Partial<QQuestion>) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}

export default function QuestionCard({ q, index, total, onChange, onMove, onRemove }: Props) {
  const setOption = (oi: number, value: string) =>
    onChange({ options: q.options.map((o, i) => (i === oi ? value : o)) })

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="text-slate-300" title="Use the arrows below to reorder">
          <Move size={16} />
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
          {index + 1}
        </span>
        <input
          value={q.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Type the question"
          className={`${FIELD} font-medium`}
        />
      </div>

      <div className="pl-[4.25rem]">
        <div className="mt-4 space-y-2.5">
          {q.options.map((opt, oi) => {
            const correct = q.correctIndex === oi
            return (
              <div key={oi} className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Mark option ${LETTERS[oi]} as correct`}
                  onClick={() => onChange({ correctIndex: oi })}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    correct
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-slate-200 bg-white hover:border-green-400 dark:border-slate-700 dark:bg-slate-900"
                  }`}
                >
                  {correct && <Check size={14} strokeWidth={3} />}
                </button>
                <div className="relative flex-1">
                  <input
                    value={opt}
                    onChange={(e) => setOption(oi, e.target.value)}
                    placeholder={`Option ${LETTERS[oi]}`}
                    className={`${FIELD} pr-9`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {LETTERS[oi]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[100px_1fr]">
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
            <label className={LABEL}>Explanation</label>
            <input
              value={q.explanation}
              onChange={(e) => onChange({ explanation: e.target.value })}
              placeholder="Why is this the right answer?"
              className={FIELD}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMove(-1)}
              aria-label="Move question up"
              className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-slate-800"
            >
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={() => onMove(1)}
              aria-label="Move question down"
              className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-slate-800"
            >
              <ArrowDown size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-600"
          >
            <Trash2 size={13} /> Delete question
          </button>
        </div>
      </div>
    </div>
  )
}