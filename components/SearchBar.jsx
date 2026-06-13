import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      Search Blogs
      <span className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by title, topic, or author..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 shadow-sm transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />
      </span>
    </label>
  );
}
