import Link from 'next/link';
import clsx from 'clsx';

const variants = {
  primary: 'bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800 shadow-lg shadow-slate-950/15',
  secondary: 'border border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50',
  ghost: 'text-slate-600 hover:text-slate-950 hover:bg-slate-100',
};

export default function ButtonLink({ href, children, variant = 'primary', className = '' }) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all',
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
