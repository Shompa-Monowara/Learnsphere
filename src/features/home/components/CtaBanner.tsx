import { Link } from "react-router-dom"
import { ArrowRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CtaBanner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-600 via-teal-800 to-emerald-950 px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl" />
          <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Rocket size={13} /> Launch your academy in a weekend
          </span>
          <h2 className="relative mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight">Ready to bring your courses into one beautiful sphere?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-teal-50">Create your first course free, invite your students, and watch progress happen in real time. No credit card required.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-xl bg-orange-500 px-6 text-white hover:bg-orange-600">
              <Link to="/register">Get Started Free <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
              <Link to="/contact">Talk to our team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}