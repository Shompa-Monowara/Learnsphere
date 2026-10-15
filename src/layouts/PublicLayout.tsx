import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"

import { Outlet } from "react-router-dom"


export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}