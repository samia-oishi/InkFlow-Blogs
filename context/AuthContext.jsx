'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';

const AuthContext = createContext(null);

function readableName(user) {
  if (!user) return 'InkFlow Writer';
  if (user.displayName && user.displayName !== user.email) return user.displayName;
  if (user.email) return user.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return 'InkFlow Writer';
}

function normalizeProfile(profile, currentUser) {
  if (!profile && !currentUser) return null;
  const email = profile?.email || currentUser?.email || '';
  const displayName = profile?.displayName && profile.displayName !== email ? profile.displayName : readableName(currentUser || { email });

  return {
    uid: profile?.uid || currentUser?.uid,
    email,
    displayName,
    photoURL: profile?.photoURL || currentUser?.photoURL || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
    role: profile?.role || 'user',
    ...profile,
    displayName,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  async function authHeaders() {
    if (!auth?.currentUser) return {};
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async function loadProfile(currentUser = auth?.currentUser) {
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);
    try {
      const headers = await authHeaders();
      const response = await fetch('/api/profile', { headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load profile.');
      const nextProfile = normalizeProfile(data.profile, currentUser);
      setProfile(nextProfile);
      return nextProfile;
    } catch {
      const fallbackProfile = normalizeProfile(null, currentUser);
      setProfile(fallbackProfile);
      return fallbackProfile;
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) await loadProfile(currentUser);
      else setProfile(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function register(email, password, displayName) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const finalName = displayName?.trim() || readableName(credential.user);
    await updateProfile(credential.user, { displayName: finalName });
    setUser(credential.user);
    await loadProfile({ ...credential.user, displayName: finalName });
    return credential.user;
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    setUser(credential.user);
    return loadProfile(credential.user);
  }

  async function loginWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    setUser(credential.user);
    return loadProfile(credential.user);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      role: profile?.role || 'user',
      isAdmin: profile?.role === 'admin',
      loading,
      profileLoading,
      isFirebaseConfigured,
      authHeaders,
      loadProfile,
      register,
      login,
      loginWithGoogle,
      resetPassword,
      logout,
    }),
    [user, profile, loading, profileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
