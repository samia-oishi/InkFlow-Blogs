import { NextResponse } from 'next/server';
import { hasFirebaseAdminConfig } from '@/lib/firebaseAdmin';

export async function GET(request) {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  
  return NextResponse.json({
    adminEmails,
    adminEmailsRaw: process.env.ADMIN_EMAILS || 'NOT_SET',
    firebaseWeb: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
    },
    firebaseAdmin: {
      hasConfig: hasFirebaseAdminConfig(),
      projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'MISSING',
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'SET (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'MISSING',
    }
  });
}
