import { NextResponse } from 'next/server';
import { hasFirebaseAdminConfig, getAdminAuth } from '@/lib/firebaseAdmin';

export async function GET(request) {
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
  const privateKeyProcessed = privateKeyRaw.replace(/\n/g, '\n');
  
  const diagnostics = {
    firebaseAdmin: {
      projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'MISSING',
      privateKeyRaw: {
        length: privateKeyRaw.length,
        startsWith: privateKeyRaw.substring(0, 50),
        endsWith: privateKeyRaw.substring(privateKeyRaw.length - 30),
        hasLiteralNewlines: privateKeyRaw.includes('\n'),
        hasEscapedNewlines: privateKeyRaw.includes('\n'),
      },
      privateKeyProcessed: {
        length: privateKeyProcessed.length,
        hasLiteralNewlines: privateKeyProcessed.includes('\n'),
      },
      hasConfig: hasFirebaseAdminConfig(),
    },
    adminEmails: (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()),
  };
  
  // Try to initialize and test
  try {
    if (hasFirebaseAdminConfig()) {
      const auth = getAdminAuth();
      diagnostics.authTest = 'Firebase Admin SDK initialized successfully';
    } else {
      diagnostics.authTest = 'Firebase Admin SDK NOT configured';
    }
  } catch (err) {
    diagnostics.authTest = `ERROR: ${err.message}`;
  }
  
  return NextResponse.json(diagnostics);
}
