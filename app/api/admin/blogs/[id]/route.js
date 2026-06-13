import { ok, fail } from '@/lib/apiResponse';
import { hasMongoConfig, blogsCollection } from '@/lib/mongodb';
import { authError, requireAdmin } from '@/lib/serverAuth';
import { serializeBlog, toObjectId } from '@/lib/dbBlog';

export async function PATCH(request, context) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return fail('MongoDB is not configured yet.', 503);

  try {
    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) return fail('Invalid blog id.', 400);

    const payload = await request.json();
    const status = payload.status;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return fail('Status must be pending, approved, or rejected.', 400);
    }

    const blogs = await blogsCollection();
    await blogs.updateOne(
      { _id: objectId },
      { $set: { status, moderationNote: payload.moderationNote || '', updatedAt: new Date().toISOString() } }
    );
    const blog = await blogs.findOne({ _id: objectId });

    return ok({ blog: serializeBlog(blog) });
  } catch (error) {
    return fail(error.message || 'Unable to update blog status.', 500);
  }
}
