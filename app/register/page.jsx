'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import AuthNotice from '@/components/AuthNotice';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, isFirebaseConfigured } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit({ name, email, password }) {
    setBusy(true);
    setError('');
    try {
      await register(email, password, name);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err) {
      setError(err.message || 'Google registration failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      {!isFirebaseConfigured && <AuthNotice />}
      <AuthForm mode="register" onSubmit={handleSubmit} onGoogle={handleGoogle} busy={busy} error={error} />
    </div>
  );
}
