import { Link } from "react-router-dom"
import { CATEGORY_META, formatDate } from "@/features/blog/posts"
import type { BlogPost } from "@/features/blog/posts"

export default function PostCard({ post }: { post: BlogPost }) {
  const { gradient, icon: Icon } = CATEGORY_META[post.category]

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.12)] dark:border-slate-800 dark:bg-slate-900"
    >
      <div className={`relative flex h-36 items-center justify-center bg-linear-to-br ${gradient}`}>
        <Icon size={40} className="text-white/90" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-xs">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-teal-700 dark:text-white">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-slate-500 dark:text-slate-400">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800">
          <span className="truncate pr-3">
            {post.author} · {formatDate(post.date)}
          </span>
          <span className="shrink-0">{post.readMinutes} min read</span>
        </div>
      </div>
    </Link>
  )
}