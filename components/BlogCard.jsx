import Link from 'next/link';
import { CalendarDays, Clock, UserRound } from 'lucide-react';
import { formatDate } from '@/lib/blogFormat';

export default function BlogCard({ blog, featured = false }) {
  return (
    <article className="group flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/10">
      <div className="relative h-56 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-indigo-700 shadow-sm backdrop-blur">
          {blog.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="grid min-h-[44px] gap-2 text-xs font-semibold text-slate-500 sm:grid-cols-2">
          <span className="inline-flex items-center gap-1 truncate"><UserRound size={14} className="shrink-0" />{blog.authorName}</span>
          <span className="inline-flex items-center gap-1 truncate"><CalendarDays size={14} className="shrink-0" />{formatDate(blog.publishedAt || blog.createdAt)}</span>
          <span className="inline-flex items-center gap-1 truncate"><Clock size={14} className="shrink-0" />{blog.readingTime || 3} min read</span>
        </div>
        <h3 className={`${featured ? 'text-2xl' : 'text-xl'} mt-4 line-clamp-2 min-h-[64px] font-black leading-tight text-slate-950`}>
          {blog.title}
        </h3>
        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">{blog.shortDescription}</p>
        <Link href={`/items/${blog.id}`} className="mt-auto inline-flex w-fit rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600">
          View Details
        </Link>
      </div>
    </article>
  );
}
