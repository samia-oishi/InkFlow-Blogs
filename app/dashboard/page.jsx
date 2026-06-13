'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock3, PenLine, ShieldCheck, UserRound } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SectionHeader from '@/components/SectionHeader';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}

function DashboardContent() {
  const { profile, authHeaders, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function load() {
      const headers = await authHeaders();
      const response = await fetch('/api/my/blogs', { headers });
      const data = await response.json();
      setBlogs(data.blogs || []);
    }
    load();
  }, []);

  const stats = [
    ['Total Blogs', blogs.length, BookOpen],
    ['Approved', blogs.filter((blog) => blog.status === 'approved').length, CheckCircle2],
    ['Pending', blogs.filter((blog) => blog.status === 'pending').length, Clock3],
  ];

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Dashboard" title={`Welcome, ${profile?.displayName || 'Writer'}`} description="Track your writing activity, submissions, and account workflow in one place." />
        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Logged in as</p>
              <div className="mt-2 flex items-center gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isAdmin ? <ShieldCheck /> : <UserRound />}
                </span>
                <div>
                  <p className="text-2xl font-black capitalize text-slate-950">{profile?.role || 'user'} Account</p>
                  <p className="text-sm font-semibold text-slate-500">{profile?.email}</p>
                </div>
              </div>
            </div>
            {isAdmin && <Link href="/admin" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-indigo-600">Open Admin Dashboard</Link>}
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon /></div>
              <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-4xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Quick actions</h2>
            <div className="mt-5 grid gap-3">
              <Link href="/items/add" className="rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white hover:bg-indigo-600"><PenLine className="mr-2 inline" size={18} />Add Blog</Link>
              <Link href="/items/manage" className="rounded-2xl border border-slate-200 px-5 py-4 font-bold text-slate-700 hover:bg-slate-100">Manage Blogs</Link>
              <Link href="/profile" className="rounded-2xl border border-slate-200 px-5 py-4 font-bold text-slate-700 hover:bg-slate-100">Edit Profile</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Recent submissions</h2>
            <div className="mt-5 grid gap-3">
              {blogs.slice(0, 5).map((blog) => (
                <div key={blog.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-black text-slate-950">{blog.title}</p>
                    <p className="text-sm text-slate-500">{blog.category}</p>
                  </div>
                  <StatusBadge status={blog.status} />
                </div>
              ))}
              {!blogs.length && <p className="text-sm font-semibold text-slate-500">No submissions yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
