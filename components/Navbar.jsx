'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/items', label: 'Blogs' },
  { href: '/about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, logout } = useAuth();
  const displayName = profile?.displayName || user?.displayName || 'Account';

  async function handleLogout() {
    await logout();
    setDropdownOpen(false);
    setOpen(false);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-indigo-950/20">
            <BookOpen size={20} />
          </span>
          InkFlow
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 hover:text-slate-950',
                pathname === link.href ? 'bg-slate-100 text-slate-950' : 'text-slate-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800">
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <User size={17} className="text-slate-500" />
                <span className="max-w-36 truncate text-sm font-bold text-slate-800">{displayName}</span>
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/10">
                  <div className="border-b border-slate-100 p-4">
                    <p className="truncate text-sm font-black text-slate-950">{displayName}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <DropdownLink href={isAdmin ? '/admin' : '/dashboard'} icon={<LayoutDashboard size={17} />} label="Dashboard" close={() => setDropdownOpen(false)} />
                  <DropdownLink href="/profile" icon={<User size={17} />} label="Profile" close={() => setDropdownOpen(false)} />
                  <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50">
                    <LogOut size={17} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={() => setOpen((value) => !value)} className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-black text-slate-950">{displayName}</p>
                  <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
                </div>
                <Link href={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100">Dashboard</Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100">Profile</Link>
                <button onClick={handleLogout} className="rounded-2xl px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50">Logout</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-bold">Login</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownLink({ href, icon, label, close }) {
  return (
    <Link href={href} onClick={close} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
      {icon} {label}
    </Link>
  );
}
