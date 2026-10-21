import { ChevronDown, Save } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/features/admin/toast-context"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import Tabs from "@/features/student/components/Tabs"
import { BTN_PRIMARY, CARD, INPUT } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"
import { useTheme } from "@/stores/theme-context"

interface SiteSettings {
  general: {
    siteName: string
    supportEmail: string
    defaultLanguage: string
    defaultCurrency: string
    description: string
  }
  email: {
    fromName: string
    fromEmail: string
    replyTo: string
    welcomeEmail: boolean
    enrollmentEmail: boolean
    certificateEmail: boolean
  }
  payments: {
    paymentsEnabled: boolean
    platformFeePercent: number
    taxPercent: number
    minPayout: number
    refundWindowDays: number
  }
  appearance: {
    primaryColor: string
    defaultTheme: "light" | "dark" | "system"
    logoUrl: string
    footerText: string
  }
  integrations: {
    googleAnalyticsId: string
    googleLogin: boolean
    githubLogin: boolean
    maintenanceMode: boolean
  }
}

type Tab = "general" | "email" | "payments" | "appearance" | "integrations"

const Field = ({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) => (
  <div className={className}>
    <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white">{label}</label>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
)

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className={cn(CARD, "p-6")}>
    <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    {children}
  </div>
)

function Toggle({ checked, onChange, title, text }: { checked: boolean; onChange: (v: boolean) => void; title: string; text: string }) {
  return (
    <div className="flex min-h-[46px] items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-700">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500">{text}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700")}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </button>
    </div>
  )
}

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "BDT", label: "BDT (৳)" },
  { value: "INR", label: "INR (₹)" },
]
const LANGUAGES = ["English", "Bangla", "Hindi", "Spanish", "French"]

export default function AdminSiteSettings() {
  const toast = useToast()
  const { applyAppearance } = useTheme()
  const [tab, setTab] = useState<Tab>("general")
  const [data, setData] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get<{ settings: SiteSettings }>("/admin/site-settings")
      .then((res) => setData(res.data.settings))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const set = <S extends keyof SiteSettings, K extends keyof SiteSettings[S]>(section: S, key: K, value: SiteSettings[S][K]) =>
    setData((d) => (d ? { ...d, [section]: { ...d[section], [key]: value } } : d))

  const num = (v: string) => (v === "" ? 0 : Number(v))

  const save = async () => {
    if (!data) return
    setSaving(true)
    try {
      const res = await api.put<{ settings: SiteSettings }>("/admin/site-settings", data)
      setData(res.data.settings)
      // Save korar sathe sathe theme + primary color ei browser e apply hobe
      applyAppearance(
        {
          primaryColor: res.data.settings.appearance.primaryColor,
          defaultTheme: res.data.settings.appearance.defaultTheme,
        },
        true
      )
      toast.success("Settings saved", "Your site settings have been updated.")
    } catch (err) {
      toast.error("Could not save settings", getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const select = "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"

  return (
    <div className="space-y-8">
      <PageHeader
        crumb="Site Settings"
        title="Site settings"
        subtitle="Configure branding, email, payments, and appearance for the whole platform."
        action={
          <button type="button" onClick={() => void save()} disabled={saving || !data} className={BTN_PRIMARY}>
            <Save size={16} /> {saving ? "Saving..." : "Save changes"}
          </button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "general", label: "General" },
          { value: "email", label: "Email" },
          { value: "payments", label: "Payments" },
          { value: "appearance", label: "Appearance" },
          { value: "integrations", label: "Integrations" },
        ]}
      />

      {loading && <div className={cn(CARD, "h-64 animate-pulse")} />}
      {error && <Notice type="error">{error}</Notice>}

      {data && tab === "general" && (
        <Section title="General settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Site name">
              <input value={data.general.siteName} onChange={(e) => set("general", "siteName", e.target.value)} maxLength={80} className={INPUT} />
            </Field>
            <Field label="Support email">
              <input type="email" value={data.general.supportEmail} onChange={(e) => set("general", "supportEmail", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Default language">
              <div className="relative">
                <select value={data.general.defaultLanguage} onChange={(e) => set("general", "defaultLanguage", e.target.value)} className={select}>
                  {LANGUAGES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
            <Field label="Default currency">
              <div className="relative">
                <select value={data.general.defaultCurrency} onChange={(e) => set("general", "defaultCurrency", e.target.value)} className={select}>
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
          </div>
          <Field label="Site description" className="mt-4">
            <textarea
              value={data.general.description}
              onChange={(e) => set("general", "description", e.target.value)}
              rows={3}
              maxLength={500}
              className={cn(INPUT, "resize-none")}
            />
          </Field>
        </Section>
      )}

      {data && tab === "email" && (
        <Section title="Email settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Sender name">
              <input value={data.email.fromName} onChange={(e) => set("email", "fromName", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Sender email">
              <input type="email" value={data.email.fromEmail} onChange={(e) => set("email", "fromEmail", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Reply-to email" hint="Optional. Replies from users go here.">
              <input type="email" value={data.email.replyTo} onChange={(e) => set("email", "replyTo", e.target.value)} className={INPUT} />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Toggle title="Welcome email" text="Send a welcome email when a new user registers." checked={data.email.welcomeEmail} onChange={(v) => set("email", "welcomeEmail", v)} />
            <Toggle title="Enrollment confirmation" text="Email students after they enroll in a course." checked={data.email.enrollmentEmail} onChange={(v) => set("email", "enrollmentEmail", v)} />
            <Toggle title="Certificate email" text="Email students when they earn a certificate." checked={data.email.certificateEmail} onChange={(v) => set("email", "certificateEmail", v)} />
          </div>
        </Section>
      )}

      {data && tab === "payments" && (
        <Section title="Payment settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Toggle title="Accept payments" text="Turn off to pause all paid enrollments." checked={data.payments.paymentsEnabled} onChange={(v) => set("payments", "paymentsEnabled", v)} />
            <div className="hidden md:block" />
            <Field label="Platform fee (%)" hint="Commission kept by the platform on each sale.">
              <input type="number" min={0} max={100} value={data.payments.platformFeePercent} onChange={(e) => set("payments", "platformFeePercent", num(e.target.value))} className={INPUT} />
            </Field>
            <Field label="Tax (%)">
              <input type="number" min={0} max={100} value={data.payments.taxPercent} onChange={(e) => set("payments", "taxPercent", num(e.target.value))} className={INPUT} />
            </Field>
            <Field label="Minimum payout" hint="Smallest amount an instructor can request.">
              <input type="number" min={0} value={data.payments.minPayout} onChange={(e) => set("payments", "minPayout", num(e.target.value))} className={INPUT} />
            </Field>
            <Field label="Refund window (days)">
              <input type="number" min={0} max={365} value={data.payments.refundWindowDays} onChange={(e) => set("payments", "refundWindowDays", num(e.target.value))} className={INPUT} />
            </Field>
          </div>
        </Section>
      )}

      {data && tab === "appearance" && (
        <Section title="Appearance">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={data.appearance.primaryColor}
                  onChange={(e) => set("appearance", "primaryColor", e.target.value)}
                  className="h-[46px] w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
                />
                <input value={data.appearance.primaryColor} onChange={(e) => set("appearance", "primaryColor", e.target.value)} maxLength={7} className={INPUT} />
              </div>
            </Field>
            <Field label="Default theme" hint="Applies to everyone who hasn't picked a theme themselves.">
              <div className="relative">
                <select value={data.appearance.defaultTheme} onChange={(e) => set("appearance", "defaultTheme", e.target.value as SiteSettings["appearance"]["defaultTheme"])} className={select}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">Follow system</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
            <Field label="Logo URL">
              <input value={data.appearance.logoUrl} onChange={(e) => set("appearance", "logoUrl", e.target.value)} placeholder="https://..." className={INPUT} />
            </Field>
            <Field label="Footer text">
              <input value={data.appearance.footerText} onChange={(e) => set("appearance", "footerText", e.target.value)} maxLength={200} placeholder="© 2026 LearnSphere" className={INPUT} />
            </Field>
          </div>
        </Section>
      )}

      {data && tab === "integrations" && (
        <Section title="Integrations">
          <Field label="Google Analytics ID" hint="Example: G-XXXXXXXXXX">
            <input value={data.integrations.googleAnalyticsId} onChange={(e) => set("integrations", "googleAnalyticsId", e.target.value)} maxLength={40} className={INPUT} />
          </Field>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Toggle title="Google login" text="Let users sign in with Google." checked={data.integrations.googleLogin} onChange={(v) => set("integrations", "googleLogin", v)} />
            <Toggle title="GitHub login" text="Let users sign in with GitHub." checked={data.integrations.githubLogin} onChange={(v) => set("integrations", "githubLogin", v)} />
            <Toggle title="Maintenance mode" text="Show a maintenance notice to visitors while you make changes." checked={data.integrations.maintenanceMode} onChange={(v) => set("integrations", "maintenanceMode", v)} />
          </div>
        </Section>
      )}
    </div>
  )
}