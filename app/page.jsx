'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BookOpenText, Coffee, Feather, Globe2, PenLine, Quote, Search, Users } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import ButtonLink from '@/components/ButtonLink';
import SectionHeader from '@/components/SectionHeader';
import { categories, categoryDescriptions } from '@/data/categories';

const benefits = [
  ['Easy Publishing', 'Write and submit thoughtful posts from a focused blog editor.', PenLine],
  ['Modern Writing Experience', 'Clean forms, readable previews, and a calm writing workflow.', Feather],
  ['Responsive Reading Experience', 'Articles are comfortable to read on phones, tablets, and desktops.', Globe2],
  ['Community Driven', 'Writers contribute ideas while admins keep the blog library high quality.', Users],
];

const testimonials = [
  ['Lina Carter', 'InkFlow makes it easy to find practical stories without feeling overwhelmed by noise.', 'https://i.pravatar.cc/160?img=31'],
  ['Marcus Lee', 'The writing and review flow feels clear. It is built around actual blog publishing.', 'https://i.pravatar.cc/160?img=33'],
  ['Tara Miles', 'The blog pages are readable, organized, and pleasant to browse on mobile.', 'https://i.pravatar.cc/160?img=47'],
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((response) => response.json())
      .then((data) => setFeatured((data.blogs || []).slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_20%,rgba(251,191,36,0.18),transparent_25rem),radial-gradient(circle_at_12%_10%,rgba(99,102,241,0.14),transparent_26rem)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-white px-4 py-2 text-sm font-bold text-amber-700 shadow-sm">
              <BookOpenText size={16} /> Daily reads for curious minds
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Share Stories That Matter
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              InkFlow is a modern blog site for thoughtful articles on technology, design, AI, productivity, programming, and career growth. Read fresh ideas, follow categories you care about, and publish your own stories.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/items">Explore Blogs <ArrowRight className="ml-2" size={18} /></ButtonLink>
              <ButtonLink href="/items/add" variant="secondary">Write a Blog</ButtonLink>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[2.5rem] border border-white bg-white/85 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur">
              <div className="overflow-hidden rounded-[2rem] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"
                  alt="Writer notebook and coffee on a desk"
                  className="h-64 w-full object-cover"
                />
                <div className="p-7">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                    <Coffee size={17} /> Featured essay
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950">How small ideas become memorable blog posts</h2>
                  <p className="mt-4 leading-7 text-slate-600">
                    A good blog begins with a clear observation, grows through honest revision, and ends with something useful for the reader to carry forward.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {['Readable stories', 'Real writers', 'Fresh categories', 'Thoughtful discussions'].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                        <Quote size={16} className="text-indigo-600" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Featured" title="Featured Blogs" description="Read selected stories from the InkFlow blog library." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featured.map((blog) => <BlogCard key={blog.id} blog={blog} featured />)}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Categories" title="Find stories by topic" description="Browse clear blog categories designed for readers, writers, and learners." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50">
                <h3 className="text-xl font-black text-slate-950">{category}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{categoryDescriptions[category]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Why choose InkFlow" title="A better place to read and write blogs" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map(([title, text, Icon]) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon /></div>
                <h3 className="mt-5 font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Testimonials" title="Loved by readers and writers" description="InkFlow is designed around comfortable reading and simple publishing." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map(([name, feedback, avatar]) => (
              <div key={name} className="rounded-3xl border border-white/10 bg-white/10 p-6">
                <img src={avatar} alt={name} className="h-14 w-14 rounded-full object-cover" />
                <p className="mt-5 text-slate-200">“{feedback}”</p>
                <h3 className="mt-5 font-black">{name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-br from-indigo-600 to-slate-950 p-8 text-center text-white shadow-2xl shadow-indigo-950/20 sm:p-12">
          <h2 className="text-3xl font-black sm:text-4xl">Get new stories in your inbox</h2>
          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">Subscribe for featured articles, writing ideas, and editor picks from InkFlow.</p>
          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input type="email" placeholder="you@example.com" className="min-h-12 flex-1 rounded-full border-0 px-5 text-slate-950" />
            <button className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-indigo-50">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
