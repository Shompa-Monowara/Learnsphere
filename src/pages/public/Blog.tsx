import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import PostCard from "@/features/blog/PostCard"
import { CATEGORIES, CATEGORY_META, POSTS, formatDate } from "@/features/blog/posts"
import type { Category } from "@/features/blog/posts"

export default function Blog() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<"All" | Category>("All")

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return POSTS.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!term || p.title.toLowerCase().includes(term) || p.excerpt.toLowerCase().includes(term))
    )
  }, [query, category])

  const showFeatured = category === "All" && !query.trim() && filtered.length > 0
  const featured = showFeatured ? filtered[0] : null
  const rest = showFeatured ? filtered.slice(1) : filtered

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
      active
        ? "border-teal-600 bg-teal-600 text-white"
        : "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    }`

  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Blog</span>
          </nav>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            The LearnSphere blog
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Practical ideas for learners, instructors and teams: how to study better, teach better and get more out of
            the platform.
          </p>
          <div className="relative mt-7 max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="h-12 rounded-xl bg-white pl-11 dark:bg-slate-800"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(category === "All")} onClick={() => setCategory("All")}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className={chip(category === c)} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <p className="font-semibold text-slate-900 dark:text-white">No articles match your search</p>
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setCategory("All")
              }}
              className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {featured && (
              <Link
                to={`/blog/${featured.slug}`}
                className="group mt-8 grid overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.12)] md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  className={`flex min-h-56 items-center justify-center bg-linear-to-br ${CATEGORY_META[featured.category].gradient}`}
                >
                  {(() => {
                    const Icon = CATEGORY_META[featured.category].icon
                    return <Icon size={64} className="text-white/90" />
                  })()}
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    Featured · {featured.category}
                  </span>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {featured.excerpt}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {featured.author} · {formatDate(featured.date)} · {featured.readMinutes} min read
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 group-hover:text-teal-800">
                    Read article <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}