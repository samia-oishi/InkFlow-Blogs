import { ok, fail } from '@/lib/apiResponse';
import { hasMongoConfig, profilesCollection, blogsCollection } from '@/lib/mongodb';
import { authError, requireUser } from '@/lib/serverAuth';

export async function GET(request) {
  let session;
  try {
    session = await requireUser(request);
  } catch (error) {
    return authError(error);
  }

  return ok({ profile: cleanProfile(session.profile) });
}

export async function PATCH(request) {
  let session;
  try {
    session = await requireUser(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return fail('MongoDB is not configured yet.', 503);

  try {
    const payload = await request.json();
    const update = {
      displayName: payload.displayName?.trim() || session.profile.displayName,
      photoURL: payload.photoURL?.trim() || session.profile.photoURL || '',
      bio: payload.bio?.trim() || '',
      website: payload.website?.trim() || '',
      location: payload.location?.trim() || '',
      updatedAt: new Date().toISOString(),
    };

    const profiles = await profilesCollection();
    await profiles.updateOne({ uid: session.decoded.uid }, { $set: update }, { upsert: true });
    const profile = await profiles.findOne({ uid: session.decoded.uid });

    const blogs = await blogsCollection();
    await blogs.updateMany(
      { authorId: session.decoded.uid },
      { $set: { authorName: update.displayName, authorAvatar: update.photoURL } }
    );

    return ok({ profile: cleanProfile(profile) });
  } catch (error) {
    return fail(error.message || 'Unable to update profile.', 500);
  }
}

export async function DELETE(request) {
  let session;
  try {
    session = await requireUser(request);
  } catch (error) {
    return authError(error);
  }

  if (!hasMongoConfig()) return fail('MongoDB is not configured yet.', 503);

  try {
    const profiles = await profilesCollection();
    await profiles.deleteOne({ uid: session.decoded.uid });
    return ok({ deleted: true });
  } catch (error) {
    return fail(error.message || 'Unable to delete profile.', 500);
  }
}

function cleanProfile(profile) {
  if (!profile) return null;
  return {
    ...profile,
    id: String(profile._id || profile.id || ''),
    _id: undefined,
  };
}
