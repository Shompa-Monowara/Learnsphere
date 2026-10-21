import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { iconFor } from "@/features/admin/category-icons"
import CategoryDialog from "@/features/admin/components/CategoryDialog"
import ConfirmDialog from "@/features/admin/components/ConfirmDialog"
import { useToast } from "@/features/admin/toast-context"
import type { AdminCategory } from "@/features/admin/types"
import { num } from "@/features/admin/utils"
import EmptyState from "@/features/student/components/EmptyState"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, BTN_PRIMARY, CARD } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

/* Card er icon er rong ghure ghure teal, orange, slate hoy */
const TONES = [
  "bg-teal-50 text-teal-600 dark:bg-teal-500/15",
  "bg-orange-50 text-orange-500 dark:bg-orange-500/15",
  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
]

export default function AdminCategories() {
  const toast = useToast()
  const { data, loading, error, reload } = useFetch<{ categories: AdminCategory[] }>("/admin/categories")

  /* undefined = dialog bondho, null = notun category, object = edit */
  const [editing, setEditing] = useState<AdminCategory | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<AdminCategory | null>(null)
  const [busy, setBusy] = useState(false)

  const categories = data?.categories ?? []

  const save = async (values: { name: string; icon: string }) => {
    setBusy(true)
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, values)
        toast.success("Category updated", `"${values.name}" was saved.`)
      } else {
        await api.post("/categories", values)
        toast.success("Category created", `"${values.name}" is now available to teachers.`)
      }
      setEditing(undefined)
      await reload()
    } catch (err) {
      toast.error("Could not save category", getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const remove = async (c: AdminCategory) => {
    setBusy(true)
    try {
      await api.delete(`/categories/${c._id}`)
      toast.success("Category deleted", `"${c.name}" was removed.`)
      setDeleting(null)
      await reload()
    } catch (err) {
      toast.error("Could not delete category", getErrorMessage(err))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Categories"
        title="Categories"
        subtitle="Organise the catalog with clear, well-structured course categories."
        action={
          <button type="button" onClick={() => setEditing(null)} className={BTN_PRIMARY}>
            <Plus size={18} /> Add category
          </button>
        }
      />

      {error && (
        <Notice type="error">
          {error}{" "}
          <button type="button" onClick={() => void reload()} className="font-semibold underline">Retry</button>
        </Notice>
      )}

      {loading && !data && <p className="py-10 text-center text-slate-500">Loading categories...</p>}

      {data && categories.length === 0 && (
        <EmptyState
          title="No categories yet"
          text="Create your first category so teachers can organise their courses."
          action={<button type="button" onClick={() => setEditing(null)} className={BTN_PRIMARY}>Add category</button>}
        />
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((c, i) => {
          const Icon = iconFor(c.icon)
          return (
            <div key={c._id} className={cn(CARD, "p-5")}>
              <div className="flex items-start justify-between">
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", TONES[i % TONES.length])}>
                  <Icon size={20} />
                </span>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400">
                  Active
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{c.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {num(c.coursesCount)} {c.coursesCount === 1 ? "course" : "courses"} · {num(c.teachersCount)}{" "}
                {c.teachersCount === 1 ? "teacher" : "teachers"}
              </p>
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button type="button" onClick={() => setEditing(c)} className={cn(BTN_OUTLINE, "!px-3.5 !py-2")}>
                  <Pencil size={14} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(c)}
                  className={cn(BTN_OUTLINE, "!px-3.5 !py-2 hover:!bg-red-50 hover:!text-red-600")}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {editing !== undefined && (
        <CategoryDialog category={editing} busy={busy} onSubmit={(v) => void save(v)} onCancel={() => setEditing(undefined)} />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name}?`}
          text={
            deleting.coursesCount > 0
              ? `This category has ${deleting.coursesCount} course${deleting.coursesCount === 1 ? "" : "s"}, so it can't be deleted. Move those courses to another category first.`
              : "This category will be permanently removed. This can't be undone."
          }
          confirmLabel="Delete category"
          tone="danger"
          busy={busy}
          onConfirm={() => void remove(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}