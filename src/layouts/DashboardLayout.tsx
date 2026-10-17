import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import type { Accent, NavItem, Promo } from "@/components/dashboard/types"
import { cn } from "@/lib/utils"

interface Props {
  items: NavItem[]
  label: string
  badges?: Record<string, number>
  notificationsTo: string
  accent?: Accent
  promo?: Promo
}

export default function DashboardLayout({
  items,
  label,
  badges = {},
  notificationsTo,
  accent = "teal",
  promo,
}: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        items={items}
        label={label}
        badges={badges}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        accent={accent}
        promo={promo}
      />

      <div className={cn("transition-all duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <Topbar
          onMenu={() => setMobileOpen(true)}
          unread={badges.notifications ?? 0}
          notificationsTo={notificationsTo}
        />
        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}