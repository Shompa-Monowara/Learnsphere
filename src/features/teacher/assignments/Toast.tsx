export default function Toast({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}