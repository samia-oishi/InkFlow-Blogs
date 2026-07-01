import { NextResponse } from 'next/server';
import { hasMongoConfig, profilesCollection } from '@/lib/mongodb';

// Emergency admin setup - works without authentication
export async function POST(request) {
  if (!hasMongoConfig()) {
    return NextResponse.json({ error: 'MongoDB not configured' }, { status: 503 });
  }

  try {
    const { email, secret } = await request.json();
    
    // Simple protection - use your email as secret
    if (secret !== 'scribe.oishi@gmail.com') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const profiles = await profilesCollection();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find or create admin user
    const existing = await profiles.findOne({ email: normalizedEmail });

    if (existing) {
      // Update to admin
      await profiles.updateOne(
        { _id: existing._id },
        { $set: { role: 'admin', updatedAt: new Date().toISOString() } }
      );
      return NextResponse.json({
        success: true,
        message: `Updated ${email} to admin`,
        action: 'updated'
      });
    } else {
      // Create new admin profile
      const now = new Date().toISOString();
      const result = await profiles.insertOne({
        uid: 'temp-' + Date.now(),
        email: normalizedEmail,
        displayName: email.split('@')[0],
        photoURL: '',
        bio: '',
        website: '',
        location: '',
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      });
      return NextResponse.json({
        success: true,
        message: `Created admin profile for ${email}`,
        action: 'created',
        id: String(result.insertedId)
      });
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Check current status
export async function GET(request) {
  if (!hasMongoConfig()) {
    return NextResponse.json({ error: 'MongoDB not configured' }, { status: 503 });
  }

  try {
    const profiles = await profilesCollection();
    const admins = await profiles.find({ role: 'admin' }).project({ email: 1, role: 1, displayName: 1 }).toArray();
    return NextResponse.json({ admins });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
