'use client';

import { useEffect, useMemo, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';
import Filters from '@/components/Filters';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams({ q: query, category, date: dateFilter });
    setLoading(true);
    fetch(`/api/blogs?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setBlogs(data.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [query, category, dateFilter]);

  const countText = useMemo(() => `${blogs.length} ${blogs.length === 1 ? 'blog' : 'blogs'} found`, [blogs.length]);

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="All Blog Posts" title="Explore the InkFlow library" description="Search, filter, and read dynamically fetched blogs from MongoDB or the online demo API fallback." />
        <div className="mt-10 grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_0.85fr]">
          <SearchBar value={query} onChange={setQuery} />
          <Filters category={category} setCategory={setCategory} dateFilter={dateFilter} setDateFilter={setDateFilter} />
        </div>
        <p className="mt-6 text-sm font-bold text-slate-500">{loading ? 'Loading blogs...' : countText}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
        {!loading && !blogs.length && <div className="mt-8"><EmptyState title="No blogs matched your filters" /></div>}
      </div>
    </div>
  );
}
