import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { login } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Firebase ID Token is required' }, { status: 400 });
    }

    if (!adminAuth) {
      console.error('Firebase admin auth is not initialized (missing credentials)');
      return NextResponse.json({ error: 'Server authentication configuration error' }, { status: 500 });
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'No email found in token' }, { status: 401 });
    }

    // Find user in our MongoDB by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized email address' }, { status: 401 });
    }

    // We no longer check password hashes, we trust Firebase verified the email.
    await login(user.id, user.role);

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username, role: user.role, email: user.email } 
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
