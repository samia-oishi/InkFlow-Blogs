'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, UserRound } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';
import { formatDate } from '@/lib/blogFormat';

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`/api/blogs/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setBlog(data.blog);
        const listResponse = await fetch('/api/blogs');
        const listData = await listResponse.json();
        setRelated((listData.blogs || []).filter((item) => item.id !== data.blog.id && item.category === data.blog.category).slice(0, 3));
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <div className="px-4 py-24 text-center font-bold text-slate-600">Loading blog...</div>;
  if (!blog) return <div className="mx-auto max-w-3xl px-4 py-24"><EmptyState title="Blog not found" description="The blog may have been deleted or is not approved yet." /></div>;

  return (
    <article className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/items" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"><ArrowLeft size={17} /> Back to Blogs</Link>
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-950/5">
          <img src={blog.coverImage} alt={blog.title} className="h-80 w-full object-cover" />
          <div className="p-6 sm:p-10">
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">{blog.category}</span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{blog.title}</h1>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-slate-500">
              <span className="inline-flex items-center gap-2"><UserRound size={16} />{blog.authorName}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays size={16} />{formatDate(blog.publishedAt || blog.createdAt)}</span>
              <span className="inline-flex items-center gap-2"><Clock size={16} />{blog.readingTime} min read</span>
            </div>
            <div className="mt-10 whitespace-pre-line text-lg leading-9 text-slate-700">{blog.content}</div>
          </div>
        </div>
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-black text-slate-950">Related Posts</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">{related.map((item) => <BlogCard key={item.id} blog={item} />)}</div>
          </section>
        )}
      </div>
    </article>
  );
}
