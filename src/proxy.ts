import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Only protect API routes that need admin access
const protectedPaths = [
  '/api/club-data/admin',
  '/api/gallery/admin',
  '/api/events/admin',
  '/api/announcements/admin'
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
