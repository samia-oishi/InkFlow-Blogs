import { ok, fail } from '@/lib/apiResponse';
import { hasMongoConfig, blogsCollection } from '@/lib/mongodb';
import { authError, requireUser } from '@/lib/serverAuth';
import { serializeBlogs } from '@/lib/dbBlog';

export async function GET(request) {
  let session;
  try {
    session = await requireUser(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return ok({ blogs: [], source: 'not-configured' });

  try {
    const blogs = await blogsCollection();
    const docs = await blogs.find({ authorId: session.decoded.uid }).sort({ createdAt: -1 }).toArray();
    return ok({ blogs: serializeBlogs(docs), source: 'mongodb' });
  } catch (error) {
    return fail(error.message || 'Unable to load your blogs.', 500);
  }
}
