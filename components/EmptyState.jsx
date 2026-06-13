import { FileText } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description = 'Try changing filters or creating something new.' }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <FileText size={26} />
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
