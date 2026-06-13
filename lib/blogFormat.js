export function slugify(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function estimateReadingTime(content = '') {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(date) {
  if (!date) return 'Not dated';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function normalizeBlog(blog) {
  const content = blog.content || blog.body || '';
  return {
    ...blog,
    id: String(blog._id || blog.id),
    title: blog.title || 'Untitled story',
    shortDescription: blog.shortDescription || blog.excerpt || content.slice(0, 150),
    content,
    readingTime: blog.readingTime || estimateReadingTime(content),
  };
}
