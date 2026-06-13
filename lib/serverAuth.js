import { fail } from '@/lib/apiResponse';
import { getAdminAuth, hasFirebaseAdminConfig } from '@/lib/firebaseAdmin';
import { hasMongoConfig, profilesCollection } from '@/lib/mongodb';

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function readableName(email) {
  if (!email) return 'InkFlow Writer';
  return email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayNameFromDecoded(decoded) {
  if (decoded.name && decoded.name !== decoded.email) return decoded.name;
  return readableName(decoded.email);
}

export function roleForEmail(email) {
  return email && getAdminEmails().includes(email.toLowerCase()) ? 'admin' : 'user';
}

async function verifyTokenWithFirebaseRest(token) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    const error = new Error('Firebase Web API key is missing. Add NEXT_PUBLIC_FIREBASE_API_KEY to .env.local.');
    error.status = 500;
    throw error;
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });

  const data = await response.json();

  if (!response.ok || !data.users?.length) {
    const error = new Error('Invalid or expired Firebase token.');
    error.status = 401;
    throw error;
  }

  const user = data.users[0];

  return {
    uid: user.localId,
    email: user.email || '',
    name: user.displayName || '',
    picture: user.photoUrl || '',
  };
}

async function verifyFirebaseToken(token) {
  if (hasFirebaseAdminConfig()) {
    return getAdminAuth().verifyIdToken(token);
  }

  return verifyTokenWithFirebaseRest(token);
}

export async function verifyRequestUser(request) {
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (!token) {
    const error = new Error('Missing authorization token.');
    error.status = 401;
    throw error;
  }

  const decoded = await verifyFirebaseToken(token);
  const role = roleForEmail(decoded.email);
  const displayName = displayNameFromDecoded(decoded);

  let profile = {
    uid: decoded.uid,
    email: decoded.email || '',
    displayName,
    photoURL: decoded.picture || '',
    role,
  };

  if (hasMongoConfig()) {
    const profiles = await profilesCollection();
    const existing = await profiles.findOne({ uid: decoded.uid });

    if (existing) {
      const nextRole = existing.role === 'admin' || role === 'admin' ? 'admin' : 'user';
      const nextDisplayName = existing.displayName && existing.displayName !== existing.email ? existing.displayName : displayName;
      profile = {
        ...existing,
        id: String(existing._id),
        displayName: nextDisplayName,
        role: nextRole,
      };

      if (existing.role !== nextRole || existing.displayName !== nextDisplayName) {
        await profiles.updateOne({ uid: decoded.uid }, { $set: { role: nextRole, displayName: nextDisplayName, updatedAt: new Date().toISOString() } });
      }
    } else {
      const now = new Date().toISOString();
      const doc = {
        uid: decoded.uid,
        email: decoded.email || '',
        displayName,
        photoURL: decoded.picture || '',
        bio: '',
        website: '',
        location: '',
        role,
        createdAt: now,
        updatedAt: now,
      };
      const result = await profiles.insertOne(doc);
      profile = { ...doc, id: String(result.insertedId) };
    }
  }

  return { decoded, profile, role: profile.role || role };
}

export async function requireUser(request) {
  try {
    return await verifyRequestUser(request);
  } catch (error) {
    throw error;
  }
}

export async function requireAdmin(request) {
  const session = await requireUser(request);
  if (session.role !== 'admin') {
    const error = new Error('Admin access required. Add your email to ADMIN_EMAILS in .env.local.');
    error.status = 403;
    throw error;
  }
  return session;
}

export function authError(error) {
  return fail(error.message || 'Authentication failed.', error.status || 401);
}
