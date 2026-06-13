'use client';

import { useState } from 'react';
import { categories } from '@/data/categories';

const initialState = {
  title: '',
  category: categories[0],
  shortDescription: '',
  content: '',
  coverImage: '',
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function BlogForm({ initialValues, submitLabel = 'Submit Blog', onSubmit, busy = false }) {
  const [form, setForm] = useState({ ...initialState, ...initialValues });
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.title || !form.shortDescription || !form.content || !form.category || !form.publishedAt) {
      setError('Please complete all required fields before submitting.');
      return;
    }

    await onSubmit({
      ...form,
      publishedAt: new Date(form.publishedAt).toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
      {error && <div className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Blog Title" required>
          <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="input" placeholder="How modern teams publish better stories" />
        </Field>
        <Field label="Category" required>
          <select value={form.category} onChange={(event) => updateField('category', event.target.value)} className="input">
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </Field>
        <Field label="Cover Image URL">
          <input value={form.coverImage} onChange={(event) => updateField('coverImage', event.target.value)} className="input" placeholder="https://images.unsplash.com/..." />
        </Field>
        <Field label="Publish Date" required>
          <input type="date" value={form.publishedAt?.slice(0, 10)} onChange={(event) => updateField('publishedAt', event.target.value)} className="input" />
        </Field>
      </div>
      <Field label="Short Description" required className="mt-5">
        <textarea value={form.shortDescription} onChange={(event) => updateField('shortDescription', event.target.value)} rows={3} className="input" placeholder="A polished two-line summary for the blog card." />
      </Field>
      <Field label="Full Content" required className="mt-5">
        <textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} rows={10} className="input" placeholder="Write the full blog content here..." />
      </Field>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button disabled={busy} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={() => setForm(initialState)} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100">
          Reset
        </button>
      </div>
    </form>
  );
}

function Field({ label, required, children, className = '' }) {
  return (
    <label className={`grid gap-2 text-sm font-bold text-slate-700 ${className}`}>
      <span>{label} {required && <span className="text-rose-500">*</span>}</span>
      {children}
    </label>
  );
}
