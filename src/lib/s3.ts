import { S3Client } from '@aws-sdk/client-s3';

// Initialize the S3 Client
// This works for both Local MinIO and Cloudflare R2
export const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT || 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'techclub_access_key',
    secretAccessKey: process.env.S3_SECRET_KEY || 'techclub_secret_key',
  },
  forcePathStyle: true,
});

export const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'techclub-media';

// Helper to get a public URL for an object key
export function getPublicUrl(key: string) {
  if (!key) return '';
  // If it's already a full URL (like from legacy seed data), return it
  if (key.startsWith('http')) return key;
  
  const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT || 'http://localhost:9000';
  return `${endpoint}/${BUCKET_NAME}/${key}`;
}
