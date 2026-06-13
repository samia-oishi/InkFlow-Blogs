import { ObjectId } from 'mongodb';
import { blogsCollection } from '@/lib/mongodb';
import { estimateReadingTime, slugify } from '@/lib/blogFormat';

export function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export function serializeBlog(blog) {
  if (!blog) return null;
  return {
    ...blog,
    id: String(blog._id || blog.id),
    _id: undefined,
  };
}

export function serializeBlogs(blogs) {
  return blogs.map(serializeBlog);
}

export function blogFromPayload(payload, user, overrides = {}) {
  const now = new Date().toISOString();
  const content = payload.content?.trim() || '';

  return {
    title: payload.title?.trim() || 'Untitled Blog',
    slug: slugify(payload.title || 'untitled-blog'),
    category: payload.category || 'Technology',
    shortDescription: payload.shortDescription?.trim() || content.slice(0, 150),
    content,
    coverImage: payload.coverImage?.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    publishedAt: payload.publishedAt || now,
    authorId: user.uid,
    authorName: user.displayName || user.email || 'InkFlow Writer',
    authorEmail: user.email || '',
    authorAvatar: user.photoURL || '',
    status: overrides.status || 'pending',
    source: 'user',
    readingTime: estimateReadingTime(content),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export async function findBlogById(id) {
  const objectId = toObjectId(id);
  if (!objectId) return null;

  const blogs = await blogsCollection();
  return blogs.findOne({ _id: objectId });
}

export function canEditBlog(blog, session) {
  return session.role === 'admin' || blog.authorId === session.decoded.uid;
}
