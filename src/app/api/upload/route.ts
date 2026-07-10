import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    // Generate a timestamp and signature for direct client-side upload
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Cloudinary signature doesn't require specific parameters unless configured in frontend
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ 
      timestamp, 
      signature 
    });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
  }
}
