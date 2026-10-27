export function ContactSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <div className="h-6 w-40 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
      <div className="mt-6 h-12 max-w-md animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.43fr_1fr]">
        <div className="h-[520px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-[520px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )
}