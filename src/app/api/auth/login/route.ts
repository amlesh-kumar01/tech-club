import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { login } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Firebase ID Token is required' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error('Firebase API key missing');
      return NextResponse.json({ error: 'Server authentication configuration error' }, { status: 500 });
    }

    // Verify the Firebase ID token using Google Identity Toolkit REST API
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    if (!response.ok || !data.users || data.users.length === 0) {
      console.error('Firebase token verification failed:', data);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userEmail = data.users[0].email;

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
