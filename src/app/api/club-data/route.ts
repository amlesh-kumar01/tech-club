import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';

// GET /api/club-data
export async function GET() {
  try {
    const data = await prisma.clubData.findFirst();
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/club-data
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    
    // Find the single document
    const currentData = await prisma.clubData.findFirst();
    if (!currentData) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // --- CLOUDINARY CLEANUP LOGIC ---
    
    // Find deleted executives
    if (updates.executives) {
      const oldPhotos = currentData.executives.map((e: any) => e.photoUrl).filter(Boolean);
      const newPhotos = updates.executives.map((e: any) => e.photoUrl).filter(Boolean);
      const deletedPhotos = oldPhotos.filter((url: string) => !newPhotos.includes(url));
      for (const url of deletedPhotos) {
        await deleteCloudinaryMedia(url, 'image');
      }
    }

    // Find deleted gallery frames
    if (updates.galleryFrames) {
      const oldMedia = currentData.galleryFrames.map((f: any) => ({ url: f.mediaUrl, type: f.mediaType || 'image' })).filter((f:any) => f.url);
      const newMedia = updates.galleryFrames.map((f: any) => f.mediaUrl).filter(Boolean);
      const deletedMedia = oldMedia.filter((f: any) => !newMedia.includes(f.url));
      for (const f of deletedMedia) {
        await deleteCloudinaryMedia(f.url, f.type);
      }
    }

    // Check qrCodeUrl change
    if (updates.qrCodeUrl !== undefined && updates.qrCodeUrl !== currentData.qrCodeUrl && currentData.qrCodeUrl) {
      await deleteCloudinaryMedia(currentData.qrCodeUrl, 'image');
    }

    // --- END CLEANUP LOGIC ---

    const updated = await prisma.clubData.update({
      where: { id: currentData.id },
      data: updates,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
