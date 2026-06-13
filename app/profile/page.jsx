"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { profile, authHeaders, loadProfile } = useAuth();
  const [form, setForm] = useState({
    email: "",
    displayName: "",
    photoURL: "",
    bio: "",
    website: "",
    location: "",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        email: profile.email || "",
        displayName: profile.displayName || "",
        photoURL: profile.photoURL || "",
        bio: profile.bio || "",
        website: profile.website || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const headers = await authHeaders();
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Profile update failed.");
      await loadProfile();
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProfile() {
    if (
      !confirm(
        "Delete your profile document? Your Firebase account will remain unless you remove it in Firebase.",
      )
    )
      return;
    const headers = await authHeaders();
    const response = await fetch("/api/profile", { method: "DELETE", headers });
    const data = await response.json();
    setMessage(
      response.ok
        ? "Profile document deleted."
        : data.error || "Delete failed.",
    );
    await loadProfile();
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Profile"
          title="Manage your public writer profile"
          description="Update your display name and profile details. Your email comes from Firebase Authentication and is shown here for reference."
        />
        {message && (
          <div className="mt-8 rounded-3xl bg-indigo-50 p-4 text-sm font-bold text-indigo-800">
            {message}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Email Address">
              <input
                className="input bg-slate-50 text-slate-500"
                value={form.email}
                readOnly
              />
            </Field>
            <Field label="Display Name">
              <input
                className="input"
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                placeholder="Your public writer name"
              />
            </Field>
            <Field label="Photo URL">
              <input
                className="input"
                value={form.photoURL}
                onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
              />
            </Field>
            <Field label="Website">
              <input
                className="input"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <input
                className="input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Bio" className="mt-5">
            <textarea
              rows={5}
              className="input"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              disabled={busy}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-indigo-600 disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save Profile"}
            </button>
            <button
              type="button"
              onClick={deleteProfile}
              className="rounded-full bg-rose-50 px-6 py-3 text-sm font-black text-rose-700 hover:bg-rose-100"
            >
              Delete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label
      className={`grid gap-2 text-sm font-bold text-slate-700 ${className}`}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}
