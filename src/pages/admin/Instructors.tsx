import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import ConfirmDialog from "@/features/admin/components/ConfirmDialog"
import InstructorDialog from "@/features/admin/components/InstructorDialog"
import type { AdminMentor, MentorValues } from "@/features/admin/mentor-types"
import { useToast } from "@/features/admin/toast-context"
import Avatar from "@/features/student/components/Avatar"
import EmptyState from "@/features/student/components/EmptyState"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, BTN_PRIMARY, CARD } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

export default function AdminInstructors() {
  const toast = useToast()
  const { data, loading, error, reload } = useFetch<{ mentors: AdminMentor[] }>("/admin/mentors")

  /* undefined = dialog bondho, null = notun instructor, object = edit */
  const [editing, setEditing] = useState<AdminMentor | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<AdminMentor | null>(null)
  const [busy, setBusy] = useState(false)

  const mentors = data?.mentors ?? []

  const save = async (values: MentorValues) => {
    setBusy(true)
    try {
      if (editing) {
        await api.put(`/admin/mentors/${editing._id}`, values)
        toast.success("Instructor updated", `${values.name} was saved.`)
      } else {
        await api.post("/admin/mentors", values)
        toast.success(
          "Instructor created",
          values.isPublished ? `${values.name} is now on the Instructors page.` : `${values.name} was saved as a draft.`
        )
      }
      setEditing(undefined)
      await reload()
    } catch (err) {
      toast.error("Could not save instructor", getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const togglePublish = async (m: AdminMentor) => {
    setBusy(true)
    try {
      await api.patch(`/admin/mentors/${m._id}/publish`, { isPublished: !m.isPublished })
      toast.success(
        m.isPublished ? "Instructor unpublished" : "Instructor published",
        m.isPublished ? `${m.name} is hidden from the Instructors page.` : `${m.name} is now on the Instructors page.`
      )
      await reload()
    } catch (err) {
      toast.error("Could not update instructor", getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const remove = async (m: AdminMentor) => {
    setBusy(true)
    try {
      await api.delete(`/admin/mentors/${m._id}`)
      toast.success("Instructor deleted", `${m.name} was removed.`)
      setDeleting(null)
      await reload()
    } catch (err) {
      toast.error("Could not delete instructor", getErrorMessage(err))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Instructors"
        title="Instructors"
        subtitle="Create instructor profiles with a professional photo. Published profiles appear on the public Instructors page."
        action={
          <button type="button" onClick={() => setEditing(null)} className={BTN_PRIMARY}>
            <Plus size={18} /> Add instructor
          </button>
        }
      />

      {error && (
        <Notice type="error">
          {error}{" "}
          <button type="button" onClick={() => void reload()} className="font-semibold underline">
            Retry
          </button>
        </Notice>
      )}

      {loading && !data && <p className="py-10 text-center text-slate-500">Loading instructors...</p>}

      {data && mentors.length === 0 && (
        <EmptyState
          title="No instructor profiles yet"
          text="Add your first instructor and publish it to show it on the Instructors page."
          action={
            <button type="button" onClick={() => setEditing(null)} className={BTN_PRIMARY}>
              Add instructor
            </button>
          }
        />
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mentors.map((m) => (
          <div key={m._id} className={cn(CARD, "p-5")}>
            <div className="flex items-start gap-4">
              <Avatar name={m.name} src={m.avatar} size={64} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900 dark:text-white">{m.name}</h3>
                <p className="mt-0.5 truncate text-sm text-slate-500">{m.headline || "No headline"}</p>
                {m.category && (
                  <span className="mt-2 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                    {m.category}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  m.isPublished
                    ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {m.isPublished ? "Published" : "Draft"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => void togglePublish(m)}
                disabled={busy}
                className={cn(BTN_OUTLINE, "!px-3.5 !py-2")}
              >
                {m.isPublished ? <EyeOff size={14} /> : <Eye size={14} />} {m.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button type="button" onClick={() => setEditing(m)} className={cn(BTN_OUTLINE, "!px-3.5 !py-2")}>
                <Pencil size={14} /> Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleting(m)}
                className={cn(BTN_OUTLINE, "!px-3.5 !py-2 hover:!bg-red-50 hover:!text-red-600")}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing !== undefined && (
        <InstructorDialog
          mentor={editing}
          busy={busy}
          onSubmit={(v) => void save(v)}
          onCancel={() => setEditing(undefined)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name}?`}
          text="This profile will be permanently removed from the Instructors page. This can't be undone."
          confirmLabel="Delete instructor"
          tone="danger"
          busy={busy}
          onConfirm={() => void remove(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}