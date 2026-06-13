export default function SectionHeader({ eyebrow, title, description, centered = true }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>}
    </div>
  );
}
