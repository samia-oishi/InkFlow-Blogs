import { fetchDemoBlogs } from '@/lib/demoBlogs';
import { ok, fail } from '@/lib/apiResponse';
import { hasMongoConfig, blogsCollection } from '@/lib/mongodb';
import { authError, requireUser } from '@/lib/serverAuth';
import { canEditBlog, findBlogById, serializeBlog, toObjectId } from '@/lib/dbBlog';
import { estimateReadingTime, slugify } from '@/lib/blogFormat';

export async function GET(_request, context) {
  const { id } = await context.params;

  if (!hasMongoConfig() || id.startsWith('demo-')) {
    const blogs = await fetchDemoBlogs(10);
    const blog = blogs.find((item) => item.id === id);
    if (!blog) return fail('Blog not found.', 404);
    return ok({ blog, source: 'demo-api' });
  }

  try {
    const blog = await findBlogById(id);
    if (!blog) return fail('Blog not found.', 404);

    const serialized = serializeBlog(blog);
    if (serialized.source === 'jsonplaceholder' && serialized.demoId) {
      const demoBlogs = await fetchDemoBlogs(10);
      const demo = demoBlogs.find((item) => item.demoId === serialized.demoId);
      if (demo) {
        return ok({
          blog: {
            ...serialized,
            title: demo.title,
            slug: demo.slug,
            category: demo.category,
            shortDescription: demo.shortDescription,
            content: demo.content,
            coverImage: serialized.coverImage || demo.coverImage,
            readingTime: demo.readingTime,
          },
          source: 'mongodb',
        });
      }
    }

    return ok({ blog: serialized, source: 'mongodb' });
  } catch (error) {
    return fail(error.message || 'Unable to load blog.', 500);
  }
}

export async function PATCH(request, context) {
  const { id } = await context.params;
  let session;
  try {
    session = await requireUser(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return fail('MongoDB is not configured yet.', 503);

  try {
    const objectId = toObjectId(id);
    if (!objectId) return fail('Invalid blog id.', 400);

    const blogs = await blogsCollection();
    const existing = await blogs.findOne({ _id: objectId });
    if (!existing) return fail('Blog not found.', 404);
    if (!canEditBlog(existing, session)) return fail('You can only edit your own blogs.', 403);

    const payload = await request.json();
    const content = payload.content?.trim() || existing.content;
    const update = {
      title: payload.title?.trim() || existing.title,
      slug: slugify(payload.title || existing.title),
      category: payload.category || existing.category,
      shortDescription: payload.shortDescription?.trim() || existing.shortDescription,
      content,
      coverImage: payload.coverImage?.trim() || existing.coverImage,
      publishedAt: payload.publishedAt || existing.publishedAt,
      readingTime: estimateReadingTime(content),
      updatedAt: new Date().toISOString(),
    };

    if (session.role !== 'admin') {
      update.status = 'pending';
    } else if (payload.status) {
      update.status = payload.status;
    }

    await blogs.updateOne({ _id: objectId }, { $set: update });
    const blog = await blogs.findOne({ _id: objectId });
    return ok({ blog: serializeBlog(blog) });
  } catch (error) {
    return fail(error.message || 'Unable to update blog.', 500);
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  let session;
  try {
    session = await requireUser(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return fail('MongoDB is not configured yet.', 503);

  try {
    const objectId = toObjectId(id);
    if (!objectId) return fail('Invalid blog id.', 400);

    const blogs = await blogsCollection();
    const existing = await blogs.findOne({ _id: objectId });
    if (!existing) return fail('Blog not found.', 404);
    if (session.role !== 'admin' && !canEditBlog(existing, session)) return fail('You can only delete your own blogs.', 403);

    await blogs.deleteOne({ _id: objectId });
    return ok({ deleted: true });
  } catch (error) {
    return fail(error.message || 'Unable to delete blog.', 500);
  }
}
