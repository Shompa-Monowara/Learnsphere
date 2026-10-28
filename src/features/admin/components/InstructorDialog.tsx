import { Camera, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Avatar from "@/features/student/components/Avatar"
import { BTN_OUTLINE, INPUT } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { api, getErrorMessage } from "@/services/api"
import type { AdminMentor, MentorValues } from "../mentor-types"

interface Props {
  mentor: AdminMentor | null
  busy?: boolean
  onSubmit: (values: MentorValues) => void
  onCancel: () => void
}

const Label = ({ htmlFor, children }: { htmlFor: string; children: string }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
    {children}
  </label>
)

export default function InstructorDialog({ mentor, busy, onSubmit, onCancel }: Props) {
  const { data } = useFetch<{ categories: { _id: string; name: string }[] }>("/categories")
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(mentor?.name ?? "")
  const [avatar, setAvatar] = useState(mentor?.avatar ?? "")
  const [headline, setHeadline] = useState(mentor?.headline ?? "")
  const [category, setCategory] = useState(mentor?.category ?? "")
  const [skills, setSkills] = useState(mentor?.skills.join(", ") ?? "")
  const [bio, setBio] = useState(mentor?.bio ?? "")
  const [isPublished, setIsPublished] = useState(mentor?.isPublished ?? true)
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState("")

  const valid = name.trim().length >= 2
  const locked = !!busy || uploading

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onCancel()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [busy, onCancel])

  const uploadPhoto = async (file?: File) => {
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhotoError("Please choose a JPG or PNG image")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Image must be 2 MB or smaller")
      return
    }
    setUploading(true)
    setPhotoError("")
    try {
      const fd = new FormData()
      fd.append("folder", "avatars")
      fd.append("file", file)
      const res = await api.post<{ url: string }>("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setAvatar(res.data.url)
    } catch (err) {
      setPhotoError(getErrorMessage(err))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || locked) return
    onSubmit({
      name: name.trim(),
      avatar,
      headline: headline.trim(),
      bio: bio.trim(),
      category: category.trim(),
      skills,
      isPublished,
    })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !busy && onCancel()} />
      <form
        onSubmit={submit}
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {mentor ? "Edit instructor" : "Add instructor"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar name={name || "Instructor"} src={avatar} size={72} />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Professional photo</p>
              <p className="text-xs text-slate-500">JPG or PNG, up to 2 MB. A clear head-and-shoulders photo works best.</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={locked}
                  className={`${BTN_OUTLINE} !py-1.5`}
                >
                  <Camera size={14} /> {uploading ? "Uploading..." : avatar ? "Change photo" : "Upload photo"}
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar("")}
                    disabled={locked}
                    className={`${BTN_OUTLINE} !py-1.5`}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => void uploadPhoto(e.target.files?.[0])}
              />
            </div>
          </div>
          {photoError && <p className="text-sm text-red-600">{photoError}</p>}

          <div>
            <Label htmlFor="mentor-name">Full name</Label>
            <input
              id="mentor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              autoFocus
              placeholder="e.g. Sofia Marino"
              className={INPUT}
            />
          </div>

          <div>
            <Label htmlFor="mentor-headline">Headline</Label>
            <input
              id="mentor-headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={120}
              placeholder="e.g. Brand & Graphic Designer"
              className={INPUT}
            />
          </div>

          <div>
            <Label htmlFor="mentor-category">Field</Label>
            <input
              id="mentor-category"
              list="mentor-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={60}
              placeholder="e.g. Graphic Design"
              className={INPUT}
            />
            <datalist id="mentor-categories">
              {(data?.categories ?? []).map((c) => (
                <option key={c._id} value={c.name} />
              ))}
            </datalist>
          </div>

          <div>
            <Label htmlFor="mentor-skills">Expertise (comma separated)</Label>
            <input
              id="mentor-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Branding, Typography, Figma"
              className={INPUT}
            />
          </div>

          <div>
            <Label htmlFor="mentor-bio">Bio</Label>
            <textarea
              id="mentor-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="A short introduction students will see on the Instructors page."
              className={INPUT}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-900 dark:text-white">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
            Publish on the Instructors page
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={locked || !valid}
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {busy ? "Saving..." : mentor ? "Save changes" : "Create instructor"}
          </button>
        </div>
      </form>
    </div>
  )
}