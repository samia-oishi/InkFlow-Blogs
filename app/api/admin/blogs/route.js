import { ok, fail } from '@/lib/apiResponse';
import { fetchDemoBlogs } from '@/lib/demoBlogs';
import { hasMongoConfig, blogsCollection } from '@/lib/mongodb';
import { authError, requireAdmin } from '@/lib/serverAuth';
import { serializeBlogs } from '@/lib/dbBlog';

export async function GET(request) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return ok({ blogs: [], source: 'not-configured' });

  try {
    const demoBlogs = await fetchDemoBlogs(10);
    const blogs = await blogsCollection();
    const docs = await blogs.find({}).sort({ createdAt: -1 }).toArray();
    return ok({ blogs: replaceImportedDemoText(serializeBlogs(docs), demoBlogs), source: 'mongodb' });
  } catch (error) {
    return fail(error.message || 'Unable to load admin blogs.', 500);
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
