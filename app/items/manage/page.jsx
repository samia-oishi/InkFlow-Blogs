'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import ProtectedRoute from '@/components/ProtectedRoute';
import SectionHeader from '@/components/SectionHeader';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/blogFormat';

export default function ManageBlogsPage() {
  return <ProtectedRoute><ManageContent /></ProtectedRoute>;
}

function ManageContent() {
  const { authHeaders } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadBlogs() {
    setLoading(true);
    try {
      const headers = await authHeaders();
      const response = await fetch('/api/my/blogs', { headers });
      const data = await response.json();
      setBlogs(data.blogs || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

  async function deleteBlog(id) {
    if (!confirm('Delete this blog? This cannot be undone.')) return;
    const headers = await authHeaders();
    const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || 'Delete failed.');
    else {
      setMessage('Blog deleted.');
      loadBlogs();
    }
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Manage Blogs" title="Your publishing dashboard" description="Edit your own submissions, view status, and delete drafts or published blogs." />
        {message && <div className="mt-8 rounded-3xl bg-indigo-50 p-4 text-sm font-bold text-indigo-800">{message}</div>}
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          {loading ? <p className="p-8 text-center font-bold text-slate-500">Loading your blogs...</p> : blogs.length ? (
            <div className="divide-y divide-slate-100">
              {blogs.map((blog) => (
                <div key={blog.id} className="grid gap-4 p-5 md:grid-cols-[96px_1fr_auto] md:items-center">
                  <img src={blog.coverImage} alt={blog.title} className="h-24 w-24 rounded-2xl object-cover" />
                  <div>
                    <div className="flex flex-wrap items-center gap-3"><StatusBadge status={blog.status} /><span className="text-sm font-bold text-slate-500">{blog.category} · {formatDate(blog.publishedAt)}</span></div>
                    <h3 className="mt-2 text-xl font-black text-slate-950">{blog.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{blog.shortDescription}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/items/${blog.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-100">View</Link>
                    <Link href={`/items/${blog.id}/edit`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-600">Edit</Link>
                    <button onClick={() => deleteBlog(blog.id)} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="p-8"><EmptyState title="You have not submitted blogs yet" description="Create your first blog from the Add Blog page." /></div>}
        </div>
      </div>
    </div>
  );
}
