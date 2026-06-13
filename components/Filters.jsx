import { categories } from '@/data/categories';

export default function Filters({ category, setCategory, dateFilter, setDateFilter }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Category Filter
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100">
          <option>All</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Publish Date Filter
        <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100">
          <option value="All">All time</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </label>
    </div>
  );
}
