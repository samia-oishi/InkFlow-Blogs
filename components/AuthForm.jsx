'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, UserRound } from 'lucide-react';

export default function AuthForm({ mode, loginType = 'user', setLoginType, onSubmit, onGoogle, onForgotPassword, busy, error, message }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const isRegister = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(form);
  }

  async function handleForgotPassword() {
    if (!form.email) {
      await onForgotPassword('');
      return;
    }
    await onForgotPassword(form.email);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 sm:p-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-950">{isRegister ? 'Create your InkFlow account' : loginType === 'admin' ? 'Admin Login' : 'User Login'}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isRegister ? 'Register as a writer and start submitting blogs for review.' : loginType === 'admin' ? 'Admins can review, approve, edit, and delete submitted blogs.' : 'Readers and writers can create blogs, manage submissions, and update profiles.'}
        </p>
      </div>

      {!isRegister && setLoginType && (
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-2">
          <button
            type="button"
            onClick={() => setLoginType('user')}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${loginType === 'user' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <UserRound size={17} /> User
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${loginType === 'admin' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <ShieldCheck size={17} /> Admin
          </button>
        </div>
      )}

      {error && <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}
      {message && <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div>}

      <div className="mt-6 grid gap-4">
        {isRegister && (
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Name
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input" placeholder="Avery Writer" />
          </label>
        )}
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Email
          <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input" placeholder="you@example.com" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Password
          <input type="password" required minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="input" placeholder="At least 6 characters" />
        </label>
      </div>

      {!isRegister && (
        <div className="mt-3 text-right">
          <button type="button" onClick={handleForgotPassword} className="text-sm font-black text-indigo-600 hover:text-indigo-800">
            Forgot password?
          </button>
        </div>
      )}

      <button disabled={busy} className="mt-6 w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? 'Please wait...' : isRegister ? 'Register' : loginType === 'admin' ? 'Login as Admin' : 'Login as User'}
      </button>
      <button type="button" onClick={onGoogle} disabled={busy} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60">
        <Sparkles size={18} /> Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-slate-600">
        {isRegister ? 'Already have an account?' : 'New to InkFlow?'}{' '}
        <Link href={isRegister ? '/login' : '/register'} className="font-black text-indigo-600 hover:text-indigo-800">
          {isRegister ? 'Login' : 'Register'}
        </Link>
      </p>
    </form>
  );
}
