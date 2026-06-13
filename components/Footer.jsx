import Link from 'next/link';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm8.88 1.5a1.13 1.13 0 1 1 0 2.25 1.13 1.13 0 0 1 0-2.25ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M18.9 2.5h3.05l-6.66 7.61L23.13 21.5h-6.15l-4.82-6.3-5.51 6.3H3.58l7.13-8.15L3.2 2.5h6.3l4.35 5.75 5.05-5.75Zm-1.07 16.99h1.69L8.58 4.4H6.77l11.06 15.09Z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5ZM3 9.5h4v12H3v-12Zm6.25 0h3.83v1.64h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12v6.29h-4v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67h-4V9.5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-black text-slate-950">InkFlow</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            A modern blog site for thoughtful writers, comfortable reading, and meaningful stories.
          </p>
          <div className="mt-5 flex gap-3 text-slate-500">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-black text-slate-950">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/items">Blogs</Link>
            <Link href="/about">About</Link>
            <Link href="/items/add">Add Blog</Link>
          </div>
        </div>
        <div>
          <h3 className="font-black text-slate-950">Account</h3>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/items/manage">Manage Blogs</Link>
            <Link href="/admin">Admin Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-sm text-slate-500">
        © 2026 InkFlow. Built for modern stories.
      </div>
    </footer>
  );
}
