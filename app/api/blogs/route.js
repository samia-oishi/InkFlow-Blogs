import { hasMongoConfig, blogsCollection } from '@/lib/mongodb';
import { fetchDemoBlogs } from '@/lib/demoBlogs';
import { ok, fail } from '@/lib/apiResponse';
import { authError, requireUser } from '@/lib/serverAuth';
import { blogFromPayload, serializeBlogs } from '@/lib/dbBlog';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'approved';
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const date = searchParams.get('date') || 'All';
  const shouldIncludeDemo = status === 'approved';
  const demoBlogs = shouldIncludeDemo ? await fetchDemoBlogs(10) : [];

  if (!hasMongoConfig()) {
    return ok({ blogs: filterBlogs(demoBlogs, { query, category, date }), source: 'demo-api' });
  }

  try {
    const filters = { status };
    const blogs = await blogsCollection();
    const docs = await blogs.find(filters).sort({ publishedAt: -1, createdAt: -1 }).toArray();
    const mongoBlogs = replaceImportedDemoText(serializeBlogs(docs), demoBlogs);
    const mongoDemoIds = new Set(mongoBlogs.map((blog) => blog.demoId).filter(Boolean));
    const extraDemoBlogs = demoBlogs.filter((blog) => !mongoDemoIds.has(blog.demoId));
    const combinedBlogs = shouldIncludeDemo ? [...mongoBlogs, ...extraDemoBlogs] : mongoBlogs;
    const sortedBlogs = combinedBlogs.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

    return ok({ blogs: filterBlogs(sortedBlogs, { query, category, date }), source: shouldIncludeDemo ? 'mongodb-and-demo-api' : 'mongodb' });
  } catch (error) {
    return fail(error.message || 'Unable to load blogs.', 500);
  }
}

export async function POST(request) {
  let session;
  try {
    session = await requireUser(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) {
    return fail('MongoDB is not configured yet. Add MONGODB_URI to create blogs.', 503);
  }

  try {
    const payload = await request.json();
    const status = session.role === 'admin' ? payload.status || 'approved' : 'pending';
    const blog = blogFromPayload(payload, session.profile, { status });
    const blogs = await blogsCollection();
    const result = await blogs.insertOne(blog);

    return ok({ blog: { ...blog, id: String(result.insertedId) } }, { status: 201 });
  } catch (error) {
    return fail(error.message || 'Unable to create blog.', 500);
  }
}

function replaceImportedDemoText(blogs, demoBlogs) {
  const demoById = new Map(demoBlogs.map((blog) => [blog.demoId, blog]));

  return blogs.map((blog) => {
    if (blog.source !== 'jsonplaceholder' || !demoById.has(blog.demoId)) return blog;
    const demo = demoById.get(blog.demoId);
    return {
      ...blog,
      title: demo.title,
      slug: demo.slug,
      category: demo.category,
      shortDescription: demo.shortDescription,
      content: demo.content,
      coverImage: blog.coverImage || demo.coverImage,
      readingTime: demo.readingTime,
    };
  });
}

function filterBlogs(blogs, { query, category, date }) {
  const lowerQuery = query.toLowerCase();
  return blogs.filter((blog) => {
    const matchesQuery = !query || [blog.title, blog.shortDescription, blog.content, blog.authorName]
      .join(' ')
      .toLowerCase()
      .includes(lowerQuery);
    const matchesCategory = category === 'All' || blog.category === category;
    const matchesDate = date === 'All' || matchesDateFilter(blog.publishedAt || blog.createdAt, date);
    return matchesQuery && matchesCategory && matchesDate;
  });
}

function matchesDateFilter(value, date) {
  const published = new Date(value).getTime();
  const now = Date.now();
  if (date === 'week') return published >= now - 7 * 86400000;
  if (date === 'month') return published >= now - 30 * 86400000;
  if (date === 'year') return published >= now - 365 * 86400000;
  return true;
}
