import { useRef, useState } from "react"
import { ImagePlus, Loader2 } from "lucide-react"
import { getErrorMessage } from "@/services/api"
import { FIELD, LABEL } from "./ui"
import { uploadFile } from "./upload"
import type { BuilderForm, CategoryOption } from "./types"

interface Props {
  form: BuilderForm
  categories: CategoryOption[]
  onChange: (patch: Partial<BuilderForm>) => void
  onError: (msg: string) => void
}

export default function StepBasics({ form, categories, onChange, onError }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const pick = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) return onError("Please choose a JPG or PNG image.")
    if (file.size > 5 * 1024 * 1024) return onError("Image must be under 5 MB.")
    setUploading(true)
    try {
      onChange({ thumbnail: await uploadFile(file, "thumbnails") })
    } catch (err) {
      onError(getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course basics</h2>

      <div>
        <label className={LABEL}>Course title</label>
        <input
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. TypeScript Deep Dive: Types That Scale"
          className={FIELD}
        />
        <p className="mt-1.5 text-xs text-slate-400">A clear, benefit-driven title performs best.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Category</label>
          <select value={form.category} onChange={(e) => onChange({ category: e.target.value })} className={FIELD}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Level</label>
          <select
            value={form.level}
            onChange={(e) => onChange({ level: e.target.value as BuilderForm["level"] })}
            className={FIELD}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Description</label>
        <textarea
          rows={4}
          maxLength={500}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What will students learn?"
          className={FIELD}
        />
        <p className="mt-1.5 text-xs text-slate-400">{form.description.length}/500 characters</p>
      </div>

      <div>
        <label className={LABEL}>Course thumbnail</label>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => {
          void pick(e.target.files?.[0])
          e.target.value = ""
        }} />

        {form.thumbnail ? (
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <img src={form.thumbnail} alt="Thumbnail" className="aspect-video w-full object-cover" />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange({ thumbnail: "" })}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center transition hover:border-teal-400 dark:border-slate-700"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {uploading ? "Uploading..." : "Upload a cover image"}
            </span>
            <span className="text-xs text-slate-400">1280×720 recommended · JPG or PNG</span>
          </button>
        )}
      </div>
    </div>
  )
}