import SectionHeader from '@/components/SectionHeader';

const team = [
  ['Avery Stone', 'Product Lead', 'https://i.pravatar.cc/160?img=12'],
  ['Mina Brooks', 'Editor in Chief', 'https://i.pravatar.cc/160?img=25'],
  ['Leo Grant', 'Platform Engineer', 'https://i.pravatar.cc/160?img=52'],
];

export default function AboutPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="About InkFlow" title="A modern home for meaningful digital publishing" description="InkFlow blends a premium reading experience with practical author and admin tools: dynamic blogs, profile management, role-based dashboards, and moderation." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[['Platform Introduction', 'InkFlow helps writers publish polished stories and gives readers a clean, responsive space to explore ideas.'], ['Mission', 'Make high-quality publishing feel accessible, fast, and professionally designed for every creator.'], ['Vision', 'A community-driven editorial platform where thoughtful writing moves from draft to approval to discovery.']].map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">{title}</h2>
              <p className="mt-4 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <section className="mt-16">
          <SectionHeader eyebrow="Team" title="The people behind the flow" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {team.map(([name, role, avatar]) => (
              <div key={name} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <img src={avatar} alt={name} className="mx-auto h-24 w-24 rounded-full object-cover" />
                <h3 className="mt-5 text-xl font-black text-slate-950">{name}</h3>
                <p className="mt-1 text-sm font-bold text-indigo-600">{role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
