import { Link } from "react-router-dom"
import EmptyState from "@/features/student/components/EmptyState"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_PRIMARY } from "@/features/student/ui"

export default function AdminComingSoon({ title }: { title: string }) {
  return (
    <div className="space-y-8">
      <PageHeader crumb={title} title={title} subtitle="This section of the control center is coming next." />
      <EmptyState
        title={`${title} is not built yet`}
        text="The overview is ready. This page will be added in the next step."
        action={
          <Link to="/admin" className={BTN_PRIMARY}>
            Back to overview
          </Link>
        }
      />
    </div>
  )
}