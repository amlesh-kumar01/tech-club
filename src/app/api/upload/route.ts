import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, BUCKET_NAME } from '@/lib/s3';
// no auth import needed

export async function POST(req: NextRequest) {
  try {
    // Allowing any user to upload files for facility booking and feed

    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Filename and contentType are required' }, { status: 400 });
    }

    // Create a unique object key
    const ext = filename.split('.').pop();
    const uniqueKey = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
    });

    // Generate a pre-signed URL that expires in 5 minutes (300 seconds)
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({ 
      uploadUrl: presignedUrl, 
      key: uniqueKey 
    });

  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
