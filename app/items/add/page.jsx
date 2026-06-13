'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/BlogForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/context/AuthContext';

export default function AddBlogPage() {
  return (
    <ProtectedRoute>
      <AddBlogContent />
    </ProtectedRoute>
  );
}

function AddBlogContent() {
  const router = useRouter();
  const { authHeaders } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(payload) {
    setBusy(true);
    setMessage('');
    try {
      const headers = await authHeaders();
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit blog.');
      setMessage('Blog submitted successfully. Admin approval may be required before it appears publicly.');
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
        <SectionHeader eyebrow="Add Blog" title="Submit a new story" description="Authenticated users can create blogs. Normal user submissions are sent to admin approval; admin submissions can publish immediately." />
        {message && <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold text-indigo-800">{message}</div>}
        <div className="mt-8"><BlogForm onSubmit={handleSubmit} busy={busy} /></div>
      </div>
    </div>
  );
}
