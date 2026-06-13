import { categories } from '@/data/categories';
import { estimateReadingTime, slugify } from '@/lib/blogFormat';

const covers = [
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
];

const authors = ['Maya Chen', 'Jordan Ellis', 'Avery Brooks', 'Noah Patel', 'Sophia Rivera'];

const englishStories = [
  {
    title: 'How I Plan a Week of Meaningful Writing',
    category: 'Productivity',
    shortDescription: 'A practical routine for turning loose ideas into clear drafts without rushing the creative process.',
    content: 'A productive writing week begins before the first sentence. I start by collecting questions from conversations, books, and small observations from everyday life. Then I choose one idea that still feels interesting after a night of rest.\n\nThe next step is outlining. I write the promise of the article in one sentence, list the reader questions I need to answer, and decide what feeling the ending should leave behind. This keeps the draft focused without making it stiff.\n\nGood writing also needs quiet revision. I read the piece aloud, remove repeated points, and replace vague language with specific images. A steady routine makes publishing less stressful and helps each story earn the reader’s attention.',
  },
  {
    title: 'The Small Design Choices That Make Blogs Easier to Read',
    category: 'Design',
    shortDescription: 'Spacing, contrast, headings, and rhythm can make a blog feel calm, premium, and readable.',
    content: 'A blog does not need heavy decoration to feel professional. The best reading experiences usually come from careful spacing, strong contrast, and typography that lets the words breathe.\n\nHeadings should guide the reader through the article like signposts on a quiet road. Paragraphs should be short enough to scan but long enough to carry a complete thought. Images should support the story, not distract from it.\n\nWhen design is working well, readers do not notice the interface. They simply keep reading. That is the standard every publishing platform should aim for.',
  },
  {
    title: 'Why Developers Should Write More Often',
    category: 'Programming',
    shortDescription: 'Technical writing improves communication, deepens understanding, and creates a record of learning.',
    content: 'Writing is one of the most useful habits a developer can build. It turns scattered knowledge into something clear enough to share. If an idea cannot be explained simply, it probably needs more thought.\n\nA short technical blog can document a bug, compare two approaches, or explain why a team chose a certain tool. These posts become useful references for future projects and for other developers facing similar problems.\n\nThe goal is not to sound impressive. The goal is to be helpful. Clear writing makes engineering work easier to understand, maintain, and improve.',
  },
  {
    title: 'A Beginner Friendly Guide to AI in Daily Work',
    category: 'AI',
    shortDescription: 'Use AI as a thinking partner for drafts, summaries, research notes, and better questions.',
    content: 'AI tools are most useful when they support human judgment instead of replacing it. They can help summarize long notes, generate first drafts, compare options, and point out gaps in an argument.\n\nThe key is to stay involved. Ask specific questions, check important facts, and rewrite the output in your own voice. A thoughtful workflow keeps the speed of AI without losing accuracy or personality.\n\nUsed well, AI can make everyday work lighter. It gives writers and teams more time to think about meaning, structure, and the reader’s experience.',
  },
  {
    title: 'Building a Career Through Public Learning',
    category: 'Career',
    shortDescription: 'Sharing what you learn can build confidence, community, and professional opportunity over time.',
    content: 'Public learning is the practice of sharing lessons while they are still fresh. It might be a short blog post, a project note, or a reflection on a mistake that taught you something useful.\n\nThis habit builds a visible record of growth. It also helps other people learn from your process, not just your finished results. Over time, thoughtful posts can show curiosity, consistency, and communication skills.\n\nYou do not need to be an expert before you write. You only need to be honest about what you learned and generous enough to make it useful for someone else.',
  },
  {
    title: 'Technology That Feels Human',
    category: 'Technology',
    shortDescription: 'The best digital products respect attention, reduce friction, and make people feel capable.',
    content: 'Technology feels human when it respects the person using it. That means clear language, predictable interactions, and features that solve real problems instead of creating new ones.\n\nA good product does not ask users to understand the system. It helps the system understand the user’s goal. Small choices like helpful empty states, visible feedback, and simple navigation can make a product feel trustworthy.\n\nHuman technology is not less advanced. It is more thoughtful. It uses complexity behind the scenes so the experience can remain simple in front of the user.',
  },
  {
    title: 'The Art of Writing Better Blog Introductions',
    category: 'Design',
    shortDescription: 'A strong introduction gives readers a reason to care and a clear path into the article.',
    content: 'The introduction is a promise. It tells readers what the article is about, why it matters, and what they can expect if they keep reading. A vague opening makes people leave before the useful part begins.\n\nOne reliable approach is to start with a real problem. Name the tension, show what is at stake, and then guide the reader toward the answer. This creates momentum without exaggeration.\n\nA good introduction does not need to be dramatic. It needs to be clear, specific, and honest about the value of the story ahead.',
  },
  {
    title: 'Simple Systems for Staying Consistent',
    category: 'Productivity',
    shortDescription: 'Consistency becomes easier when your system is small, visible, and forgiving.',
    content: 'Most people do not fail because they lack ambition. They fail because their systems are too complicated to repeat on difficult days. A useful system should be small enough to restart quickly.\n\nFor writing, that might mean keeping a single idea list, setting one weekly publishing goal, and reviewing drafts at the same time each day. The simpler the system, the easier it is to trust.\n\nConsistency is not about never missing a day. It is about returning without drama and making the next good action obvious.',
  },
  {
    title: 'What Makes an Online Community Worth Joining',
    category: 'Career',
    shortDescription: 'Healthy communities are built on generosity, clear expectations, and thoughtful conversation.',
    content: 'A strong online community gives people a reason to return. Members feel safe asking questions, sharing work, and learning from different perspectives. That does not happen by accident.\n\nGood communities have clear expectations. They reward helpfulness more than noise and make space for beginners without lowering the quality of discussion.\n\nThe best communities feel like shared libraries of experience. People contribute what they know, take what they need, and leave the space better than they found it.',
  },
  {
    title: 'From Rough Notes to Published Article',
    category: 'Programming',
    shortDescription: 'A repeatable editing process can turn messy notes into a useful, readable blog post.',
    content: 'Every article starts messy. The first notes might be fragments, links, examples, or sentences that do not yet fit together. That is normal. The job of editing is to create order.\n\nI begin by grouping related notes, deleting anything that does not support the main idea, and writing a simple outline. Then I draft quickly, leaving rough sections in place instead of stopping to perfect every line.\n\nThe final pass is for the reader. I check whether the title matches the article, whether each section earns its place, and whether the ending gives a clear takeaway.',
  },
];

export async function fetchDemoBlogs(limit = 10) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch demo blogs from the online API.');
  }

  const posts = await response.json();
  const now = Date.now();

  return posts.map((post, index) => {
    const story = englishStories[index % englishStories.length];
    const content = story.content;
    const category = story.category || categories[index % categories.length];
    const publishedAt = new Date(now - index * 86400000).toISOString();

    return {
      id: `demo-${post.id}`,
      demoId: post.id,
      title: story.title,
      slug: slugify(story.title),
      category,
      shortDescription: story.shortDescription,
      content,
      coverImage: covers[index % covers.length],
      authorName: authors[index % authors.length],
      authorEmail: `writer${index + 1}@inkflow.demo`,
      authorAvatar: `https://i.pravatar.cc/160?img=${index + 12}`,
      status: 'approved',
      source: 'jsonplaceholder',
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      readingTime: estimateReadingTime(content),
    };
  });
}
