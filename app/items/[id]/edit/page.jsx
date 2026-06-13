'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogForm from '@/components/BlogForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/context/AuthContext';

export default function EditBlogPage() {
  return <ProtectedRoute><EditBlogContent /></ProtectedRoute>;
}

function EditBlogContent() {
  const { id } = useParams();
  const router = useRouter();
  const { authHeaders } = useAuth();
  const [blog, setBlog] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((response) => response.json())
      .then((data) => setBlog(data.blog || null))
      .catch(() => setBlog(null));
  }, [id]);

  async function handleSubmit(payload) {
    setBusy(true);
    setMessage('');
    try {
      const headers = await authHeaders();
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update blog.');
      setMessage('Blog updated. User edits return to pending review.');
      setTimeout(() => router.push('/items/manage'), 900);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="Edit Blog" title="Refine your story" description="Owners can edit their blogs. Admins can edit any blog and manage moderation status separately." />
        {message && <div className="mt-8 rounded-3xl bg-indigo-50 p-4 text-sm font-bold text-indigo-800">{message}</div>}
        <div className="mt-8">
          {blog ? <BlogForm initialValues={blog} submitLabel="Update Blog" onSubmit={handleSubmit} busy={busy} /> : <p className="text-center font-bold text-slate-500">Loading blog editor...</p>}
        </div>
      </div>
    </div>
  );
}
