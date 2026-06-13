import { fetchDemoBlogs } from '@/lib/demoBlogs';
import { ok, fail } from '@/lib/apiResponse';
import { blogsCollection, hasMongoConfig } from '@/lib/mongodb';
import { authError, requireAdmin } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return fail('MongoDB is not configured yet.', 503);

  try {
    const demoBlogs = await fetchDemoBlogs(10);
    const blogs = await blogsCollection();
    let imported = 0;
    let updated = 0;

    for (const blog of demoBlogs) {
      const exists = await blogs.findOne({ source: 'jsonplaceholder', demoId: blog.demoId });
      if (!exists) {
        await blogs.insertOne(blog);
        imported += 1;
      } else {
        await blogs.updateOne(
          { _id: exists._id },
          {
            $set: {
              title: blog.title,
              slug: blog.slug,
              category: blog.category,
              shortDescription: blog.shortDescription,
              content: blog.content,
              coverImage: exists.coverImage || blog.coverImage,
              readingTime: blog.readingTime,
              status: exists.status || 'approved',
              updatedAt: new Date().toISOString(),
            },
          }
        );
        updated += 1;
      }
    }

    return ok({
      imported,
      updated,
      message: imported || updated ? `Imported ${imported} and refreshed ${updated} demo blogs.` : 'Demo blogs are already up to date.',
    });
  } catch (error) {
    return fail(error.message || 'Unable to import demo blogs.', 500);
  }
}
