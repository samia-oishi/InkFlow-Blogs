'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminRoute } from '@/components/ProtectedRoute';
import SectionHeader from '@/components/SectionHeader';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/blogFormat';

export default function AdminPage() {
  return <AdminRoute><AdminContent /></AdminRoute>;
}

function AdminContent() {
  const { authHeaders } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState('');

  async function loadBlogs({ silent = false } = {}) {
    if (!silent) setLoading(true);
    try {
      const headers = await authHeaders();
      const response = await fetch('/api/admin/blogs', { headers, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load admin blogs.');
      setBlogs(data.blogs || []);
    } catch (error) {
      setMessage(error.message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

  async function setStatus(id, status) {
    setActionId(`${id}-${status}`);
    setMessage('');
    try {
      const headers = await authHeaders();
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Status update failed.');
      setMessage(`Blog ${status}.`);
      await loadBlogs({ silent: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionId('');
    }
  }

  async function deleteBlog(id) {
    if (!confirm('Delete this blog as admin?')) return;
    setActionId(`${id}-delete`);
    setMessage('');
    try {
      const headers = await authHeaders();
      const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Delete failed.');
      setMessage('Blog deleted.');
      await loadBlogs({ silent: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionId('');
    }
  }

  async function importDemoBlogs() {
    setActionId('import');
    setMessage('');
    try {
      const headers = await authHeaders();
      const response = await fetch('/api/blogs/import-demo', { method: 'POST', headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import failed.');
      setMessage(data.message || 'Import complete.');
      await loadBlogs({ silent: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionId('');
    }
  }

  const counts = {
    total: blogs.length,
    pending: blogs.filter((blog) => blog.status === 'pending').length,
    approved: blogs.filter((blog) => blog.status === 'approved').length,
    rejected: blogs.filter((blog) => blog.status === 'rejected').length,
  };

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Admin Dashboard" title="Moderate InkFlow submissions" description="Approve pending posts, reject drafts, delete inappropriate content, and import demo blogs when needed." />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ['Total', counts.total],
            ['Pending', counts.pending],
            ['Approved', counts.approved],
            ['Rejected', counts.rejected],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold leading-6 text-slate-600">Demo blogs are always shown publicly. Importing them saves copies in MongoDB for admin review and editing.</p>
          <button disabled={actionId === 'import'} onClick={importDemoBlogs} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
            {actionId === 'import' ? 'Importing...' : 'Import 10 Demo Blogs'}
          </button>
        </div>

        {message && <div className="mt-6 rounded-3xl bg-indigo-50 p-4 text-sm font-bold text-indigo-800">{message}</div>}

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          {loading ? <p className="p-8 text-center font-bold text-slate-500">Loading submissions...</p> : (
            <div className="divide-y divide-slate-100">
              {blogs.map((blog) => (
                <div key={blog.id} className="grid gap-5 p-5 xl:grid-cols-[112px_1fr_360px] xl:items-center">
                  <img src={blog.coverImage} alt={blog.title} className="h-28 w-full rounded-2xl object-cover sm:w-28" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={blog.status} />
                      <span className="text-sm font-bold text-slate-500">{blog.category} · {formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-xl font-black text-slate-950">{blog.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{blog.shortDescription}</p>
                    <p className="mt-2 truncate text-xs font-semibold text-slate-400">Author: {blog.authorName || 'Unknown'} · {blog.authorEmail || 'No email'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end">
                    <Link href={`/items/${blog.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-bold hover:bg-slate-100">View</Link>
                    <Link href={`/items/${blog.id}/edit`} className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-bold hover:bg-slate-100">Edit</Link>
                    <button disabled={Boolean(actionId)} onClick={() => setStatus(blog.id, 'approved')} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">Approve</button>
                    <button disabled={Boolean(actionId)} onClick={() => setStatus(blog.id, 'rejected')} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50">Reject</button>
                    <button disabled={Boolean(actionId)} onClick={() => deleteBlog(blog.id)} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50">Delete</button>
                  </div>
                </div>
              ))}
              {!blogs.length && <p className="p-8 text-center font-bold text-slate-500">No MongoDB submissions yet. User posts will appear here after submission.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
