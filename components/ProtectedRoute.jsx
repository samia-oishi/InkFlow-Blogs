'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, isFirebaseConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (!isFirebaseConfigured) {
    return <GuardMessage title="Firebase setup required" description="Paste your Firebase Web App config into .env.local to use protected pages." />;
  }

  if (loading || !user) {
    return <LoadingMessage label="Checking your session" />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { user, loading, isAdmin, isFirebaseConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user && !isAdmin) router.replace('/dashboard');
  }, [loading, user, isAdmin, router]);

  if (!isFirebaseConfigured) {
    return <GuardMessage title="Firebase setup required" description="Admin routes need Firebase and MongoDB credentials in .env.local." />;
  }

  if (loading || !user) return <LoadingMessage label="Checking admin access" />;
  if (!isAdmin) return <GuardMessage title="Admin access required" description="Your account is not listed as an InkFlow admin." />;

  return children;
}

function LoadingMessage({ label }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="mt-4 font-semibold text-slate-700">{label}...</p>
    </div>
  );
}

function GuardMessage({ title, description }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
      </div>
    </div>
  );
}
