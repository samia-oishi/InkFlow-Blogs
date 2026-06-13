'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import AuthNotice from '@/components/AuthNotice';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, logout, resetPassword, isFirebaseConfigured } = useAuth();
  const [loginType, setLoginType] = useState('user');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function finishLogin(profile) {
    if (loginType === 'admin' && profile?.role !== 'admin') {
      await logout();
      throw new Error('This email is not registered as an admin. Add it to ADMIN_EMAILS in .env.local or log in as a user.');
    }

    router.push(loginType === 'admin' ? '/admin' : '/dashboard');
  }

  async function handleSubmit({ email, password }) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const profile = await login(email, password);
      await finishLogin(profile);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const profile = await loginWithGoogle();
      await finishLogin(profile);
    } catch (err) {
      setError(err.message || 'Google login failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleForgotPassword(email) {
    setError('');
    setMessage('');

    if (!email) {
      setError('Enter your email address first, then click Forgot password.');
      return;
    }

    setBusy(true);
    try {
      await resetPassword(email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Unable to send password reset email.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      {!isFirebaseConfigured && <AuthNotice />}
      <AuthForm
        mode="login"
        loginType={loginType}
        setLoginType={setLoginType}
        onSubmit={handleSubmit}
        onGoogle={handleGoogle}
        onForgotPassword={handleForgotPassword}
        busy={busy}
        error={error}
        message={message}
      />
    </div>
  );
}
