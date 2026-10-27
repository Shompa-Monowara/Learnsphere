interface ContactErrorProps {
  message: string
  onRetry: () => void
}

export function ContactError({ message, onRetry }: ContactErrorProps) {
  return (
    <div className="py-32 text-center">
      <p className="text-sm font-medium text-red-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Try again
      </button>
    </div>
  )
}