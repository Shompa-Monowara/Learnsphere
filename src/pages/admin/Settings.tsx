import { Camera, Moon, ShieldCheck, Sun } from "lucide-react"
import { useRef, useState } from "react"
import Avatar from "@/features/student/components/Avatar"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import Tabs from "@/features/student/components/Tabs"
import { BTN_OUTLINE, BTN_PRIMARY, CARD, INPUT } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"
import { useTheme } from "@/stores/theme-context"

type Tab = "profile" | "security" | "notifications" | "appearance"
type Msg = { type: "success" | "error"; text: string } | null

const Label = ({ children }: { children: string }) => (
  <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white">{children}</label>
)

function ProfileTab() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name ?? "")
  const [headline, setHeadline] = useState(user?.headline ?? "")
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<Msg>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setName(user?.name ?? "")
    setHeadline(user?.headline ?? "")
    setMsg(null)
  }

  const save = async () => {
    if (name.trim().length < 2) {
      setMsg({ type: "error", text: "Name must be at least 2 characters" })
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      const res = await api.put("/auth/me", { name: name.trim(), headline: headline.trim() })
      updateUser(res.data.user)
      setMsg({ type: "success", text: "Profile updated." })
    } catch (err) {
      setMsg({ type: "error", text: getErrorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  const uploadAvatar = async (file?: File) => {
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMsg({ type: "error", text: "Please choose a JPG or PNG image" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMsg({ type: "error", text: "Image must be 2 MB or smaller" })
      return
    }
    setUploading(true)
    setMsg(null)
    try {
      const fd = new FormData()
      fd.append("folder", "avatars")
      fd.append("file", file)
      const up = await api.post<{ url: string }>("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const res = await api.put("/auth/me", { avatar: up.data.url })
      updateUser(res.data.user)
      setMsg({ type: "success", text: "Profile photo updated." })
    } catch (err) {
      setMsg({ type: "error", text: getErrorMessage(err) })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn(CARD, "p-6")}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Administrator profile</h2>
      <p className="mb-5 border-b border-slate-100 pb-5 text-sm text-slate-500 dark:border-slate-800">
        Update your photo and account details.
      </p>

      <div className="flex items-center gap-5">
        <Avatar name={user?.name ?? ""} src={user?.avatar} size={80} />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Profile photo</p>
          <p className="text-xs text-slate-500">JPG or PNG, up to 2 MB.</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={`${BTN_OUTLINE} mt-2 !py-1.5`}
          >
            <Camera size={14} /> {uploading ? "Uploading..." : "Upload"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ""
              void uploadAvatar(file)
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <Label>Full name</Label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
        </div>
        <div>
          <Label>Email address</Label>
          <input value={user?.email ?? ""} disabled className={INPUT} />
          <p className="mt-1 text-xs text-slate-400">Email can't be changed.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <Label>Job title</Label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Platform Administrator"
            maxLength={120}
            className={INPUT}
          />
        </div>
        <div>
          <Label>Role</Label>
          <div className="flex h-[46px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <ShieldCheck size={16} className="text-teal-600" />
            Administrator
          </div>
        </div>
      </div>

      {msg && (
        <div className="mt-4">
          <Notice type={msg.type}>{msg.text}</Notice>
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={reset} className="px-3 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
          Cancel
        </button>
        <button type="button" onClick={() => void save()} disabled={busy} className={BTN_PRIMARY}>
          {busy ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<Msg>(null)

  const save = async () => {
    if (next.length < 6) return setMsg({ type: "error", text: "New password must be at least 6 characters" })
    if (next !== confirm) return setMsg({ type: "error", text: "Passwords do not match" })
    setBusy(true)
    setMsg(null)
    try {
      await api.put("/auth/password", { currentPassword: current, newPassword: next })
      setCurrent("")
      setNext("")
      setConfirm("")
      setMsg({ type: "success", text: "Password updated." })
    } catch (err) {
      setMsg({ type: "error", text: getErrorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn(CARD, "p-6")}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Change password</h2>
      <p className="mb-5 border-b border-slate-100 pb-5 text-sm text-slate-500 dark:border-slate-800">
        Admin accounts control the whole platform. Use a strong, unique password.
      </p>

      <div className="max-w-md space-y-4">
        <div>
          <Label>Current password</Label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className={INPUT} />
        </div>
        <div>
          <Label>New password</Label>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={INPUT} />
        </div>
        <div>
          <Label>Confirm new password</Label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={INPUT} />
        </div>
        {msg && <Notice type={msg.type}>{msg.text}</Notice>}
        <button type="button" onClick={() => void save()} disabled={busy || !current || !next} className={BTN_PRIMARY}>
          {busy ? "Updating..." : "Update password"}
        </button>
      </div>
    </div>
  )
}

const PREF_KEY = "ls-admin-notification-prefs"
const PREF_DEFAULTS = { submissions: true, registrations: true, payments: true, payouts: true }
type Prefs = typeof PREF_DEFAULTS

function loadPrefs(): Prefs {
  try {
    return { ...PREF_DEFAULTS, ...JSON.parse(localStorage.getItem(PREF_KEY) || "{}") }
  } catch {
    return PREF_DEFAULTS
  }
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs)

  const toggle = (key: keyof Prefs) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(next))
    } catch {
      /* ignore when storage is unavailable */
    }
  }

  const rows: { key: keyof Prefs; title: string; text: string }[] = [
    { key: "submissions", title: "Course submissions", text: "When a teacher submits a course for review." },
    { key: "registrations", title: "New registrations", text: "When new students or teachers join the platform." },
    { key: "payments", title: "Payment issues", text: "When a payment fails or is refunded." },
    { key: "payouts", title: "Payout requests", text: "When an instructor requests a payout." },
  ]

  return (
    <div className={cn(CARD, "p-6")}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification preferences</h2>
      <p className="mb-2 border-b border-slate-100 pb-5 text-sm text-slate-500 dark:border-slate-800">
        Choose what you want to hear about. Saved on this device.
      </p>

      {rows.map((r) => (
        <div
          key={r.key}
          className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0 dark:border-slate-800"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.title}</p>
            <p className="text-xs text-slate-500">{r.text}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs[r.key]}
            onClick={() => toggle(r.key)}
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              prefs[r.key] ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                prefs[r.key] ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
        </div>
      ))}
    </div>
  )
}

function AppearanceTab() {
  const { theme, toggleTheme } = useTheme()

  const choose = (value: "light" | "dark") => {
    if (theme !== value) toggleTheme()
  }

  const options = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
  ]

  return (
    <div className={cn(CARD, "p-6")}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
      <p className="mb-5 border-b border-slate-100 pb-5 text-sm text-slate-500 dark:border-slate-800">
        Pick how LearnSphere looks for you.
      </p>

      <div className="grid max-w-md grid-cols-2 gap-4">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => choose(value)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-colors",
              theme === value
                ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-500/10"
                : "border-slate-200 text-slate-600 hover:border-teal-300 dark:border-slate-700 dark:text-slate-300"
            )}
          >
            <Icon size={24} />
            <span className="text-sm font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AdminSettings() {
  const [tab, setTab] = useState<Tab>("profile")

  return (
    <div className="space-y-8">
      <PageHeader
        crumb="Settings"
        title="Settings"
        subtitle="Manage your admin profile, security, notifications, and appearance."
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "profile", label: "Profile" },
          { value: "security", label: "Security" },
          { value: "notifications", label: "Notifications" },
          { value: "appearance", label: "Appearance" },
        ]}
      />

      {tab === "profile" && <ProfileTab />}
      {tab === "security" && <SecurityTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "appearance" && <AppearanceTab />}
    </div>
  )
}