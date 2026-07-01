import admin from 'firebase-admin';

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  // Handle both actual newlines and escaped \n characters
  return key.replace(/\\n/g, '\n').trim();
}

export function hasFirebaseAdminConfig() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && getPrivateKey());
}

export function getAdminAuth() {
  if (!hasFirebaseAdminConfig()) {
    throw new Error('Missing Firebase Admin credentials. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to .env.local.');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getPrivateKey(),
      }),
    });
  }

  return admin.auth();
}
